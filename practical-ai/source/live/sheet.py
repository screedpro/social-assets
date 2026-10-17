"""Contact sheet of stills: python3 sheet.py OUT.png dir1 dir2 ..."""
import sys, glob, os
from PIL import Image, ImageDraw
out, dirs = sys.argv[1], sys.argv[2:]
rows = []
for d in dirs:
    fs = sorted(glob.glob(os.path.join(d, 'still_*.png')), key=lambda p: int(p.split('_')[-1][:-4]))
    rows.append([Image.open(f).resize((270, 338)) for f in fs])
W = max(len(r) for r in rows) * 276 + 6
S = Image.new('RGB', (W, len(rows) * 344 + 6), '#888')
for i, r in enumerate(rows):
    for j, im in enumerate(r): S.paste(im, (6 + j * 276, 6 + i * 344))
S.save(out)
