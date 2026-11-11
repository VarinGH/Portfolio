/* Coded animations. Each one draws into a 720 x 430 box that is scaled to fit the figure frame.
   window.ANIMS[name](frameElement) starts it and returns a function that stops it. */
window.ANIMS = {};

/* Defocus curve on three linked screens. The screens follow the real application's design:
   its type (Sarabun), colours, components and wording. Values are illustrative. No product names. */
window.ANIMS.defocus = function (frame) {
  var F = "'Sarabun UI','Sarabun',sans-serif";
  var LENS = [1.5, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0];
  /* acuity per lens as logMAR; shown in Snellen feet (20/20 notation) */
  var LET = { '1.5': 0.3, '1': 0.2, '0.5': 0.0, '0': -0.1, '-0.5': 0.0, '-1': 0.1, '-1.5': 0.1, '-2': 0.1, '-2.5': 0.1, '-3': 0.2, '-3.5': 0.3, '-4': 0.5 };
  var SN = { '-0.1': '20/16', '0': '20/20', '0.1': '20/25', '0.2': '20/32', '0.3': '20/40', '0.4': '20/50', '0.5': '20/63', '0.6': '20/80' };
  function sn(v) { return SN[String(v)]; }
  var ORDER = [-2.0, 1.0, -3.5, -0.5, 1.5, -1.5, -4.0, -2.5, 0.5, -3.0, -1.0];
  var START = 5, TYPO = 7, WRONG = 0.6, N = ORDER.length;
  var MINUS = '−';
  function fd(d) { return (d > 0 ? '+' : d < 0 ? MINUS : '') + Math.abs(d).toFixed(2); }
  function lm(n) { return n; }
  var CW = 236, CH = 128, PL = 34, PR = 6, PT = 16, PB = 18;
  function px(d) { return PL + (1.5 - d) / 5.5 * (CW - PL - PR); }
  function py(v) { return PT + (v + 0.15) / 0.85 * (CH - PT - PB); }

  /* tokens from the three apps */
  var T = { ink: '#14171b', ink2: '#434a53', ink3: '#5c636d', rule: '#d3d8dd', ruleS: '#a9b1ba', sheet2: '#f5f6f7', action: '#a3245c', actionTint: '#f7e4ed', ok: '#2b6b45', okTint: '#e1f0e6', caution: '#7d4c00', cautionRing: '#d98e10', cautionTint: '#fdf0d3' };
  var P = { ground: '#eef1f3', rule: '#d5dbe0', ink: '#16212b', ink2: '#46535f', ink3: '#66727d', pen: '#1d4f91', penTint: '#e5edf8', warn: '#7f5300', warnTint: '#fdf0d3' };
  var I = { shell: '#f3f4f6', ink: '#1f2933', muted: '#52606d', rule: '#cbd2d9', grid: '#e4e7eb', navy: '#2f4a6d', navySoft: '#e6ecf3', dc: '#2a78d6', confirm: '#8a5a12', confirmBg: '#fdf3e1', block: '#b42318', ok: '#276749', okBg: '#e7f4ec' };
  var tr = 'transition:background-color .28s ease,border-color .28s ease,color .28s ease,opacity .28s ease,transform .28s cubic-bezier(.2,.8,.2,1);';
  var dev = 'position:absolute;box-sizing:border-box;background:#1d2024;';
  var scr = 'position:absolute;overflow:hidden;font-family:' + F + ';';
  var lab = 'position:absolute;top:374px;text-align:center;font-family:' + F + ';font-size:18px;font-weight:600;color:#16181c;line-height:1.2';
  var sub = 'display:block;font-weight:400;font-size:15px;color:#4a4f57';

  var grid = '<rect x="' + px(-0.5) + '" y="' + PT + '" width="' + (px(-2.0) - px(-0.5)) + '" height="' + (CH - PT - PB) + '" fill="#eef3f9"/>';
  [0, 0.2, 0.4, 0.6].forEach(function (v) { grid += '<path d="M' + PL + ' ' + py(v) + ' H' + (CW - PR) + '" stroke="' + I.grid + '" stroke-width="1"/><text x="' + (PL - 4) + '" y="' + (py(v) + 3.4) + '" text-anchor="end">' + sn(v) + '</text>'; });
  grid += '<path d="M' + PL + ' ' + py(0.2) + ' H' + (CW - PR) + '" stroke="' + I.muted + '" stroke-width=".8" stroke-dasharray="4 3"/><path d="M' + PL + ' ' + py(0.3) + ' H' + (CW - PR) + '" stroke="' + I.muted + '" stroke-width=".8" stroke-dasharray="1 3"/>';
  [1, 0, -1, -2, -3, -4].forEach(function (d) { grid += '<text x="' + px(d) + '" y="' + (CH - 4) + '" text-anchor="middle">' + (d > 0 ? '+' : d < 0 ? MINUS : '') + Math.abs(d) + '</text>'; });
  [['far', 0.5], ['intermediate', -1.25], ['near', -3.0]].forEach(function (b) { grid += '<text x="' + px(b[1]) + '" y="' + (PT - 5) + '" text-anchor="middle" font-size="8.5">' + b[0] + '</text>'; });
  var marks = '';
  for (var j = 0; j < LENS.length - 1; j++) marks += '<line data-s="' + j + '" stroke="' + I.dc + '" stroke-width="1.8" stroke-linecap="round" opacity="0"/>';
  marks += '<circle data-ring="1" r="7.5" fill="none" stroke="' + I.block + '" stroke-width="1.6" opacity="0"/>';
  for (j = 0; j < LENS.length; j++) marks += LENS[j] === 0 ? '<rect data-p="' + j + '" width="6" height="6" fill="#fff" stroke="' + I.dc + '" stroke-width="1.5"/>' : '<circle data-p="' + j + '" r="0" fill="' + I.dc + '"/>';

  frame.innerHTML =
    '<div style="position:relative;width:720px;height:430px;flex-shrink:0;transform-origin:center center">' +

    /* tablet: optometrist */
    '<div style="' + dev + 'left:8px;top:6px;width:256px;height:358px;border-radius:18px">' +
     '<div style="' + scr + 'left:9px;top:9px;right:9px;bottom:9px;border-radius:8px;background:#fff;color:' + T.ink + ';padding:12px 14px;display:flex;flex-direction:column">' +
      '<div style="font-size:20px;font-weight:600;line-height:1.2">Defocus curve</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-top:4px;font-size:12px;color:' + T.ink2 + ';white-space:nowrap"><span style="padding:1px 7px;border-radius:5px;font-weight:600;background:' + T.actionTint + ';color:' + T.action + '">distance-corrected</span><span style="font-weight:600;color:' + T.ink + '">Both eyes open</span></div>' +
      '<div data-k="card" style="margin-top:10px;border:2px solid ' + T.ruleS + ';border-radius:11px;padding:7px 10px 10px;text-align:center;' + tr + '">' +
        '<div data-k="pos" style="font-size:14px;color:' + T.ink2 + '"></div>' +
        '<div style="font-size:46px;font-weight:600;line-height:1.06;letter-spacing:-.03em;font-variant-numeric:tabular-nums;white-space:nowrap"><span data-k="lens" style="display:inline-block"></span><small style="font-size:21px;margin-left:4px;color:' + T.ink3 + ';letter-spacing:0">D</small></div>' +
        '<div style="position:relative;height:42px;margin-top:5px">' +
          '<div data-k="tap" style="position:absolute;left:0;top:0;right:0;bottom:0;border-radius:8px;background:' + T.action + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:600;white-space:nowrap;' + tr + '"></div>' +
          '<div data-k="in" style="position:absolute;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:6px;color:' + T.ok + ';font-size:15.5px;font-weight:600;opacity:0;' + tr + '"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Lens in the frame</div>' +
        '</div></div>' +
      '<div style="position:relative;height:54px;margin-top:8px">' +
        '<div data-k="wait" style="position:absolute;left:0;top:8px;right:0;font-size:13.5px;line-height:1.35;color:' + T.ink3 + ';' + tr + '">Confirm the lens above first, then enter the value</div>' +
        '<div data-k="ro" style="position:absolute;left:0;top:0;display:flex;align-items:baseline;gap:6px;opacity:0;' + tr + '"><span data-k="val" style="display:inline-block;font-size:48px;font-weight:600;line-height:1.1;letter-spacing:-.01em;font-variant-numeric:tabular-nums"></span></div>' +
      '</div>' +
      '<div style="position:relative;height:62px;margin-top:auto">' +
        '<div data-k="save" style="position:absolute;left:0;bottom:0;right:0;height:44px;border-radius:8px;background:' + T.action + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;white-space:nowrap;' + tr + '"></div>' +
        '<div data-k="flag" style="position:absolute;left:0;bottom:0;right:0;min-height:60px;box-sizing:border-box;border-radius:8px;background:' + T.cautionTint + ';border:1.6px solid ' + T.cautionRing + ';color:' + T.caution + ';padding:6px 10px;font-size:12.5px;line-height:1.28;font-weight:500;opacity:0;transform:translateY(4px);' + tr + '">This lens stands out from its neighbours. Check the lens power and sign.</div>' +
      '</div>' +
     '</div></div>' +

    /* phone: assistant (the visit board: status and time only) */
    '<div style="' + dev + 'left:276px;top:44px;width:174px;height:318px;border-radius:21px">' +
     '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:7px;border-radius:13px;background:' + P.ground + ';color:' + P.ink + ';display:flex;flex-direction:column">' +
      '<div style="background:#fff;border-bottom:1px solid ' + P.rule + ';padding:11px 11px 7px"><div style="font-size:16px;font-weight:600;line-height:1.2">Today’s visits</div><div style="font-size:11px;color:' + P.ink2 + '">Friday 13 November</div></div>' +
      '<div style="padding:9px 8px 0;flex:1 1 0;min-height:0">' +
        '<div style="font-size:11.5px;font-weight:600;color:' + P.ink2 + ';margin:0 1px 5px">In progress <span style="font-weight:500;color:' + P.ink3 + '">1</span></div>' +
        '<div data-k="row" style="background:#fff;border:1.2px solid #9db5d6;border-radius:8px;padding:8px 9px 9px;' + tr + '">' +
          '<div style="display:flex;align-items:center;gap:5px"><span style="font-size:18px;font-weight:600;letter-spacing:.01em">014</span><span style="padding:0 6px;border-radius:4px;font-size:10.5px;font-weight:500;background:' + P.penTint + ';color:' + P.pen + '">Mine</span><span style="flex:1 1 auto"></span><span data-k="clock" style="font-size:15px;font-weight:500;font-variant-numeric:tabular-nums"></span></div>' +
          '<div style="font-size:12px;color:' + P.ink2 + ';margin-top:1px">Visit at 3 months</div>' +
          '<div style="font-size:12.5px;margin-top:6px;line-height:1.3">Now: Defocus curve on the tablet</div>' +
          '<div style="font-size:11.5px;color:' + P.ink2 + ';margin-top:4px">9 of 14 steps done</div>' +
          '<div data-k="pflag" style="font-size:11.5px;line-height:1.3;font-weight:500;color:' + P.warn + ';max-height:0;opacity:0;overflow:hidden;transition:max-height .35s ease,opacity .3s ease,margin-top .35s ease">1 waiting for the optometrist to confirm</div>' +
        '</div>' +
      '</div>' +
      '<div style="background:#fff;border-top:1px solid ' + P.rule + ';padding:8px"><div style="height:38px;border-radius:8px;background:' + P.pen + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:600">Start a new visit</div></div>' +
     '</div></div>' +

    /* laptop: principal investigator (the dashboard sheet) */
    '<div style="' + dev + 'left:462px;top:138px;width:246px;height:214px;border-radius:10px 10px 0 0">' +
     '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:6px;background:' + I.shell + ';color:' + I.ink + ';display:flex;flex-direction:column">' +
      '<div style="background:#fff;border-bottom:1px solid ' + I.rule + ';display:flex;gap:11px;padding:0 8px;font-size:11px"><span style="padding:6px 0 4px">Participants</span><span style="padding:6px 0 3px;color:' + I.navy + ';font-weight:600;border-bottom:2px solid ' + I.navy + '">Dashboard</span><span style="padding:6px 0 4px">QC flags</span></div>' +
      '<div style="margin:5px;background:#fff;border:1px solid ' + I.rule + ';border-radius:3px;flex:1 1 0;min-height:0;display:flex;flex-direction:column">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 7px;border-bottom:1px solid ' + I.grid + '"><span style="font-size:12px;font-weight:600;color:' + I.navy + '">Defocus curve</span><span data-k="tag" style="padding:0 6px;border-radius:2px;font-size:10.5px;line-height:16px;border:1px solid ' + I.rule + ';color:' + I.muted + ';background:#fff;white-space:nowrap;' + tr + '"></span></div>' +
        '<svg viewBox="0 0 ' + CW + ' ' + CH + '" style="flex:1 1 0;min-height:0;width:100%;font-family:' + F + ';font-size:9.5px;fill:' + I.muted + '">' + grid + marks + '</svg>' +
      '</div>' +
     '</div></div>' +
    '<div style="position:absolute;left:450px;top:352px;width:270px;height:11px;background:#1d2024;border-radius:0 0 10px 10px"></div>' +
    '<div data-k="alarm" style="position:absolute;left:563px;top:84px;width:44px;height:44px;border-radius:50%;background:' + I.confirmBg + ';border:1.6px solid #e6c48a;color:' + I.block + ';display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform-origin:50% 10%"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15z"/><path d="M10 21a2 2 0 0 0 4 0"/><path d="M12 3V5"/></svg></div>' +

    '<div style="' + lab + ';left:8px;width:256px">Optometrist<span style="' + sub + '">enters each reading</span></div>' +
    '<div style="' + lab + ';left:268px;width:190px">Assistant<span style="' + sub + '">follows visit status</span></div>' +
    '<div style="' + lab + ';left:450px;width:270px">Principal investigator<span style="' + sub + '">sees curve and quality flags</span></div>' +
    '</div>';

  var box = frame.firstChild, el = {}, ptEl = [], segEl = [];
  [].forEach.call(box.querySelectorAll('[data-k]'), function (n) { el[n.getAttribute('data-k')] = n; });
  [].forEach.call(box.querySelectorAll('[data-p]'), function (n) { ptEl[+n.getAttribute('data-p')] = n; });
  [].forEach.call(box.querySelectorAll('[data-s]'), function (n) { segEl[+n.getAttribute('data-s')] = n; });
  var ring = box.querySelector('[data-ring]');
  function fit() { var s = Math.min(frame.clientWidth / 720, frame.clientHeight / 430); box.style.transform = 'scale(' + s + ')'; }
  fit();

  /* text that changes slides in rather than snapping */
  function swap(n, txt, dy) {
    if (n.textContent === String(txt)) return;
    n.textContent = txt;
    if (n.animate) n.animate([{ opacity: 0, transform: 'translateY(' + (dy || 7) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  /* error: a small alarm pops up above the laptop, shakes, then fades away */
  function alarm() {
    var a = el.alarm, bell = a.firstChild;
    if (!a.animate) return;
    a.animate([{ opacity: 0, transform: 'translateY(16px) scale(.7)' }, { opacity: 1, transform: 'translateY(0) scale(1)', offset: .12 }, { opacity: 1, transform: 'translateY(0) scale(1)', offset: .78 }, { opacity: 0, transform: 'translateY(-8px) scale(.96)' }], { duration: 2600, easing: 'cubic-bezier(.2,.8,.2,1)' });
    bell.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(16deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(11deg)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duration: 620, delay: 260, iterations: 2, easing: 'ease-in-out' });
  }
  function press(n) { if (n.animate) n.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)', offset: .35 }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' }); }

  /* timeline: one state per tick; the first five lenses are already measured when the loop starts */
  var TL = [];
  function push(s, n) { for (var k = 0; k < (n || 1); k++) TL.push(s); }
  for (var i = START; i < N; i++) {
    var ok = LET[String(ORDER[i])];
    push({ i: i, done: i, ph: 'lens' }, 4);
    push({ i: i, done: i, ph: 'in' }, 3);
    if (i === TYPO) {
      push({ i: i, done: i, ph: 'val', va: WRONG }, 3);
      push({ i: i, done: i + 1, ph: 'flag', va: WRONG, wrong: true }, 14);
      push({ i: i, done: i + 1, ph: 'val', va: ok, fixed: true, redo: true }, 4);
      push({ i: i, done: i + 1, ph: 'saved', va: ok, fixed: true }, 4);
    } else {
      push({ i: i, done: i, ph: 'val', va: ok }, 3);
      push({ i: i, done: i + 1, ph: 'saved', va: ok }, 3);
    }
  }
  push({ i: N - 1, done: N, ph: 'end', va: LET[String(ORDER[N - 1])] }, 22);

  /* curve state, eased every frame so points grow and lines draw smoothly at any refresh rate */
  var vis = [], yv = [], tv = [], ty = [], ringV = 0, ringT = 0;
  LENS.forEach(function (d, j) { vis[j] = d === 0 ? 1 : 0; tv[j] = vis[j]; yv[j] = ty[j] = py(lm(LET[String(d)])); });
  var typoIdx = LENS.indexOf(ORDER[TYPO]);
  var last = null, tick = 0, prevPh = '', raf = 0, timer = 0, sec0 = 38 * 60 + 12, t0 = Date.now();

  function apply(s) {
    var lens = ORDER[s.i], after = s.i > TYPO || s.fixed;
    swap(el.pos, 'Lens ' + (s.i + 1) + ' of ' + N + (s.redo ? '  re-measure' : ''), 0);
    swap(el.lens, fd(lens), 10);
    el.tap.textContent = 'Lens ' + fd(lens) + ' is in the frame';
    var isIn = s.ph !== 'lens';
    el.tap.style.opacity = isIn ? 0 : 1; el.tap.style.transform = isIn ? 'scale(.96)' : 'none';
    el['in'].style.opacity = isIn ? 1 : 0;
    el.card.style.borderColor = isIn ? T.ok : T.ruleS;
    var hasV = s.va != null;
    el.wait.style.opacity = hasV ? 0 : (isIn ? .0 : 1);
    el.ro.style.opacity = hasV ? 1 : (isIn ? .35 : 0);
    if (hasV) swap(el.val, sn(s.va), 12); else if (isIn) el.val.textContent = '–';
    var flag = s.ph === 'flag';
    el.flag.style.opacity = flag ? 1 : 0; el.flag.style.transform = flag ? 'none' : 'translateY(4px)';
    el.save.style.opacity = flag ? 0 : (hasV ? 1 : .4);
    el.save.textContent = s.ph === 'saved' || s.ph === 'end' ? 'Saved' : (hasV ? 'Save ' + sn(s.va) + ' at ' + fd(lens) : 'Enter a value');
    el.save.style.background = s.ph === 'saved' || s.ph === 'end' ? T.ok : T.action;
    if (s.ph !== prevPh) { if (s.ph === 'in') press(el.tap); if (s.ph === 'saved' || s.ph === 'flag') press(el.save); if (s.ph === 'flag') alarm(); }
    el.pflag.style.maxHeight = flag ? '50px' : '0'; el.pflag.style.opacity = flag ? 1 : 0; el.pflag.style.marginTop = flag ? '5px' : '0';
    el.row.style.borderColor = flag ? '#e5c27a' : '#9db5d6';
    el.tag.textContent = flag ? 'R09 open' : (after ? 'R09 resolved' : 'No. 014');
    el.tag.style.borderColor = flag ? '#e6c48a' : (after ? '#a7d3b8' : I.rule);
    el.tag.style.color = flag ? I.confirm : (after ? I.ok : I.muted);
    el.tag.style.background = flag ? I.confirmBg : (after ? I.okBg : '#fff');
    for (var j = 0; j < LENS.length; j++) {
      if (LENS[j] === 0) continue;
      var oi = ORDER.indexOf(LENS[j]);
      tv[j] = oi < s.done ? 1 : 0;
      ty[j] = py(lm((s.wrong && oi === TYPO) ? WRONG : LET[String(LENS[j])]));
    }
    ringT = flag ? 1 : 0;
    prevPh = s.ph;
  }
  function frameStep(now) {
    var dt = last == null ? 16 : Math.min(60, now - last); last = now;
    var a = 1 - Math.exp(-dt / 110), b = 1 - Math.exp(-dt / 160);
    for (var j = 0; j < LENS.length; j++) {
      vis[j] += (tv[j] - vis[j]) * a; yv[j] += (ty[j] - yv[j]) * b;
      var x = px(LENS[j]), n = ptEl[j];
      if (LENS[j] === 0) { n.setAttribute('x', x - 3); n.setAttribute('y', yv[j] - 3); }
      else { n.setAttribute('cx', x); n.setAttribute('cy', yv[j]); n.setAttribute('r', (3.2 * vis[j]).toFixed(2)); }
    }
    for (j = 0; j < LENS.length - 1; j++) {
      var m = Math.min(vis[j], vis[j + 1]), l = segEl[j], x1 = px(LENS[j]), x2 = px(LENS[j + 1]);
      l.setAttribute('opacity', m > .02 ? 1 : 0);
      var cx = (x1 + x2) / 2, cy = (yv[j] + yv[j + 1]) / 2;
      l.setAttribute('x1', cx + (x1 - cx) * m); l.setAttribute('y1', cy + (yv[j] - cy) * m);
      l.setAttribute('x2', cx + (x2 - cx) * m); l.setAttribute('y2', cy + (yv[j + 1] - cy) * m);
    }
    ringV += (ringT - ringV) * a;
    ring.setAttribute('cx', px(LENS[typoIdx])); ring.setAttribute('cy', yv[typoIdx]);
    ring.setAttribute('opacity', ringV.toFixed(2)); ring.setAttribute('r', (7.5 + (1 - ringV) * 6).toFixed(2));
    var sec = sec0 + Math.floor((Date.now() - t0) / 1000);
    var c = Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
    if (el.clock.textContent !== c) el.clock.textContent = c;
    raf = requestAnimationFrame(frameStep);
  }
  function reset() { t0 = Date.now(); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  apply(TL[reduce ? TL.length - 1 : 0]);
  raf = requestAnimationFrame(frameStep);
  if (!reduce) timer = setInterval(function () { tick = (tick + 1) % TL.length; if (tick === 0) reset(); apply(TL[tick]); }, 230);
  window.addEventListener('resize', fit);
  return function () { clearInterval(timer); cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
};

/* Hindsight, redrawn from the real desktop app (dark theme, phase colours, monospace phase tag):
   1. a thumb drive is plugged in and new cases copy in by themselves,
   2. phases are found automatically while the playhead runs,
   3. the last 10 capsulorhexis are pulled up side by side and exported. Illustrative cases. */
window.ANIMS.hindsight = function (frame) {
  var SANS = "'Source Sans 3','Sarabun',Arial,sans-serif", MONO = "ui-monospace,Consolas,'Courier New',monospace";
  var PH = [ /* name, share of case, colour: the app's own PHASES and PHASE_COLORS */
    ['Incision', .05, '#e06c75'], ['OVD injection', .04, '#61afef'], ['Capsulorhexis', .11, '#e5c07b'], ['Hydrodissection', .07, '#56b6c2'],
    ['Hydrodelineation', .04, '#48a999'], ['Phacoemulsification', .32, '#d97757'], ['Irrigation/Aspiration', .15, '#98c379'],
    ['IOL implantation', .11, '#c678dd'], ['OVD removal', .07, '#e88db9'], ['Wound sealing', .04, '#8b949e']];
  var DRAW = [0, 1, 2, 3, 3, 4, 5, 6, 6, 6];   /* which eye drawing each phase uses */
  var acc = 0; PH.forEach(function (p) { p.push(acc); acc += p[1]; });          /* p[3] = start */
  var CASE_MIN = 15.5, L = 21.5, T1 = 3.6, T2 = 15, T3 = 20;                      /* seconds */
  var CASES = ['12 Nov', '11 Nov', '7 Nov', '5 Nov', '4 Nov', '31 Oct', '29 Oct', '24 Oct', '22 Oct', '17 Oct'];
  var BG = '#262623', PANEL = '#1f1f1d', LINE = '#3a3a36', TXT = '#e8e8e4', DIM = '#9a9a94', BLUE = '#3b8beb';
  function mmss(m) { var s = Math.round(m * 60); return (s / 60 | 0) + ':' + ('0' + s % 60).slice(-2); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = cl(x); return x * x * (3 - 2 * x); }

  /* ---- realistic microscope view. Local coordinates: eye centre at 0,0, limbus radius 90. ---- */
  var RL = 90, RP = 63, RX = 41, RN = 36, RO = 47;          /* limbus, dilated pupil, rhexis, nucleus, IOL optic */
  var MAIN = [-89, -14], SIDE = [-42, 80];                   /* main incision (temporal) and side port */
  function seed(n) { return function () { n = (n * 16807) % 2147483647; return (n - 1) / 2147483646; }; }
  var rnd = seed(7), vessels = '';
  for (var v = 0; v < 14; v++) { /* conjunctival vessels: from the fornix toward the limbus, branching */
    var a = rnd() * 6.283, r0 = 170, r1 = RL + 6 + rnd() * 18, d = 'M' + (Math.cos(a) * r0).toFixed(1) + ' ' + (Math.sin(a) * r0 * .8).toFixed(1);
    for (var st = 1; st <= 5; st++) { var rr = r0 + (r1 - r0) * st / 5, aa = a + (rnd() - .5) * .18 * st / 2; d += ' L' + (Math.cos(aa) * rr).toFixed(1) + ' ' + (Math.sin(aa) * rr * (st < 5 ? .86 : 1)).toFixed(1); }
    vessels += '<path d="' + d + '" stroke="#c0504a" stroke-width="' + (0.5 + rnd() * .8).toFixed(2) + '" fill="none" opacity="' + (0.25 + rnd() * .25).toFixed(2) + '" stroke-linecap="round"/>';
  }
  var fib = '';
  for (var f2 = 0; f2 < 120; f2++) { var fa = f2 / 120 * 6.283 + (rnd() - .5) * .03, w1 = RP + 1, w2 = RL - 3 - rnd() * 6;
    fib += '<path d="M' + (Math.cos(fa) * w1).toFixed(1) + ' ' + (Math.sin(fa) * w1).toFixed(1) + ' L' + (Math.cos(fa + .02) * w2).toFixed(1) + ' ' + (Math.sin(fa + .02) * w2).toFixed(1) + '" stroke="' + (f2 % 3 ? '#76808c' : '#2b333c') + '" stroke-width=".9" opacity=".55"/>'; }
  var hook = function (x, y, sx, sy) { return '<path d="M' + x + ' ' + y + ' q' + (18 * sx) + ' ' + (-30 * sy) + ' ' + (58 * sx) + ' ' + (-38 * sy) + ' M' + x + ' ' + y + ' q' + (8 * sx) + ' ' + (8 * sy) + ' ' + (22 * sx) + ' ' + (4 * sy) + '" stroke="#55595f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M' + x + ' ' + y + ' q' + (18 * sx) + ' ' + (-30 * sy) + ' ' + (58 * sx) + ' ' + (-38 * sy) + '" stroke="#e8ebee" stroke-width="1.6" fill="none"/>'; };
  var EYEDEFS =
    '<radialGradient id="hsConj" r="50%"><stop offset=".4" stop-color="#f8ece6"/><stop offset=".78" stop-color="#efcdc4"/><stop offset="1" stop-color="#d59a8f"/></radialGradient>' +
    '<radialGradient id="hsRef" cx="46%" cy="44%" r="55%"><stop offset="0" stop-color="#ffb866"/><stop offset=".6" stop-color="#ec8a35"/><stop offset="1" stop-color="#b4521d"/></radialGradient>' +
    '<radialGradient id="hsNuc" r="50%"><stop offset="0" stop-color="#c78a2e" stop-opacity=".95"/><stop offset=".7" stop-color="#b4782a" stop-opacity=".8"/><stop offset="1" stop-color="#e9d2a0" stop-opacity=".35"/></radialGradient>' +
    '<radialGradient id="hsLimb" r="50%"><stop offset=".86" stop-color="#26303a" stop-opacity="0"/><stop offset=".97" stop-color="#26303a" stop-opacity=".9"/><stop offset="1" stop-color="#9aa6b0" stop-opacity=".4"/></radialGradient>' +
    '<clipPath id="hsPupC" clipPathUnits="userSpaceOnUse"><circle r="' + RP + '"/></clipPath>' +
    '<clipPath id="hsCorC" clipPathUnits="userSpaceOnUse"><circle r="' + (RL - 1) + '"/></clipPath>' +
    '<filter id="hsSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
    '<g id="hsBack"><ellipse rx="190" ry="120" fill="url(#hsConj)"/>' + vessels + '<circle r="' + RP + '" fill="url(#hsRef)"/></g>' +
    '<g id="hsIris"><path d="M' + RL + ' 0 A' + RL + ' ' + RL + ' 0 1 0 ' + (-RL) + ' 0 A' + RL + ' ' + RL + ' 0 1 0 ' + RL + ' 0 Z M' + RP + ' 0 A' + RP + ' ' + RP + ' 0 1 1 ' + (-RP) + ' 0 A' + RP + ' ' + RP + ' 0 1 1 ' + RP + ' 0 Z" fill="#4b5763" fill-rule="evenodd"/>' + fib +
      '<circle r="' + (RP + 9) + '" fill="none" stroke="#5f6a76" stroke-width="2" opacity=".7"/><circle r="' + (RP + .5) + '" fill="none" stroke="#1d242b" stroke-width="2"/><circle r="' + RL + '" fill="url(#hsLimb)"/></g>' +
    '<g id="hsGlint"><ellipse cx="-16" cy="-22" rx="2.6" ry="2.1" fill="#fff" opacity=".9"/><ellipse cx="-9" cy="-23" rx="1.9" ry="1.6" fill="#fff" opacity=".8"/>' +
      '<path d="M-60 -52 A80 80 0 0 1 20 -82" stroke="#fff" stroke-width="5" fill="none" opacity=".08" filter="url(#hsSoft)"/></g>';
  var FIELD = '<rect x="-222" y="-131" width="444" height="262" fill="url(#hsDrape)"/><rect x="-222" y="-131" width="444" height="262" fill="#ffffff" opacity=".06"/>' +
    '<ellipse rx="196" ry="126" fill="#b0675b"/><use href="#hsBack"/>';
  var HOOKS = hook(-112, -88, 1, 1) + hook(112, -88, -1, 1) + hook(-112, 88, 1, -1) + hook(112, 88, -1, -1);

  function mtl(x1, y1, x2, y2, w) { /* a polished steel shaft */
    var L = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1);
    return '<path d="' + L + '" stroke="#4a4f56" stroke-width="' + (w + 2) + '" stroke-linecap="round"/><path d="' + L + '" stroke="#b9c0c8" stroke-width="' + w + '" stroke-linecap="round"/><path d="' + L + '" stroke="#f3f5f7" stroke-width="' + Math.max(.8, w * .28) + '" stroke-linecap="round" transform="translate(-.6 -.6)"/>';
  }
  /* an instrument through a wound: straight, pivoting at the wound, handle running off screen */
  function thru(W, tx, ty, w, out) {
    var dx = W[0] - tx, dy = W[1] - ty, n = Math.sqrt(dx * dx + dy * dy) || 1, fx = W[0] + dx / n * 260, fy = W[1] + dy / n * 260;
    var hx = W[0] + dx / n * (out || 70), hy = W[1] + dy / n * (out || 70);
    return mtl(fx, fy, hx, hy, w + 6) + mtl(hx, hy, tx, ty, w);
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sector(r, a0, a1) { return 'M0 0 L' + (Math.cos(a0) * r).toFixed(1) + ' ' + (Math.sin(a0) * r).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (Math.cos(a1) * r).toFixed(1) + ' ' + (Math.sin(a1) * r).toFixed(1) + ' Z'; }
  var CORTEX = []; for (var c2 = 0; c2 < 12; c2++) CORTEX.push(c2 / 12 * 6.283 + .2);

  /* ph = phase index in PH (0..9), p = progress in it */
  function surg(ph, p) {
    var under = '', over = '', tools = '', wounds = '';
    var nucLeft = ph < 5 ? 1 : ph === 5 ? 1 - cl((p - .3) / .7) : 0;
    var rx = ph < 2 ? 0 : ph === 2 ? cl((p - .15) / .85) : 1;              /* rhexis completed fraction */
    var ovd = ph === 1 ? p : ph >= 2 && ph < 8 ? 1 : ph === 8 ? 1 - p : 0;  /* viscoelastic in the chamber */
    var a0 = -Math.PI * .55;
    /* lens: cortex rim, nucleus, IOL. All seen through the pupil */
    if (ph < 7) under += '<circle r="' + (RX + 6) + '" fill="#f1e0bd" opacity="' + (ph === 6 ? .22 * (1 - p) : .22) + '"/>';
    if (ph === 6 || ph < 6) CORTEX.forEach(function (ca, i) { var gone = ph === 6 && p > i / 12; if (!gone) under += '<path d="M' + (Math.cos(ca) * (RX + 1)).toFixed(1) + ' ' + (Math.sin(ca) * (RX + 1)).toFixed(1) + ' L' + (Math.cos(ca + .08) * (RX + 8)).toFixed(1) + ' ' + (Math.sin(ca + .08) * (RX + 8)).toFixed(1) + '" stroke="#fff4dc" stroke-width="2" opacity=".16" stroke-linecap="round"/>'; });
    if (ph < 5) {
      var rot = ph === 3 ? cl((p - .75) / .25) * 50 : ph === 4 ? 50 : 0;
      under += '<g transform="rotate(' + rot + ')"><circle r="' + RN + '" fill="url(#hsNuc)"/><path d="M0 0 L0 -14 M0 0 L12 7 M0 0 L-12 7" stroke="#e7c27a" stroke-width="1.3" opacity=".7"/></g>';
      if (ph === 4) under += '<circle r="' + (RN - 9) + '" fill="none" stroke="#ffd27a" stroke-width="2.4" opacity="' + (.9 * cl(p * 1.5)) + '"/>';
    } else if (ph === 5) {
      var crack = cl(p / .3), k;
      for (k = 0; k < 4; k++) {
        var s0 = cl((p - .3 - k * .175) / .175), al = k * Math.PI / 2 + Math.PI / 4, mx = Math.cos(al + Math.PI / 4), my = Math.sin(al + Math.PI / 4), gap = 3 * crack, sc = 1 - s0;
        if (sc > 0) under += '<g transform="translate(' + (mx * (gap + 12 * s0)).toFixed(1) + ' ' + (my * (gap + 12 * s0)).toFixed(1) + ') scale(' + sc.toFixed(3) + ')" opacity="' + (1 - s0 * .4) + '"><path d="' + sector(RN, al, al + Math.PI / 2) + '" fill="url(#hsNuc)"/><path d="' + sector(RN - 9, al, al + Math.PI / 2) + '" fill="#d9a046" opacity=".25"/></g>';
      }
      if (p < .3) under += '<path d="M' + (-RN * crack) + ' 0 H' + (RN * crack) + ' M0 ' + (-RN * crack) + ' V' + (RN * crack) + '" stroke="#7a3d12" stroke-width="2" opacity=".6" transform="rotate(45)"/>';
      for (k = 0; k < 6; k++) under += '<circle cx="' + (Math.sin(p * 90 + k * 2) * 6).toFixed(1) + '" cy="' + (Math.cos(p * 70 + k * 3) * 6).toFixed(1) + '" r="1.1" fill="#fff" opacity=".5"/>';
    }
    if (ph >= 7) { /* IOL: folded at the wound, unfolds and slides into the bag */
      var u = ph === 7 ? cl(p * 1.25) : 1, ox = lerp(MAIN[0] + 18, 0, Math.min(1, u * 1.3)), oy = lerp(MAIN[1] + 4, 0, Math.min(1, u * 1.3)), rxo = lerp(10, RO, u), rot2 = lerp(-70, -15, u);
      var opt = '<g transform="translate(' + ox.toFixed(1) + ' ' + oy.toFixed(1) + ') rotate(' + rot2.toFixed(1) + ')">' +
        '<ellipse rx="' + rxo.toFixed(1) + '" ry="' + RO + '" fill="#fff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.3"/>' +
        '<path d="M' + (-rxo * .5).toFixed(1) + ' ' + (-RO * .7) + ' A' + rxo.toFixed(1) + ' ' + RO + ' 0 0 1 ' + (rxo * .7).toFixed(1) + ' ' + (-RO * .4) + '" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>' +
        '<path d="M' + (rxo * .55).toFixed(1) + ' ' + (-RO * .82) + ' C' + (rxo * 1.2 + 10).toFixed(1) + ' -70 ' + (40 * u + 20) + ' -95 ' + (-10 * u + 25) + ' -' + (60 + 40 * u).toFixed(0) + '" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none"/>' +
        '<path d="M' + (-rxo * .55).toFixed(1) + ' ' + (RO * .82) + ' C' + (-rxo * 1.2 - 10).toFixed(1) + ' 70 ' + (-40 * u - 20) + ' 95 ' + (10 * u - 25) + ' ' + (60 + 40 * u).toFixed(0) + '" stroke="#fff" stroke-opacity="' + (.5 * cl(u * 2 - .6)) + '" stroke-width="1.6" fill="none"/></g>';
      over += opt;
    }
    if (rx > 0) { /* capsulorhexis edge, and the free flap while tearing */
      var C = 2 * Math.PI * RX;
      over += '<circle r="' + RX + '" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.4" stroke-dasharray="' + (C * rx).toFixed(1) + ' ' + (C + 1).toFixed(1) + '" transform="rotate(' + (a0 * 180 / Math.PI).toFixed(1) + ')"/>';
      if (rx < 1) { var ta = a0 + rx * 6.283; over += '<path d="M' + (Math.cos(ta) * RX).toFixed(1) + ' ' + (Math.sin(ta) * RX).toFixed(1) + ' Q' + (Math.cos(ta - .4) * 22).toFixed(1) + ' ' + (Math.sin(ta - .4) * 22).toFixed(1) + ' ' + (Math.cos(a0) * RX).toFixed(1) + ' ' + (Math.sin(a0) * RX).toFixed(1) + '" fill="#ffffff" fill-opacity=".14" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>'; }
    }
    if (ph === 3) { var wx = lerp(RX, -RX - 10, cl((p - .1) / .6)); over += '<path d="M' + wx.toFixed(1) + ' -60 Q' + (wx - 14).toFixed(1) + ' 0 ' + wx.toFixed(1) + ' 60" stroke="#6b250c" stroke-width="5" fill="none" opacity="' + (.35 * (p < .7 ? 1 : 0)) + '" filter="url(#hsSoft)"/>'; }

    /* wounds */
    if (ph > 0 || p > .3) wounds += '<path d="M' + (SIDE[0] - 4) + ' ' + (SIDE[1] - 5) + ' l7 6" stroke="#fdf3ee" stroke-width="2.4" opacity=".75"/>';
    if (ph > 0 || p > .8) wounds += '<path d="M' + (MAIN[0] + 1) + ' ' + (MAIN[1] - 10) + ' q-4 10 0 20" stroke="#fdf3ee" stroke-width="3" fill="none" opacity=".75"/>';
    if (ph === 9) wounds += '<ellipse cx="' + (MAIN[0] + 4) + '" cy="' + MAIN[1] + '" rx="' + (10 * p) + '" ry="' + (14 * p) + '" fill="#ffffff" opacity=".45" filter="url(#hsSoft)"/>';

    /* instruments, pivoting at the wounds */
    var tx, ty;
    if (ph === 0) {
      if (p < .35) { var q = Math.sin(cl(p / .35) * Math.PI); tools += thru(SIDE, SIDE[0] + 16 * q, SIDE[1] - 18 * q, 2.5); }
      else { var q2 = Math.sin(cl((p - .35) / .65) * Math.PI); tx = MAIN[0] + 30 * q2; ty = MAIN[1] + 4 * q2; tools += thru(MAIN, tx, ty, 3) + '<path d="M' + tx + ' ' + ty + ' l-14 -8 l-4 16 Z" fill="#d7dde3" stroke="#5a6068" stroke-width="1"/>'; }
    } else if (ph === 1 || ph === 3 || ph === 4 || ph === 9) {
      tx = ph === 1 ? lerp(MAIN[0] + 10, 20, p) : ph === 3 ? RX - 4 : ph === 4 ? 14 : MAIN[0] + 6; ty = ph === 1 ? lerp(MAIN[1], -6, p) : ph === 9 ? MAIN[1] + 2 : 4;
      tools += thru(MAIN, tx, ty, 2.2);
      if (ph === 1) over += '<circle cx="' + tx + '" cy="' + ty + '" r="' + (6 + 30 * p) + '" fill="#d8ecff" opacity=".12"/>';
    } else if (ph === 2) {
      if (p < .15) { tx = lerp(MAIN[0] + 10, Math.cos(a0) * RX, p / .15); ty = lerp(MAIN[1], Math.sin(a0) * RX, p / .15); tools += thru(MAIN, tx, ty, 1.8) + '<path d="M' + tx + ' ' + ty + ' l0 5" stroke="#d7dde3" stroke-width="1.6"/>'; }
      else { var ta2 = a0 + rx * 6.283; tx = Math.cos(ta2 - .25) * (RX - 4); ty = Math.sin(ta2 - .25) * (RX - 4); tools += thru(MAIN, tx - 2, ty - 3, 1.8, 40) + thru(MAIN, tx + 2, ty + 3, 1.8, 40); }
    } else if (ph === 5) {
      var qa = p < .3 ? 0 : Math.floor(cl((p - .3) / .7) * 4 - .001) * Math.PI / 2 + Math.PI / 2;
      tx = p < .3 ? lerp(-20, 22, cl(p / .3)) : Math.cos(qa) * 16; ty = p < .3 ? 0 : Math.sin(qa) * 16;
      tools += thru(MAIN, tx, ty, 4.2, 26) + '<path d="M' + tx + ' ' + ty + ' l-6 -1" stroke="#ffffff" stroke-width="2.2"/>' + thru(SIDE, -tx * .5 + 6, -ty * .5 - 4, 1.8) ;
    } else if (ph === 6 || ph === 8) {
      var sw = ph === 6 ? p * 6.283 : p * 4; tx = Math.cos(sw) * (ph === 6 ? RX - 2 : 20); ty = Math.sin(sw) * (ph === 6 ? RX - 2 : 20);
      tools += thru(MAIN, tx, ty, 3.6) + '<circle cx="' + tx + '" cy="' + ty + '" r="1.4" fill="#2a2a2a"/>';
    } else if (ph === 7 && p < .8) {
      tools += thru(MAIN, MAIN[0] + 8, MAIN[1] + 2, 9, 30);
    }
    return '<g clip-path="url(#hsPupC)">' + under + over + '</g><use href="#hsIris"/>' +
      (ovd > 0 ? '<circle r="' + (RL - 1) + '" fill="#d8ecff" opacity="' + (.07 * ovd) + '"/>' : '') + wounds + tools + '<use href="#hsGlint"/>';
  }
  function eyeView(ph, p, t) {
    var jx = Math.sin(t * 1.7) * .8, jy = Math.cos(t * 1.3) * .6;
    return '<g transform="translate(' + (222 + jx).toFixed(1) + ' ' + (131 + jy).toFixed(1) + ')">' + FIELD + surg(ph, p) + HOOKS + '</g>';
  }
  function miniEye(cx, cy, s, rxp, dr, ox, oy) { /* one past case: same eye, slightly different rhexis size and centring */
    var C = 2 * Math.PI * (RX + dr);
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')"><g clip-path="url(#hsMiniC)"><use href="#hsBack"/><g clip-path="url(#hsPupC)"><circle r="' + RN + '" fill="url(#hsNuc)"/>' +
      '<circle cx="' + ox + '" cy="' + oy + '" r="' + (RX + dr) + '" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2" stroke-dasharray="' + (C * rxp).toFixed(1) + ' ' + (C + 1).toFixed(1) + '" transform="rotate(-100 ' + ox + ' ' + oy + ')"/></g><use href="#hsIris"/><use href="#hsGlint"/></g></g>';
  }
  function phaseAt(f) { for (var i = PH.length - 1; i >= 0; i--) if (f >= PH[i][3]) return [i, cl((f - PH[i][3]) / PH[i][1])]; return [0, 0]; }

  var defs = '<defs>' + EYEDEFS +
    '<pattern id="hsDrape" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#2c8466"/><circle cx="4.5" cy="4.5" r="1.7" fill="#63c9a2"/></pattern>' +
    '<clipPath id="hsMiniC" clipPathUnits="userSpaceOnUse"><rect x="-120" y="-110" width="240" height="220" rx="8"/></clipPath></defs>';
  var box = document.createElement('div');
  box.style.cssText = 'position:relative;width:720px;height:430px;flex-shrink:0;font-family:' + SANS + ';color:' + TXT;
  box.innerHTML =
    '<div data-k="head" style="position:absolute;left:0;right:0;top:8px;text-align:center;font-size:20px;font-weight:600;color:#f2f2ee"></div>' +
    '<div style="position:absolute;left:8px;right:8px;top:42px;bottom:6px;background:' + BG + ';border:1px solid ' + LINE + ';border-radius:10px;overflow:hidden">' +
      '<div style="height:34px;display:flex;align-items:center;gap:8px;padding:0 12px;border-bottom:1px solid ' + LINE + '">' +
        '<span style="width:20px;height:20px;border-radius:5px;background:' + BLUE + ';display:flex;align-items:center;justify-content:center"><span style="width:8px;height:8px;border:2px solid #fff;border-radius:50%"></span></span>' +
        '<span style="font-weight:700;font-size:15px">Hindsight</span><span style="font-size:10px;letter-spacing:.12em;color:' + DIM + '">SURGICAL REVIEW</span>' +
        '<span data-k="crumb" style="margin-left:14px;font-size:15px;font-weight:600"></span>' +
        '<span data-k="chip" style="margin-left:auto;font-size:12px;font-weight:700;padding:2px 10px;border-radius:10px"></span></div>' +
      '<svg data-k="vid" viewBox="0 0 444 262" style="position:absolute;left:10px;top:44px;width:444px;height:262px;border-radius:6px;background:#0d0d0d">' + defs + '<g data-k="vg"></g></svg>' +
      '<div data-k="tag" style="position:absolute;left:18px;top:52px;font-family:' + MONO + ';font-size:12px;color:#fff;background:rgba(0,0,0,.6);border-left:3px solid ' + BLUE + ';padding:3px 8px"></div>' +
      '<div data-k="side" style="position:absolute;left:466px;right:10px;top:44px;bottom:10px;background:' + PANEL + ';border-radius:6px;padding:10px 12px;font-size:13px;overflow:hidden"></div>' +
      '<div style="position:absolute;left:10px;top:314px;width:444px;display:flex;align-items:center;gap:10px">' +
        '<span style="width:26px;height:26px;border-radius:50%;background:' + BLUE + ';display:flex;align-items:center;justify-content:center"><span style="width:0;height:0;border-left:9px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent;margin-left:2px"></span></span>' +
        '<span data-k="time" style="font-family:' + MONO + ';font-size:13px"></span><span data-k="ai" style="margin-left:auto;font-size:12px;font-weight:700"></span></div>' +
      '<div data-k="tl" style="position:absolute;left:10px;top:348px;width:444px;height:26px;background:#181816;border-radius:3px"></div>' +
    '</div>';
  frame.innerHTML = ''; frame.appendChild(box);
  var el = {}; Array.prototype.forEach.call(box.querySelectorAll('[data-k]'), function (n) { el[n.dataset.k] = n; });
  function fit() { var s = Math.min(frame.clientWidth / 720, frame.clientHeight / 430); box.style.transform = 'scale(' + s + ')'; }
  fit();

  function row(dot, name, right, dim) {
    return '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid ' + LINE + ';' + (dim ? 'opacity:.35' : '') + '"><span style="width:9px;height:9px;border-radius:2px;background:' + dot + ';flex-shrink:0"></span><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + name + '</span><span style="font-family:' + MONO + ';font-size:12px;color:' + DIM + '">' + right + '</span></div>';
  }
  function bar(f, col) { return '<div style="height:5px;background:#33332f;border-radius:3px;margin:3px 0 2px"><div style="height:5px;width:' + (f * 100) + '%;background:' + col + ';border-radius:3px"></div></div>'; }
  function timeline(f, hi) {
    var h = '';
    PH.forEach(function (p, i) {
      var vis = cl((f - p[3]) / p[1]); if (vis <= 0) return;
      h += '<div style="position:absolute;top:3px;height:20px;left:' + (p[3] * 100) + '%;width:' + (p[1] * vis * 100) + '%;background:' + p[2] + ';opacity:' + (hi == null || hi === i ? 1 : .3) + ';overflow:hidden;font-size:10px;font-weight:700;color:#1a1a1a;line-height:20px;padding-left:3px;box-sizing:border-box;white-space:nowrap">' + (p[1] > .09 ? p[0] : '') + '</div>';
    });
    if (hi == null) h += '<div style="position:absolute;top:-4px;bottom:-4px;width:2px;background:#fff;left:' + (f * 100) + '%"></div>';
    return h;
  }

  function draw(t) {
    var vg = '', side = '', tag = '', time = '', ai = '', head, chip, crumb, tl;
    if (t < T1) { /* 1. sync from thumb drive */
      var u = t / T1;
      head = '1. Plug in the thumb drive: new cases copy in by themselves';
      crumb = 'Case Files'; chip = 'USB connected';
      var x = 150 + 60 * (1 - ease(u * 2));
      vg = '<rect x="0" y="0" width="444" height="262" fill="#141413"/>' +
        '<rect x="' + (x - 40) + '" y="104" width="80" height="54" rx="8" fill="#3d3d39"/><rect x="' + (x + 40) + '" y="116" width="34" height="30" fill="#b8bcc2"/><rect x="' + (x + 48) + '" y="123" width="6" height="6" fill="#55595e"/><rect x="' + (x + 60) + '" y="123" width="6" height="6" fill="#55595e"/>' +
        '<text x="' + x + '" y="136" text-anchor="middle" font-size="12" fill="' + DIM + '" font-family="' + SANS + '">OR recorder</text>' +
        '<rect x="290" y="70" width="110" height="122" rx="8" fill="none" stroke="' + LINE + '"/><text x="345" y="186" text-anchor="middle" font-size="11" fill="' + DIM + '" font-family="' + SANS + '">This computer</text>';
      for (var d = 0; d < 3; d++) { var dx = ((u * 3 + d / 3) % 1); if (u > .15 && u < .9) vg += '<rect x="' + (250 + 40 * dx) + '" y="126" width="8" height="10" rx="1" fill="' + BLUE + '" opacity="' + (1 - dx) + '"/>'; }
      side = '<div style="font-weight:700;font-size:14px;margin-bottom:6px">Importing from USB</div>';
      ['Case 1 · 15:32', 'Case 2 · 09:21', 'Case 3 · 12:08'].forEach(function (n, i) {
        var f = cl((u - .12 - i * .25) / .25);
        side += '<div style="margin-top:8px;font-size:13px;display:flex;justify-content:space-between"><span>' + n + '</span><span style="color:' + (f >= 1 ? '#7bc67e' : DIM) + '">' + (f >= 1 ? '✓ copied' : f > 0 ? Math.round(f * 100) + '%' : 'waiting') + '</span></div>' + bar(f, f >= 1 ? '#7bc67e' : BLUE);
      });
      side += '<div style="margin-top:14px;color:' + DIM + ';font-size:12px;line-height:1.35">100% local: videos and data never leave this computer</div>';
      time = '00:00 / 15:32'; tl = '';
    } else if (t < T2) { /* 2. phase detection */
      var f = (t - T1) / (T2 - T1), pa = phaseAt(f);
      head = '2. Each phase is found automatically';
      crumb = 'Review'; chip = 'Detecting phases';
      vg = eyeView(pa[0], pa[1], t);
      tag = PH[pa[0]][0]; time = mmss(f * CASE_MIN) + ' / 15:32'; ai = '<span style="color:#5ec4c0">● AI ' + Math.round(f * 100) + '%</span>';
      side = '<div style="font-weight:700;font-size:14px;margin-bottom:4px">Phases</div>';
      PH.forEach(function (p, i) { var done = f >= p[3] + p[1] * .3; side += row(p[2], (i + 1) + '. ' + p[0], done ? mmss(p[1] * CASE_MIN) : '…', !done); });
      tl = timeline(f);
    } else { /* 3. last 10 capsulorhexis */
      var g = (t - T2) / (T3 - T2);
      head = '3. Review in seconds: your last 10 capsulorhexis, side by side';
      crumb = 'Export Studio'; chip = 'Ready';
      vg = '<rect x="0" y="0" width="444" height="262" fill="#141413"/>';
      var DR = [0, -3, 2, -1, 4, -2, 1, -4, 3, 0], OF = [[0, 0], [3, -2], [-2, 1], [1, 3], [-3, -1], [2, 2], [0, -3], [-1, 2], [3, 1], [-2, -2]];
      for (var i = 0; i < 10; i++) {
        var c = i % 5, r = i / 5 | 0, cx = 46 + c * 88, cy = 80 + r * 118, pr = cl(g * 1.6 - i * .04 - (i % 3) * .05), op = cl(g * 8 - i * .5);
        vg += '<g opacity="' + op + '"><rect x="' + (cx - 42) + '" y="' + (cy - 52) + '" width="84" height="104" rx="4" fill="url(#hsDrape)"/>' + miniEye(cx, cy - 6, .34, pr, DR[i], OF[i][0], OF[i][1]) +
          '<text x="' + cx + '" y="' + (cy + 46) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="' + SANS + '">' + CASES[i] + '</text></g>';
      }
      tag = 'Capsulorhexis · 10 cases'; time = '10 clips · 7:48 total';
      var ex = cl((g - .45) / .4);
      side = '<div style="font-weight:700;font-size:14px;margin-bottom:6px">Export Studio</div>' +
        row('#e5c07b', 'Phase: Capsulorhexis', '') + row(BLUE, 'Cases: my last 10', '') + row('#9a9a94', 'Layout: side by side', '') +
        '<div style="margin-top:14px;height:34px;border-radius:6px;background:' + (ex >= 1 ? '#2e5b37' : BLUE) + ';color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">' +
        (ex > 0 && ex < 1 ? '<span style="position:absolute;left:0;top:0;bottom:0;width:' + (ex * 100) + '%;background:rgba(255,255,255,.22)"></span>' : '') +
        '<span style="position:relative">' + (ex >= 1 ? '✓ Saved for feedback' : ex > 0 ? 'Exporting ' + Math.round(ex * 100) + '%' : 'Export 10 clips') + '</span></div>' +
        '<div style="margin-top:10px;color:' + DIM + ';font-size:12px;line-height:1.35">Compare technique across cases, or send to your supervisor for feedback</div>';
      tl = timeline(1, 2);
    }
    el.head.textContent = head; el.crumb.textContent = crumb;
    el.chip.textContent = chip; el.chip.style.background = chip === 'Detecting phases' ? '#1f3b3a' : chip === 'Ready' ? '#1d2f45' : '#3a321c';
    el.chip.style.color = chip === 'Detecting phases' ? '#5ec4c0' : chip === 'Ready' ? '#7fb4f0' : '#e6c27a';
    el.vg.innerHTML = vg; el.side.innerHTML = side; el.tag.textContent = tag; el.tag.style.display = tag ? '' : 'none';
    el.time.textContent = time; el.ai.innerHTML = ai; el.tl.innerHTML = tl;
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { draw(T2 - .01); return function () {}; }
  var t0 = performance.now(), id = setInterval(function () { draw(((performance.now() - t0) / 1000) % L); }, 50);
  draw(0); window.addEventListener('resize', fit);
  return function () { clearInterval(id); window.removeEventListener('resize', fit); };
};
