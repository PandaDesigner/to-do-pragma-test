"""Decodifica una captura CDP a PNG de 375x812 en evidence/.

Uso: python3 scripts/save-cdp-capture.py <json-del-cdp> <nombre-salida.png>
"""

import base64
import io
import json
import sys

from PIL import Image


def main() -> int:
    source, target = sys.argv[1], sys.argv[2]
    payload = json.loads(open(source, encoding="utf-8").read())
    raw = base64.b64decode(payload["data"])
    image = Image.open(io.BytesIO(raw)).convert("RGB")
    # El deviceScaleFactor es 2, así que la captura viene a 750x1624.
    image = image.resize((375, 812), Image.LANCZOS)
    image.save(target)
    print(f"{target} {image.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
