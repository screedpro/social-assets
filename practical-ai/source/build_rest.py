import json, os, sys, glob
sys.path.insert(0, os.path.dirname(__file__))
from slidelib import *
OUT = sys.argv[1]
files = sys.argv[2:]
posts = []
for f in files: posts += json.load(open(f))
os.makedirs(OUT, exist_ok=True)
for p in posts:
    pid = p['id']
    d = os.path.join(OUT, pid); os.makedirs(d, exist_ok=True)
    slides = [slide_cover(p), slide_text(p, 2, 'white', p['s2']), slide_text(p, 3, 'slab', p['s3']), slide_steps(p, 4, p['s4']), slide_copy(p, 5, p['s5']), slide_roadmap(p), slide_offer(p)]
    for k, c in enumerate(slides, 1):
        open(os.path.join(d, f'{pid}-{k}.dc.html'), 'w').write(c)
print(len(posts), 'posts built')
