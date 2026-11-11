/* Coded animations. Each one draws into a 720 x 430 box that is scaled to fit the figure frame.
   window.ANIMS[name](frameElement) starts it and returns a function that stops it. */
window.ANIMS = {};
window.ANIMS.defocus = function (frame) {
  var SANS = "'Source Sans 3','Sarabun',Arial,sans-serif";
  var D = [1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0];
  var V = [0.20, 0.08, 0.00, 0.04, 0.10, 0.08, 0.12, 0.10, 0.22, 0.36, 0.50];
  var TYPO = 6, N = D.length;
  function fd(d) { return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d).toFixed(2); }
  function px(d) { return 30 + (1 - d) / 5 * 222; }
  function py(v) { return 14 + v / 0.6 * 92; }
  var ticks = '', xl = '';
  [1, 0, -1, -2, -3, -4].forEach(function (d) {
    ticks += '<path d="M' + px(d) + ' 106 v4" stroke="#16181c" stroke-width="1"/>';
    xl += '<text x="' + px(d) + '" y="122" text-anchor="middle">' + (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + '</text>';
  });
  var dev = 'position:absolute;box-sizing:border-box;background:#25282B;';
  var scr = 'position:absolute;background:#ffffff;color:#16181c;overflow:hidden;font-family:' + SANS + ';';
  var lab = 'position:absolute;top:366px;text-align:center;font-family:' + SANS + ';font-size:18px;font-weight:700;color:#16181c;line-height:1.15';
  var sub = 'display:block;font-weight:400;font-size:15px;color:#4a4f57';
  var cap = 'font-size:13px;color:#4a4f57;line-height:1.2';
  frame.innerHTML =
    '<div class="dfx" style="position:relative;width:720px;height:430px;flex-shrink:0;transform-origin:center center">' +
    /* tablet: optometrist */
    '<div style="' + dev + 'left:14px;top:62px;width:230px;height:290px;border-radius:16px">' +
      '<div style="' + scr + 'left:9px;top:9px;right:9px;bottom:9px;border-radius:6px;padding:14px 16px;display:flex;flex-direction:column">' +
        '<div style="display:flex;justify-content:space-between;' + cap + '"><span>Right eye</span><span data-k="tstep"></span></div>' +
        '<div style="margin-top:18px;' + cap + '">Defocus lens</div>' +
        '<div style="font-size:34px;font-weight:700;line-height:1.1"><span data-k="tdef"></span> D</div>' +
        '<div style="margin-top:18px;' + cap + '">Visual acuity (logMAR)</div>' +
        '<div data-k="tbox" style="margin-top:4px;height:52px;box-sizing:border-box;border:2px solid #9a9a9a;display:flex;align-items:center;padding:0 12px;font-size:34px;font-weight:700"><span data-k="tva"></span></div>' +
        '<div data-k="tmsg" style="margin-top:10px;font-size:15px;line-height:1.25;min-height:38px"></div>' +
      '</div></div>' +
    /* phone: assistant */
    '<div style="' + dev + 'left:266px;top:92px;width:124px;height:260px;border-radius:18px">' +
      '<div style="' + scr + 'left:7px;top:7px;right:7px;bottom:7px;border-radius:11px;padding:20px 10px 12px;display:flex;flex-direction:column;align-items:center;text-align:center">' +
        '<div style="' + cap + '">Next lens</div>' +
        '<div data-k="pdef" style="margin-top:16px;font-size:32px;font-weight:700;line-height:1"></div>' +
        '<div style="font-size:14px;color:#4a4f57;margin-top:4px">dioptres</div>' +
        '<div data-k="pbtn" style="margin-top:auto;width:100%;height:52px;box-sizing:border-box;border:2px solid #16181c;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1.15;font-weight:700"></div>' +
        '<div data-k="pstep" style="margin-top:8px;' + cap + '"></div>' +
      '</div></div>' +
    /* laptop: principal investigator */
    '<div style="' + dev + 'left:418px;top:142px;width:284px;height:198px;border-radius:10px 10px 0 0">' +
      '<div style="' + scr + 'left:8px;top:8px;right:8px;bottom:8px;padding:8px 8px 4px;display:flex;flex-direction:column">' +
        '<div style="display:flex;justify-content:space-between;' + cap + '"><span>Live data: defocus curve</span><span data-k="lcount"></span></div>' +
        '<svg viewBox="0 0 264 128" style="flex:1 1 0;min-height:0;width:100%;margin-top:2px;font-family:' + SANS + ';font-size:10px;fill:#4a4f57">' +
          '<path d="M30 10 V106 H256" fill="none" stroke="#16181c" stroke-width="1"/>' + ticks + xl +
          '<path d="M30 60 H256" stroke="#d0d0d0" stroke-width="1" stroke-dasharray="2 3"/>' +
          '<text x="26" y="17" text-anchor="end">0.0</text><text x="26" y="63" text-anchor="end">0.3</text><text x="26" y="109" text-anchor="end">0.6</text>' +
          '<polyline data-k="line" fill="none" stroke="#16181c" stroke-width="2" stroke-linejoin="round" points=""/><g data-k="pts"></g>' +
        '</svg>' +
        '<div data-k="lmsg" style="font-size:12px;line-height:1.2;min-height:15px;color:#4a4f57"></div>' +
      '</div></div>' +
    '<div style="position:absolute;left:404px;top:340px;width:312px;height:12px;background:#25282B;border-radius:0 0 10px 10px"></div>' +
    '<div style="' + lab + ';left:14px;width:230px">Optometrist<span style="' + sub + '">enters each reading</span></div>' +
    '<div style="' + lab + ';left:244px;width:168px">Assistant<span style="' + sub + '">changes the lens</span></div>' +
    '<div style="' + lab + ';left:404px;width:312px">Principal investigator<span style="' + sub + '">watches the curve build</span></div>' +
    '<div data-k="head" style="position:absolute;left:0;right:0;top:16px;text-align:center;font-family:' + SANS + ';font-size:21px;font-weight:600;color:#16181c"></div>' +
    '</div>';
  var box = frame.firstChild, el = {};
  [].forEach.call(box.querySelectorAll('[data-k]'), function (n) { el[n.getAttribute('data-k')] = n; });
  function fit() { var s = Math.min(frame.clientWidth / 720, frame.clientHeight / 430); box.style.transform = 'scale(' + s + ')'; }
  fit();

  /* build the timeline: one state per tick */
  var T = [];
  function push(s, n) { for (var k = 0; k < (n || 1); k++) T.push(s); }
  for (var i = 0; i < N; i++) {
    var ok = V[i].toFixed(2);
    push({ i: i, pressed: false, va: '', msg: 'Waiting for the lens', pts: i }, 3);
    push({ i: i, pressed: true, va: '', msg: 'Lens in place. Enter the reading.', pts: i }, 2);
    if (i === TYPO) {
      push({ i: i, pressed: true, va: '1.20', flag: true, msg: 'Jump of 1.12 from the last step. Please re-check.', pts: i, held: true }, 11);
      push({ i: i, pressed: true, va: ok, msg: 'Corrected and accepted', pts: i + 1, fixed: true }, 5);
    } else {
      push({ i: i, pressed: true, va: ok, msg: 'Accepted', pts: i + 1 }, 3);
    }
  }
  push({ i: N - 1, pressed: true, va: V[N - 1].toFixed(2), msg: 'Curve complete', pts: N, done: true }, 16);

  var fixedSeen = false;
  function draw(s) {
    if (s.i === 0 && s.pts === 0) fixedSeen = false;
    if (s.fixed) fixedSeen = true;
    el.tstep.textContent = 'Step ' + (s.i + 1) + ' of ' + N;
    el.tdef.textContent = fd(D[s.i]);
    el.tva.textContent = s.va || '–';
    el.tva.style.color = s.va ? '#16181c' : '#b9bec6';
    el.tbox.style.border = s.flag ? '4px solid #16181c' : '2px solid #9a9a9a';
    el.tmsg.textContent = s.msg;
    el.tmsg.style.fontWeight = s.flag ? '700' : '400';
    el.tmsg.style.color = s.flag ? '#16181c' : '#4a4f57';
    el.pdef.textContent = fd(D[s.i]);
    el.pbtn.textContent = s.pressed ? 'In place ✓' : 'Tap when in place';
    el.pbtn.style.background = s.pressed ? '#25282B' : '#ffffff';
    el.pbtn.style.color = s.pressed ? '#ffffff' : '#16181c';
    el.pstep.textContent = (s.i + 1) + ' / ' + N;
    el.lcount.textContent = s.pts + ' of ' + N + ' steps';
    var p = '', c = '';
    for (var k = 0; k < s.pts; k++) {
      p += px(D[k]).toFixed(1) + ',' + py(V[k]).toFixed(1) + ' ';
      c += '<circle cx="' + px(D[k]).toFixed(1) + '" cy="' + py(V[k]).toFixed(1) + '" r="3.2" fill="' + (k === TYPO ? '#ffffff' : '#16181c') + '" stroke="#16181c" stroke-width="1.6"/>';
    }
    el.line.setAttribute('points', p);
    el.pts.innerHTML = c;
    el.lmsg.textContent = s.held ? 'Step ' + (s.i + 1) + ': value held for re-check, not yet saved' : (fixedSeen ? '1 value corrected at entry (open circle)' : 'All values within the rules');
    el.lmsg.style.fontWeight = s.held ? '700' : '400';
    el.lmsg.style.color = s.held ? '#16181c' : '#4a4f57';
    el.head.textContent = s.done ? 'Defocus curve complete: 11 lenses, +1.00 to −4.00 D' : 'Measuring a defocus curve: lens ' + (s.i + 1) + ' of ' + N;
  }
  var t = 0; draw(T[0]);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { draw(T[T.length - 1]); return function () {}; }
  var id = setInterval(function () { t = (t + 1) % T.length; draw(T[t]); }, 220);
  window.addEventListener('resize', fit);
  return function () { clearInterval(id); window.removeEventListener('resize', fit); };
};
