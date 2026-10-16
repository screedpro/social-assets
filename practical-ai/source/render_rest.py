import os, re, sys, glob
sys.argv_saved = list(sys.argv)
S = '/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad'
src = open(S + '/gen/render.py').read()
src = src[:src.index('def jobs():')]
exec(src)
from playwright.sync_api import sync_playwright
SRC, DST = sys.argv[1], sys.argv[2]
ids = sys.argv[3:] or sorted(os.listdir(SRC))
def check_js():
    # returns list of overflow problems: any element extending beyond 1350 or root content overflow
    return """() => { const r = document.body.firstElementChild; const probs=[];
      if (r.scrollHeight > 1351) probs.push('root scrollHeight '+r.scrollHeight);
      const kids=[...r.children]; let y=0; for (const k of kids){ const b=k.getBoundingClientRect(); if (b.bottom>1350-63) probs.push('child bottom '+Math.round(b.bottom)); }
      for (const el of r.querySelectorAll('*')) { if (el.scrollWidth > el.clientWidth+2 && getComputedStyle(el).overflow!=='visible') probs.push('hscroll'); }
      for (const el of r.querySelectorAll('h1,h2,p,span,div')) { const b=el.getBoundingClientRect(); if (b.right>1080-60) {probs.push('right '+Math.round(b.right)+' '+el.textContent.slice(0,30)); break;} }
      return probs; }"""
problems = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=1)
    current = {}
    def route(r):
        u = r.request.url
        if u.startswith('http://local/page'):
            return r.fulfill(status=200, content_type='text/html; charset=utf-8', body=current['html'])
        m = re.search(r'/_blob/([0-9a-f]{32})', u)
        if m and m.group(1) in BLOBS:
            fp, ct = BLOBS[m.group(1)]
            return r.fulfill(status=200, content_type=ct, body=open(fp, 'rb').read())
        if 'fonts.googleapis.com' in u:
            return r.fulfill(status=200, content_type='text/css', body="@font-face{font-family:Inter;src:url(http://local/inter.woff2) format('woff2');font-weight:100 900;font-style:normal}")
        if u.startswith('http://local/inter.woff2'):
            return r.fulfill(status=200, content_type='font/woff2', body=open(FONT, 'rb').read())
        return r.abort()
    pg.route('**/*', route)
    n = 0
    for pid in ids:
        os.makedirs(f'{DST}/{pid}', exist_ok=True)
        for k in range(1, 8):
            current['html'] = prep(open(f'{SRC}/{pid}/{pid}-{k}.dc.html').read())
            pg.goto('http://local/page')
            pg.wait_for_selector('body[data-ready="1"]')
            pg.evaluate('document.fonts.ready')
            pg.wait_for_timeout(120)
            pr = pg.evaluate(check_js())
            if pr: problems[f'{pid}-{k}'] = pr
            pg.screenshot(path=f'{DST}/{pid}/{pid}-{k}.png', clip={'x': 0, 'y': 0, 'width': 1080, 'height': 1350})
            n += 1
    b.close()
print(n, 'slides rendered')
for k, v in problems.items(): print('PROBLEM', k, v[:3])
