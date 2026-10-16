import json, html, os, sys

TRI = "/_blob/c5cd3bddbbcc63eb1a904e2aca1633e6"
LOGO_W = "/_blob/19a751f3a6353638ed4da1a9f5a5e3b5"
FONT = "'Helvetica Neue', Helvetica, Inter, Arial, sans-serif"
SERIES = ['Getting started', 'Jargon buster', 'Accounting', 'Suppliers and margin', 'Winning work', 'Running the crew', 'Agents and automation', 'Skills and dashboards']
TOPICS = {
 1: ['Claude.ai, Claude Code and the Console', 'Connectors, APIs and MCPs', 'What’s an artifact?', 'Tokens, plans and paying as you go', 'What’s a skill? Tips and limits', 'Markdown files and CLAUDE.md', 'What’s a webhook?', 'n8n: the mesh in your screed', 'GitHub: a draft before you go live', 'Which model, when?'],
 2: ['Connect Xero to Claude', 'A week of invoices in one go', 'Purchase orders in a batch', 'Bank reconciliation: Claude drafts, you approve', 'A daily cash update from your bank feed', 'Debtors, creditors and cash flow', 'Merge duplicate contacts in Xero', 'Check ABNs on the Business Register', 'Credit checks before you supply', 'Never miss a BAS, rego or insurance date'],
 3: ['A listening post on your accounts inbox', 'Supplier bills into Xero, coded', 'Teach Claude your coding from last year’s bills', 'Price-creep alerts', 'Find where margin leaks', 'Quote with today’s costs', 'One RFQ pack to five suppliers', 'Do you still need ApprovalMax?', 'Payment dates set for you', 'Supplier statements reconciled'],
 4: ['Stop reading every email', 'Voice note in the car, CRM updated', 'Wake up old clients', 'Clean up your contacts', 'A map of who works with whom', 'A tender register with reminders', 'Quote options clients value', 'Have Claude set up your CRM', 'Posts your followers want', 'Write in your voice'],
 5: ['A tool register from a photo', 'Who’s going where tomorrow', 'Talk instead of filling in site forms', 'Safety documents', 'Timesheets and weekly wages', 'Replace your forms app', 'A new starter checklist', 'Toolbox talks and training', 'Licences and tickets in one register', 'Your morning dashboard'],
 6: ['Meet Pam', 'Pam’s day', 'Agent or scheduled task?', 'Ten scheduled tasks for a tiling business', 'What wakes an agent up', 'Do you still need Zapier?', 'You don’t need a data lake', 'Getting Claudes to talk to each other', 'An agent in Microsoft Teams', 'Set up your own agent'],
 7: ['Ten skills for a tiling business', 'A deep-think skill', 'A brand pack', 'Dashboards that look, dashboards that act', 'Approve straight from a dashboard', 'Rolling out Claude to your team', '“Who am I?”: permissions', 'Draft but can’t send', 'Most digital brains are hype', 'A knowledge graph for your business'],
}
BG = {'white': ('#ffffff', '#161616', '#0a0a0a', '#3d3d3a', '#5f5f5b', '#e2e2de'),
      'slab': ('#f2f2f0', '#161616', '#0a0a0a', '#3d3d3a', '#5f5f5b', '#e2e2de'),
      'dark': ('#121212', '#ffffff', '#ffffff', 'rgba(255,255,255,0.82)', 'rgba(255,255,255,0.62)', 'rgba(255,255,255,0.18)')}
E = html.escape

def head(title):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{E(title)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0}}
</style>
</helmet>
'''

def tail(props=None, js='return {};'):
    p = {'$preview': {'width': 1080, 'height': 1350}}
    if props: p = {**props, **p}
    pj = json.dumps(p, ensure_ascii=False).replace("'", '&#39;')
    return f'''</x-dc>
<script type="text/x-dc" data-dc-script data-props='{pj}'>
class Component extends DCLogic {{
renderVals() {{
{js}
}}
}}
</script>
</body>
</html>
'''

def root(bg):
    b = BG[bg]
    return f'<div style="width: 1080px; height: 1350px; box-sizing: border-box; padding: 64px; background: {b[0]}; color: {b[1]}; font-family: {FONT}; display: flex; flex-direction: column; justify-content: space-between">\n'

def headline(text, bg, size=104):
    b = BG[bg]
    words = text.split(' ')
    first, last = ' '.join(words[:-1]), words[-1]
    lead = E(first) + ' ' if first else ''
    return (f'<h2 style="margin: 0; font-size: {size}px; line-height: 1.0; letter-spacing: -0.04em; font-weight: 500; color: {b[2]}; max-width: 940px">'
            f'{lead}<span style="white-space: nowrap">{E(last)}<img src="{TRI}" alt="" style="width: 0.36em; height: 0.22em; margin-left: 0.05em"></span></h2>\n')

def body(text, bg):
    return f'<p style="margin: 0; font-size: 40px; line-height: 1.25; letter-spacing: -0.015em; color: {BG[bg][3]}; max-width: 880px">{E(text)}</p>\n'

def footer(label, n, bg):
    b = BG[bg]
    return (f'<div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid {b[5]}; padding-top: 40px; font-size: 28px; color: {b[4]}">'
            f'<span>{E(label)}</span><span style="font-variant-numeric: tabular-nums">{n} / 7</span></div>\n')

def pills(items, bg):
    ink = BG[bg][2]
    s = ''.join(f'<span style="border: 2px solid rgba(10,10,10,0.45); border-radius: 980px; padding: 18px 36px; font-size: 36px; font-weight: 500; color: {ink}">{E(i)}</span>\n' for i in items)
    return f'<div style="display: flex; flex-wrap: wrap; gap: 16px">\n{s}</div>\n'

def cards(items, bg):
    out = []
    for t, d in items:
        out.append(f'<div style="background: #ffffff; border-radius: 20px; padding: 40px 44px; display: flex; flex-direction: column; gap: 12px"><div style="font-size: 44px; font-weight: 500; letter-spacing: -0.02em; color: #0a0a0a">{E(t)}</div><div style="font-size: 34px; line-height: 1.3; color: #3d3d3a">{E(d)}</div></div>\n')
    return '<div style="display: flex; flex-direction: column; gap: 20px">\n' + ''.join(out) + '</div>\n'

def strip(items, bg):
    b = BG[bg]
    out = []
    for i, (big, small) in enumerate(items):
        pad = '36px 24px 36px 0' if i == 0 else ('36px 0 36px 24px' if i == len(items) - 1 else '36px 24px')
        br = f'; border-right: 1px solid {b[5]}' if i < len(items) - 1 else ''
        out.append(f'<div style="padding: {pad}; display: flex; flex-direction: column; gap: 4px{br}"><div style="font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; font-weight: 500; color: {b[2]}">{E(big)}</div><div style="font-size: 28px; line-height: 1.3; color: {b[4]}">{E(small)}</div></div>\n')
    return f'<div style="display: grid; grid-template-columns: repeat({len(items)}, minmax(0, 1fr)); border-top: 1px solid {b[5]}; border-bottom: 1px solid {b[5]}">\n' + ''.join(out) + '</div>\n'

def chat(items, bg):
    out = []
    for who, text, side in items:
        if side == 'right':
            out.append(f'<div style="align-self: flex-end; max-width: 760px; display: flex; flex-direction: column; gap: 8px; align-items: flex-end"><span style="font-size: 24px; color: #5f5f5b">{E(who)}</span><div style="background: #121212; color: #ffffff; border-radius: 28px; padding: 28px 36px; font-size: 36px; line-height: 1.3">{E(text)}</div></div>\n')
        else:
            out.append(f'<div style="align-self: flex-start; max-width: 760px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 24px; color: #5f5f5b">{E(who)}</span><div style="background: #ffffff; color: #161616; border-radius: 28px; padding: 28px 36px; font-size: 36px; line-height: 1.3">{E(text)}</div></div>\n')
    return '<div style="display: flex; flex-direction: column; gap: 20px">\n' + ''.join(out) + '</div>\n'

def listcard(title, rows, bg):
    r = ''.join(f'<div style="display: flex; gap: 32px; padding: 20px 0; border-top: 1px solid #e2e2de; font-size: 32px"><span style="width: 220px; flex-shrink: 0; color: #5f5f5b">{E(a)}</span><span>{E(v)}</span></div>\n' for a, v in rows)
    return f'<div style="background: #ffffff; border-radius: 20px; padding: 44px; display: flex; flex-direction: column"><div style="font-size: 44px; font-weight: 500; letter-spacing: -0.02em; color: #0a0a0a; padding-bottom: 20px">{E(title)}</div>\n{r}</div>\n'

def grid2(items, bg):
    r = ''.join(f'<div style="padding: 20px 0; border-top: 1px solid #e2e2de; font-size: 32px; display: flex; gap: 16px"><span style="width: 40px; color: #5f5f5b; font-variant-numeric: tabular-nums">{i + 1}</span><span>{E(t)}</span></div>\n' for i, t in enumerate(items))
    return f'<div style="background: #ffffff; border-radius: 20px; padding: 24px 44px 44px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 40px; grid-auto-flow: column; grid-template-rows: repeat({(len(items) + 1) // 2}, auto)">\n{r}</div>\n'

BLOCKS = {'pills': pills, 'cards': cards, 'strip': strip, 'chat': chat, 'grid2': grid2}

def slide_text(p, n, bg, s):
    label = f"{SERIES[p['series']]}, post {p['num']} of 10"
    top = headline(s['h'], bg) + (body(s['b'], bg) if s.get('b') else '')
    x = s.get('x')
    blk = ''
    if x:
        kind = x[0]
        blk = listcard(x[1], x[2], bg) if kind == 'listcard' else BLOCKS[kind](x[1], bg)
    return (head(f"{p['title_short']}: slide {n}") + root(bg) +
            f'<div style="display: flex; flex-direction: column; gap: 40px; padding-top: 72px">\n{top}</div>\n' + blk +
            footer(label, n, bg) + '</div>\n' + tail())

def slide_steps(p, n, s):
    bg = 'white'
    label = f"{SERIES[p['series']]}, post {p['num']} of 10"
    lis = []
    for i, st in enumerate(s['steps']):
        last = '; border-bottom: 1px solid #e2e2de' if i == len(s['steps']) - 1 else ''
        lis.append(f'<li style="display: flex; gap: 40px; align-items: baseline; padding: 40px 0; border-top: 1px solid #e2e2de{last}"><span style="font-size: 44px; font-weight: 500; color: #0a0a0a; font-variant-numeric: tabular-nums; width: 48px">{i + 1}</span><span style="font-size: 40px; line-height: 1.25; letter-spacing: -0.015em">{E(st)}</span></li>\n')
    return (head(f"{p['title_short']}: slide {n}") + root(bg) +
            f'<div style="padding-top: 72px">\n{headline(s["h"], bg)}</div>\n' +
            '<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column">\n' + ''.join(lis) + '</ol>\n' +
            footer(label, n, bg) + '</div>\n' + tail())

def slide_copy(p, n, s):
    bg = 'dark'
    label = f"{SERIES[p['series']]}, post {p['num']} of 10"
    return (head(f"{p['title_short']}: slide {n}") + root(bg) +
            f'<div style="display: flex; flex-direction: column; gap: 40px; padding-top: 72px">\n{headline("Copy this", bg)}{body(s["sub"], bg)}</div>\n' +
            f'<div style="background: #ffffff; color: #161616; border-radius: 20px; padding: 48px; font-size: 44px; line-height: 1.3; letter-spacing: -0.015em">“{E(s["prompt"])}”</div>\n' +
            f'<div style="display: flex; flex-direction: column; gap: 40px">\n<p style="margin: 0; font-size: 28px; line-height: 1.3; color: rgba(255,255,255,0.62)">{E(s["note"])}</p>\n' +
            footer(label, n, bg) + '</div>\n</div>\n' + tail())

def slide_cover(p):
    ser = SERIES[p['series']]
    names = json.dumps(SERIES, ensure_ascii=False)
    js = f'''var names = {names};
var cur = this.props.current ?? {p['series']};
var order = [0, 4, 1, 5, 2, 6, 3, 7];
var series = order.map(function (i) {{
var on = i === cur;
return {{
name: names[i],
markStyle: 'width: 30px; height: 18px; flex-shrink: 0; visibility: ' + (on ? 'visible' : 'hidden'),
textStyle: 'font-size: 34px; line-height: 1.2; letter-spacing: -0.015em; ' + (on ? 'font-weight: 500; color: #ffffff' : 'font-weight: 400; color: rgba(255,255,255,0.62)')
}};
}});
return {{ series: series }};'''
    return (head(f"{p['title_short']}: cover") + root('dark') +
            '<div style="display: flex; flex-direction: column; gap: 36px; padding-top: 48px">\n'
            f'<h1 style="margin: 0; font-size: 92px; line-height: 1.0; letter-spacing: -0.04em; font-weight: 500; max-width: 940px">{E(p["q"])}</h1>\n'
            f'<p style="margin: 0; font-size: 40px; line-height: 1.25; letter-spacing: -0.015em; color: rgba(255,255,255,0.82); max-width: 880px">{E(p["sub"])}</p>\n</div>\n'
            '<div style="display: flex; flex-direction: column; gap: 20px">\n<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 48px">\n'
            '<sc-for list="{{series}}" as="s" hint-placeholder-count="8">\n'
            '<div style="display: flex; align-items: center; gap: 18px; padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.18)">\n'
            f'<img src="{TRI}" alt="" style="{{{{s.markStyle}}}}">\n<span style="{{{{s.textStyle}}}}">{{{{s.name}}}}</span>\n</div>\n</sc-for>\n</div>\n'
            f'<p style="margin: 0; font-size: 28px; line-height: 1.3; color: rgba(255,255,255,0.62)">Practical AI for ScreedPro clients. Eight series; this post is from {E(ser)}.</p>\n</div>\n'
            '<div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.18); padding-top: 40px">\n'
            f'<img src="{LOGO_W}" alt="ScreedPro" style="width: 320px; height: auto">\n'
            '<div style="display: flex; align-items: center; gap: 12px; font-size: 28px; color: rgba(255,255,255,0.62)">Swipe\n'
            '<svg aria-hidden="true" width="18" height="28" viewBox="0 0 18 28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l10 10-10 10"></path></svg>\n</div>\n</div>\n</div>\n' +
            tail({'current': {'editor': 'int', 'default': p['series'], 'min': 0, 'max': 7}}, js))

def slide_roadmap(p):
    ser = SERIES[p['series']]
    names = json.dumps(TOPICS[p['series']], ensure_ascii=False)
    js = f'''var names = {names};
var cur = this.props.current ?? {p['num']};
var topics = names.map(function (n, i) {{
var num = i + 1;
var on = num === cur;
var done = num < cur;
return {{
num: num,
name: n,
done: done,
markStyle: 'width: 30px; height: 18px; flex-shrink: 0; display: ' + (on ? 'block' : 'none'),
textStyle: 'flex: 1; font-size: 34px; line-height: 1.2; letter-spacing: -0.015em; ' + (on ? 'font-weight: 500; color: #0a0a0a' : (done ? 'color: #5f5f5b' : 'color: #161616'))
}};
}});
return {{ topics: topics }};'''
    label = f"{ser}, post {p['num']} of 10"
    return (head(f"{p['title_short']}: series roadmap") + root('white') +
            '<div style="display: flex; flex-direction: column; gap: 24px; padding-top: 48px">\n' + headline(f'Coming up in {ser}', 'white', 84) +
            '<p style="margin: 0; font-size: 32px; line-height: 1.3; color: #3d3d3a">Ten posts. You’re on the one marked.</p>\n</div>\n'
            '<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column">\n<sc-for list="{{topics}}" as="t" hint-placeholder-count="10">\n'
            '<li style="display: flex; align-items: center; gap: 24px; padding: 18px 0; border-top: 1px solid #e2e2de">\n'
            '<span style="width: 44px; font-size: 30px; font-variant-numeric: tabular-nums; color: #5f5f5b">{{t.num}}</span>\n'
            '<span style="{{t.textStyle}}">{{t.name}}</span>\n'
            f'<img src="{TRI}" alt="" style="{{{{t.markStyle}}}}">\n'
            '<sc-if value="{{t.done}}" hint-placeholder-val="{{false}}">\n<svg aria-label="Done" role="img" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#5f5f5b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l6 6L23 7"></path></svg>\n</sc-if>\n</li>\n</sc-for>\n</ol>\n' +
            footer(label, 6, 'white') + '</div>\n' +
            tail({'current': {'editor': 'int', 'default': p['num'], 'min': 1, 'max': 10}}, js))

def slide_offer(p):
    return (head(f"{p['title_short']}: the offer") + root('dark') +
            '<div style="display: flex; flex-direction: column; gap: 40px; padding-top: 72px">\n' + headline('Want it set up for you', 'dark') +
            body('ScreedPro clients get a free AI agent or skill when they enquire, and another with every quote or booking.', 'dark') + '</div>\n' +
            strip([('Enquire', 'One free'), ('Get a quote', 'Another free'), ('Book a job', 'Another free')], 'dark') +
            '<div style="display: flex; flex-direction: column; gap: 40px">\n<div style="display: flex; flex-direction: column; gap: 20px">\n'
            '<span style="align-self: flex-start; display: inline-flex; align-items: center; gap: 14px; background: #ff4d00; color: #0a0a0a; border-radius: 980px; padding: 28px 48px; font-size: 40px; font-weight: 500; letter-spacing: -0.01em">Link in bio<svg aria-hidden="true" width="23" height="14" viewBox="0 0 46 28"><path d="M23 0L46 28H0z" fill="#0a0a0a"></path></svg></span>\n'
            '<span style="font-size: 32px; line-height: 1.3; color: rgba(255,255,255,0.82)">Follow us for the full series.</span>\n</div>\n'
            '<div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.18); padding-top: 40px; font-size: 28px; color: rgba(255,255,255,0.62)"><span>screedpro.com</span><span style="font-variant-numeric: tabular-nums">7 / 7</span></div>\n</div>\n</div>\n' +
            tail())

