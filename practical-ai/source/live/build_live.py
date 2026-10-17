"""Build live slide pages. python3 build_live.py SPECS.json OUTDIR [ids...]
SPECS.json: {ID: {"h": headline, "label": footer label, "n": slide number, "spec": {...}}}"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from slidelib import head, tail, root, headline, footer

ENGINE = open(os.path.join(HERE, 'engine.js')).read()

def page(pid, d):
    n = d.get('n', 3)
    body = (head(f"{pid}: slide {n} live") + root('slab').replace('justify-content: space-between', 'justify-content: flex-start') +
            '<div style="padding-top:8px">\n' + headline(d['h'], 'slab', size=d.get('hsize', 88)) + '</div>\n' +
            '<div id="stage" style="position:relative; flex:1; min-height:0; margin:30px 0 30px"></div>\n' +
            footer(d['label'], n, 'slab') + '</div>\n' + tail())
    js = '<script>\nwindow.SPEC = ' + json.dumps(d['spec'], ensure_ascii=False) + ';\n' + ENGINE + '\n</script>\n'
    return body.replace('</body>', js + '</body>')

if __name__ == '__main__':
    specs = json.load(open(sys.argv[1])); out = sys.argv[2]; ids = sys.argv[3:] or list(specs)
    os.makedirs(out, exist_ok=True)
    for pid in ids:
        open(os.path.join(out, f'{pid}.dc.html'), 'w').write(page(pid, specs[pid]))
    print(len(ids), 'built')
