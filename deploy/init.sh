#!/usr/bin/env bash
# deploy/init.sh  –  Einmaliges Setup vom eigenen Rechner aus
#
# Was dieses Script macht:
#   1. SSH-Key generieren (falls noch keiner existiert)
#   2. Public Key auf den Server übertragen
#   3. setup.sh auf den Server kopieren und ausführen
#   4. GitHub-Secrets via `gh` setzen
#
# Voraussetzungen auf deinem Rechner:
#   - ssh, ssh-copy-id, ssh-keyscan
#   - gh (GitHub CLI), eingeloggt: gh auth status
#
# Aufruf:
#   bash auge-2/deploy/init.sh

set -euo pipefail

REPO="JereIsThere/claude-projects"
KEY_PATH="$HOME/.ssh/auge2_deploy"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Hilfsfunktionen ─────────────────────────────────────────────────────────
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
ok()    { printf '  \033[32m✓\033[0m  %s\n' "$*"; }
info()  { printf '  \033[36m→\033[0m  %s\n' "$*"; }
fail()  { printf '\033[31mFehler:\033[0m %s\n' "$*"; exit 1; }

echo ""
bold "╔══════════════════════════════════════════════╗"
bold "║   Auge 2.0 – Einrichtung vom eigenen Rechner ║"
bold "╚══════════════════════════════════════════════╝"
echo ""

# ── 0. Voraussetzungen ──────────────────────────────────────────────────────
command -v gh          &>/dev/null || fail "gh (GitHub CLI) nicht gefunden. brew install gh / apt install gh"
command -v ssh         &>/dev/null || fail "ssh nicht gefunden."
command -v ssh-copy-id &>/dev/null || fail "ssh-copy-id nicht gefunden."

if ! gh auth status &>/dev/null; then
    fail "Nicht bei GitHub eingeloggt. Bitte zuerst: gh auth login"
fi

# ── Server-Verbindungsdaten abfragen ────────────────────────────────────────
echo "Serververbindung:"
read -rp "  IP oder Hostname:   " SERVER_HOST
read -rp "  SSH-Benutzername:   " SERVER_USER
read -rp "  SSH-Port [22]:      " SERVER_PORT
SERVER_PORT="${SERVER_PORT:-22}"
echo ""

# Kurzformen für alle ssh/scp Befehle
SSH="ssh -i $KEY_PATH -p $SERVER_PORT"
SCP="scp -i $KEY_PATH -P $SERVER_PORT"

# ── 1. SSH-Key generieren ───────────────────────────────────────────────────
if [ -f "$KEY_PATH" ]; then
    ok "SSH-Key existiert bereits ($KEY_PATH)"
else
    info "SSH-Key generieren: $KEY_PATH"
    ssh-keygen -t ed25519 -C "auge2-deploy@$(hostname)" -f "$KEY_PATH" -N ""
    ok "Key generiert"
fi

# ── 2. Public Key auf Server übertragen ─────────────────────────────────────
info "Public Key auf $SERVER_USER@$SERVER_HOST:$SERVER_PORT kopieren"
echo "   (SSH-Passwort für den Server eingeben, danach nie wieder nötig)"
ssh-copy-id -i "$KEY_PATH.pub" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST"
ok "Public Key übertragen"

# ── 3. Known Hosts aktualisieren ────────────────────────────────────────────
ssh-keyscan -p "$SERVER_PORT" -H "$SERVER_HOST" >> "$HOME/.ssh/known_hosts" 2>/dev/null
ok "Known Hosts aktualisiert"

# ── 4. setup.sh auf Server kopieren und ausführen ───────────────────────────
info "setup.sh auf Server übertragen"
$SCP -q "$SCRIPT_DIR/setup.sh" "$SERVER_USER@$SERVER_HOST:/tmp/auge2-setup.sh"

info "Server-Setup ausführen (sudo nötig)"
$SSH "$SERVER_USER@$SERVER_HOST" "sudo bash /tmp/auge2-setup.sh"
ok "Server-Setup abgeschlossen"

# ── 5. GitHub-Secrets setzen ────────────────────────────────────────────────
echo ""
info "GitHub-Secrets setzen (Repo: $REPO)"

gh secret set AUGE2_SSH_KEY  -R "$REPO" < "$KEY_PATH"
ok "AUGE2_SSH_KEY gesetzt"

gh secret set AUGE2_SSH_HOST -R "$REPO" --body "$SERVER_HOST"
ok "AUGE2_SSH_HOST gesetzt"

gh secret set AUGE2_SSH_USER -R "$REPO" --body "$SERVER_USER"
ok "AUGE2_SSH_USER gesetzt"

gh secret set AUGE2_SSH_PORT -R "$REPO" --body "$SERVER_PORT"
ok "AUGE2_SSH_PORT gesetzt"

# ── Fertig ───────────────────────────────────────────────────────────────────
echo ""
bold "╔════════════════════════════════════════════════════════════╗"
bold "║  Fertig! Was jetzt noch zu tun ist:                        ║"
bold "║                                                            ║"
bold "║  1. OrientDB-Passwort auf dem Server eintragen:            ║"
bold "║     ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
bold "║     sudo nano /var/www/auge2/.env.local                    ║"
bold "║                                                            ║"
bold "║  2. Ersten Commit pushen → Deploy läuft automatisch        ║"
bold "║     git push origin claude/auge-2-react-orientdb-wp0ad     ║"
bold "║                                                            ║"
bold "║  3. Live unter:                                            ║"
bold "║     https://auge2.jeremias-groehl.de                       ║"
bold "╚════════════════════════════════════════════════════════════╝"
echo ""
