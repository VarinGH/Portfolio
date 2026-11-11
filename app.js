(function () {
  var D = window.PORTFOLIO, P = D.pages, N = P.length;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var lang = store.get('lang') === 'th' ? 'th' : 'en';
  var cur = 0, mediaIdx = 0, stopAnim = null, turn = '', popSel = '';
  var page = document.getElementById('page'), stage = document.getElementById('stage');

  function tx(v) { return v == null ? '' : (typeof v === 'string' ? v : (v[lang] || v.en || '')); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function T(v) { return esc(tx(v)); }
  function M(v) { return T(v).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function li(a) { return (a || []).map(function (b) { return '<li>' + M(b) + '</li>'; }).join(''); }
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
    if (m.type === 'anim') return '';
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
    return '<figure><div class="frame' + (m.light ? ' light' : '') + '"' + (m.type === 'anim' ? ' data-anim="' + esc(m.name) + '"' : '') + '>' + mediaInner(m) + '</div>' + tabs + '<figcaption><strong>' + esc(u.fig) + ' ' + n + '.</strong> ' + T(m.cap) + '</figcaption></figure>';
  }
  function body(p, u) {
    if (p.type === 'project') {
      return '<h1>' + T(p.title) + '</h1><p class="sub">' + T(p.sub) + '</p><div class="role">' + T(p.role) + '</div>' +
        '<div class="txt"><div class="blk"><h2>' + esc(u.problem) + '</h2>' + (Array.isArray(p.problem) ? '<ul>' + li(p.problem) + '</ul>' : '<p>' + T(p.problem) + '</p>') + '</div>' +
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
    if (p.type === 'gallery') {
      return '<h1>' + T(p.title) + '</h1><div class="role">' + T(p.hint) + '</div><div class="gal">' + p.items.map(function (it, i) {
        return '<button type="button" class="gi" data-zoom="' + i + '"><img src="' + esc(it.src) + '" alt=""><span>' + T(it.cap) + '</span></button>'; }).join('') + '</div>';
    }
    var h = '<h1>' + T(p.title) + '</h1><div class="fill">';
    if (p.statement) h += '<div class="cv-top">' + (p.photo ? '<div class="photo"><img src="' + esc(p.photo) + '" alt=""></div>' : '') + '<p class="stmt">' + T(p.statement) + '</p></div>';
    (p.blocks || []).forEach(function (b, bi) {
      h += '<div class="cv-sec' + (bi === 0 && !p.statement ? ' first' : '') + '">' + (b.heading ? '<h2>' + T(b.heading) + '</h2>' : '');
      if (b.entries) h += '<div class="ents' + (b.cols === 2 ? ' two' : '') + '">' + b.entries.map(function (e) {
        return '<div class="ent' + (e.wide ? ' wide' : '') + '"><b>' + T(e.t) + '</b>' + (e.s ? '<em>' + T(e.s) + '</em>' : '') + (e.n ? '<span>' + T(e.n) + '</span>' : '') + '</div>'; }).join('') + '</div>';
      if (b.list) h += '<ul class="' + (b.cols === 2 ? 'two ' : '') + (b.small ? 'small' : '') + '">' + li(b.list) + '</ul>';
      h += '</div>';
    });
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
    return '<nav class="nav" aria-label="Pages"><button type="button" class="arrow" data-go="' + (cur - 1) + '" aria-label="' + esc(u.prev) + '"' + (cur === 0 ? ' disabled' : '') + '><span class="disc">' + CH_L + '</span></button>' + secs +
      '<button type="button" class="arrow next" data-go="' + (cur + 1) + '" data-next="1" aria-label="' + esc(u.next) + '"' + (cur === N - 1 ? ' disabled' : '') + '><span class="disc">' + CH_R + '</span></button></nav>' +
      '<div class="ft"><span>' + esc(u.foot) + '</span><span>' + esc(u.page) + ' ' + (cur + 1) + ' ' + esc(u.of) + ' ' + N + '</span></div>';
  }
  function render() {
    var u = D.ui[lang], p = P[cur];
    document.documentElement.lang = lang;
    if (stopAnim) { stopAnim(); stopAnim = null; }
    page.innerHTML = header(u) + '<div class="body' + (turn ? ' turn ' + turn : '') + '">' + body(p, u) + '</div>' + nav(u);
    turn = '';
    if (popSel) { var pb = page.querySelector(popSel); if (pb) pb.classList.add('pop'); popSel = ''; }
    var an = page.querySelector('[data-anim]');
    if (an && window.ANIMS && window.ANIMS[an.dataset.anim]) stopAnim = window.ANIMS[an.dataset.anim](an);
    var v = page.querySelector('video'); if (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }
  function go(i, fromNext) {
    if (i < 0 || i >= N || i === cur) return;
    turn = i > cur ? 'fwd' : 'back';
    if (!popSel) popSel = i > cur ? '.arrow.next' : '.arrow:not(.next)';
    cur = i; mediaIdx = 0; logTurn();
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
    render();
  }
  page.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.lang) { lang = b.dataset.lang; store.set('lang', lang); render(); }
    else if (b.dataset.media != null) { mediaIdx = +b.dataset.media; render(); }
    else if (b.dataset.zoom != null) zoom(P[cur].items[+b.dataset.zoom]);
    else if (b.dataset.go != null) { if (b.classList.contains('sec')) popSel = '.sec[aria-current="true"]'; go(+b.dataset.go, !!b.dataset.next); }
  });
  function zoom(it) {
    var o = document.createElement('button');
    o.type = 'button'; o.className = 'lb';
    o.innerHTML = '<img src="' + esc(it.src) + '" alt=""><span>' + T(it.cap) + '</span>';
    o.addEventListener('click', function (e) { e.stopPropagation(); o.remove(); });
    page.appendChild(o);
  }
  /* hidden settings page: press and hold the name at the top left for 1.5 seconds */
  var V = window.APP_VERSION || { version: '?', built: '' }, holdT = null;
  function holdStart(e) { if (e.target.closest('.hd-id')) { clearTimeout(holdT); holdT = setTimeout(openSettings, 1500); } }
  function holdEnd() { clearTimeout(holdT); }
  page.addEventListener('pointerdown', holdStart);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { page.addEventListener(n, holdEnd); });
  document.addEventListener('touchmove', holdEnd, { passive: true });
  function checkServer(cb) {
    if (navigator.onLine === false) return cb({ offline: true, why: 'The tablet reports no internet connection.' });
    var done = false, ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (done) return; done = true; if (ctl) ctl.abort(); cb({ offline: true, why: 'The server did not answer within 8 seconds.' }); }, 8000);
    fetch('version.json?t=' + Date.now(), { cache: 'no-store', signal: ctl ? ctl.signal : undefined }).then(function (r) { if (!r.ok) throw new Error('Server answered ' + r.status + '.'); return r.json(); })
      .then(function (j) { if (done) return; done = true; clearTimeout(timer); cb({ server: j }); })
      .catch(function (e) { if (done) return; done = true; clearTimeout(timer); cb({ offline: true, why: 'Could not reach the server. ' + (e && e.message ? e.message : '') }); });
  }
  function openSettings() {
    if (document.querySelector('.set')) return;
    var o = document.createElement('div'); o.className = 'set';
    o.innerHTML = '<div class="set-in" style="zoom:' + (window.innerWidth / 800) + '"><h1>Settings</h1><div class="role">You have found the easter egg.</div>' +
      '<dl><dt>Version on this tablet</dt><dd>' + esc(V.version) + ' <span>(' + esc(V.built) + ')</span></dd>' +
      '<dt>Last updated on this tablet</dt><dd>' + esc(fmtDT(+store.get('updatedAt') || 0)) + '</dd>' +
      '<dt>Version on the server</dt><dd data-s="srv">Checking\u2026</dd>' +
      '<dt>Saved for offline use</dt><dd data-s="off">\u2026</dd></dl>' +
      '<div class="set-btns"><button type="button" class="sbtn" data-s="upd">Update now</button>' +
      '<button type="button" class="sbtn" data-s="chk">Check again</button>' +
      '<button type="button" class="sbtn" data-s="p1">Back to page 1, English</button>' +
      '<button type="button" class="sbtn dark" data-s="close">Close</button></div>' +
      '<p class="set-note">Update now downloads the newest version and restarts the app. It needs internet. Without internet the app keeps running from the saved copy and nothing is checked.</p>' +
      '<h2 class="set-h">Usage log</h2><p class="set-note" style="margin-top:6px">Which page was on screen, when, and for how long. Time on this settings page and time with the screen off are not counted. Press Clear log just before you hand the tablet over.</p>' +
      '<div class="set-btns"><button type="button" class="sbtn" data-s="clr">Clear log</button><button type="button" class="sbtn" data-s="ref">Refresh log</button></div>' +
      '<div data-s="log"></div></div>';
    logPause();
    document.body.appendChild(o);
    var q = function (k) { return o.querySelector('[data-s="' + k + '"]'); };
    function check() {
      q('srv').textContent = 'Checking\u2026 (' + fmtT(Date.now()) + ')';
      checkServer(function (r) {
        if (r.offline) { q('srv').innerHTML = '<strong>Not checked.</strong> ' + esc(r.why) + ' <span>(' + fmtT(Date.now()) + ')</span>'; q('upd').textContent = 'Try update anyway'; return; }
        var same = r.server.version === V.version;
        q('srv').innerHTML = esc(r.server.version) + ' <span>(' + esc(r.server.built) + ')</span><br><strong>' + (same ? 'Same as this tablet. Up to date.' : 'Different from this tablet. Press Update now.') + '</strong>';
        q('upd').textContent = same ? 'Reload anyway' : 'Update now';
      });
    }
    function offlineCount() {
      if (!window.caches) { q('off').textContent = 'Not available in this browser'; return; }
      caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.open(k).then(function (c) { return c.keys(); }); })); })
        .then(function (ls) { var n = 0; ls.forEach(function (l) { n += l.length; }); q('off').textContent = n ? n + ' files saved. The app can run without internet.' : 'Nothing saved yet. Open the app once with internet.'; })
        .catch(function () { q('off').textContent = 'Could not read'; });
    }
    o.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      var k = b.dataset.s;
      if (k === 'close') { o.remove(); logResume(); }
      else if (k === 'clr') { logClear(); q('log').innerHTML = logHtml(); }
      else if (k === 'ref') q('log').innerHTML = logHtml();
      else if (k === 'chk') { check(); offlineCount(); }
      else if (k === 'p1') { lang = 'en'; store.set('lang', 'en'); o.remove(); cur = -1; go(0); logResume(); }
      else if (k === 'upd') {
        b.disabled = true; b.textContent = 'Updating\u2026';
        /* only wipe the saved copy after the server has really answered, so a tablet without internet keeps working */
        checkServer(function (r) {
          if (r.offline) { b.disabled = false; b.textContent = 'Try update anyway'; q('srv').innerHTML = '<strong>Update not done.</strong> ' + esc(r.why) + ' The saved copy is untouched. <span>(' + fmtT(Date.now()) + ')</span>'; return; }
          doUpdate();
        });
      }
    });
    function doUpdate() {
      {
        var wipe = window.caches ? caches.keys().then(function (ks) { return Promise.all(ks.map(function (x) { return caches.delete(x); })); }) : Promise.resolve();
        var unreg = navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }) : Promise.resolve();
        Promise.all([wipe, unreg]).catch(function () {}).then(function () { location.replace(location.pathname + '?u=' + Date.now() + '#1'); });
      }
    }
    q('log').innerHTML = logHtml();
    check(); offlineCount();
  }

  /* usage log: which page was on screen, when, and for how long (kept on this tablet only) */
  var LOG = [], open_ = null, paused = false;
  try { LOG = JSON.parse(store.get('log') || '[]') || []; } catch (e) { LOG = []; }
  try { var lo = JSON.parse(store.get('logOpen') || 'null'); if (lo && lo.last > lo.t) LOG.push({ p: lo.p, t: lo.t, d: lo.last - lo.t }); } catch (e) {}
  store.set('logOpen', 'null');
  function logSave() { if (LOG.length > 3000) LOG = LOG.slice(-3000); store.set('log', JSON.stringify(LOG)); }
  function logClose() {
    if (!open_) return;
    var d = Date.now() - open_.t;
    if (d >= 300) LOG.push({ p: open_.p, t: open_.t, d: d });
    open_ = null; store.set('logOpen', 'null'); logSave();
  }
  function logOpenNow() { if (paused || document.visibilityState !== 'visible') return; open_ = { p: cur + 1, t: Date.now() }; }
  function logTurn() { logClose(); logOpenNow(); }
  function logPause() { logClose(); paused = true; }
  function logResume() { paused = false; logOpenNow(); }
  function logClear() { LOG = []; open_ = null; logSave(); store.set('logOpen', 'null'); }
  setInterval(function () { if (open_) store.set('logOpen', JSON.stringify({ p: open_.p, t: open_.t, last: Date.now() })); }, 4000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') logOpenNow(); else logClose(); });
  window.addEventListener('pagehide', logClose);
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDT(ms) { if (!ms) return 'Not recorded'; var d = new Date(ms); return d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getFullYear() + ', ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
  function fmtT(ms) { var d = new Date(ms); return two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()); }
  function fmtD(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + two(s % 60); }
  function pageName(n) { var p = P[n - 1]; return p ? tx(p.short || p.title) : '?'; }
  function logHtml() {
    if (!LOG.length) return '<p class="set-note">No page views recorded yet.</p>';
    var tot = {}, cnt = {}, all = 0;
    LOG.forEach(function (e) { tot[e.p] = (tot[e.p] || 0) + e.d; cnt[e.p] = (cnt[e.p] || 0) + 1; all += e.d; });
    var h = '<table class="logt"><tr><th>Page</th><th></th><th>Views</th><th>Total time</th></tr>';
    for (var n = 1; n <= N; n++) h += '<tr' + (tot[n] ? '' : ' class="none"') + '><td>' + n + '</td><td>' + esc(pageName(n)) + '</td><td>' + (cnt[n] || 0) + '</td><td>' + (tot[n] ? fmtD(tot[n]) : 'not opened') + '</td></tr>';
    h += '<tr class="sum"><td></td><td>All pages, from ' + esc(fmtDT(LOG[0].t)) + '</td><td>' + LOG.length + '</td><td>' + fmtD(all) + '</td></tr></table>';
    h += '<table class="logt"><tr><th>Time</th><th>Page</th><th></th><th>Shown for</th></tr>';
    LOG.slice(-300).forEach(function (e) { h += '<tr><td>' + fmtT(e.t) + '</td><td>' + e.p + '</td><td>' + esc(pageName(e.p)) + '</td><td>' + fmtD(e.d) + '</td></tr>'; });
    return h + '</table>';
  }
  /* each time the app comes to the front with internet, compare versions quietly; the result shows in Settings */
  /* swipe left / right to turn the page */
  var sx = null, sy = null;
  document.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (sx == null || document.querySelector('.set, .lb')) { sx = null; return; }
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
  if (store.get('seenVersion') !== V.version) { store.set('seenVersion', V.version); store.set('updatedAt', String(Date.now())); }
  render(); logOpenNow();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
