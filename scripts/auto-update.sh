#!/usr/bin/env bash
# Pulls claude-learnings to its remote HEAD, rebuilds the site, and
# updates the submodule pin in the parent repo. Designed to be invoked
# from cron, n8n, or a webhook — emits a single line of JSON to stdout
# describing what happened, so the caller can branch on `.status`.
#
# Exit codes:
#   0  success (idle or rebuilt)
#   1  build failed — public_html restored from snapshot
#   2  unexpected error before build (git, fs, etc.)
#
# Stdout (single line, always JSON):
#   {"status":"idle"|"updated"|"failed","before":"…","after":"…","topics_added":[…],"topics_removed":[…],"message":"…"}
#
# Logs: human-readable progress goes to stderr. n8n "Execute Command"
# captures stdout — keep it clean JSON.

set -uo pipefail

REPO_DIR="${REPO_DIR:-/home/claude-user/auge}"
PUBLIC_HTML="${PUBLIC_HTML:-/home/claude-user/public_html}"
SUBMODULE_PATH="pages/claude-learnings"
LOG_PREFIX="[auto-update]"

log()  { printf '%s %s\n' "$LOG_PREFIX" "$*" >&2; }
emit() { printf '%s\n' "$1"; }

# Minimal JSON helpers — no jq dependency. We only need to encode strings
# (escape backslashes, quotes, control chars) and arrays of strings.
json_str() {
  # Escapes to a valid JSON string literal including the surrounding quotes.
  python3 -c 'import json,sys; sys.stdout.write(json.dumps(sys.argv[1]))' "$1"
}

json_str_array() {
  # Reads newline-separated values from stdin, emits a JSON array.
  python3 -c '
import json, sys
items = [line for line in sys.stdin.read().splitlines() if line.strip()]
sys.stdout.write(json.dumps(items))
'
}

abort() {
  local msg="$1"
  log "ERROR: $msg"
  emit "{\"status\":\"failed\",\"message\":$(json_str "$msg")}"
  exit 2
}

command -v rsync   >/dev/null || { echo "$LOG_PREFIX rsync is required" >&2; exit 2; }
command -v python3 >/dev/null || { echo "$LOG_PREFIX python3 is required (for JSON encoding)" >&2; exit 2; }

cd "$REPO_DIR" || abort "cannot cd to $REPO_DIR"

# 1. Capture pre-state
log "checking $SUBMODULE_PATH for upstream changes…"
HEAD_BEFORE=$(git -C "$SUBMODULE_PATH" rev-parse HEAD 2>/dev/null) \
  || abort "submodule not initialised — run: git submodule update --init $SUBMODULE_PATH"

# 2. Fetch + fast-forward submodule to the tracked branch's HEAD
git -C "$SUBMODULE_PATH" fetch --quiet origin || abort "git fetch failed"
DEFAULT_REMOTE_REF=$(git -C "$SUBMODULE_PATH" symbolic-ref refs/remotes/origin/HEAD 2>/dev/null \
  | sed 's|^refs/remotes/origin/||')
DEFAULT_REMOTE_REF="${DEFAULT_REMOTE_REF:-main}"

git -C "$SUBMODULE_PATH" checkout --quiet "$DEFAULT_REMOTE_REF" 2>/dev/null \
  || abort "submodule checkout $DEFAULT_REMOTE_REF failed"
git -C "$SUBMODULE_PATH" pull --ff-only --quiet origin "$DEFAULT_REMOTE_REF" \
  || abort "submodule pull --ff-only failed (likely diverged history)"

HEAD_AFTER=$(git -C "$SUBMODULE_PATH" rev-parse HEAD)

# 3. Diff topic list (informational — published in the JSON output)
TOPICS_BEFORE=$(git -C "$SUBMODULE_PATH" ls-tree -d --name-only "$HEAD_BEFORE" 2>/dev/null \
  | grep -v '^\.' | sort)
TOPICS_AFTER=$(git -C "$SUBMODULE_PATH" ls-tree -d --name-only "$HEAD_AFTER" 2>/dev/null \
  | grep -v '^\.' | sort)
TOPICS_ADDED=$(comm -13 <(echo "$TOPICS_BEFORE") <(echo "$TOPICS_AFTER") | json_str_array)
TOPICS_REMOVED=$(comm -23 <(echo "$TOPICS_BEFORE") <(echo "$TOPICS_AFTER") | json_str_array)

# 4. Idle path: nothing changed and public_html looks healthy
if [ "$HEAD_BEFORE" = "$HEAD_AFTER" ] && [ -f "$PUBLIC_HTML/index.html" ]; then
  log "no changes (HEAD $HEAD_AFTER), skipping rebuild"
  emit "{\"status\":\"idle\",\"before\":$(json_str "$HEAD_BEFORE"),\"after\":$(json_str "$HEAD_AFTER"),\"topics_added\":$TOPICS_ADDED,\"topics_removed\":$TOPICS_REMOVED}"
  exit 0
fi

# 5. Snapshot public_html so we can roll back on build failure.
SNAPSHOT="$(mktemp -d -t public_html-snapshot.XXXXXX)"
log "snapshotting $PUBLIC_HTML → $SNAPSHOT (hardlinks)"
if [ -d "$PUBLIC_HTML" ]; then
  cp -al "$PUBLIC_HTML/." "$SNAPSHOT/" 2>/dev/null \
    || cp -a "$PUBLIC_HTML/." "$SNAPSHOT/" \
    || abort "snapshot failed"
fi

restore_snapshot() {
  log "restoring snapshot…"
  rm -rf "$PUBLIC_HTML"
  mkdir -p "$PUBLIC_HTML"
  cp -a "$SNAPSHOT/." "$PUBLIC_HTML/"
}

# 6. Build (writes directly into PUBLIC_HTML via vite outDir)
log "building (HEAD $HEAD_BEFORE → $HEAD_AFTER)…"
if ! npm run build >&2; then
  log "build failed, rolling back"
  restore_snapshot
  rm -rf "$SNAPSHOT"
  emit "{\"status\":\"failed\",\"message\":\"build failed; public_html restored\",\"before\":$(json_str "$HEAD_BEFORE"),\"after\":$(json_str "$HEAD_AFTER"),\"topics_added\":$TOPICS_ADDED,\"topics_removed\":$TOPICS_REMOVED}"
  exit 1
fi

rm -rf "$SNAPSHOT"

# 7. Commit submodule pin in the parent repo if it moved.
if [ "$HEAD_BEFORE" != "$HEAD_AFTER" ]; then
  log "committing submodule pin update in parent repo"
  git add "$SUBMODULE_PATH"
  if ! git diff --cached --quiet; then
    git commit -m "chore: auto-bump claude-learnings to $HEAD_AFTER" >&2 || true
  fi
fi

emit "{\"status\":\"updated\",\"before\":$(json_str "$HEAD_BEFORE"),\"after\":$(json_str "$HEAD_AFTER"),\"topics_added\":$TOPICS_ADDED,\"topics_removed\":$TOPICS_REMOVED}"
exit 0
