/* Coded animations. Each one draws into a 720 x 430 box that is scaled to fit the figure frame.
   window.ANIMS[name](frameElement) starts it and returns a function that stops it. */
window.ANIMS = {};

/* Defocus curve on three linked screens, redrawn from the real application's workflow:
   randomised lens order, a tap to confirm each lens, letters read, a live curve, and the
   "stands out from its neighbours" check. Values are illustrative. */
window.ANIMS.defocus = function (frame) {
  var SANS = "'Source Sans 3','Sarabun',Arial,sans-serif";
  var LENS = [1.5, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0];
  var LET = { '1.5': 38, '1': 46, '0.5': 54, '0': 58, '-0.5': 55, '-1': 51, '-1.5': 50, '-2': 49, '-2.5': 50, '-3': 46, '-3.5': 38, '-4': 30 };
  var ORDER = [-2.0, 1.0, -3.5, -0.5, 1.5, -1.5, -4.0, -2.5, 0.5, -3.0, -1.0];   /* 0.00 is copied, not measured */
  var TYPO = 7, WRONG = 15, N = ORDER.length;
  function fd(d) { return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d).toFixed(2); }
  function px(d) { return 34 + (1.5 - d) / 5.5 * 222; }
  function py(n) { return 12 + (70 - n) / 60 * 92; }
  var grid = '', xl = '';
  [1, 0, -1, -2, -3, -4].forEach(function (d) {
    grid += '<path d="M' + px(d) + ' 104 v4" stroke="#16181c" stroke-width="1"/>';
    xl += '<text x="' + px(d) + '" y="120" text-anchor="middle">' + (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + '</text>';
  });
  [[-1.5, '66 cm'], [-3.0, '33 cm']].forEach(function (m) {
    grid += '<path d="M' + px(m[0]) + ' 12 V104" stroke="#52606d" stroke-width="1" stroke-dasharray="3 3"/><text x="' + (px(m[0]) + 3) + '" y="20" font-size="9">' + m[1] + '</text>';
  });
  var dev = 'position:absolute;box-sizing:border-box;background:#25282B;';
  var scr = 'position:absolute;background:#ffffff;color:#16181c;overflow:hidden;font-family:' + SANS + ';';
  var lab = 'position:absolute;top:366px;text-align:center;font-family:' + SANS + ';font-size:18px;font-weight:700;color:#16181c;line-height:1.15';
  var sub = 'display:block;font-weight:400;font-size:15px;color:#4a4f57';
  var cap = 'font-size:13px;color:#4a4f57;line-height:1.2';
  frame.innerHTML =
    '<div style="position:relative;width:720px;height:430px;flex-shrink:0;transform-origin:center center">' +
    '<div data-k="head" style="position:absolute;left:0;right:0;top:16px;text-align:center;font-family:' + SANS + ';font-size:21px;font-weight:600;color:#16181c"></div>' +
    /* tablet: optometrist */
    '<div style="' + dev + 'left:14px;top:62px;width:230px;height:290px;border-radius:16px">' +
      '<div style="' + scr + 'left:9px;top:9px;right:9px;bottom:9px;border-radius:6px;padding:13px 15px;display:flex;flex-direction:column">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;' + cap + '"><span style="background:#14171b;color:#ffffff;font-weight:700;padding:1px 7px;border-radius:3px">Both eyes</span><span data-k="tstep"></span></div>' +
        '<div style="margin-top:10px;font-size:36px;font-weight:700;line-height:1.05"><span data-k="tdef"></span><span style="font-size:18px;font-weight:600"> D</span></div>' +
        '<div data-k="tbtn" style="margin-top:8px;height:36px;box-sizing:border-box;border:2px solid #a3245c;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;white-space:nowrap"></div>' +
        '<div style="margin-top:12px;' + cap + '">Letters read</div>' +
        '<div data-k="tbox" style="margin-top:3px;height:48px;box-sizing:border-box;border:2px solid #a9b1ba;border-radius:6px;display:flex;align-items:baseline;padding:4px 12px 0;font-size:32px;font-weight:700;line-height:1.2"><span data-k="tva"></span><span data-k="tunit" style="font-size:14px;font-weight:400;color:#4a4f57;margin-left:6px">letters</span></div>' +
        '<div data-k="tmsg" style="margin-top:8px;font-size:14px;line-height:1.22;min-height:52px"></div>' +
      '</div></div>' +
    /* phone: assistant (visit board: status and time only) */
    '<div style="' + dev + 'left:258px;top:72px;width:140px;height:280px;border-radius:18px">' +
      '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:7px;border-radius:11px;padding:14px 9px 10px;display:flex;flex-direction:column;background:#eef1f3">' +
        '<div style="font-size:13px;font-weight:700">Today’s visits</div>' +
        '<div style="margin-top:8px;background:#ffffff;border:1px solid #c9d0d6;border-left:4px solid #1d4f91;border-radius:8px;padding:8px 8px 9px;display:flex;flex-direction:column">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:700"><span style="white-space:nowrap">No. 014</span><span style="font-size:11px;font-weight:600;background:#1d4f91;color:#ffffff;border-radius:3px;padding:0 5px">mine</span></div>' +
          '<div data-k="pclock" style="margin-top:6px;font-size:27px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums"></div>' +
          '<div style="font-size:11px;color:#4a4f57;margin-top:2px">active time</div>' +
          '<div style="margin-top:8px;font-size:13px;font-weight:600;line-height:1.15;white-space:nowrap">Defocus curve</div>' +
          '<div style="font-size:12px;color:#4a4f57">on the tablet</div>' +
          '<div data-k="pstep" style="margin-top:6px;font-size:12px;color:#4a4f57"></div>' +
        '</div>' +
        '<div data-k="pflag" style="margin-top:8px;font-size:12px;line-height:1.2;text-align:center;padding:5px 2px;border-radius:6px;box-sizing:border-box"></div>' +
      '</div></div>' +
    /* laptop: principal investigator */
    '<div style="' + dev + 'left:418px;top:142px;width:284px;height:198px;border-radius:10px 10px 0 0">' +
      '<div style="' + scr + 'left:8px;top:8px;right:8px;bottom:8px;padding:8px 8px 4px;display:flex;flex-direction:column">' +
        '<div style="display:flex;justify-content:space-between;font-size:13px;line-height:1.2;color:#52606d;border-bottom:2px solid #2f4a6d;padding-bottom:3px"><span style="color:#2f4a6d;font-weight:700">No. 014, defocus curve</span><span data-k="lcount"></span></div>' +
        '<svg viewBox="0 0 264 126" style="flex:1 1 0;min-height:0;width:100%;margin-top:2px;font-family:' + SANS + ';font-size:10px;fill:#4a4f57">' +
          '<rect x="' + px(-1.0) + '" y="8" width="' + (px(-2.0) - px(-1.0)) + '" height="96" fill="#e8f1fb"/><path d="M34 8 V104 H258" fill="none" stroke="#1f2933" stroke-width="1"/>' + grid + xl +
          '<text x="30" y="16" text-anchor="end">70</text><text x="30" y="62" text-anchor="end">40</text><text x="30" y="107" text-anchor="end">10</text>' +
          '<g data-k="segs"></g><g data-k="pts"></g>' +
        '</svg>' +
        '<div data-k="lmsg" style="font-size:12px;line-height:1.2;min-height:15px;color:#4a4f57"></div>' +
      '</div></div>' +
    '<div style="position:absolute;left:404px;top:340px;width:312px;height:12px;background:#25282B;border-radius:0 0 10px 10px"></div>' +
    '<div style="' + lab + ';left:14px;width:230px">Optometrist<span style="' + sub + '">enters each reading</span></div>' +
    '<div style="' + lab + ';left:244px;width:168px">Assistant<span style="' + sub + '">follows visit status</span></div>' +
    '<div style="' + lab + ';left:404px;width:312px">Principal investigator<span style="' + sub + '">sees the curve and quality flags</span></div>' +
    '</div>';
  var box = frame.firstChild, el = {};
  [].forEach.call(box.querySelectorAll('[data-k]'), function (n) { el[n.getAttribute('data-k')] = n; });
  function fit() { var s = Math.min(frame.clientWidth / 720, frame.clientHeight / 430); box.style.transform = 'scale(' + s + ')'; }
  fit();

  /* timeline: one state per tick */
  var T = [];
  function push(s, n) { for (var k = 0; k < (n || 1); k++) T.push(s); }
  for (var i = 0; i < N; i++) {
    var ok = LET[String(ORDER[i])];
    push({ i: i, inp: false, va: null, msg: 'Change the lens, then confirm it is in the frame.', done: i }, 3);
    push({ i: i, inp: true, va: null, msg: 'Enter the letters read.', done: i }, 2);
    if (i === TYPO) {
      push({ i: i, inp: true, va: WRONG, flag: true, msg: 'This lens stands out from its neighbours. Check the lens power and sign.', done: i + 1, wrong: true }, 12);
      push({ i: i, inp: true, va: ok, msg: 'Re-measured and saved.', done: i + 1, fixed: true }, 6);
    } else {
      push({ i: i, inp: true, va: ok, msg: 'Saved.', done: i + 1 }, 3);
    }
  }
  push({ i: N - 1, inp: true, va: LET[String(ORDER[N - 1])], msg: 'All 11 lenses measured. Check the graph, then finish.', done: N, end: true }, 18);

  var tick = 0;
  function clock() { var sec = 38 * 60 + 12 + Math.floor(tick * 0.22); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function draw(s) {
    var lens = ORDER[s.i];
    el.head.textContent = s.end ? 'Defocus curve complete: 11 lenses measured' : 'Measuring a defocus curve: lens ' + (s.i + 1) + ' of ' + N + ', in random order';
    el.tstep.textContent = 'Lens ' + (s.i + 1) + ' of ' + N;
    el.tdef.textContent = fd(lens);
    el.tbtn.textContent = s.inp ? 'Lens in the frame ✓' : 'Lens ' + fd(lens) + ' is in the frame';
    el.tbtn.style.background = s.inp ? '#e1f0e6' : '#a3245c';
    el.tbtn.style.borderColor = s.inp ? '#2b6b45' : '#a3245c';
    el.tbtn.style.color = s.inp ? '#2b6b45' : '#ffffff';
    el.tva.textContent = s.va == null ? '–' : s.va;
    el.tva.style.color = s.va == null ? '#b9bec6' : '#16181c';
    el.tunit.style.visibility = s.va == null ? 'hidden' : 'visible';
    el.tbox.style.borderWidth = s.flag ? '4px' : '2px';
    el.tbox.style.borderColor = s.flag ? '#d98e10' : '#a9b1ba';
    el.tbox.style.background = s.flag ? '#fdf0d3' : '#ffffff';
    el.tmsg.textContent = s.msg;
    el.tmsg.style.fontWeight = s.flag ? '700' : '400';
    el.tmsg.style.color = s.flag ? '#7d4c00' : (s.va != null ? '#2b6b45' : '#434a53');
    el.pclock.textContent = clock();
    el.pstep.textContent = 'Lens ' + (s.i + 1) + ' of ' + N;
    el.pflag.textContent = s.flag ? '1 flag open' : 'No open flags';
    el.pflag.style.fontWeight = s.flag ? '700' : '400';
    el.pflag.style.background = s.flag ? '#fdf0d3' : '#e3f1e9';
    el.pflag.style.color = s.flag ? '#7f5300' : '#22704a';
    /* curve: 0.00 is always present (copied from distance acuity); measured lenses appear in random order */
    var have = { '0': LET['0'] };
    for (var k = 0; k < s.done; k++) have[String(ORDER[k])] = (s.wrong && k === TYPO) ? WRONG : LET[String(ORDER[k])];
    var segs = '', pts = '';
    for (var j = 0; j < LENS.length; j++) {
      var a = String(LENS[j]), b = j + 1 < LENS.length ? String(LENS[j + 1]) : null;
      if (b != null && have[a] != null && have[b] != null) segs += '<path d="M' + px(LENS[j]).toFixed(1) + ' ' + py(have[a]).toFixed(1) + ' L' + px(LENS[j + 1]).toFixed(1) + ' ' + py(have[b]).toFixed(1) + '" stroke="#2a78d6" stroke-width="2" fill="none"/>';
      if (have[a] == null) continue;
      var cx = px(LENS[j]), cy = py(have[a]);
      if (LENS[j] === 0) pts += '<rect x="' + (cx - 3.2).toFixed(1) + '" y="' + (cy - 3.2).toFixed(1) + '" width="6.4" height="6.4" fill="#ffffff" stroke="#2a78d6" stroke-width="1.6"/>';
      else {
        if (s.wrong && LENS[j] === ORDER[TYPO]) pts += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="8" fill="none" stroke="#b42318" stroke-width="1.8"/>';
        pts += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="3.4" fill="#2a78d6"/>';
      }
    }
    el.segs.innerHTML = segs; el.pts.innerHTML = pts;
    el.lcount.textContent = (s.done + 1) + ' of 12 points';
    var after = s.i > TYPO || s.fixed;
    el.lmsg.textContent = s.flag ? 'Quality flag open: lens ' + fd(ORDER[TYPO]) + ' stands out' : (after ? '1 flag raised and resolved during the visit' : 'No open flags. Square: 0.00 D, copied');
    el.lmsg.style.fontWeight = s.flag ? '700' : '400';
    el.lmsg.style.color = s.flag ? '#b42318' : (after ? '#276749' : '#52606d');
  }
  draw(T[0]);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { draw(T[T.length - 1]); return function () {}; }
  var id = setInterval(function () { tick = (tick + 1) % T.length; draw(T[tick]); }, 220);
  window.addEventListener('resize', fit);
  return function () { clearInterval(id); window.removeEventListener('resize', fit); };
};
