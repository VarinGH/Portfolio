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
