"""Build AA02 slide 3 as a Teams-style chat with a deterministic live-typing animation.
python3 aa02_live.py OUT_DC_HTML
The page exposes window.__frame(t) (seconds) and window.__T (total length)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from slidelib import head, tail, root, headline, footer, E, SERIES

P = [x for x in json.load(open(os.path.join(os.path.dirname(__file__), 'posts_AA.json'))) if x['id'] == 'AA02'][0]
MSGS = P['s3']['x'][1]
ORANGE = '#ff5a1f'

def bubble(i, who, text, side):
    if side == 'right':
        return (f'<div class="m me" data-i="{i}" style="display:none; align-self:flex-end; max-width:800px">'
                f'<div class="b" style="background:#121212; color:#fff; border-radius:24px 24px 6px 24px; padding:18px 26px; font-size:30px; line-height:1.3">{E(text)}</div></div>\n')
    return (f'<div class="m pam" data-i="{i}" style="display:none; align-self:flex-start; max-width:830px; gap:16px; align-items:flex-end">'
            f'<div class="av" style="width:52px; height:52px; flex-shrink:0; border-radius:50%; background:{ORANGE}; color:#fff; font-size:26px; font-weight:700; display:flex; align-items:center; justify-content:center">P</div>'
            f'<div class="b" style="background:#ffffff; color:#161616; border:1px solid #e2e2de; border-radius:24px 24px 24px 6px; padding:18px 26px; font-size:30px; line-height:1.3"><span class="t">{E(text)}</span><span class="r" style="visibility:hidden"></span></div></div>\n')

msgs = ''.join(bubble(i, *m) for i, m in enumerate(MSGS))
typing = (f'<div id="typing" style="display:none; align-self:flex-start; gap:16px; align-items:flex-end">'
          f'<div style="width:52px; height:52px; border-radius:50%; background:{ORANGE}; color:#fff; font-size:26px; font-weight:700; display:flex; align-items:center; justify-content:center">P</div>'
          '<div style="background:#fff; border:1px solid #e2e2de; border-radius:24px 24px 24px 6px; padding:24px 28px; display:flex; gap:10px">'
          + ''.join(f'<span class="dot" style="width:14px; height:14px; border-radius:50%; background:#8a8a85; display:block"></span>' for _ in range(3)) +
          '</div></div>\n')

panel = f'''<div style="background:#f2f2f0; border:1px solid #e2e2de; border-radius:28px; overflow:hidden; display:flex; flex-direction:column; height:905px; margin-top:28px">
<div style="background:#ffffff; border-bottom:1px solid #e2e2de; padding:22px 32px; display:flex; align-items:center; gap:18px">
<div style="position:relative; width:60px; height:60px; border-radius:50%; background:{ORANGE}; color:#fff; font-size:30px; font-weight:700; display:flex; align-items:center; justify-content:center">P<span style="position:absolute; right:-2px; bottom:-2px; width:18px; height:18px; border-radius:50%; background:#22a45d; border:3px solid #fff"></span></div>
<div style="display:flex; flex-direction:column; gap:2px"><span style="font-size:32px; font-weight:500; color:#0a0a0a">Pam</span><span style="font-size:23px; color:#5f5f5b">AI agent · drafts, you approve</span></div>
<span style="margin-left:auto; font-size:23px; color:#5f5f5b">Microsoft Teams</span>
</div>
<div id="msgs" style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; gap:14px; padding:20px 28px; overflow:hidden">
{msgs}{typing}</div>
<div style="background:#ffffff; border-top:1px solid #e2e2de; padding:18px 24px; display:flex; align-items:center; gap:16px">
<div style="flex:1; min-height:44px; border:1px solid #e2e2de; border-radius:999px; padding:12px 26px; font-size:28px; line-height:1.3; color:#161616; display:flex; align-items:center"><span style="display:block"><span id="compose"></span><span id="caret" style="display:inline-block; width:3px; height:32px; background:#161616; margin-left:2px; vertical-align:-6px"></span><span id="ph" style="color:#9a9a95">Type a message</span></span></div>
<div id="send" style="width:64px; height:64px; border-radius:50%; background:#d9d9d5; display:flex; align-items:center; justify-content:center"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M3 20l18-8L3 4v6l12 2-12 2z" fill="#fff"/></svg></div>
</div>
</div>
'''

label = f"{SERIES[P['series']]}, post {P['num']} of 10"
html = (head(f"{P['title_short']}: slide 3") + root('slab').replace('justify-content: space-between', 'justify-content: flex-start') +
        f'<div style="padding-top:8px">\n' + headline(P['s3']['h'], 'slab', size=88) + '</div>\n' + panel +
        '<div style="flex:1"></div>' + footer(label, 3, 'slab') + '</div>\n' + tail())

ANIM = r'''
<script>
(function(){
var M = __M__;
// timeline: user messages are typed in the compose box then sent; Pam shows typing dots then streams words.
var ev = [], t = 0.6;
M.forEach(function(m, i){
  if (m[2] === 'right') { var d = m[1].length / 30; ev.push({i:i, kind:'type', a:t, b:t + d}); t += d + 0.35; }
  else { ev.push({i:i, kind:'dots', a:t, b:t + 1.0}); t += 1.0; var w = m[1].split(' ').length, d2 = w * 0.07;
         ev.push({i:i, kind:'stream', a:t, b:t + d2}); t += d2 + 0.6; }
});
window.__T = t + 3.0;
window.__frame = function(T){
  var msgs = document.querySelectorAll('#msgs .m'), typing = document.getElementById('typing');
  var compose = document.getElementById('compose'), ph = document.getElementById('ph'), caret = document.getElementById('caret'), send = document.getElementById('send');
  msgs.forEach(function(el){ el.style.display = 'none'; });
  typing.style.display = 'none'; compose.textContent = ''; send.style.background = '#d9d9d5';
  var composing = false;
  ev.forEach(function(e){
    var el = msgs[e.i], txt = M[e.i][1];
    if (e.kind === 'type') {
      if (T >= e.a && T < e.b) { composing = true; compose.textContent = txt.slice(0, Math.floor((T - e.a) / (e.b - e.a) * txt.length)); send.style.background = '#121212'; }
      else if (T >= e.b + 0.15) { el.style.display = 'flex'; }
      else if (T >= e.b) { composing = true; compose.textContent = txt; send.style.background = '#ff5a1f'; }
    } else if (e.kind === 'dots') {
      if (T >= e.a && T < e.b) { typing.style.display = 'flex'; typing.parentNode.appendChild(typing);
        typing.querySelectorAll('.dot').forEach(function(d, k){ var ph2 = ((T * 3) - k * 0.25) % 1; d.style.transform = 'translateY(' + (ph2 < 0.4 ? -8 * Math.sin(ph2 / 0.4 * Math.PI) : 0) + 'px)'; }); }
    } else if (e.kind === 'stream') {
      if (T >= e.a) { el.style.display = 'flex'; var words = txt.split(' '), n = T >= e.b ? words.length : Math.max(1, Math.ceil((T - e.a) / (e.b - e.a) * words.length));
        el.querySelector('.t').textContent = words.slice(0, n).join(' '); el.querySelector('.r').textContent = n < words.length ? ' ' + words.slice(n).join(' ') : ''; }
    }
  });
  // each message is appended in order so newest sits at the bottom
  var box = document.getElementById('msgs');
  msgs.forEach(function(el){ box.appendChild(el); }); if (typing.style.display !== 'none') box.appendChild(typing);
  ph.style.display = composing && compose.textContent ? 'none' : (composing ? 'none' : 'inline');
  caret.style.visibility = composing ? ((Math.floor(T * 2.5) % 2 === 0) ? 'visible' : 'hidden') : 'hidden';
  if (!composing) { ph.style.display = 'inline'; }
  return true;
};
})();
</script>
'''.replace('__M__', json.dumps(MSGS, ensure_ascii=False))

open(sys.argv[1], 'w').write(html.replace('</body>', ANIM + '</body>'))
print('built', sys.argv[1])
