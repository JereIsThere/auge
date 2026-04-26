"""Generate data.json files for each page that needs them."""
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent.parent
PAGES = ROOT / "pages"


def write_seite_eins() -> None:
    out = PAGES / "seite-eins" / "data.json"
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "value": 42,
    }
    out.write_text(json.dumps(payload, indent=2))
    print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    write_seite_eins()
