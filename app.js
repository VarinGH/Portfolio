(function () {
  var D = window.PORTFOLIO, P = D.pages, N = P.length;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var lang = store.get('lang') === 'th' ? 'th' : 'en';
  var hinted = store.get('hinted') === '1';
  var cur = 0, mediaIdx = 0;
  var page = document.getElementById('page'), stage = document.getElementById('stage');

  function tx(v) { return v == null ? '' : (typeof v === 'string' ? v : (v[lang] || v.en || '')); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function T(v) { return esc(tx(v)); }
  function li(a) { return (a || []).map(function (b) { return '<li>' + T(b) + '</li>'; }).join(''); }
  var CH_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 L7.5 12 L14.5 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CH_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5 L16.5 12 L9.5 19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function header(u) {
    return '<div class="hd"><div class="hd-id"><span class="hd-name">' + esc(u.name) + '</span><span>' + esc(u.running) + '</span></div>' +
      '<div class="lang" role="group" aria-label="Language"><button type="button" class="th" data-lang="th" aria-pressed="' + (lang === 'th') + '">ไทย</button><i aria-hidden="true"></i><button type="button" class="en" data-lang="en" aria-pressed="' + (lang === 'en') + '">English</button></div></div>';
  }
  function mediaInner(m) {
    var st = '';
    if (m.pos) st += 'object-position:' + m.pos + ';';
    if (m.zoom) st += 'transform:scale(' + m.zoom + ');transform-origin:' + (m.pos || '50% 50%') + ';';
    var cls = m.fit ? ' class="fit"' : '';
    if (m.type === 'video') return '<video' + cls + ' src="' + esc(m.src) + '" style="' + st + '" autoplay muted loop playsinline preload="auto"></video>';
    if (m.type === 'image') return '<img' + cls + ' src="' + esc(m.src) + '" style="' + st + '" alt="">';
    return m.html || '';
  }
  function figure(p, u) {
    var ms = p.media || [], m = ms[mediaIdx] || ms[0];
    if (!m) return '<div class="fill"></div>';
    var tabs = '';
    if (ms.length > 1) {
      tabs = '<div class="tabs" role="tablist">' + ms.map(function (x, i) {
        return '<button type="button" role="tab" data-media="' + i + '" aria-selected="' + (i === mediaIdx) + '">' + esc(u.fig) + ' ' + (cur + 1) + String.fromCharCode(97 + i) + '</button>';
      }).join('') + '</div>';
    }
    var n = (cur + 1) + (ms.length > 1 ? String.fromCharCode(97 + mediaIdx) : '');
    return '<figure><div class="frame">' + mediaInner(m) + '</div>' + tabs + '<figcaption><strong>' + esc(u.fig) + ' ' + n + '.</strong> ' + T(m.cap) + '</figcaption></figure>';
  }
  function body(p, u) {
    if (p.type === 'project') {
      return '<h1>' + T(p.title) + '</h1><p class="sub">' + T(p.sub) + '</p><div class="role">' + T(p.role) + '</div>' +
        '<div class="txt"><div class="blk"><h2>' + esc(u.problem) + '</h2><p>' + T(p.problem) + '</p></div>' +
        '<div class="blk"><h2>' + esc(u.solution) + '</h2><ul>' + li(p.bullets) + '</ul></div></div>' + figure(p, u);
    }
    if (p.type === 'research') {
      var col = function (c) {
        var h = '<div class="col"><h2>' + T(c.heading) + '</h2>';
        (c.items || []).forEach(function (it) { h += '<div class="item"><h3>' + T(it.name) + '</h3>' + (it.meta ? '<div class="meta">' + T(it.meta) + '</div>' : '') + '<p>' + T(it.text) + '</p></div>'; });
        if (c.list) h += '<div class="item"><div class="lbl">' + T(c.listLabel) + '</div><ul>' + li(c.list) + '</ul></div>';
        return h + '</div>';
      };
      return '<h1>' + T(p.title) + '</h1><div class="cols">' + col(p.left) + col(p.right) + '</div>';
    }
    var h = '<h1>' + T(p.title) + '</h1><div class="fill">';
    if (p.lines) {
      h += '<div class="cv-top"><div class="photo">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : 'Photo') + '</div><div class="item">' +
        p.lines.map(function (l, i) { return i === 0 ? '<h3>' + T(l) + '</h3>' : '<p>' + T(l) + '</p>'; }).join('') + '</div></div>';
    }
    (p.blocks || []).forEach(function (b) { h += '<div class="cv-sec"><h2>' + T(b.heading) + '</h2><ul>' + li(b.list) + '</ul></div>'; });
    return h + '</div>';
  }
  function nav(u) {
    var secs = '<div class="secs">';
    D.sections.forEach(function (s) {
      var first = -1, dots = '';
      P.forEach(function (p, i) { if (p.sec === s.id) { if (first < 0) first = i; dots += '<i' + (i === cur ? ' class="on"' : '') + '></i>'; } });
      secs += '<button type="button" class="sec" data-go="' + first + '" aria-current="' + (P[cur].sec === s.id) + '"><span>' + T(s.label) + '</span><span class="dots">' + dots + '</span></button>';
    });
    secs += '</div>';
    return '<nav class="nav" aria-label="Pages"><button type="button" class="arrow" data-go="' + (cur - 1) + '" aria-label="' + esc(u.prev) + '"' + (cur === 0 ? ' disabled' : '') + '>' + CH_L + '</button>' + secs +
      '<button type="button" class="arrow' + (!hinted && cur < N - 1 ? ' pulse' : '') + '" data-go="' + (cur + 1) + '" data-next="1" aria-label="' + esc(u.next) + '"' + (cur === N - 1 ? ' disabled' : '') + '>' + CH_R + '</button></nav>' +
      '<div class="ft"><span>' + esc(u.foot) + '</span><span>' + esc(u.page) + ' ' + (cur + 1) + ' ' + esc(u.of) + ' ' + N + '</span></div>';
  }
  function render() {
    var u = D.ui[lang], p = P[cur];
    document.documentElement.lang = lang;
    page.innerHTML = header(u) + body(p, u) + nav(u);
    var v = page.querySelector('video'); if (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }
  function go(i, fromNext) {
    if (i < 0 || i >= N || i === cur) return;
    if (fromNext && !hinted) { hinted = true; store.set('hinted', '1'); }
    cur = i; mediaIdx = 0;
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
    render();
  }
  page.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.lang) { lang = b.dataset.lang; store.set('lang', lang); render(); }
    else if (b.dataset.media != null) { mediaIdx = +b.dataset.media; render(); }
    else if (b.dataset.go != null) go(+b.dataset.go, !!b.dataset.next);
  });
  /* swipe left / right to turn the page */
  var sx = null, sy = null;
  document.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), dx < 0);
  }, { passive: true });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(cur + 1, true); if (e.key === 'ArrowLeft') go(cur - 1); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* fit the 800 x 1280 page to whatever screen it is on */
  function fit() {
    var s = Math.min(window.innerWidth / 800, window.innerHeight / 1280);
    stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  }
  window.addEventListener('resize', fit); fit();

  /* keep the screen awake while the app is showing */
  var lock = null;
  function awake() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(function (l) { lock = l; }).catch(function () {});
  }
  document.addEventListener('visibilitychange', awake);
  document.addEventListener('click', function () { if (!lock || lock.released) awake(); });
  awake();

  var h = parseInt((location.hash || '').slice(1), 10);
  if (h >= 1 && h <= N) cur = h - 1;
  render();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
  /* ?reset in the address clears the "Next" hint and language, for setting up before handing over */
  if (/[?&]reset/.test(location.search)) { store.set('hinted', '0'); store.set('lang', 'en'); }
})();
