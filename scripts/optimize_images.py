#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps


IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}


def iter_images(paths: Iterable[Path]) -> Iterable[Path]:
    for p in paths:
        if p.is_dir():
            for root, _, files in os.walk(p):
                for name in files:
                    fp = Path(root) / name
                    if fp.suffix in IMG_EXTS:
                        yield fp
        else:
            if p.suffix in IMG_EXTS and p.exists():
                yield p


def max_edge_for(path: Path) -> int:
    n = path.name.lower()
    s = str(path).lower()

    if n == "img_9375.jpg":
        return 1200
    if "hero" in n:
        return 2000
    if "16x9" in n:
        return 2000
    if "/photos/" in s:
        return 1600
    return 2000


def optimize_one(path: Path) -> tuple[bool, str]:
    original_size = path.stat().st_size
    max_edge = max_edge_for(path)

    try:
        with Image.open(path) as im0:
            im = ImageOps.exif_transpose(im0)
            fmt = (im0.format or "").upper()
            mode = im.mode

            if mode in ("P", "RGBA"):
                im = im.convert("RGB")
            elif mode != "RGB":
                im = im.convert("RGB")

            w, h = im.size
            scale = min(1.0, max_edge / float(max(w, h)))
            if scale < 1.0:
                im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

            tmp = path.with_suffix(path.suffix + ".tmp")

            if fmt in ("PNG",) and path.suffix.lower() == ".png":
                im.save(tmp, format="PNG", optimize=True)
            else:
                im.save(
                    tmp,
                    format="JPEG",
                    quality=82,
                    optimize=True,
                    progressive=True,
                    subsampling=2,
                )

        new_size = tmp.stat().st_size
        if new_size >= original_size:
            tmp.unlink(missing_ok=True)
            return False, f"kept (would grow) {original_size}B"

        tmp.replace(path)
        return True, f"{original_size}B -> {new_size}B"
    except Exception as e:
        return False, f"error: {e}"


def main(argv: list[str]) -> int:
    roots = [Path(a) for a in argv[1:]] or [Path("photos"), Path("IMG_9375.jpg")]
    imgs = sorted(set(iter_images(roots)))
    if not imgs:
        print("No images found.", file=sys.stderr)
        return 1

    changed = 0
    for p in imgs:
        ok, msg = optimize_one(p)
        if ok:
            changed += 1
        print(f"{'OK ' if ok else 'SKIP'} {p} — {msg}")

    print(f"\nOptimized {changed}/{len(imgs)} images.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

