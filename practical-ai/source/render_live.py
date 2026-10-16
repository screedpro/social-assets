"""Render a live slide to frames + MP4. python3 render_live.py SRC_DC_HTML OUT_DIR [fps] [stills-only]"""
import os, re, sys, subprocess
S = '/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad'
src = open(S + '/gen/render.py').read(); exec(src[:src.index('def jobs():')])
from playwright.sync_api import sync_playwright
SRC, OUT = sys.argv[1], sys.argv[2]
FPS = int(sys.argv[3]) if len(sys.argv) > 3 else 30
STILLS = len(sys.argv) > 4
os.makedirs(OUT + '/frames', exist_ok=True)
html = prep(open(SRC).read())
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=1)
    def route(r):
        u = r.request.url
        if u.startswith('http://local/page'): return r.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
        m = re.search(r'/_blob/([0-9a-f]{32})', u)
        if m and m.group(1) in BLOBS:
            fp, ct = BLOBS[m.group(1)]; return r.fulfill(status=200, content_type=ct, body=open(fp, 'rb').read())
        if 'fonts.googleapis.com' in u:
            return r.fulfill(status=200, content_type='text/css', body="@font-face{font-family:Inter;src:url(http://local/inter.woff2) format('woff2');font-weight:100 900;font-style:normal}")
        if u.startswith('http://local/inter.woff2'): return r.fulfill(status=200, content_type='font/woff2', body=open(FONT, 'rb').read())
        return r.abort()
    pg.route('**/*', route)
    pg.goto('http://local/page'); pg.wait_for_selector('body[data-ready="1"]'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(200)
    T = pg.evaluate('window.__T')
    clip = {'x': 0, 'y': 0, 'width': 1080, 'height': 1350}
    if STILLS:
        for t in [0.3, 2.0, 4.0, 5.3, 8.5, 12.0, T]:
            pg.evaluate(f'window.__frame({t})'); pg.screenshot(path=f'{OUT}/still_{t:05.2f}.png', clip=clip)
    else:
        n = int(T * FPS)
        for k in range(n + 1):
            pg.evaluate(f'window.__frame({k / FPS})'); pg.screenshot(path=f'{OUT}/frames/f{k:04d}.png', clip=clip)
        pg.evaluate(f'window.__frame({T})'); pg.screenshot(path=f'{OUT}/final.png', clip=clip)
    # overflow check on final state
    pg.evaluate(f'window.__frame({T})')
    print('T', T, 'root scrollHeight', pg.evaluate('document.body.firstElementChild.scrollHeight'),
          'msgs overflow', pg.evaluate("(()=>{const m=document.getElementById('msgs');return [m.scrollHeight,m.clientHeight]})()"))
    b.close()
if not STILLS:
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', f'{OUT}/frames/f%04d.png',
                    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
                    '-shortest', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-crf', '18',
                    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', f'{OUT}/live.mp4'], check=True)
    print('video', os.path.getsize(f'{OUT}/live.mp4'))
