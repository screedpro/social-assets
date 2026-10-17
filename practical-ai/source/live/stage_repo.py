"""Copy rendered video + still into the asset repo. python3 stage_repo.py VIDDIR_PATTERN ID... (VIDDIR_PATTERN like live/vid_{id})"""
import sys, os, shutil
from PIL import Image
S = '/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad'
R = '/home/claude/social-assets/practical-ai/series'
pat, ids = sys.argv[1], sys.argv[2:]
for i in ids:
    src = os.path.join(S, pat.format(id=i)); d = os.path.join(R, i, 'live'); os.makedirs(d, exist_ok=True)
    shutil.copy(os.path.join(src, 'live.mp4'), os.path.join(d, f'{i}-3.mp4'))
    Image.open(os.path.join(src, 'final.png')).convert('RGB').save(os.path.join(d, f'{i}-3.jpg'), quality=92)
    print(i, os.path.getsize(os.path.join(d, f'{i}-3.mp4')))
