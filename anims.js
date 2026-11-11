/* Coded animations. Each one draws into a 720 x 470 box that is scaled to fit the figure frame.
   window.ANIMS[name](frameElement) starts it and returns a function that stops it. */
window.ANIMS = {};

/* Defocus curve on three linked screens. The screens follow the real application's design:
   its type (Sarabun), colours, components and wording. Values are illustrative. No product names. */
window.ANIMS.defocus = function (frame) {
  var F = "'Sarabun UI','Sarabun',sans-serif";
  var LENS = [1.5, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0];
  var LET = { '1.5': 38, '1': 46, '0.5': 54, '0': 58, '-0.5': 55, '-1': 51, '-1.5': 50, '-2': 49, '-2.5': 50, '-3': 46, '-3.5': 38, '-4': 30 };
  var ORDER = [-2.0, 1.0, -3.5, -0.5, 1.5, -1.5, -4.0, -2.5, 0.5, -3.0, -1.0];
  var START = 5, TYPO = 7, WRONG = 30, N = ORDER.length;
  var MINUS = '−';
  function fd(d) { return (d > 0 ? '+' : d < 0 ? MINUS : '') + Math.abs(d).toFixed(2); }
  function lm(n) { return 1.1 - 0.02 * n; }
  var CW = 236, CH = 112, PL = 24, PR = 6, PT = 14, PB = 16;
  function px(d) { return PL + (1.5 - d) / 5.5 * (CW - PL - PR); }
  function py(v) { return PT + (v + 0.1) / 0.7 * (CH - PT - PB); }

  /* tokens from the three apps */
  var T = { ink: '#14171b', ink2: '#434a53', ink3: '#5c636d', rule: '#d3d8dd', ruleS: '#a9b1ba', sheet2: '#f5f6f7', action: '#a3245c', actionTint: '#f7e4ed', ok: '#2b6b45', okTint: '#e1f0e6', caution: '#7d4c00', cautionRing: '#d98e10', cautionTint: '#fdf0d3' };
  var P = { ground: '#eef1f3', rule: '#d5dbe0', ink: '#16212b', ink2: '#46535f', ink3: '#66727d', pen: '#1d4f91', penTint: '#e5edf8', warn: '#7f5300', warnTint: '#fdf0d3' };
  var I = { shell: '#f3f4f6', ink: '#1f2933', muted: '#52606d', rule: '#cbd2d9', grid: '#e4e7eb', navy: '#2f4a6d', navySoft: '#e6ecf3', dc: '#2a78d6', confirm: '#8a5a12', confirmBg: '#fdf3e1', block: '#b42318', ok: '#276749', okBg: '#e7f4ec' };
  var tr = 'transition:background-color .28s ease,border-color .28s ease,color .28s ease,opacity .28s ease,transform .28s cubic-bezier(.2,.8,.2,1);';
  var dev = 'position:absolute;box-sizing:border-box;background:#1d2024;';
  var scr = 'position:absolute;overflow:hidden;font-family:' + F + ';';
  var lab = 'position:absolute;top:404px;text-align:center;font-family:' + F + ';font-size:18px;font-weight:600;color:#16181c;line-height:1.2';
  var sub = 'display:block;font-weight:400;font-size:15px;color:#4a4f57';

  var chips = '<div style="' + chipBase() + 'border-style:dashed;color:' + T.ink3 + '"><b style="font-weight:500">0.00</b><i style="font-style:normal">58</i></div>';
  function chipBase() { return 'display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;height:25px;border-radius:5px;border:1.2px solid ' + T.rule + ';background:#fff;font-size:8.5px;line-height:1.15;font-variant-numeric:tabular-nums;' + tr; }
  ORDER.forEach(function (d, k) { chips += '<div data-c="' + k + '" style="' + chipBase() + '"><b style="font-weight:500">' + fd(d) + '</b><i data-ci="' + k + '" style="font-style:normal;color:' + T.ink3 + ';min-height:10px"></i></div>'; });

  var grid = '<rect x="' + px(-0.5) + '" y="' + PT + '" width="' + (px(-2.0) - px(-0.5)) + '" height="' + (CH - PT - PB) + '" fill="#eef3f9"/>';
  [0, 0.2, 0.4, 0.6].forEach(function (v) { grid += '<path d="M' + PL + ' ' + py(v) + ' H' + (CW - PR) + '" stroke="' + I.grid + '" stroke-width="1"/><text x="' + (PL - 4) + '" y="' + (py(v) + 2.6) + '" text-anchor="end">' + v.toFixed(1) + '</text>'; });
  grid += '<path d="M' + PL + ' ' + py(0.2) + ' H' + (CW - PR) + '" stroke="' + I.muted + '" stroke-width=".8" stroke-dasharray="4 3"/><path d="M' + PL + ' ' + py(0.3) + ' H' + (CW - PR) + '" stroke="' + I.muted + '" stroke-width=".8" stroke-dasharray="1 3"/>';
  [1, 0, -1, -2, -3, -4].forEach(function (d) { grid += '<text x="' + px(d) + '" y="' + (CH - 4) + '" text-anchor="middle">' + (d > 0 ? '+' : d < 0 ? MINUS : '') + Math.abs(d) + '</text>'; });
  [['far', 0.5], ['intermediate', -1.25], ['near', -3.0]].forEach(function (b) { grid += '<text x="' + px(b[1]) + '" y="' + (PT - 4) + '" text-anchor="middle" font-size="7">' + b[0] + '</text>'; });
  var marks = '';
  for (var j = 0; j < LENS.length - 1; j++) marks += '<line data-s="' + j + '" stroke="' + I.dc + '" stroke-width="1.8" stroke-linecap="round" opacity="0"/>';
  marks += '<circle data-ring="1" r="7.5" fill="none" stroke="' + I.block + '" stroke-width="1.6" opacity="0"/>';
  for (j = 0; j < LENS.length; j++) marks += LENS[j] === 0 ? '<rect data-p="' + j + '" width="6" height="6" fill="#fff" stroke="' + I.dc + '" stroke-width="1.5"/>' : '<circle data-p="' + j + '" r="0" fill="' + I.dc + '"/>';

  frame.innerHTML =
    '<div style="position:relative;width:720px;height:470px;flex-shrink:0;transform-origin:center center">' +
    '<div data-k="head" style="position:absolute;left:0;right:0;top:12px;text-align:center;font-family:' + F + ';font-size:21px;font-weight:600;color:#16181c"></div>' +

    /* tablet: optometrist */
    '<div style="' + dev + 'left:14px;top:50px;width:238px;height:340px;border-radius:17px">' +
     '<div style="' + scr + 'left:9px;top:9px;right:9px;bottom:9px;border-radius:7px;background:#fff;color:' + T.ink + ';padding:10px 12px;display:flex;flex-direction:column">' +
      '<div style="font-size:15px;font-weight:600;line-height:1.25">Defocus curve</div>' +
      '<div style="display:flex;align-items:center;gap:7px;margin-top:3px;font-size:9.5px;color:' + T.ink2 + '"><span style="padding:1px 6px;border-radius:4px;font-weight:600;background:' + T.actionTint + ';color:' + T.action + '">distance-corrected</span><span style="font-weight:600;color:' + T.ink + '">Both eyes open</span></div>' +
      '<div data-k="card" style="margin-top:8px;border:1.6px solid ' + T.ruleS + ';border-radius:9px;padding:6px 9px 9px;text-align:center;' + tr + '">' +
        '<div data-k="pos" style="font-size:10.5px;color:' + T.ink2 + '"></div>' +
        '<div style="font-size:36px;font-weight:600;line-height:1.1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;white-space:nowrap"><span data-k="lens" style="display:inline-block"></span><small style="font-size:16px;margin-left:3px;color:' + T.ink3 + ';letter-spacing:0">D</small></div>' +
        '<div style="position:relative;height:32px;margin-top:4px">' +
          '<div data-k="tap" style="position:absolute;left:0;top:0;right:0;bottom:0;border-radius:7px;background:' + T.action + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;white-space:nowrap;' + tr + '"></div>' +
          '<div data-k="in" style="position:absolute;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:5px;color:' + T.ok + ';font-size:12px;font-weight:600;opacity:0;' + tr + '"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Lens in the frame</div>' +
        '</div></div>' +
      '<div style="position:relative;height:50px;margin-top:6px">' +
        '<div data-k="wait" style="position:absolute;left:0;top:6px;right:0;font-size:10.5px;line-height:1.35;color:' + T.ink3 + ';' + tr + '">Confirm the lens above first, then enter the value</div>' +
        '<div data-k="ro" style="position:absolute;left:0;top:0;display:flex;align-items:baseline;gap:6px;opacity:0;' + tr + '"><span data-k="val" style="display:inline-block;font-size:44px;font-weight:600;line-height:1;font-variant-numeric:tabular-nums"></span><span style="font-size:11.5px;color:' + T.ink2 + '">letters of 70</span></div>' +
      '</div>' +
      '<div style="position:relative;height:40px;margin-top:2px">' +
        '<div data-k="save" style="position:absolute;left:0;top:0;right:0;height:32px;border-radius:7px;background:' + T.action + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;' + tr + '"></div>' +
        '<div data-k="flag" style="position:absolute;left:0;top:-2px;right:0;min-height:38px;box-sizing:border-box;border-radius:7px;background:' + T.cautionTint + ';border:1.4px solid ' + T.cautionRing + ';color:' + T.caution + ';padding:4px 8px;font-size:9.8px;line-height:1.3;font-weight:500;opacity:0;transform:translateY(4px);' + tr + '">This lens stands out from its neighbours. Check the lens power and sign.</div>' +
      '</div>' +
      '<div data-k="strip" style="margin-top:auto;font-size:9px;color:' + T.ink3 + '"></div>' +
      '<div style="margin-top:3px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px">' + chips + '</div>' +
     '</div></div>' +

    /* phone: assistant (the visit board: status and time only) */
    '<div style="' + dev + 'left:270px;top:64px;width:156px;height:326px;border-radius:20px">' +
     '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:7px;border-radius:13px;background:' + P.ground + ';color:' + P.ink + ';display:flex;flex-direction:column">' +
      '<div style="background:#fff;border-bottom:1px solid ' + P.rule + ';padding:9px 10px 6px"><div style="font-size:12px;font-weight:600;line-height:1.25">Today’s visits</div><div style="font-size:8.5px;color:' + P.ink2 + '">Friday 13 November</div></div>' +
      '<div style="padding:8px 7px 0;flex:1 1 0;min-height:0">' +
        '<div style="font-size:9px;font-weight:600;color:' + P.ink2 + ';margin:0 1px 4px">In progress <span style="font-weight:500;color:' + P.ink3 + '">1</span></div>' +
        '<div data-k="row" style="background:#fff;border:1px solid #9db5d6;border-radius:6px;padding:6px 8px 7px;' + tr + '">' +
          '<div style="display:flex;align-items:center;gap:5px"><span style="font-size:13px;font-weight:600;letter-spacing:.01em">014</span><span style="padding:0 5px;border-radius:3px;font-size:8px;font-weight:500;background:' + P.penTint + ';color:' + P.pen + '">Mine</span><span style="flex:1 1 auto"></span><span data-k="clock" style="font-size:11px;font-weight:500;font-variant-numeric:tabular-nums"></span></div>' +
          '<div style="font-size:9px;color:' + P.ink2 + ';margin-top:1px">Visit at 3 months</div>' +
          '<div style="font-size:9px;margin-top:4px;line-height:1.3">Now: Defocus curve on the tablet</div>' +
          '<div style="font-size:8.5px;color:' + P.ink2 + ';margin-top:3px">9 of 14 steps done</div>' +
          '<div data-k="pflag" style="font-size:8.5px;line-height:1.3;font-weight:500;color:' + P.warn + ';max-height:0;opacity:0;overflow:hidden;transition:max-height .35s ease,opacity .3s ease,margin-top .35s ease">1 waiting for the optometrist to confirm</div>' +
        '</div>' +
        '<div style="font-size:9px;font-weight:600;color:' + P.ink2 + ';margin:10px 1px 4px">Closed today <span style="font-weight:500;color:' + P.ink3 + '">1</span></div>' +
        '<div style="background:#f7f8f9;border:1px solid ' + P.rule + ';border-radius:6px;padding:6px 8px"><div style="display:flex;align-items:center"><span style="font-size:13px;font-weight:600">011</span><span style="flex:1 1 auto"></span><span style="font-size:11px;font-weight:500;color:' + P.ink3 + ';font-variant-numeric:tabular-nums">52:10</span></div><div style="font-size:9px;color:' + P.ink2 + ';margin-top:1px">Visit at 3 months <span style="color:' + P.ink3 + '">Closed</span></div></div>' +
        '<div style="font-size:8px;color:' + P.ink3 + ';text-align:center;margin-top:7px">Updated <span data-k="upd"></span></div>' +
      '</div>' +
      '<div style="background:#fff;border-top:1px solid ' + P.rule + ';padding:7px"><div style="height:30px;border-radius:6px;background:' + P.pen + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:600">Start a new visit</div></div>' +
     '</div></div>' +

    /* laptop: principal investigator (the dashboard sheet) */
    '<div style="' + dev + 'left:446px;top:176px;width:260px;height:202px;border-radius:10px 10px 0 0">' +
     '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:6px;background:' + I.shell + ';color:' + I.ink + ';display:flex;flex-direction:column">' +
      '<div style="background:#fff;border-bottom:1px solid ' + I.rule + ';display:flex;gap:9px;padding:0 8px;font-size:8.5px"><span style="padding:6px 0 4px">Participants</span><span style="padding:6px 0 3px;color:' + I.navy + ';font-weight:600;border-bottom:2px solid ' + I.navy + '">Dashboard</span><span style="padding:6px 0 4px">QC flags</span><span style="padding:6px 0 4px">Exports</span></div>' +
      '<div style="margin:6px;background:#fff;border:1px solid ' + I.rule + ';border-radius:3px;flex:1 1 0;min-height:0;display:flex;flex-direction:column">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 7px;border-bottom:1px solid ' + I.grid + '"><span style="font-size:9.5px;font-weight:600;color:' + I.navy + '">Defocus curve, both eyes (logMAR)</span><span data-k="tag" style="padding:0 5px;border-radius:2px;font-size:8px;line-height:13px;border:1px solid ' + I.rule + ';color:' + I.muted + ';background:#fff;white-space:nowrap;' + tr + '"></span></div>' +
        '<svg viewBox="0 0 ' + CW + ' ' + CH + '" style="flex:1 1 0;min-height:0;width:100%;font-family:' + F + ';font-size:7.5px;fill:' + I.muted + '">' + grid + marks + '</svg>' +
      '</div>' +
     '</div></div>' +
    '<div style="position:absolute;left:432px;top:378px;width:284px;height:11px;background:#1d2024;border-radius:0 0 10px 10px"></div>' +

    '<div style="' + lab + ';left:14px;width:238px">Optometrist<span style="' + sub + '">enters each reading</span></div>' +
    '<div style="' + lab + ';left:258px;width:180px">Assistant<span style="' + sub + '">follows visit status</span></div>' +
    '<div style="' + lab + ';left:428px;width:292px">Principal investigator<span style="' + sub + '">sees the curve and quality flags</span></div>' +
    '</div>';

  var box = frame.firstChild, el = {}, chipEl = [], chipVal = [], ptEl = [], segEl = [];
  [].forEach.call(box.querySelectorAll('[data-k]'), function (n) { el[n.getAttribute('data-k')] = n; });
  [].forEach.call(box.querySelectorAll('[data-c]'), function (n) { chipEl[+n.getAttribute('data-c')] = n; });
  [].forEach.call(box.querySelectorAll('[data-ci]'), function (n) { chipVal[+n.getAttribute('data-ci')] = n; });
  [].forEach.call(box.querySelectorAll('[data-p]'), function (n) { ptEl[+n.getAttribute('data-p')] = n; });
  [].forEach.call(box.querySelectorAll('[data-s]'), function (n) { segEl[+n.getAttribute('data-s')] = n; });
  var ring = box.querySelector('[data-ring]');
  function fit() { var s = Math.min(frame.clientWidth / 720, frame.clientHeight / 470); box.style.transform = 'scale(' + s + ')'; }
  fit();

  /* text that changes slides in rather than snapping */
  function swap(n, txt, dy) {
    if (n.textContent === String(txt)) return;
    n.textContent = txt;
    if (n.animate) n.animate([{ opacity: 0, transform: 'translateY(' + (dy || 7) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
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
    swap(el.head, s.ph === 'end' ? 'Defocus curve complete: all 11 lenses measured' : 'Measuring a defocus curve: lens ' + (s.i + 1) + ' of ' + N + ', in random order', 0);
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
    if (hasV) swap(el.val, s.va, 12); else if (isIn) el.val.textContent = '–';
    var flag = s.ph === 'flag';
    el.flag.style.opacity = flag ? 1 : 0; el.flag.style.transform = flag ? 'none' : 'translateY(4px)';
    el.save.style.opacity = flag ? 0 : (hasV ? 1 : .4);
    el.save.textContent = s.ph === 'saved' || s.ph === 'end' ? 'Saved' : (hasV ? 'Save ' + s.va + ' at ' + fd(lens) : 'Confirm the lens and enter a value');
    el.save.style.background = s.ph === 'saved' || s.ph === 'end' ? T.ok : T.action;
    if (s.ph !== prevPh) { if (s.ph === 'in') press(el.tap); if (s.ph === 'saved' || s.ph === 'flag') press(el.save); }
    el.strip.textContent = 'Lens order (' + s.done + ' of ' + N + ' measured)';
    for (var k = 0; k < N; k++) {
      var done = k < s.done, cur = k === s.i && s.ph !== 'end', fl = flag && k === TYPO;
      chipEl[k].style.background = fl ? T.cautionTint : (done ? T.sheet2 : '#fff');
      chipEl[k].style.borderColor = fl ? T.cautionRing : (cur ? T.action : T.rule);
      chipEl[k].style.boxShadow = cur && !fl ? 'inset 0 0 0 1px ' + T.action : 'none';
      var v = done ? ((s.wrong && k === TYPO) ? WRONG : LET[String(ORDER[k])]) : '';
      if (chipVal[k].textContent !== String(v)) swap(chipVal[k], v, 4);
    }
    el.pflag.style.maxHeight = flag ? '26px' : '0'; el.pflag.style.opacity = flag ? 1 : 0; el.pflag.style.marginTop = flag ? '3px' : '0';
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
  var d0 = new Date(); el.upd.textContent = ('0' + d0.getHours()).slice(-2) + ':' + ('0' + d0.getMinutes()).slice(-2);
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
  var CASE_MIN = 15.5, L = 17, T1 = 3.6, T2 = 11, T3 = 16;                      /* seconds */
  var CASES = ['12 Nov', '11 Nov', '7 Nov', '5 Nov', '4 Nov', '31 Oct', '29 Oct', '24 Oct', '22 Oct', '17 Oct'];
  var BG = '#262623', PANEL = '#1f1f1d', LINE = '#3a3a36', TXT = '#e8e8e4', DIM = '#9a9a94', BLUE = '#3b8beb';
  function mmss(m) { var s = Math.round(m * 60); return (s / 60 | 0) + ':' + ('0' + s % 60).slice(-2); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = cl(x); return x * x * (3 - 2 * x); }

  /* one eye, top view through the microscope. ph = phase index, p = progress 0..1 within it */
  function eye(cx, cy, R, ph, p, mini) {
    var k = R / 100, s = '';
    var nuc = ph < 4 ? 1 : ph === 4 ? 1 - ease(p) : 0;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (100 * k) + '" fill="url(#hsScl)"/>';
    if (!mini) s += '<path d="M' + (cx - 70 * k) + ' ' + (cy - 60 * k) + ' q30 20 50 8 M' + (cx + 40 * k) + ' ' + (cy + 70 * k) + ' q20 -10 34 -34 M' + (cx - 80 * k) + ' ' + (cy + 30 * k) + ' q16 6 26 22" stroke="#c96a6a" stroke-width="1.2" fill="none" opacity=".7"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (60 * k) + '" fill="#3f4c58"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (44 * k) + '" fill="url(#hsRef)"/>';
    if (nuc > 0) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (34 * k * (0.25 + .75 * nuc)) + '" fill="#c98a32" opacity="' + (0.35 + .5 * nuc) + '"/>';
    if (ph === 1 || ph === 2) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (40 * k * (ph === 1 ? ease(p) : 1)) + '" fill="#ffffff" opacity=".12"/>';
    if (ph >= 2) { /* capsulorhexis edge */
      var rp = ph === 2 ? ease(p) : 1, C = 2 * Math.PI * 30 * k;
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (30 * k) + '" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="' + (mini ? 1.4 : 2) + '" stroke-dasharray="' + (C * rp) + ' ' + C + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
    }
    if (ph === 3) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (34 * k * (0.7 + .3 * ((p * 3) % 1))) + '" fill="none" stroke="#9fe3ff" stroke-width="2" opacity="' + (1 - (p * 3) % 1) + '"/>';
    if (ph >= 6) { /* IOL unfolds */
      var q = ph === 6 ? ease(p) : 1;
      s += '<g opacity="' + q + '" transform="rotate(' + (-60 + 60 * q) + ' ' + cx + ' ' + cy + ')"><circle cx="' + cx + '" cy="' + cy + '" r="' + (26 * k) + '" fill="#dff3ff" fill-opacity=".22" stroke="#ffffff" stroke-opacity=".7" stroke-width="1.2"/>' +
        '<path d="M' + (cx + 22 * k) + ' ' + (cy - 12 * k) + ' q26 -10 18 -40 M' + (cx - 22 * k) + ' ' + (cy + 12 * k) + ' q-26 10 -18 40" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.6" fill="none"/></g>';
    }
    if (!mini) { /* instrument for the current phase */
      var tool = '#c9ced4', w = 5;
      if (ph === 0) { var a = ease(p); s += '<path d="M' + (cx - 150 + 80 * a) + ' ' + (cy - 70 + 30 * a) + ' l' + 50 + ' ' + 20 + '" stroke="' + tool + '" stroke-width="7" stroke-linecap="round"/>'; if (p > .5) s += '<path d="M' + (cx - 66) + ' ' + (cy - 36) + ' l10 6" stroke="#7a2a2a" stroke-width="3"/>'; }
      else {
        var ang = ph === 2 ? -Math.PI / 2 + 2 * Math.PI * ease(p) : Math.PI * 1.15, tip = ph === 2 ? 30 : ph === 4 ? 12 : 18;
        var tx = cx + Math.cos(ang) * tip, ty = cy + Math.sin(ang) * tip;
        s += '<path d="M' + (cx - 130) + ' ' + (cy - 40) + ' L' + (cx - 64) + ' ' + (cy - 30) + ' L' + tx + ' ' + ty + '" stroke="' + tool + '" stroke-width="' + (ph === 4 ? 9 : w) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        if (ph === 4) s += '<path d="M' + (cx + 130) + ' ' + (cy + 30) + ' L' + (cx + 60) + ' ' + (cy + 24) + ' L' + (cx + 14 * Math.cos(p * 30)) + ' ' + (cy + 10) + '" stroke="' + tool + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
      }
    }
    return s;
  }
  function phaseAt(f) { for (var i = PH.length - 1; i >= 0; i--) if (f >= PH[i][3]) return [i, cl((f - PH[i][3]) / PH[i][1])]; return [0, 0]; }

  var defs = '<defs><radialGradient id="hsRef" cx="45%" cy="42%" r="60%"><stop offset="0" stop-color="#ffb35c"/><stop offset=".7" stop-color="#e8862f"/><stop offset="1" stop-color="#b9561f"/></radialGradient>' +
    '<radialGradient id="hsScl" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#f1d3cb"/><stop offset="1" stop-color="#d79b92"/></radialGradient>' +
    '<pattern id="hsDrape" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#2f8a6a"/><circle cx="4" cy="4" r="1.6" fill="#5fc6a0"/></pattern></defs>';
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
      vg = '<rect x="0" y="0" width="444" height="262" fill="url(#hsDrape)"/><path d="M60 40 Q222 -10 384 40 L384 222 Q222 272 60 222 Z" fill="#e0b9a6" opacity=".35"/>' + eye(222, 131, 112, DRAW[pa[0]], pa[0] >= 8 ? 1 : pa[1]) +
        '<path d="M96 40 l40 34 M348 40 l-40 34 M96 222 l40 -34 M348 222 l-40 -34" stroke="#b7bcc2" stroke-width="5" fill="none" stroke-linecap="round"/>';
      tag = PH[pa[0]][0]; time = mmss(f * CASE_MIN) + ' / 15:32'; ai = '<span style="color:#5ec4c0">● AI ' + Math.round(f * 100) + '%</span>';
      side = '<div style="font-weight:700;font-size:14px;margin-bottom:4px">Phases</div>';
      PH.forEach(function (p, i) { var done = f >= p[3] + p[1] * .3; side += row(p[2], (i + 1) + '. ' + p[0], done ? mmss(p[1] * CASE_MIN) : '…', !done); });
      tl = timeline(f);
    } else { /* 3. last 10 capsulorhexis */
      var g = (t - T2) / (T3 - T2);
      head = '3. Review in seconds: your last 10 capsulorhexis, side by side';
      crumb = 'Export Studio'; chip = 'Ready';
      vg = '<rect x="0" y="0" width="444" height="262" fill="#141413"/>';
      for (var i = 0; i < 10; i++) {
        var c = i % 5, r = i / 5 | 0, cx = 46 + c * 88, cy = 80 + r * 118, pr = cl(g * 1.6 - i * .04 - (i % 3) * .05);
        vg += '<rect x="' + (cx - 42) + '" y="' + (cy - 54) + '" width="84" height="108" rx="4" fill="url(#hsDrape)" opacity="' + cl(g * 8 - i * .5) + '"/>' +
          '<g opacity="' + cl(g * 8 - i * .5) + '">' + eye(cx, cy - 6, 36, 2, pr, true) + '<text x="' + cx + '" y="' + (cy + 48) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="' + SANS + '">' + CASES[i] + '</text></g>';
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
