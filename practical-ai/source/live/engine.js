/* ScreedPro live-slide engine. Deterministic: window.__init() builds, window.__frame(t) draws time t (seconds). */
(function () {
'use strict';
var C = { ink: '#0a0a0a', text: '#161616', body: '#3d3d3a', mute: '#5f5f5b', faint: '#9a9a95', line: '#e2e2de', card: '#ffffff', slab: '#f2f2f0', orange: '#ff5a1f', orangeTint: '#fff1ea', green: '#22a45d', greenTint: '#e9f7ef', dark: '#121212', blue: '#2f6fed' };
var NS = 'http://www.w3.org/2000/svg';
function clamp(x, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.max(a, Math.min(b, x)); }
function prog(t, a, b) { return b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a)); }
function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
function back(p) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function mk(tag, css, parent, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
function svgEl(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function pop(e, p, from) { p = clamp(p); from = from == null ? 0.85 : from; e.style.opacity = clamp(p * 1.6); e.style.transform = (e._base || '') + ' scale(' + (from + (1 - from) * back(p)) + ')'; e.style.visibility = p <= 0 ? 'hidden' : 'visible'; }
function fade(e, p, dy) { p = clamp(p); e.style.opacity = p; e.style.transform = (e._base || '') + ' translateY(' + ((1 - ease(p)) * (dy == null ? 16 : dy)) + 'px)'; e.style.visibility = p <= 0 ? 'hidden' : 'visible'; }
function typeTo(e, s, p) { var n = Math.round(clamp(p) * s.length); e.textContent = s.slice(0, n); }
function words(e, s, p) { var w = s.split(' '); var n = p >= 1 ? w.length : Math.floor(clamp(p) * w.length); e.textContent = w.slice(0, n).join(' '); }

/* ---------- icons ---------- */
var P = {
  mail: '<path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2"/>',
  doc: '<path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="2"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/>',
  check: '<path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="3"/>',
  person: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1-5 15-5 16 0" fill="none" stroke="currentColor" stroke-width="2"/>',
  camera: '<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7l2-3h4l2 3" fill="none" stroke="currentColor" stroke-width="2"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 11a7 7 0 0014 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="2.4" fill="none"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2"/>',
  globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/>',
  truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="currentColor"/>',
  tool: '<path d="M14 6a4 4 0 005 5l-9 9-3-3 9-9a4 4 0 01-2-2z" fill="none" stroke="currentColor" stroke-width="2"/>',
  dollar: '<path d="M12 3v18M17 7c-1-2-3-2-5-2s-4 1-4 3 2 3 4 3 5 1 5 4-2 3-5 3-4-1-5-3" fill="none" stroke="currentColor" stroke-width="2"/>',
  spark: '<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor"/>',
  alert: '<path d="M12 3l10 18H2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10v5M12 17.5v.5" stroke="currentColor" stroke-width="2.4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 18h2" stroke="currentColor" stroke-width="2"/>',
  receipt: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" stroke-width="2"/>',
  card: '<rect x="2" y="6" width="20" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 11h7M5 15h10" stroke="currentColor" stroke-width="2"/>',
  folder: '<path d="M3 6h7l2 2h9v11H3z" fill="none" stroke="currentColor" stroke-width="2"/>',
  gear: '<circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2"/>',
  chat: '<path d="M4 4h16v12H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 01-12 0zM12 18v4" fill="none" stroke="currentColor" stroke-width="2"/>',
  key: '<circle cx="8" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 12h10M18 12v4M21 12v3" stroke="currentColor" stroke-width="2"/>',
  search: '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="2.4"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="6" r="1.4" fill="currentColor"/><circle cx="4" cy="12" r="1.4" fill="currentColor"/><circle cx="4" cy="18" r="1.4" fill="currentColor"/>',
  web: '<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 9h20" stroke="currentColor" stroke-width="2"/>',
  bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 20a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="2"/>',
  map: '<path d="M12 22s7-7 7-12a7 7 0 00-14 0c0 5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/>',
  brain: '<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 1V5a3 3 0 00-3-1zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 1" fill="none" stroke="currentColor" stroke-width="2"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2"/>',
  graph: '<circle cx="5" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7l4 9M17 7l-4 9M7.5 6h9" stroke="currentColor" stroke-width="2"/>'
};
/* apps: [bg, fg, glyph text or icon key] -- plain lettermarks, no logos */
var APPS = {
  xero: ['#13b5ea', '#fff', 'X'], crm: ['#1f3a5f', '#fff', 'CRM'], highlevel: ['#1f3a5f', '#fff', 'HL'], teams: ['#5059c9', '#fff', 'T'],
  outlook: ['#0f6cbd', '#fff', 'O'], gmail: ['#d93025', '#fff', 'G'], email: ['#0f6cbd', '#fff', '@mail'], calendar: ['#0f6cbd', '#fff', '@calendar'],
  n8n: ['#ea4b71', '#fff', 'n8n'], airtable: ['#2d7ff9', '#fff', 'A'], sharepoint: ['#038387', '#fff', 'S'], drive: ['#188038', '#fff', 'D'],
  dropbox: ['#0061fe', '#fff', 'D'], github: ['#24292f', '#fff', 'GH'], claude: ['#121212', '#ff5a1f', '@spark'], pam: ['#ff5a1f', '#fff', 'P'],
  abr: ['#4a4a46', '#fff', 'ABR'], ato: ['#4a4a46', '#fff', 'ATO'], bank: ['#4a4a46', '#fff', '@dollar'], phone: ['#4a4a46', '#fff', '@phone'],
  web: ['#4a4a46', '#fff', '@globe'], camera: ['#4a4a46', '#fff', '@camera'], doc: ['#4a4a46', '#fff', '@doc'], person: ['#e2e2de', '#161616', '@person'],
  you: ['#121212', '#fff', '@person'], supplier: ['#4a4a46', '#fff', '@truck'], sms: ['#22a45d', '#fff', '@chat'], forms: ['#4a4a46', '#fff', '@list'],
  zapier: ['#ff4f00', '#fff', 'Z'], approvalmax: ['#4a4a46', '#fff', 'AM'], console: ['#121212', '#fff', '@gear'], api: ['#4a4a46', '#fff', 'API'],
  mcp: ['#121212', '#fff', 'MCP'], webhook: ['#4a4a46', '#fff', '@link'], skill: ['#ff5a1f', '#fff', '@doc'], schedule: ['#4a4a46', '#fff', '@clock'],
  alert: ['#ff5a1f', '#fff', '@alert'], bell: ['#ff5a1f', '#fff', '@bell'], dashboard: ['#121212', '#fff', '@chart'], fleet: ['#4a4a46', '#fff', '@truck'],
  tool: ['#4a4a46', '#fff', '@tool'], receipt: ['#4a4a46', '#fff', '@receipt'], card: ['#4a4a46', '#fff', '@card'], folder: ['#4a4a46', '#fff', '@folder'],
  mic: ['#4a4a46', '#fff', '@mic'], graph: ['#121212', '#fff', '@graph'], search: ['#4a4a46', '#fff', '@search'], lock: ['#4a4a46', '#fff', '@lock'],
  map: ['#4a4a46', '#fff', '@map'], brain: ['#121212', '#fff', '@brain'], key: ['#4a4a46', '#fff', '@key'], list: ['#4a4a46', '#fff', '@list']
};
function iconSvg(key, size, color) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="color:' + (color || 'currentColor') + '; display:block">' + (P[key] || P.spark) + '</svg>'; }
function badge(app, size) {
  var a = APPS[app] || (P[app] ? ['#4a4a46', '#fff', '@' + app] : ['#4a4a46', '#fff', String(app || '?').slice(0, 3).toUpperCase()]);
  var g = a[2], inner;
  if (g[0] === '@') inner = iconSvg(g.slice(1), Math.round(size * 0.56), a[1]);
  else inner = '<span style="color:' + a[1] + '; font-weight:700; font-size:' + Math.round(size * (g.length > 2 ? 0.3 : g.length > 1 ? 0.38 : 0.5)) + 'px; letter-spacing:-0.02em">' + esc(g) + '</span>';
  return '<div style="width:' + size + 'px; height:' + size + 'px; border-radius:' + Math.round(size * 0.26) + 'px; background:' + a[0] + '; display:flex; align-items:center; justify-content:center; flex-shrink:0">' + inner + '</div>';
}

/* ---------- shared pieces ---------- */
function windowCard(stage, opts) {
  // a white app window filling the stage, with header
  var w = mk('div', 'position:absolute; inset:0; background:#fff; border:1px solid ' + C.line + '; border-radius:28px; overflow:hidden; display:flex; flex-direction:column', stage);
  var hd = mk('div', 'display:flex; align-items:center; gap:18px; padding:20px 28px; border-bottom:1px solid ' + C.line + '; flex-shrink:0', w);
  hd.innerHTML = badge(opts.app || 'doc', 52) + '<div style="display:flex; flex-direction:column; gap:2px; min-width:0"><span style="font-size:30px; font-weight:500; color:' + C.ink + '">' + esc(opts.title || '') + '</span>' +
    (opts.sub ? '<span style="font-size:22px; color:' + C.mute + '">' + esc(opts.sub) + '</span>' : '') + '</div>' +
    (opts.right ? '<span style="margin-left:auto; font-size:22px; color:' + C.mute + '; white-space:nowrap">' + esc(opts.right) + '</span>' : '');
  var body = mk('div', 'position:relative; flex:1; min-height:0', w);
  return { win: w, head: hd, body: body };
}
function pill(parent, text, kind, css) {
  var bg = kind === 'green' ? C.green : kind === 'orange' ? C.orange : kind === 'dark' ? C.dark : '#fff';
  var fg = kind === 'light' ? C.text : '#fff';
  var bd = kind === 'light' ? '2px solid ' + C.line : 'none';
  var ic = kind === 'green' ? iconSvg('check', 26, '#fff') : kind === 'orange' ? iconSvg('person', 26, '#fff') : '';
  return mk('div', 'display:inline-flex; align-items:center; gap:12px; background:' + bg + '; color:' + fg + '; border:' + bd + '; border-radius:999px; padding:14px 28px; font-size:27px; font-weight:500; white-space:nowrap; ' + (css || ''), parent, ic + '<span>' + esc(text) + '</span>');
}
function approvalPill(stage, text, kind) {
  var wrap = mk('div', 'position:absolute; left:0; right:0; bottom:0; display:flex; justify-content:center; z-index:5', stage);
  pill(wrap, text, kind || 'orange');
  return wrap;
}
/* shrink a window to its content and centre it (with its pill) in the stage */
function settle(H, box, win, pillWrap, fill, clear) {
  box.style.bottom = 'auto'; win.style.bottom = 'auto'; win.style.position = 'relative';
  if (fill) fill();
  var nat = win.offsetHeight;
  if (clear) clear();
  var pad = pillWrap ? 96 : 0, h = Math.min(nat, H - pad);
  win.style.height = h + 'px';
  var y0 = Math.max(0, (H - h - pad) / 2);
  box.style.top = y0 + 'px'; box.style.height = h + 'px';
  if (pillWrap) { pillWrap.style.bottom = 'auto'; pillWrap.style.top = (y0 + h + 34) + 'px'; }
}
function Edges(stage) {
  var svg = svgEl('svg', { width: '100%', height: '100%', style: 'position:absolute; inset:0; overflow:visible; z-index:1' }, stage);
  var list = [];
  return {
    svg: svg,
    add: function (d, opts) {
      opts = opts || {};
      var path = svgEl('path', { d: d, fill: 'none', stroke: opts.color || '#b9b9b4', 'stroke-width': opts.width || 4, 'stroke-linecap': 'round' }, svg);
      var len = path.getTotalLength();
      path.setAttribute('stroke-dasharray', len); path.setAttribute('stroke-dashoffset', len);
      var e = { path: path, len: len, dots: [] };
      list.push(e);
      return e;
    },
    draw: function (e, p) { e.path.setAttribute('stroke-dashoffset', e.len * (1 - clamp(p))); },
    dot: function (e, q, color, r) {
      var c = svgEl('circle', { r: r || 11, fill: color || C.orange }, svg);
      var pt = e.path.getPointAtLength(e.len * clamp(q));
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c._tmp = true; return c;
    },
    clearDots: function () { Array.prototype.slice.call(svg.querySelectorAll('circle')).forEach(function (c) { if (c._tmp) c.remove(); }); }
  };
}
function curveV(x1, y1, x2, y2) { var m = (y1 + y2) / 2; return 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + m + ' ' + x2 + ' ' + m + ' ' + x2 + ' ' + y2; }
function curveH(x1, y1, x2, y2) { var m = (x1 + x2) / 2; return 'M' + x1 + ' ' + y1 + ' C' + m + ' ' + y1 + ' ' + m + ' ' + y2 + ' ' + x2 + ' ' + y2; }
function boxNode(stage, o) {
  // centred node: icon + label (+sub)
  var dark = o.style === 'dark';
  var e = mk('div', 'position:absolute; z-index:2; left:' + o.x + 'px; top:' + o.y + 'px; width:' + o.w + 'px; min-height:' + o.h + 'px; box-sizing:border-box; padding-top:14px; padding-bottom:14px; background:' + (dark ? C.dark : '#fff') +
    '; color:' + (dark ? '#fff' : C.text) + '; border:' + (dark ? 'none' : '2px solid ' + C.line) + '; border-radius:22px; display:flex; align-items:center; gap:16px; padding-left:22px; padding-right:18px; transform-origin:center; transform:translate(-50%,-50%)', stage);
  e._base = 'translate(-50%,-50%)';
  e.innerHTML = badge(o.icon || 'doc', o.iconSize || 52) + '<div style="display:flex; flex-direction:column; gap:2px; min-width:0"><span class="lb" style="font-size:' + (o.fs || 28) + 'px; font-weight:500; line-height:1.15">' + esc(o.label) + '</span>' +
    (o.sub ? '<span class="sb" style="font-size:' + (o.sfs || 21) + 'px; line-height:1.2; color:' + (dark ? 'rgba(255,255,255,0.7)' : C.mute) + '">' + esc(o.sub) + '</span>' : '') + '</div>';
  return e;
}
function glow(e, p, color) { e.style.boxShadow = p > 0 ? '0 0 0 ' + (4 + 10 * Math.sin(p * Math.PI)) + 'px ' + (color || 'rgba(255,90,31,0.25)') : 'none'; }
function cursor(stage) {
  var c = mk('div', 'position:absolute; z-index:9; width:44px; height:44px; pointer-events:none; visibility:hidden', stage,
    '<svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 2l15 11-7 1 4 8-3 1-4-8-5 5z" fill="#121212" stroke="#fff" stroke-width="1.5"/></svg>');
  return c;
}
function moveCursor(c, x1, y1, x2, y2, p) { p = ease(clamp(p)); c.style.visibility = 'visible'; c.style.left = (x1 + (x2 - x1) * p) + 'px'; c.style.top = (y1 + (y2 - y1) * p) + 'px'; }

/* ---------- scenes ---------- */
var S = {};

/* chat: {app:'teams'|'claude'|'sms', agent:'Pam', agentSub, msgs:[[who,text,side, attach?]], appLabel} */
S.chat = function (stage, sp, W, H) {
  var agentKey = sp.agentIcon || (sp.agent === 'Pam' ? 'pam' : 'claude');
  var appLabel = sp.appLabel || ({ teams: 'Microsoft Teams', claude: 'Claude', sms: 'Text message' })[sp.app || 'claude'] || '';
  var panel = mk('div', 'position:absolute; inset:0; background:' + C.slab + '; border:1px solid ' + C.line + '; border-radius:28px; overflow:hidden; display:flex; flex-direction:column', stage);
  var hd = mk('div', 'background:#fff; border-bottom:1px solid ' + C.line + '; padding:20px 30px; display:flex; align-items:center; gap:18px', panel,
    badge(agentKey, 58) + '<div style="display:flex; flex-direction:column; gap:2px"><span style="font-size:31px; font-weight:500; color:' + C.ink + '">' + esc(sp.agent || 'Claude') + '</span><span style="font-size:22px; color:' + C.mute + '">' + esc(sp.agentSub || '') + '</span></div><span style="margin-left:auto; font-size:22px; color:' + C.mute + '">' + esc(appLabel) + '</span>');
  var box = mk('div', 'flex:1; display:flex; flex-direction:column; justify-content:flex-end; gap:14px; padding:20px 26px; overflow:hidden', panel);
  var bubbles = sp.msgs.map(function (m) {
    var right = m[2] === 'right';
    var wrap = mk('div', 'display:none; ' + (right ? 'align-self:flex-end; max-width:82%' : 'align-self:flex-start; max-width:88%; gap:14px; align-items:flex-end'), box);
    if (!right) wrap.innerHTML = badge(agentKey, 46);
    var b = mk('div', right ? 'background:#121212; color:#fff; border-radius:24px 24px 6px 24px; padding:18px 26px; font-size:29px; line-height:1.3' :
      'background:#fff; color:#161616; border:1px solid ' + C.line + '; border-radius:24px 24px 24px 6px; padding:18px 26px; font-size:29px; line-height:1.3', wrap);
    var t = mk('span', '', b, esc(m[1])); var r = mk('span', 'visibility:hidden', b);
    var att = null;
    if (m[3]) {
      var a = m[3];
      att = mk('div', 'margin-top:14px; border:1px solid ' + C.line + '; border-radius:16px; padding:16px 20px; background:#fafaf8; display:flex; flex-direction:column; gap:6px', b);
      att.innerHTML = '<div style="display:flex; align-items:center; gap:12px">' + badge(a.app || 'doc', 36) + '<span style="font-size:25px; font-weight:500">' + esc(a.title || '') + '</span>' +
        (a.tag ? '<span style="margin-left:auto; font-size:20px; font-weight:500; color:' + C.orange + '; border:2px solid ' + C.orange + '; border-radius:999px; padding:2px 12px">' + esc(a.tag) + '</span>' : '') + '</div>' +
        (a.rows || []).map(function (rw) { return '<div style="display:flex; justify-content:space-between; gap:20px; font-size:23px; color:' + C.body + '"><span>' + esc(rw[0]) + '</span><span style="color:' + C.text + '">' + esc(rw[1]) + '</span></div>'; }).join('');
    }
    return { wrap: wrap, t: t, r: r, att: att, text: m[1], right: right };
  });
  var typing = mk('div', 'display:none; align-self:flex-start; gap:14px; align-items:flex-end', box, badge(agentKey, 46) +
    '<div style="background:#fff; border:1px solid ' + C.line + '; border-radius:24px 24px 24px 6px; padding:22px 26px; display:flex; gap:10px">' + [0, 1, 2].map(function () { return '<span class="dot" style="width:13px; height:13px; border-radius:50%; background:#8a8a85; display:block"></span>'; }).join('') + '</div>');
  var comp = mk('div', 'background:#fff; border-top:1px solid ' + C.line + '; padding:16px 22px; display:flex; align-items:center; gap:16px', panel);
  var field = mk('div', 'flex:1; border:1px solid ' + C.line + '; border-radius:999px; padding:12px 26px; font-size:27px; line-height:1.3; color:#161616', comp);
  var inner = mk('span', 'display:block', field);
  var ctext = mk('span', '', inner), caret = mk('span', 'display:inline-block; width:3px; height:30px; background:#161616; margin-left:2px; vertical-align:-6px', inner), ph = mk('span', 'color:#9a9a95', inner, 'Type a message');
  var send = mk('div', 'width:62px; height:62px; border-radius:50%; background:#d9d9d5; display:flex; align-items:center; justify-content:center', comp, '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M3 20l18-8L3 4v6l12 2-12 2z" fill="#fff"/></svg>');
  var ev = [], t = 0.5;
  sp.msgs.forEach(function (m, i) {
    if (m[2] === 'right') { var d = Math.min(3.2, m[1].length / 30); ev.push({ i: i, k: 'type', a: t, b: t + d }); t += d + 0.35; }
    else { ev.push({ i: i, k: 'dots', a: t, b: t + 0.9 }); t += 0.9; var d2 = Math.min(2.2, m[1].split(' ').length * 0.07); ev.push({ i: i, k: 'stream', a: t, b: t + d2 }); t += d2 + (m[3] ? 1.1 : 0.55); }
  });
  return {
    T: t + 2.6,
    update: function (T) {
      bubbles.forEach(function (b) { b.wrap.style.display = 'none'; });
      typing.style.display = 'none'; ctext.textContent = ''; send.style.background = '#d9d9d5';
      var composing = false;
      ev.forEach(function (e) {
        var b = bubbles[e.i];
        if (e.k === 'type') {
          if (T >= e.a && T < e.b) { composing = true; typeTo(ctext, b.text, (T - e.a) / (e.b - e.a)); send.style.background = '#121212'; }
          else if (T >= e.b + 0.15) b.wrap.style.display = 'flex';
          else if (T >= e.b) { composing = true; ctext.textContent = b.text; send.style.background = C.orange; }
        } else if (e.k === 'dots') {
          if (T >= e.a && T < e.b) { typing.style.display = 'flex'; typing.querySelectorAll('.dot').forEach(function (d, k) { var q = ((T * 3) - k * 0.25) % 1; d.style.transform = 'translateY(' + (q < 0.4 ? -8 * Math.sin(q / 0.4 * Math.PI) : 0) + 'px)'; }); }
        } else if (T >= e.a) {
          b.wrap.style.display = 'flex'; var w = b.text.split(' '), n = T >= e.b ? w.length : Math.max(1, Math.ceil((T - e.a) / (e.b - e.a) * w.length));
          b.t.textContent = w.slice(0, n).join(' '); b.r.textContent = n < w.length ? ' ' + w.slice(n).join(' ') : '';
          if (b.att) { var pa = prog(T, e.b, e.b + 0.5); b.att.style.opacity = pa; }
        }
      });
      bubbles.forEach(function (b) { box.appendChild(b.wrap); }); if (typing.style.display !== 'none') box.appendChild(typing);
      ph.style.display = composing ? 'none' : 'inline';
      caret.style.visibility = composing && Math.floor(T * 2.5) % 2 === 0 ? 'visible' : 'hidden';
    }
  };
};

/* flow: {sources:[{label,sub,icon}], hub:{label,sub,icon,status:[..]}, targets:[{label,sub,icon,result}], badge, badgeKind} */
S.flow = function (stage, sp, W, H) {
  var E = Edges(stage);
  var nS = sp.sources.length, nT = sp.targets.length;
  var bottomPad = sp.badge ? 90 : 0;
  var usable = H - bottomPad;
  var ys = usable * 0.10, yh = usable * 0.42, yt = usable * 0.74;
  function row(n, wmax) { var w = Math.min(wmax, (W - (n - 1) * 18) / n); var xs = []; var total = n * w + (n - 1) * 18; for (var i = 0; i < n; i++) xs.push((W - total) / 2 + w / 2 + i * (w + 18)); return { w: w, xs: xs }; }
  var rs = row(nS, nS === 1 ? 420 : 460), rt = row(nT, nT === 1 ? 460 : 460);
  var compactS = rs.w < 290, compactT = rt.w < 290;
  var srcEls = sp.sources.map(function (s, i) { return boxNode(stage, { x: rs.xs[i], y: ys, w: rs.w, h: compactS ? 128 : 112, label: s.label, sub: s.sub, icon: s.icon, fs: compactS ? 25 : 28, sfs: compactS ? 19 : 21, iconSize: compactS ? 44 : 52 }); });
  var hub = boxNode(stage, { x: W / 2, y: yh, w: Math.min(560, W * 0.62), h: 130, label: sp.hub.label, sub: (sp.hub.status && sp.hub.status[0]) || sp.hub.sub, icon: sp.hub.icon || 'claude', style: 'dark', fs: 34, sfs: 23, iconSize: 64 });
  var hubSub = hub.querySelector('.sb');
  var tgt = sp.targets.map(function (s, i) {
    var n = boxNode(stage, { x: rt.xs[i], y: yt, w: rt.w, h: compactT ? 128 : 112, label: s.label, sub: s.sub, icon: s.icon, fs: compactT ? 25 : 28, sfs: compactT ? 19 : 21, iconSize: compactT ? 44 : 52 });
    var res = null;
    if (s.result) {
      res = mk('div', 'position:absolute; z-index:2; left:' + (rt.xs[i] - rt.w / 2) + 'px; top:' + (yt + (compactT ? 74 : 66)) + 'px; width:' + rt.w + 'px; box-sizing:border-box; background:' + C.orangeTint + '; border:2px dashed ' + C.orange + '; border-radius:16px; padding:12px 16px; font-size:' + (compactT ? 21 : 23) + 'px; line-height:1.25; color:' + C.text + '; min-height:' + (compactT ? 84 : 60) + 'px', stage);
      res._t = mk('span', '', res);
    }
    return { n: n, res: res, text: s.result || '' };
  });
  var hubTop = yh - 65, hubBot = yh + 65;
  var eIn = rs.xs.map(function (x, i) { return E.add(curveV(x, ys + 56, W / 2 + (i - (nS - 1) / 2) * 40, hubTop)); });
  var eOut = rt.xs.map(function (x, i) { return E.add(curveV(W / 2 + (i - (nT - 1) / 2) * 40, hubBot, x, yt - 56)); });
  var bdg = sp.badge ? approvalPill(stage, sp.badge, sp.badgeKind || 'orange') : null;
  var st = sp.hub.status || [];
  var T1 = 0.3 + nS * 0.22, Tin = T1 + 0.5, Thub = Tin + 1.3, Tout = Thub + 1.1, Ttg = Tout + 1.1, Tres = Ttg + 0.4 + nT * 0.15;
  var Tend = Tres + nT * 0.75 + 0.6;
  return {
    T: Tend + 2.8,
    update: function (t) {
      E.clearDots();
      srcEls.forEach(function (e, i) { pop(e, prog(t, 0.3 + i * 0.22, 0.75 + i * 0.22)); });
      pop(hub, prog(t, 0.15, 0.6));
      eIn.forEach(function (e, i) { E.draw(e, prog(t, T1, Tin)); var q = prog(t, Tin + i * 0.15, Tin + 0.9 + i * 0.15); if (q > 0 && q < 1) E.dot(e, ease(q)); });
      glow(hub, prog(t, Tin + 0.7, Thub + 0.6));
      if (st.length > 1 && hubSub) { var k = t < Tin + 0.6 ? 0 : t < Tout ? 1 : Math.min(st.length - 1, 2); hubSub.textContent = st[Math.min(k, st.length - 1)]; }
      eOut.forEach(function (e, i) { E.draw(e, prog(t, Thub, Tout)); var q = prog(t, Tout + i * 0.15, Tout + 0.9 + i * 0.15); if (q > 0 && q < 1) E.dot(e, ease(q)); });
      tgt.forEach(function (g, i) {
        pop(g.n, prog(t, Ttg + i * 0.15, Ttg + 0.45 + i * 0.15));
        if (g.res) { fade(g.res, prog(t, Tres - 0.2 + i * 0.75, Tres + i * 0.75), 10); typeTo(g.res._t, g.text, prog(t, Tres + i * 0.75, Tres + 0.7 + i * 0.75)); }
      });
      if (bdg) fade(bdg, prog(t, Tend, Tend + 0.5));
    }
  };
};

/* n8n: {title, nodes:[{id,label,sub,kind:'trigger'|'action'|'ai'|'if'|'wait',icon,col,row}], edges:[[a,b,label]], result, resultKind} */
S.n8n = function (stage, sp, W, H) {
  var canvas = mk('div', 'position:absolute; inset:0; border-radius:28px; overflow:hidden; border:1px solid ' + C.line + '; background-color:#fbfbfa; background-image:radial-gradient(#d6d6d1 1.6px, transparent 1.6px); background-size:30px 30px', stage);
  var top = mk('div', 'position:absolute; left:0; right:0; top:0; height:78px; background:#fff; border-bottom:1px solid ' + C.line + '; display:flex; align-items:center; gap:16px; padding:0 26px; z-index:3', canvas,
    badge('n8n', 46) + '<span style="font-size:27px; font-weight:500; color:' + C.ink + '">' + esc(sp.title || 'Workflow') + '</span><span style="margin-left:auto; display:flex; align-items:center; gap:10px; font-size:22px; color:' + C.mute + '">Active<span style="width:52px; height:30px; border-radius:15px; background:' + C.green + '; position:relative; display:inline-block"><span style="position:absolute; right:3px; top:3px; width:24px; height:24px; border-radius:50%; background:#fff"></span></span></span>');
  var stg = mk('div', 'position:absolute; left:0; right:0; top:78px; bottom:0', canvas);
  var Wc = W, Hc = H - 78 - (sp.result ? 100 : 30);
  var E = Edges(stg);
  var cols = 0, rows = 0; sp.nodes.forEach(function (n) { cols = Math.max(cols, n.col + 1); rows = Math.max(rows, (n.row || 0) + 1); });
  var mx = cols >= 5 ? 96 : 120, colW = cols > 1 ? (Wc - 2 * mx) / (cols - 1) : 0;
  var rowH = rows > 1 ? Math.min(330, (Hc - 200) / (rows - 1)) : 0;
  var midY = 30 + Hc / 2;
  var sz = cols >= 5 ? 128 : cols === 4 ? 150 : 160;
  var lw = cols > 1 ? Math.min(250, colW - 8) : 300;
  var map = {};
  var els = sp.nodes.map(function (n) {
    var x = cols > 1 ? mx + n.col * colW : Wc / 2;
    var y = midY + ((n.row || 0) - (rows - 1) / 2) * rowH - 20;
    var kind = n.kind || 'action';
    var w = kind === 'ai' ? Math.min(sz * 1.45, colW ? colW - 14 : 260) : sz, h = sz;
    var bg = kind === 'ai' ? C.dark : '#fff';
    var radius = kind === 'trigger' ? (h / 2) + 'px 18px 18px ' + (h / 2) + 'px' : '20px';
    var e = mk('div', 'position:absolute; z-index:2; left:' + (x - w / 2) + 'px; top:' + (y - h / 2) + 'px; width:' + w + 'px; height:' + h + 'px; box-sizing:border-box; background:' + bg + '; border:3px solid ' + (kind === 'ai' ? C.dark : '#c9c9c4') + '; border-radius:' + radius + '; display:flex; align-items:center; justify-content:center; transform-origin:center', stg);
    var ic = kind === 'trigger' ? '<div style="color:' + C.orange + '">' + iconSvg(n.icon && P[n.icon] ? n.icon : 'bolt', 54) + '</div>' : kind === 'if' ? '<span style="font-size:36px; font-weight:700; color:' + C.ink + '">IF</span>' :
      kind === 'wait' ? '<div style="color:' + C.ink + '">' + iconSvg('clock', 52) + '</div>' : kind === 'ai' ? '<div style="display:flex; flex-direction:column; align-items:center; gap:8px">' + badge(n.icon || 'claude', Math.round(sz * 0.42)) + '<span style="color:#fff; font-size:' + Math.round(sz * 0.19) + 'px; font-weight:500">AI agent</span></div>' : badge(n.icon || 'doc', Math.round(sz * 0.52));
    e.innerHTML = ic;
    var ok = mk('div', 'position:absolute; right:-14px; top:-14px; width:38px; height:38px; border-radius:50%; background:' + C.green + '; display:flex; align-items:center; justify-content:center; visibility:hidden', e, iconSvg('check', 24, '#fff'));
    var lb = mk('div', 'position:absolute; z-index:2; left:' + (x - lw / 2) + 'px; top:' + (y + h / 2 + 12) + 'px; width:' + lw + 'px; text-align:center; font-size:' + (cols >= 5 ? 24 : 27) + 'px; line-height:1.18; color:' + C.text + '; font-weight:500', stg, esc(n.label) + (n.sub ? '<div style="font-weight:400; font-size:' + (cols >= 5 ? 20 : 22) + 'px; color:' + C.mute + '">' + esc(n.sub) + '</div>' : ''));
    var o = { n: n, e: e, ok: ok, lb: lb, x: x, y: y, w: w, h: h, kind: kind };
    map[n.id] = o; return o;
  });
  var depth = {}; var trig = sp.nodes.filter(function (n) { return n.kind === 'trigger'; }).map(function (n) { return n.id; });
  if (!trig.length) trig = [sp.nodes[0].id];
  trig.forEach(function (id) { depth[id] = 0; });
  for (var it = 0; it < 12; it++) sp.edges.forEach(function (ed) { if (depth[ed[0]] != null) { var d = depth[ed[0]] + 1; if (depth[ed[1]] == null || depth[ed[1]] < d) depth[ed[1]] = d; } });
  var edges = sp.edges.map(function (ed) {
    var a = map[ed[0]], b = map[ed[1]];
    var path = E.add(curveH(a.x + a.w / 2, a.y, b.x - b.w / 2, b.y), { color: '#a9a9a4', width: 4 });
    var lab = null;
    if (ed[2]) { lab = mk('div', 'position:absolute; z-index:2; left:' + (a.x + a.w / 2 + (b.x - b.w / 2 - a.x - a.w / 2) * 0.32 - 60) + 'px; top:' + (a.y + (b.y - a.y) * 0.32 - 20) + 'px; width:120px; text-align:center', stg,
      '<span style="background:#fff; border:2px solid ' + C.line + '; border-radius:999px; padding:4px 14px; font-size:21px; color:' + C.mute + '">' + esc(ed[2]) + '</span>'); }
    return { a: a, b: b, p: path, lab: lab, d: depth[ed[0]] || 0 };
  });
  var maxD = 0; for (var k in depth) maxD = Math.max(maxD, depth[k]);
  var tAppear = function (o) { return 0.3 + (o.n.col || 0) * 0.3; };
  var tRun = 0.6 + cols * 0.3 + 0.6;
  var tLit = function (id) { return tRun + (depth[id] || 0) * 0.95; };
  var res = sp.result ? mk('div', 'position:absolute; z-index:4; left:0; right:0; bottom:26px; display:flex; justify-content:center', canvas) : null;
  if (res) pill(res, sp.result, sp.resultKind || 'dark');
  var run = mk('div', 'position:absolute; z-index:4; left:26px; bottom:26px; background:' + C.orange + '; color:#fff; border-radius:14px; padding:12px 22px; font-size:22px; font-weight:500; display:' + (sp.result ? 'none' : 'flex') + '; align-items:center; gap:10px', canvas, iconSvg('bolt', 22, '#fff') + 'Executing');
  var Tend = tRun + maxD * 0.95 + 0.9;
  return {
    T: Tend + 3.0,
    update: function (t) {
      E.clearDots();
      els.forEach(function (o) { pop(o.e, prog(t, tAppear(o), tAppear(o) + 0.45)); fade(o.lb, prog(t, tAppear(o) + 0.15, tAppear(o) + 0.55), 8);
        var lit = t >= tLit(o.n.id) + 0.05; o.ok.style.visibility = lit ? 'visible' : 'hidden'; o.e.style.borderColor = lit ? C.green : (o.kind === 'ai' ? C.dark : '#c9c9c4');
        glow(o.e, prog(t, tLit(o.n.id) - 0.25, tLit(o.n.id) + 0.4), 'rgba(34,164,93,0.25)'); });
      edges.forEach(function (ed) { var a0 = Math.max(tAppear(ed.a), tAppear(ed.b)) + 0.3; E.draw(ed.p, prog(t, a0, a0 + 0.5)); if (ed.lab) fade(ed.lab, prog(t, a0 + 0.3, a0 + 0.6), 6);
        var s0 = tLit(ed.a.n.id) + 0.1, q = prog(t, s0, s0 + 0.75); if (q > 0 && q < 1) E.dot(ed.p, ease(q), C.green, 10);
        ed.p.path.setAttribute('stroke', t >= s0 + 0.75 ? C.green : '#a9a9a4'); });
      if (res) fade(res, prog(t, Tend, Tend + 0.5));
    }
  };
};

/* scan: {item:'card'|'receipt'|'docket'|'photo'|'invoice'|'page', itemTitle, itemLines:[], count, photoIcon, fieldsTitle, fields:[[k,v]], targets:[{icon,label,line,tag}], badge} */
S.scan = function (stage, sp, W, H) {
  var E = Edges(stage);
  var bottomPad = sp.badge ? 96 : 0;
  var tg = sp.targets || [], fl = sp.fields || [];
  var phW = 350, phH = Math.min(640, (H - bottomPad) * 0.6), phX = 0, phY = 0;
  var ph = mk('div', 'position:absolute; z-index:2; left:' + phX + 'px; top:' + phY + 'px; width:' + phW + 'px; height:' + phH + 'px; box-sizing:border-box; background:#121212; border-radius:50px; padding:16px; transform-origin:center', stage);
  var scr = mk('div', 'position:relative; width:100%; height:100%; background:#3a3a37; border-radius:36px; overflow:hidden; display:flex; align-items:center; justify-content:center', ph);
  var it = sp.item || 'card', cnt = sp.count || 1;
  var dims = it === 'card' ? [280, 168] : it === 'receipt' ? [200, 400] : it === 'photo' ? [270, 270] : [250, 350];
  for (var k = Math.min(cnt, 4) - 1; k >= 1; k--) mk('div', 'position:absolute; width:' + dims[0] + 'px; height:' + dims[1] + 'px; background:#f4f4f1; border-radius:10px; transform:rotate(' + (k * 5 - 6) + 'deg) translate(' + k * 7 + 'px,' + k * 5 + 'px); box-shadow:0 2px 8px rgba(0,0,0,0.3)', scr);
  var paper = mk('div', 'position:relative; width:' + dims[0] + 'px; height:' + dims[1] + 'px; background:' + (it === 'docket' ? '#fdf6c9' : '#fff') + '; border-radius:' + (it === 'receipt' ? 2 : 10) + 'px; box-shadow:0 4px 14px rgba(0,0,0,0.35); padding:18px 20px; box-sizing:border-box; display:flex; flex-direction:column; gap:7px; transform:rotate(-3deg); overflow:hidden', scr);
  if (it === 'photo') { paper.style.alignItems = 'center'; paper.style.justifyContent = 'center'; paper.innerHTML = '<div style="color:#5f5f5b">' + iconSvg(sp.photoIcon || 'tool', 130) + '</div><div style="font-size:21px; color:#5f5f5b; text-align:center">' + esc(sp.itemTitle || '') + '</div>'; }
  else paper.innerHTML = '<div style="font-size:' + (it === 'card' ? 25 : 20) + 'px; font-weight:700; color:#161616">' + esc(sp.itemTitle || '') + '</div>' + (sp.itemLines || []).map(function (l) { return '<div style="font-size:' + (it === 'card' ? 17 : 15) + 'px; color:#4a4a46; line-height:1.2">' + esc(l) + '</div>'; }).join('');
  if (cnt > 1) mk('div', 'position:absolute; right:20px; top:20px; background:' + C.orange + '; color:#fff; font-size:26px; font-weight:700; border-radius:999px; padding:4px 16px', scr, '×' + cnt);
  var line = mk('div', 'position:absolute; left:0; right:0; height:6px; background:' + C.orange + '; box-shadow:0 0 18px ' + C.orange + '; visibility:hidden', scr);
  var flash = mk('div', 'position:absolute; inset:0; background:#fff; opacity:0', scr);
  var shut = mk('div', 'position:absolute; left:50%; bottom:24px; width:68px; height:68px; margin-left:-34px; border-radius:50%; border:5px solid #fff; box-sizing:border-box', scr);
  var fx = phW + 30, fw = W - fx;
  var card = mk('div', 'position:absolute; z-index:2; left:' + fx + 'px; top:' + phY + 'px; width:' + fw + 'px; box-sizing:border-box; background:#fff; border:2px solid ' + C.line + '; border-radius:24px; padding:20px 26px; display:flex; flex-direction:column', stage);
  card.innerHTML = '<div style="display:flex; align-items:center; gap:14px; padding-bottom:10px">' + badge('claude', 46) + '<span style="font-size:28px; font-weight:500">' + esc(sp.fieldsTitle || 'Claude reads it') + '</span></div>';
  var big = fl.length <= 4;
  var rows = fl.map(function (f) {
    var r = mk('div', 'display:flex; flex-direction:column; gap:2px; border-top:1px solid ' + C.line + '; padding:' + (big ? 14 : 10) + 'px 0', card);
    mk('span', 'font-size:21px; color:' + C.mute, r, esc(f[0]));
    var v = mk('span', 'font-size:' + (big ? 30 : 27) + 'px; color:' + C.text + '; min-height:' + (big ? 36 : 33) + 'px; line-height:1.2; overflow-wrap:anywhere', r);
    return { v: v, text: f[1] };
  });
  // reserve final text so the card height is stable
  rows.forEach(function (r) { r.v.textContent = r.text; });
  var cardBottom = phY + card.offsetHeight;
  rows.forEach(function (r) { r.v.textContent = ''; });
  var ty = Math.max(phH, cardBottom) + 90;
  var gap = 22, tw = (W - (tg.length - 1) * gap) / Math.max(1, tg.length);
  var tels = tg.map(function (g, i) {
    var x = i * (tw + gap);
    var e = mk('div', 'position:absolute; z-index:2; left:' + x + 'px; top:' + ty + 'px; width:' + tw + 'px; box-sizing:border-box; background:#fff; border:2px solid ' + C.line + '; border-radius:24px; padding:20px 24px; display:flex; flex-direction:column; gap:12px; transform-origin:center', stage);
    e.innerHTML = '<div style="display:flex; align-items:center; gap:14px">' + badge(g.icon || 'crm', 54) + '<span style="font-size:' + (tg.length > 2 ? 26 : 30) + 'px; font-weight:500">' + esc(g.label) + '</span>' + (g.tag ? '<span class="tag" style="margin-left:auto; font-size:20px; font-weight:500; color:' + C.orange + '; border:2px solid ' + C.orange + '; border-radius:999px; padding:3px 14px; visibility:hidden; white-space:nowrap">' + esc(g.tag) + '</span>' : '') + '</div>';
    var ln = mk('div', 'font-size:' + (tg.length > 2 ? 22 : 26) + 'px; line-height:1.28; color:' + C.text + '; background:' + C.orangeTint + '; border-radius:14px; padding:12px 16px', e);
    var tx = mk('span', '', ln); mk('span', 'visibility:hidden', ln, ''); 
    ln.style.minHeight = (tg.length > 1 ? 2 : 1) * (tg.length > 2 ? 28 : 33) + 'px';
    return { e: e, tx: tx, text: g.line || '', tag: e.querySelector('.tag'), x: x + tw / 2 };
  });
  var fromY = cardBottom + 4, fromX = fx + fw / 2;
  var edges = tels.map(function (g) { return E.add(curveV(fromX, fromY, g.x, ty), { color: '#c4c4bf' }); });
  var bdg = sp.badge ? approvalPill(stage, sp.badge, sp.badgeKind || 'dark') : null;
  var tScan = 0.6, tShot = 2.0, tF = 2.4, tE = tF + fl.length * 0.55 + 0.2, tT = tE + 1.0, tEnd = tT + tg.length * 0.8 + 0.4;
  return {
    T: tEnd + (bdg ? 0.6 : 0) + 2.8,
    update: function (t) {
      E.clearDots();
      pop(ph, prog(t, 0.05, 0.45));
      var sc = prog(t, tScan, tShot); line.style.visibility = sc > 0 && sc < 1 ? 'visible' : 'hidden'; line.style.top = (8 + sc * 84) + '%';
      flash.style.opacity = t >= tShot && t < tShot + 0.3 ? (1 - (t - tShot) / 0.3) * 0.8 : 0;
      shut.style.background = t >= tShot - 0.1 && t < tShot + 0.2 ? '#fff' : 'transparent';
      fade(card, prog(t, tShot + 0.1, tShot + 0.5), 12);
      rows.forEach(function (r, i) { typeTo(r.v, r.text, prog(t, tF + i * 0.55, tF + i * 0.55 + 0.5)); });
      edges.forEach(function (e, i) { E.draw(e, prog(t, tE, tE + 0.5)); var q = prog(t, tE + 0.4 + i * 0.15, tT + i * 0.15); if (q > 0 && q < 1) E.dot(e, ease(q)); });
      tels.forEach(function (g, i) { pop(g.e, prog(t, tE + 0.2 + i * 0.15, tE + 0.6 + i * 0.15)); typeTo(g.tx, g.text, prog(t, tT + i * 0.8, tT + i * 0.8 + 0.7)); if (g.tag) g.tag.style.visibility = t >= tT + i * 0.8 + 0.7 ? 'visible' : 'hidden'; });
      if (bdg) fade(bdg, prog(t, tEnd, tEnd + 0.5));
    }
  };
};

/* table: {app, title, sub, cols:[], rows:[[]], highlight:{row, note, kind}, footer, badge} */
S.table = function (stage, sp, W, H) {
  var bottomPad = sp.badge ? 96 : 0;
  var wrap = mk('div', 'position:absolute; left:0; right:0; top:0; bottom:' + bottomPad + 'px', stage);
  var win = windowCard(wrap, { app: sp.app || 'airtable', title: sp.title, sub: sp.sub, right: sp.right });
  var cols = sp.cols, n = cols.length, rows = sp.rows;
  var lens = cols.map(function (c, j) { var m = c.length; rows.forEach(function (r) { m = Math.max(m, String(r[j] || '').length); }); return Math.max(5, Math.min(m, 26)); });
  var tot = lens.reduce(function (a, b) { return a + b; }, 0);
  var fs = rows.length > 6 || n > 4 ? 22 : 25;
  var grid = 'display:grid; grid-template-columns:' + lens.map(function (l) { return (l / tot * 100).toFixed(2) + '%'; }).join(' ') + '; align-items:center';
  var tbl = mk('div', 'position:relative; display:flex; flex-direction:column; padding:0 26px 6px', win.body);
  mk('div', grid + '; padding:16px 0; border-bottom:2px solid ' + C.line + '; font-size:' + (fs - 3) + 'px; color:' + C.mute + '; font-weight:500', tbl, cols.map(function (c) { return '<span style="padding-right:12px">' + esc(c) + '</span>'; }).join(''));
  var rowEls = rows.map(function (r, i) {
    var e = mk('div', grid + '; padding:' + (rows.length > 6 ? 13 : 17) + 'px 0; border-bottom:1px solid ' + C.line + '; font-size:' + fs + 'px; color:' + C.text + '; border-radius:10px', tbl);
    var cells = r.map(function (c) { return { s: mk('span', 'padding-right:12px; line-height:1.25; min-height:1.25em', e), text: String(c) }; });
    return { e: e, cells: cells };
  });
  var hl = sp.highlight, note = null;
  if (hl) { note = mk('div', 'margin-top:20px; align-self:flex-start', tbl); pill(note, hl.note, hl.kind || 'orange'); }
  if (sp.footer) { var ft = mk('div', 'padding:18px 0 16px; font-size:22px; color:' + C.mute, tbl, esc(sp.footer)); }
  if (!sp.footer) mk('div', 'height:' + (hl ? 22 : 10) + 'px', tbl);
  var bdg = sp.badge ? approvalPill(stage, sp.badge, sp.badgeKind || 'orange') : null;
  settle(H, wrap, win.win, bdg, function () { rowEls.forEach(function (r) { r.cells.forEach(function (c) { c.s.textContent = c.text; }); }); },
    function () { rowEls.forEach(function (r) { r.cells.forEach(function (c) { c.s.textContent = ''; }); }); });
  var per = rows.length > 5 ? 0.6 : 0.8, t0 = 0.6, tH = t0 + rows.length * per + 0.3, tEnd = tH + (hl ? 1.0 : 0);
  return {
    T: tEnd + (bdg ? 0.8 : 0) + 2.8,
    update: function (t) {
      fade(win.win, prog(t, 0, 0.4), 14);
      rowEls.forEach(function (r, i) {
        var a = t0 + i * per; fade(r.e, prog(t, a, a + 0.2), 8);
        r.cells.forEach(function (c, j) { typeTo(c.s, c.text, prog(t, a + j * per / r.cells.length * 0.8, a + (j + 1) * per / r.cells.length * 0.9)); });
        var on = hl && hl.row === i && t >= tH; r.e.style.background = on ? (hl.kind === 'green' ? C.greenTint : C.orangeTint) : 'transparent'; r.e.style.paddingLeft = on ? '10px' : '0';
      });
      if (note) fade(note, prog(t, tH + 0.3, tH + 0.8), 10);
      if (bdg) fade(bdg, prog(t, tEnd, tEnd + 0.5));
    }
  };
};

/* doc: {app, title, sub, meta:[[k,v]], lines:[], tag, button, done} */
S.doc = function (stage, sp, W, H) {
  var win = windowCard(stage, { app: sp.app || 'doc', title: sp.title, sub: sp.sub, right: sp.right });
  var body = mk('div', 'position:relative; padding:22px 30px 34px; display:flex; flex-direction:column; gap:10px', win.body);
  var tag = mk('div', 'position:absolute; right:26px; top:22px', win.body); pill(tag, sp.tag || 'Drafted by Claude', 'light', 'font-size:21px; padding:8px 18px');
  var meta = (sp.meta || []).map(function (m) {
    var r = mk('div', 'display:flex; gap:16px; font-size:25px; padding:6px 0; border-bottom:1px solid ' + C.line + (sp.tag !== '' ? '; padding-right:260px' : ''), body);
    mk('span', 'color:' + C.mute + '; width:110px; flex-shrink:0', r, esc(m[0])); var v = mk('span', 'color:' + C.text, r); return { v: v, text: m[1] };
  });
  if (!meta.length) mk('div', 'height:40px', body);
  var fs = sp.lines.join(' ').length > 360 ? 24 : 27;
  var lines = sp.lines.map(function (l) {
    var head = l.charAt(0) === '#'; var bullet = l.indexOf('- ') === 0;
    var txt = head ? l.replace(/^#+\s*/, '') : bullet ? l.slice(2) : l;
    var e = mk('div', 'font-size:' + (head ? fs + 3 : fs) + 'px; line-height:1.32; color:' + (head ? C.ink : C.body) + '; font-weight:' + (head ? 500 : 400) + (head ? '; margin-top:8px' : '') + (bullet ? '; padding-left:30px; position:relative' : ''), body);
    if (bullet) mk('span', 'position:absolute; left:6px; top:0; color:' + C.orange, e, '•');
    var s = mk('span', '', e); var r = mk('span', 'visibility:hidden', e, esc(txt));
    return { s: s, r: r, text: txt };
  });
  var bar = mk('div', 'position:relative; padding:20px 30px; border-top:1px solid ' + C.line + '; display:flex; gap:16px; justify-content:flex-end; background:#fff', win.body);
  var b1 = mk('div', 'border:2px solid ' + C.line + '; border-radius:14px; padding:14px 26px; font-size:25px; color:' + C.text, bar, esc(sp.secondary || 'Edit'));
  var b2 = mk('div', 'border-radius:14px; padding:14px 28px; font-size:25px; font-weight:500; color:#fff; background:' + C.dark + '; display:flex; align-items:center; gap:10px', bar, '<span>' + esc(sp.button || 'Approve') + '</span>');
  win.win.style.inset = 'auto'; win.win.style.left = '0'; win.win.style.right = '0';
  var nat = win.win.offsetHeight, dh = Math.min(H, Math.max(nat, H * 0.62));
  win.win.style.height = dh + 'px'; win.win.style.top = ((H - dh) / 2) + 'px';
  body.style.flex = '1';
  var cur = cursor(stage);
  var t0 = 0.5, tm = t0 + meta.length * 0.6;
  var lt = []; var acc = tm + 0.2; lines.forEach(function (l) { var d = Math.min(1.6, Math.max(0.35, l.text.split(' ').length * 0.08)); lt.push([acc, acc + d]); acc += d + 0.1; });
  var tC = acc + 0.5, tClick = tC + 1.0;
  return {
    T: tClick + 3.0,
    update: function (t) {
      fade(win.win, prog(t, 0, 0.4), 14);
      meta.forEach(function (m, i) { typeTo(m.v, m.text, prog(t, t0 + i * 0.6, t0 + i * 0.6 + 0.5)); });
      lines.forEach(function (l, i) { var p = prog(t, lt[i][0], lt[i][1]); var w = l.text.split(' '); var n = p >= 1 ? w.length : Math.floor(p * w.length); l.s.textContent = w.slice(0, n).join(' '); l.r.textContent = n < w.length ? (n ? ' ' : '') + w.slice(n).join(' ') : ''; });
      var bb = b2.getBoundingClientRect(), sb = stage.getBoundingClientRect();
      var bx = bb.left - sb.left + bb.width * 0.55, by = bb.top - sb.top + bb.height * 0.45;
      if (t < tC) cur.style.visibility = 'hidden'; else if (t < tClick + 0.3) moveCursor(cur, W * 0.45, H * 0.55, bx, by, prog(t, tC, tClick - 0.15)); else moveCursor(cur, bx, by, bx - 260, by - 150, prog(t, tClick + 0.3, tClick + 0.9));
      var done = t >= tClick;
      b2.style.background = done ? C.green : C.dark;
      b2.innerHTML = done ? iconSvg('check', 26, '#fff') + '<span>' + esc(sp.done || 'Approved by you') + '</span>' : '<span>' + esc(sp.button || 'Approve') + '</span>';
      b2.style.transform = t >= tClick - 0.12 && t < tClick + 0.1 ? 'scale(0.95)' : 'none';
    }
  };
};

/* dash: {title, sub, tiles:[{label,value,prefix,suffix,delta,kind}], bars:{title,labels:[],values:[],unit}, alert:{text,button,done}} */
S.dash = function (stage, sp, W, H) {
  var win = windowCard(stage, { app: sp.app || 'dashboard', title: sp.title, sub: sp.sub, right: sp.right });
  var body = mk('div', 'position:absolute; inset:0; padding:22px 26px; display:flex; flex-direction:column; gap:18px', win.body);
  var tiles = sp.tiles || [], nt = tiles.length;
  var tg = mk('div', 'display:grid; grid-template-columns:repeat(' + (nt === 4 ? 2 : Math.min(nt, 3)) + ', minmax(0,1fr)); gap:16px', body);
  var tEls = tiles.map(function (ti) {
    var e = mk('div', 'background:' + (ti.kind === 'alert' ? C.orangeTint : C.slab) + '; border-radius:18px; padding:18px 20px; display:flex; flex-direction:column; gap:4px', tg);
    mk('span', 'font-size:21px; color:' + C.mute, e, esc(ti.label));
    var v = mk('span', 'font-size:' + (nt > 3 ? 44 : 46) + 'px; font-weight:500; letter-spacing:-0.02em; color:' + (ti.kind === 'alert' ? C.orange : C.ink), e);
    if (ti.delta) mk('span', 'font-size:20px; color:' + C.mute, e, esc(ti.delta));
    return { e: e, v: v, ti: ti };
  });
  var bars = sp.bars, barEls = [];
  if (bars) {
    var bc = mk('div', 'flex:1; min-height:0; background:#fff; border:2px solid ' + C.line + '; border-radius:18px; padding:16px 22px; display:flex; flex-direction:column', body);
    mk('div', 'font-size:23px; font-weight:500; color:' + C.ink + '; padding-bottom:10px', bc, esc(bars.title || ''));
    var area = mk('div', 'flex:1; display:flex; align-items:flex-end; gap:16px; border-bottom:2px solid ' + C.line, bc);
    var mx = Math.max.apply(null, bars.values);
    bars.values.forEach(function (v, i) {
      var col = mk('div', 'flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%', area);
      var lab = mk('span', 'font-size:18px; color:' + C.mute + '; padding-bottom:6px', col, esc(bars.fmt ? bars.fmt[i] : v));
      var b = mk('div', 'width:100%; border-radius:8px 8px 0 0; background:' + (bars.hi === i ? C.orange : '#bdbdb8') + '; height:0', col);
      barEls.push({ b: b, h: v / mx, lab: lab });
    });
    var xl = mk('div', 'display:flex; gap:16px; padding-top:8px', bc);
    bars.labels.forEach(function (l) { mk('span', 'flex:1; text-align:center; font-size:18px; color:' + C.mute, xl, esc(l)); });
  }
  var al = sp.alert, aEl = null, aBtn = null;
  if (al) {
    aEl = mk('div', 'background:#fff; border:2px solid ' + C.orange + '; border-radius:18px; padding:16px 20px; display:flex; align-items:center; gap:16px', body);
    aEl.innerHTML = '<div style="color:' + C.orange + '">' + iconSvg('alert', 34) + '</div><span style="font-size:24px; color:' + C.text + '; flex:1; line-height:1.25">' + esc(al.text) + '</span>';
    aBtn = mk('div', 'border-radius:12px; padding:12px 20px; font-size:22px; font-weight:500; color:#fff; background:' + C.dark + '; white-space:nowrap', aEl, esc(al.button || 'Draft it'));
  }
  var cur = cursor(stage);
  var tA = 2.8 + (bars ? 0.6 : 0), tClick = tA + 1.6;
  return {
    T: (al ? tClick : tA) + 3.0,
    update: function (t) {
      fade(win.win, prog(t, 0, 0.4), 14);
      tEls.forEach(function (o, i) { fade(o.e, prog(t, 0.4 + i * 0.15, 0.8 + i * 0.15), 10); var p = ease(prog(t, 0.6 + i * 0.15, 2.2 + i * 0.15)); var ti = o.ti;
        var val = typeof ti.value === 'number' ? ti.value * p : null; o.v.textContent = val == null ? (p > 0.5 ? ti.value : '') : (ti.prefix || '') + (ti.dec ? val.toFixed(ti.dec) : Math.round(val).toLocaleString('en-AU')) + (ti.suffix || ''); });
      barEls.forEach(function (o, i) { var p = ease(prog(t, 1.0 + i * 0.12, 2.2 + i * 0.12)); o.b.style.height = (o.h * 82 * p) + '%'; o.lab.style.opacity = p > 0.9 ? 1 : 0; });
      if (aEl) { fade(aEl, prog(t, tA, tA + 0.5), 12); var bb = aBtn.getBoundingClientRect(), sb = stage.getBoundingClientRect();
        var cx2 = bb.left - sb.left + bb.width * 0.5, cy2 = bb.top - sb.top + bb.height * 0.5; if (t < tA + 0.5) cur.style.visibility = 'hidden'; else if (t < tClick + 0.3) moveCursor(cur, W * 0.5, H * 0.45, cx2, cy2, prog(t, tA + 0.5, tClick - 0.1)); else moveCursor(cur, cx2, cy2, cx2 - 300, cy2 - 160, prog(t, tClick + 0.3, tClick + 0.9));
        var done = t >= tClick; aBtn.style.background = done ? C.green : C.dark; aBtn.textContent = done ? (al.done || 'Drafted for you to check') : (al.button || 'Draft it'); }
    }
  };
};

/* compare: {left:{title,sub,items:[],icon}, right:{title,sub,items:[],icon,layout:'grid'|'list'}, verdict, verdictKind} */
S.compare = function (stage, sp, W, H) {
  var bottomPad = sp.verdict ? 96 : 0;
  var avail = H - bottomPad - 60;
  var L = sp.left, R = sp.right;
  var lH = 0, rH = 0;
  function box(o, y, h, hi) {
    var e = mk('div', 'position:absolute; left:0; right:0; top:' + y + 'px; box-sizing:border-box; background:#fff; border:' + (hi ? '3px solid ' + C.orange : '2px solid ' + C.line) + '; border-radius:24px; padding:22px 28px; display:flex; flex-direction:column; gap:12px; overflow:hidden', stage);
    e.innerHTML = '<div style="display:flex; align-items:center; gap:14px">' + (o.icon ? badge(o.icon, 46) : '') + '<span style="font-size:30px; font-weight:500; color:' + C.ink + '">' + esc(o.title) + '</span>' + (o.sub ? '<span style="margin-left:auto; font-size:22px; color:' + C.mute + '">' + esc(o.sub) + '</span>' : '') + '</div>';
    var list = mk('div', o.layout === 'grid' ? 'display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px 16px' : 'display:flex; flex-direction:column; gap:10px', e);
    var its = (o.items || []).map(function (s) {
      var q = mk('div', 'display:flex; gap:12px; align-items:flex-start; font-size:' + (o.layout === 'grid' ? 23 : (o.items.length > 3 ? 25 : 27)) + 'px; line-height:1.28; color:' + C.text + (o.quote ? '; background:' + C.slab + '; border-radius:16px; padding:14px 18px' : ''), list);
      if (!o.quote) q.innerHTML = '<div style="color:' + (hi ? C.green : C.faint) + '; flex-shrink:0; margin-top:3px">' + iconSvg(hi ? 'check' : 'chat', 26) + '</div>';
      var t = mk('span', '', q); var r = mk('span', 'visibility:hidden', q, esc(s));
      return { q: q, t: t, r: r, text: s };
    });
    return { e: e, its: its };
  }
  var a = box(L, 0, 0, false);
  var b = box(R, 0, 0, true);
  var hA = a.e.offsetHeight + 24, hB = b.e.offsetHeight + 24;
  var scale = Math.min(1.25, avail / (hA + hB));
  if (scale > 1) { hA *= scale; hB *= scale; } else { hA = Math.min(hA, avail * 0.45); hB = avail - hA; }
  var y0 = Math.max(0, (avail - hA - hB) / 2);
  a.e.style.top = y0 + 'px'; a.e.style.height = hA + 'px';
  b.e.style.top = (y0 + hA + 60) + 'px'; b.e.style.height = hB + 'px';
  var arrow = mk('div', 'position:absolute; left:50%; top:' + (y0 + hA + 6) + 'px; margin-left:-24px; width:48px; height:48px; color:' + C.orange, stage, '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 4v14M6 12l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>');
  var v = sp.verdict ? approvalPill(stage, sp.verdict, sp.verdictKind || 'dark') : null;
  if (v) { v.style.bottom = 'auto'; v.style.top = (y0 + hA + 60 + hB + 34) + 'px'; }
  var tA = 0.6, per = function (n) { return n > 4 ? 0.35 : 0.8; };
  var tB = tA + 0.4 + a.its.length * per(a.its.length) + 0.4, tV = tB + 0.5 + b.its.length * per(b.its.length) + 0.3;
  return {
    T: tV + 3.0,
    update: function (t) {
      fade(a.e, prog(t, 0.1, 0.5), 12);
      a.its.forEach(function (o, i) { var s = tA + 0.3 + i * per(a.its.length); fade(o.q, prog(t, s, s + 0.2), 6); words(o.t, o.text, prog(t, s, s + per(a.its.length) * 0.9)); o.r.textContent = o.text.slice(o.t.textContent.length); });
      fade(arrow, prog(t, tB - 0.4, tB), 10);
      fade(b.e, prog(t, tB, tB + 0.4), 12);
      b.its.forEach(function (o, i) { var s = tB + 0.4 + i * per(b.its.length); pop(o.q, prog(t, s, s + 0.3), 0.9); words(o.t, o.text, prog(t, s, s + per(b.its.length) * 0.9)); o.r.textContent = o.text.slice(o.t.textContent.length); });
      if (v) fade(v, prog(t, tV, tV + 0.5));
    }
  };
};

/* stack: {layers:[{label,sub,icon,hi}] bottom-first, caption, captionKind} */
S.stack = function (stage, sp, W, H) {
  var n = sp.layers.length, bottomPad = sp.caption ? 96 : 0;
  var gap = 16, lh = Math.min(150, (H - bottomPad - (n - 1) * gap) / n);
  var totalH = n * lh + (n - 1) * gap, y0 = (H - bottomPad - totalH) / 2 + totalH;
  var els = sp.layers.map(function (l, i) {
    var y = y0 - (i + 1) * lh - i * gap; var inset = (n - 1 - i) * 0 + i * 18;
    var e = mk('div', 'position:absolute; z-index:2; left:' + inset + 'px; right:' + inset + 'px; top:' + y + 'px; height:' + lh + 'px; box-sizing:border-box; border-radius:22px; display:flex; align-items:center; gap:22px; padding:0 30px; background:' + (l.hi ? C.dark : '#fff') + '; color:' + (l.hi ? '#fff' : C.text) + '; border:' + (l.hi ? 'none' : '2px solid ' + C.line), stage);
    e.innerHTML = badge(l.icon || 'doc', Math.min(66, lh - 40)) + '<div style="display:flex; flex-direction:column; gap:4px; min-width:0"><span style="font-size:' + (lh < 110 ? 27 : 31) + 'px; font-weight:500">' + esc(l.label) + '</span>' + (l.sub ? '<span style="font-size:' + (lh < 110 ? 20 : 23) + 'px; line-height:1.25; color:' + (l.hi ? 'rgba(255,255,255,0.72)' : C.mute) + '">' + esc(l.sub) + '</span>' : '') + '</div>' + (l.tag ? '<span style="margin-left:auto; font-size:21px; font-weight:500; color:' + (l.hi ? C.orange : C.mute) + '; white-space:nowrap">' + esc(l.tag) + '</span>' : '');
    return e;
  });
  var cap = sp.caption ? approvalPill(stage, sp.caption, sp.captionKind || 'dark') : null;
  var per = 0.75, tEnd = 0.4 + n * per;
  return {
    T: tEnd + 3.2,
    update: function (t) {
      els.forEach(function (e, i) { var p = prog(t, 0.4 + i * per, 0.4 + i * per + 0.5); e.style.opacity = p; e.style.transform = 'translateY(' + (-(1 - back(p)) * 60) + 'px)'; e.style.visibility = p <= 0 ? 'hidden' : 'visible'; });
      if (cap) fade(cap, prog(t, tEnd, tEnd + 0.5));
    }
  };
};

/* checklist: {app, title, sub, items:[{text, who}], done, doneKind} */
S.checklist = function (stage, sp, W, H) {
  var bottomPad = sp.done ? 96 : 0;
  var wrap = mk('div', 'position:absolute; left:0; right:0; top:0; bottom:' + bottomPad + 'px', stage);
  var win = windowCard(wrap, { app: sp.app || 'list', title: sp.title, sub: sp.sub, right: sp.right });
  var list = mk('div', 'position:relative; padding:8px 28px 14px; display:flex; flex-direction:column', win.body);
  var n = sp.items.length, fs = n > 6 ? 24 : 27;
  var its = sp.items.map(function (it) {
    var e = mk('div', 'display:flex; align-items:center; gap:18px; padding:' + (n > 6 ? 12 : 16) + 'px 0; border-bottom:1px solid ' + C.line, list);
    var bx = mk('div', 'width:38px; height:38px; flex-shrink:0; border-radius:10px; border:3px solid #c9c9c4; box-sizing:border-box; display:flex; align-items:center; justify-content:center', e);
    var tx = mk('span', 'font-size:' + fs + 'px; line-height:1.25; color:' + C.text + '; flex:1', e, esc(it.text || it));
    if (it.who) mk('span', 'font-size:20px; color:' + C.mute + '; background:' + C.slab + '; border-radius:999px; padding:4px 14px; white-space:nowrap', e, esc(it.who));
    return { e: e, bx: bx, tx: tx };
  });
  if (its.length) its[its.length - 1].e.style.borderBottom = 'none';
  var dn = sp.done ? approvalPill(stage, sp.done, sp.doneKind || 'green') : null;
  settle(H, wrap, win.win, dn);
  var per = n > 6 ? 0.42 : 0.6, tTick = 0.5 + n * 0.22 + 0.3, tEnd = tTick + n * per;
  return {
    T: tEnd + 3.0,
    update: function (t) {
      fade(win.win, prog(t, 0, 0.4), 14);
      its.forEach(function (o, i) { fade(o.e, prog(t, 0.5 + i * 0.22, 0.8 + i * 0.22), 8); var on = t >= tTick + i * per;
        o.bx.style.background = on ? C.green : 'transparent'; o.bx.style.borderColor = on ? C.green : '#c9c9c4'; o.bx.innerHTML = on ? iconSvg('check', 24, '#fff') : '';
        o.tx.style.color = on ? C.mute : C.text; });
      if (dn) fade(dn, prog(t, tEnd, tEnd + 0.5));
    }
  };
};

/* hub: one centre, spokes out to many apps, e.g. connectors. {centre:{label,sub,icon}, spokes:[{label,icon,via}], caption} */
S.hub = function (stage, sp, W, H) {
  var E = Edges(stage);
  var bottomPad = sp.caption ? 96 : 0;
  var cx = W / 2, cy = (H - bottomPad) / 2, n = sp.spokes.length;
  var sw = n <= 3 ? 380 : n <= 4 ? 360 : 300, sh = n <= 4 ? 130 : 110;
  var rx = W / 2 - sw / 2, ry = (H - bottomPad) / 2 - sh / 2 - 10;
  var c = boxNode(stage, { x: cx, y: cy, w: 310, h: 140, label: sp.centre.label, sub: sp.centre.sub, icon: sp.centre.icon || 'claude', style: 'dark', fs: 38, sfs: 24, iconSize: 70 });
  var sp2 = sp.spokes.map(function (s, i) {
    var ang = -Math.PI / 2 + (n === 4 || n === 2 ? Math.PI / n : 0) + i * 2 * Math.PI / n;
    var x = cx + rx * Math.cos(ang), y = cy + ry * Math.sin(ang);
    var e = boxNode(stage, { x: x, y: y, w: sw, h: sh, label: s.label, sub: s.sub, icon: s.icon, fs: n <= 4 ? 31 : 28, sfs: n <= 4 ? 23 : 21, iconSize: n <= 4 ? 62 : 54 });
    var ed = E.add('M' + cx + ' ' + cy + ' L' + x + ' ' + y, { color: '#c4c4bf' });
    var via = null;
    if (s.via) { via = mk('div', 'position:absolute; z-index:3; left:' + (cx + (x - cx) * 0.6 - 70) + 'px; top:' + (cy + (y - cy) * 0.6 - 18) + 'px; width:140px; text-align:center', stage, '<span style="background:' + C.dark + '; color:#fff; border-radius:999px; padding:5px 14px; font-size:21px; white-space:nowrap; font-weight:500">' + esc(s.via) + '</span>'); }
    return { e: e, ed: ed, via: via };
  });
  var cap = sp.caption ? approvalPill(stage, sp.caption, sp.captionKind || 'dark') : null;
  var tS = 0.7, per = 0.35, tR = tS + n * per + 0.3, tEnd = tR + 2.2;
  return {
    T: tEnd + 2.6,
    update: function (t) {
      E.clearDots();
      pop(c, prog(t, 0.1, 0.5));
      sp2.forEach(function (s, i) { var a = tS + i * per; E.draw(s.ed, prog(t, a, a + 0.4)); pop(s.e, prog(t, a + 0.25, a + 0.65)); if (s.via) fade(s.via, prog(t, a + 0.4, a + 0.7), 6);
        var q = ((t - tR - i * 0.18) / 1.0); if (q > 0 && q < 2) { var qq = q % 1; E.dot(s.ed, q < 1 ? 1 - qq : qq, q < 1 ? C.orange : C.green, 10); } });
      glow(c, prog(t, tR, tR + 1.2));
      if (cap) fade(cap, prog(t, tEnd - 0.6, tEnd - 0.1));
    }
  };
};

window.__init = function () {
  var stage = document.getElementById('stage');
  var W = stage.clientWidth, H = stage.clientHeight;
  var sp = window.SPEC;
  var sc = S[sp.type](stage, sp, W, H);
  window.__T = Math.min(sc.T, 30);
  window.__frame = function (t) { sc.update(t); return true; };
  sc.update(0);
};
})();
