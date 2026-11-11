/* Eye drop compliance tracker: the to-scale 3D model of the bench prototype (from C:\ClaudProjects\EyeDropCompliance\EyeDropSensor_Prototype_3D.html),
   moved into the portfolio. Everything is in millimetres. Uses the local copy of three.js (lib/), so it works offline.
   One renderer is kept for the whole session and its canvas is moved into the figure each time the page is shown,
   so turning pages never leaks WebGL contexts. */
(function () {
  if (!window.ANIMS) window.ANIMS = {};
  var S = null; /* the scene, built once */

  var UNITS = [
    ['all', 'Overview', 'Bench prototype on a Vigamox 4 mL bottle, drawn to scale: 31 mm wide, 37 mm deep, 66 mm tall. Tap a part to look at it.'],
    ['bottle', 'Bottle', 'Vigamox Alcon Drop-Tainer, round, natural LDPE with a tan cap. Modelled 18.5 mm wide and 52 mm tall with the cap.'],
    ['camera', 'Camera + IR', 'OV2640 camera, 8 \u00d7 8 mm, on a post at the shoulder, tilted 20\u00b0 toward the tip. An 850 nm infrared LED lights the eye. A long ribbon runs down to the base.'],
    ['board', 'XIAO board', 'Seeed XIAO ESP32-S3 Sense, 21 \u00d7 17.8 mm, lying flat in the base. Records a short clip of each instillation and stores it on microSD.'],
    ['battery', 'Battery', '150 mAh LiPo cell, 25 \u00d7 20 \u00d7 4 mm, under the board. The product version moves to a CR2450 coin cell with a supercapacitor.'],
    ['accel', 'Accelerometer', 'ADXL362 runs all the time and wakes the board when the bottle is held upside down for about a second.'],
    ['clock', 'Clock', 'DS3231 real-time clock stamps every event. Nothing is transmitted: the clinic reads the device on a dock.'],
    ['cradle', 'Cradle', 'Printed TPU cradle: two bands, front spine, back pad for the breakouts, camera post, and a 31 \u00d7 23.6 \u00d7 14 mm base box.']
  ];
  /* which way the camera should face to see each unit (radians around the Y axis; 0 = front, camera side) */
  var FACE = { all: null, bottle: 0.7, camera: 0.35, board: 2.3, battery: -0.9, accel: Math.PI + 0.35, clock: Math.PI - 0.35, cradle: 1.0 };

  function build() {
    var T = THREE, V = function (x, y, z) { return new T.Vector3(x, y, z); };
    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0x000000, 0);
    var canvas = renderer.domElement; canvas.className = 'ed3-gl';
    var scene = new T.Scene();
    var pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new T.RoomEnvironment(), 0.04).texture; pm.dispose();
    var camera = new T.PerspectiveCamera(30, 1, 1, 2000);
    var key = new T.DirectionalLight(0xfff6ea, 2.2); key.position.set(70, 120, 90); scene.add(key);
    var rimL = new T.DirectionalLight(0xdfe9ff, 1.2); rimL.position.set(-90, 50, -80); scene.add(rimL);
    scene.add(new T.HemisphereLight(0xffffff, 0x9aa3ad, 0.35));

    function mat(c, o) { var m = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); return m; }
    function phys(c, o) { var m = new T.MeshPhysicalMaterial(Object.assign({ color: c, roughness: 0.5, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); return m; }
    var C = { ldpe: 0xf3f1e8, liquid: 0xc9d34e, label: 0xfbfbf9, cap: 0xb48f62, pcb: 0x141619, gold: 0xe0b552, steel: 0xc9cdd2, chip: 0x18191c,
      flex: 0xc07a22, red: 0xc0222c, blue: 0x1c4ea6, lipo: 0xc4c8cc, kapton: 0xd08d18, cradle: 0xe7e7e2, led: 0xe8eefb, cone: 0x3d8bff };
    var WIRE = [0xd23b3b, 0x222428, 0xe2b100, 0x2f9e55, 0x2f6fd0, 0xf2f2f2];
    var M = {
      pcb: function () { return phys(C.pcb, { roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35 }); },
      gold: function () { return mat(C.gold, { metalness: 1, roughness: 0.22 }); },
      steel: function () { return mat(C.steel, { metalness: 1, roughness: 0.3 }); },
      chip: function () { return mat(C.chip, { roughness: 0.55 }); }
    };
    function box(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); return o; }
    function cyl(r1, r2, h, m, x, y, z, seg) { var o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 32), m); o.position.set(x || 0, y || 0, z || 0); return o; }
    function loft(st, m, closed) { /* round loft through stations [y, rx, rz] */
      var seg = 72, v = [], idx = [];
      st.forEach(function (s) { for (var j = 0; j < seg; j++) { var a = j / seg * Math.PI * 2; v.push(Math.cos(a) * s[1], s[0], Math.sin(a) * s[2]); } });
      for (var i = 0; i < st.length - 1; i++) for (var j = 0; j < seg; j++) { var a = i * seg + j, b = (i + 1) * seg + j, c = i * seg + (j + 1) % seg, d = (i + 1) * seg + (j + 1) % seg; idx.push(a, b, c, b, d, c); }
      if (closed !== false) { var n = v.length / 3; v.push(0, st[0][0], 0, 0, st[st.length - 1][0], 0); var top = (st.length - 1) * seg;
        for (var k = 0; k < seg; k++) { idx.push(n, k, (k + 1) % seg); idx.push(n + 1, top + (k + 1) % seg, top + k); } }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.computeVertexNormals();
      return new T.Mesh(g, m);
    }
    function ribbon(pts, w, m) {
      var cur = new T.CatmullRomCurve3(pts), N = 48, v = [], idx = [];
      for (var i = 0; i <= N; i++) { var p = cur.getPoint(i / N); v.push(p.x - w / 2, p.y, p.z, p.x + w / 2, p.y, p.z); }
      for (var j = 0; j < N; j++) { var a = j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.computeVertexNormals();
      return new T.Mesh(g, m);
    }
    function wire(pts, color) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.5, 8, false), phys(color, { roughness: 0.32, clearcoat: 0.5 })); }

    var root = new T.Group(); scene.add(root);
    var U = {}; UNITS.forEach(function (u) { if (u[0] !== 'all') U[u[0]] = []; });
    var tags = [], labelsEl = document.createElement('div'); labelsEl.className = 'ed3-labels';
    function tag(group, x, y, z, text, unit) { var a = new T.Object3D(); a.position.set(x, y, z); group.add(a); var el = document.createElement('div'); el.className = 'ed3-tag'; el.textContent = text; labelsEl.appendChild(el); tags.push({ a: a, el: el, unit: unit }); }

    var P = { Dia: 18.5, H: 27, T: 52 };
    var R = P.Dia / 2, H = P.H, SH = 4, CAPH = 16, CAPR = 7.75, NR = 5.6, WALL = 1.6;
    var neckVis = Math.max(1.5, P.T - H - SH - CAPH), yNeck = H + SH, yCap = yNeck + neckVis, yTop = yCap + CAPH, yTip = yTop - 1.5;
    var BH = 14, TW = 31, TD = 23.6, yF = -BH + 1.2, yX = yF + 4.6;
    var centerY = (yTop - BH) / 2;

    /* ---- bottle: round natural LDPE body, greenish-yellow solution, blank label, tan cap */
    var bottle = new T.Group(); root.add(bottle); U.bottle.push(bottle);
    var st = [[0, R - 2, R - 2], [0.6, R - 0.8, R - 0.8], [2, R, R], [H, R, R]], rn = NR + 0.8;
    [0.3, 0.55, 0.8, 1].forEach(function (t) { var k = 1 - Math.sqrt(1 - t * t), r = R - (R - rn) * k; st.push([H + SH * t, r, r]); });
    st.push([yNeck + 1, rn, rn], [yNeck + 1.01, NR, NR], [yCap + 5, NR, NR], [yCap + 5.2, 3.4, 3.4], [yCap + 7, 3.0, 3.0], [yTip - 0.6, 1.5, 1.5], [yTip, 1.1, 1.1]);
    var liq = loft([[1.2, R - 0.9, R - 0.9], [H * 0.66, R - 0.9, R - 0.9]], phys(C.liquid, { roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.88 }));
    liq.renderOrder = 1; bottle.add(liq);
    var shell = loft(st, phys(C.ldpe, { transparent: true, opacity: 0.5, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.5, depthWrite: false, side: T.DoubleSide }));
    shell.renderOrder = 2; bottle.add(shell);
    bottle.add(loft([[7.5, R + 0.06, R + 0.06], [H - 8.5, R + 0.06, R + 0.06]], mat(C.label, { roughness: 0.85, side: T.DoubleSide }), false));
    var thr = mat(C.ldpe, { roughness: 0.4 });
    [1.6, 3.4].forEach(function (dy) { var t = new T.Mesh(new T.TorusGeometry(NR + 0.25, 0.35, 8, 40), thr); t.rotation.x = Math.PI / 2; t.position.y = yCap + dy; bottle.add(t); });
    tag(bottle, -R, H * 0.5, 0, 'Vigamox bottle, round 4 mL', 'bottle');
    var cap = new T.Group(); root.add(cap); U.bottle.push(cap); cap.userData.off = V(0, 16, 0);
    var capM = mat(C.cap, { roughness: 0.52 });
    cap.add(cyl(CAPR - 0.9, CAPR, CAPH, capM, 0, yCap + CAPH / 2, 0, 48));
    cap.add(cyl(CAPR - 1.1, CAPR - 0.9, 0.6, capM, 0, yTop + 0.3, 0, 48));
    for (var i = 0; i < 30; i++) { var a = i / 30 * Math.PI * 2, r = CAPR - 0.2, b = box(0.55, CAPH * 0.7, 0.6, capM, Math.cos(a) * r, yCap + CAPH * 0.4, Math.sin(a) * r); b.rotation.y = -a; cap.add(b); }

    /* ---- printed TPU cradle and base box */
    var cradle = new T.Group(); root.add(cradle); U.cradle.push(cradle);
    var cradleMat = mat(C.cradle, { roughness: 0.88 });
    var trayMat = phys(C.cradle, { roughness: 0.7, transparent: true, opacity: 0.45, depthWrite: false });
    var sh = new T.Shape(); sh.absarc(0, 0, R + 0.2 + WALL, 0, Math.PI * 2, false);
    var hole = new T.Path(); hole.absarc(0, 0, R + 0.2, 0, Math.PI * 2, true); sh.holes.push(hole);
    [0, H - 7].forEach(function (y) { var sg = new T.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.3, bevelSegments: 2, curveSegments: 48 }); sg.rotateX(-Math.PI / 2); var m = new T.Mesh(sg, cradleMat); m.position.y = y + 0.4; cradle.add(m); });
    var z0 = R + 0.2 + WALL;
    cradle.add(box(6, H - 1, 1.8, cradleMat, 0, (H - 1) / 2, z0 - 0.7));
    cradle.add(box(15, H - 1, 1.8, cradleMat, 0, (H - 1) / 2, -(z0 + 0.1)));
    var camY = H + 0.5, camZ = Math.max(CAPR, R) + 6.7, tilt = -20 * Math.PI / 180;
    cradle.add(box(6, camY - (H - 4), 2, cradleMat, 0, (camY + H - 4) / 2 - 0.3, z0 + 0.4));
    tag(cradle, R + 2, H - 4, 0, 'Printed TPU cradle', 'cradle');
    var tray = new T.Group(); root.add(tray); U.cradle.push(tray); tray.userData.off = V(0, -30, 0);
    var trayBox = box(TW, BH, TD, trayMat, 0, -BH / 2, 0); trayBox.renderOrder = 3; tray.add(trayBox);
    tag(tray, TW / 2, -BH + 1, -TD / 2, 'Printed base box', 'cradle');

    /* ---- XIAO ESP32-S3 Sense lying flat in the base */
    var xiao = new T.Group(), pcb = M.pcb(), gold = M.gold(), steel = M.steel(), dark = M.chip();
    xiao.add(box(21, 17.8, 1.0, pcb, 0, 0, 0.5));
    for (var k = 0; k < 7; k++) { var px = (k - 3) * 2.54; xiao.add(box(1.5, 1.1, 1.1, gold, px, 8.45, 0.5), box(1.5, 1.1, 1.1, gold, px, -8.45, 0.5)); }
    xiao.add(box(7.3, 8.94, 3.2, steel, 8.15, 0, 2.6), box(0.3, 7.2, 1.9, dark, 11.8, 0, 2.6));
    xiao.add(box(10.5, 10, 2.1, steel, -4.6, 0.6, 2.05));
    xiao.add(box(2.4, 1.6, 0.9, steel, 6, 7.1, 1.45), box(2.4, 1.6, 0.9, steel, 6, -7.1, 1.45));
    xiao.add(cyl(1, 1, 1.2, gold, -9.2, -7.2, 1.6).rotateX(Math.PI / 2));
    xiao.add(box(1.8, 8, 3.8, dark, 3.4, 0, 2.9));
    xiao.add(box(15, 17.8, 0.8, pcb, -3, 0, 5.2));
    xiao.add(box(11.5, 11, 1.4, steel, -3.6, -1, 4.1), box(15, 11, 1.0, mat(0x2a3a55, { roughness: 0.4 }), -5.3, -1, 4.1));
    xiao.add(box(13, 3, 1.2, mat(0xd8cfb8, { roughness: 0.6 }), -3, 7.0, 6.2), box(13, 1, 1.3, dark, -3, 5.9, 6.25));
    xiao.add(box(3.5, 2.65, 1, steel, -8, -5.6, 6.1));
    var xg = new T.Group(); xiao.rotation.x = -Math.PI / 2; xg.add(xiao); xg.rotation.y = Math.PI; xg.position.set(-3.2, yX, 0); root.add(xg); U.board.push(xg);
    tag(xg, 9, 6, 0, 'XIAO ESP32-S3 Sense, 21 \u00d7 17.8', 'board');

    /* ---- LiPo under the board */
    var lipo = new T.Group(); root.add(lipo); U.battery.push(lipo); lipo.userData.off = V(0, -14, 0);
    lipo.add(box(25, 4, 20, mat(C.lipo, { metalness: 0.85, roughness: 0.38 }), -1, yF + 2, 0), box(3, 4.1, 20.1, phys(C.kapton, { roughness: 0.3, clearcoat: 0.6, transparent: true, opacity: 0.92 }), 12.9, yF + 2, 0));
    tag(lipo, TW / 2, yF + 2, 4, 'LiPo 150 mAh, 25 \u00d7 20 \u00d7 4', 'battery');

    /* ---- camera head and IR LED at the shoulder, ribbon down to the base */
    var cam = new T.Group(), blk = mat(0x101113, { roughness: 0.45 });
    cam.add(box(19, 1.6, 10, cradleMat, -3.5, -0.8, 0));
    cam.add(box(8, 2.6, 8, blk, 0, 1.3, 0), cyl(3.6, 3.6, 3.4, blk, 0, 4.3, 0), cyl(2.6, 2.9, 0.5, blk, 0, 6.25, 0));
    cam.add(cyl(1.7, 1.7, 0.25, phys(0x1a2a55, { roughness: 0.02, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0 }), 0, 6.5, 0));
    var led = phys(C.led, { transparent: true, opacity: 0.6, roughness: 0.05, clearcoat: 1 });
    cam.add(cyl(2.9, 2.9, 1, led, -9, 0.5, 0), cyl(2.5, 2.5, 5, led, -9, 3.5, 0));
    var dome = new T.Mesh(new T.SphereGeometry(2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), led); dome.position.set(-9, 6, 0); cam.add(dome);
    cam.add(cyl(0.9, 0.9, 1.2, mat(0x3a3f47, { metalness: 0.6, roughness: 0.4 }), -9, 2.4, 0)); /* die inside the LED */
    var leg = mat(C.steel, { metalness: 1, roughness: 0.3 }); cam.add(cyl(0.3, 0.3, 4, leg, -10.27, -3.4, 0, 8), cyl(0.3, 0.3, 4, leg, -7.73, -3.4, 0, 8));
    var L = 48, cg = new T.ConeGeometry(L * Math.tan(30 * Math.PI / 180), L, 40, 1, true); cg.translate(0, -L / 2, 0); cg.rotateX(Math.PI);
    var cone = new T.Mesh(cg, new T.MeshBasicMaterial({ color: new T.Color(C.cone).convertSRGBToLinear(), transparent: true, opacity: 0.14, side: T.DoubleSide, depthWrite: false }));
    cone.position.y = 6.5; cone.userData.fixed = true; cam.add(cone);
    cam.position.set(0, camY, camZ); cam.rotation.x = tilt; cam.updateMatrix(); root.add(cam); U.camera.push(cam);
    var pc = V(0, 0.3, 4).applyMatrix4(cam.matrix), zRun = z0 + 2.4, yConn = yX + 6.2;
    var fp = [pc, V(0, pc.y - 1.2, pc.z + 2.4), V(0, pc.y - 5.5, pc.z + 1.2), V(0, H - 10, zRun + 0.4), V(0, 2, zRun), V(0, yConn + 2.2, zRun), V(0, yConn + 0.3, zRun - 1.6), V(0, yConn, TD / 2 - 1.5), V(0, yConn, 8.4)];
    var rib = new T.Group(); rib.add(ribbon(fp, 6, phys(C.flex, { roughness: 0.3, clearcoat: 0.7, side: T.DoubleSide }))); root.add(rib); U.camera.push(rib);
    tag(cam, 0, 7, 0, 'OV2640 camera, 8 \u00d7 8', 'camera');
    tag(cam, -9, 8.5, 0, 'IR LED 850 nm, 5 mm', 'camera');

    /* ---- back: accelerometer and clock breakouts */
    function breakout(w, h, color, chip, rows) {
      var g = new T.Group(), gd = M.gold();
      g.add(box(w, h, 1.6, phys(color, { roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 }), 0, 0, 0.8));
      g.add(box(chip[0], chip[1], chip[2], M.chip(), 0, chip[3], 1.6 + chip[2] / 2));
      rows.forEach(function (rw) { for (var i = 0; i < rw.n; i++) { var ring = new T.Mesh(new T.TorusGeometry(0.75, 0.28, 8, 20), gd); ring.position.set((i - (rw.n - 1) / 2) * 2.54, rw.y, 1.62); g.add(ring); } });
      return g;
    }
    var zk = -(z0 + 1.0), yA = H - 7.5, yR = 6.8;
    var adxl = breakout(13, 13, C.red, [3, 3.25, 1.06, 0], [{ n: 4, y: 5.2 }, { n: 4, y: -5.2 }]);
    var rtc = breakout(14, 13, C.blue, [10.3, 7.5, 2.3, 1.6], [{ n: 5, y: -5.2 }]);
    rtc.add(cyl(5, 5, 3.2, mat(0xb9bdc2, { metalness: 1, roughness: 0.25 }), 0, 1.4, -1.6, 40).rotateX(Math.PI / 2)); /* coin-cell holder on the back of the clock module */
    adxl.rotation.y = Math.PI; adxl.position.set(0, yA, zk); rtc.rotation.y = Math.PI; rtc.position.set(0, yR, zk);
    var ga = new T.Group(), gr = new T.Group(); ga.add(adxl); gr.add(rtc); ga.userData.off = V(0, 0, -16); gr.userData.off = V(0, 0, -16);
    root.add(ga, gr); U.accel.push(ga); U.clock.push(gr);
    tag(ga, 0, yA + 4, zk - 2, 'ADXL362 accelerometer', 'accel');
    tag(gr, 0, yR - 2, zk - 2, 'DS3231 clock', 'clock');

    /* ---- jumper wires (hidden in the exploded view) */
    var wires = new T.Group(); root.add(wires);
    var zp = zk - 1.9, zw = -TD / 2, padX = function (j) { return -(j - 3) * 2.54 - 3.2; };
    for (var q = 0; q < 4; q++) { var xp = -(q - 2) * 2.54, xe = padX(q + 3);
      wires.add(wire([V(xp, yR - 5.2, zp), V(xp, yR - 6.6, zp - 1.6), V((xp + xe) / 2, -3.5, zw - 1.2), V(xe, yX + 3, zw + 0.5), V(xe, yX + 1.2, -8.45)], WIRE[q])); }
    for (var s = 0; s < 4; s++) { var xp2 = -(s - 1.5) * 2.54, sd = s < 2 ? 1 : -1, kk = (s === 0 || s === 3) ? 1 : 0, xs = sd * (8.5 + kk * 1.2), xe2 = s < 3 ? padX(s) : 1.5;
      wires.add(wire([V(xp2, yA - 5.2, zp), V(xs, yA - 8, zp - 0.6), V(xs, 2, zp - 0.2), V(xs * 0.95, -3.5, zw - 1.2), V(xe2, yX + 3, zw + 0.5), V(xe2, yX + (s < 3 ? 1.2 : 0), s < 3 ? -8.45 : -6)], WIRE[(s + 2) % 6])); }
    [[-10.27, 5.08, 0], [-7.73, 2.54, 1]].forEach(function (w) { var p = V(w[0], -5.4, 0).applyMatrix4(cam.matrix), xe3 = -w[1] - 3.2;
      wires.add(wire([p, V(p.x + 0.4, p.y - 3, p.z - 1), V(xe3, H - 9, zRun + 0.2), V(xe3, 2, zRun), V(xe3, yX + 3.2, TD / 2 + 0.6), V(xe3, yX + 1.2, 8.45)], WIRE[w[2]])); });
    [[1, 0], [-1, 1]].forEach(function (w) { wires.add(wire([V(13, yF + 2, w[0] * 2), V(14.2, yF + 3.6, w[0] * 2), V(11, yX - 0.4, w[0] * 1.5), V(6.5, yX - 0.1, w[0] * 1.27)], WIRE[w[1]])); });

    /* ---- the eye in use, 25 mm above the tip */
    var eye = new T.Group(); root.add(eye); eye.visible = false;
    var ball = new T.Mesh(new T.SphereGeometry(12, 48, 32), phys(0xf6f1ea, { roughness: 0.25, clearcoat: 1, transparent: true, opacity: 0.85 })); ball.position.y = yTip + 37; eye.add(ball);
    eye.add(cyl(5.9, 5.9, 0.5, mat(0x6a4a2e, { roughness: 0.6 }), 0, yTip + 25.4, 0, 48), cyl(2, 2, 0.6, mat(0x050506), 0, yTip + 25.3, 0, 24));
    tag(eye, 12, yTip + 34, 0, 'Eye in use, 25 mm from the tip', 'use');

    /* ---- soft contact shadow under the base */
    var sc = document.createElement('canvas'); sc.width = sc.height = 128; var sx = sc.getContext('2d'), grd = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, 'rgba(20,24,30,.55)'); grd.addColorStop(.45, 'rgba(20,24,30,.22)'); grd.addColorStop(1, 'rgba(20,24,30,0)'); sx.fillStyle = grd; sx.fillRect(0, 0, 128, 128);
    var shadow = new T.Mesh(new T.PlaneGeometry(78, 64), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -BH - 0.05; scene.add(shadow);

    /* every unit gets its own copies of its materials, so the others can be faded while one is explored */
    var unitList = Object.keys(U).map(function (id) {
      var mats = [];
      U[id].forEach(function (g) { g.traverse(function (o) {
        if (!o.isMesh || o.userData.fixed) return;
        o.material = o.material.clone();
        o.material.userData = { o0: o.material.opacity, t0: o.material.transparent, d0: o.material.depthWrite };
        mats.push(o.material);
      }); });
      return { id: id, groups: U[id], mats: mats, f: 1, ft: 1 };
    });
    var wireMats = []; wires.traverse(function (o) { if (o.isMesh) { o.material.userData = { o0: 1, t0: false, d0: true }; wireMats.push(o.material); } });
    var wireUnit = { id: 'wires', groups: [wires], mats: wireMats, f: 1, ft: 1 };
    unitList.push(wireUnit);

    return { renderer: renderer, canvas: canvas, scene: scene, camera: camera, root: root, units: unitList, tags: tags, labelsEl: labelsEl,
      parts: [cap, tray, lipo, ga, gr], wires: wires, eye: eye, cone: cone, shadow: shadow, BH: BH, centerY: centerY };
  }

  window.ANIMS.eyedrop = function (frame) {
    if (!window.THREE) { frame.innerHTML = '<p class="ed3-err">The 3D library did not load.</p>'; return function () {}; }
    if (!S) { try { S = build(); } catch (e) { frame.innerHTML = '<p class="ed3-err">This tablet could not start 3D drawing.</p>'; return function () {}; } }
    var T = THREE, cam = S.camera, renderer = S.renderer, canvas = S.canvas;
    frame.classList.add('ed3');
    var ui = document.createElement('div'); ui.className = 'ed3-ui';
    ui.innerHTML = '<div class="ed3-list" role="group" aria-label="Explore the units"><span class="ed3-h">Explore</span>' +
      UNITS.map(function (u) { return '<button type="button" data-u="' + u[0] + '" aria-pressed="' + (u[0] === 'all') + '">' + u[1] + '</button>'; }).join('') + '</div>' +
      '<div class="ed3-tools"><button type="button" data-t="explode" aria-pressed="false">Explode</button><button type="button" data-t="use" aria-pressed="false">In use</button><button type="button" data-t="labels" aria-pressed="false">Labels</button></div>' +
      '<div class="ed3-card"><b></b><span></span></div>' +
      '<div class="ed3-hint">Drag to turn \u00b7 pinch to zoom</div>';
    frame.appendChild(canvas); frame.appendChild(S.labelsEl); frame.appendChild(ui);
    var card = ui.querySelector('.ed3-card'), cardB = card.querySelector('b'), cardS = card.querySelector('span');

    var st = { sel: 'all', explode: false, use: false, labels: false };
    var th = 0.75, ph = 1.2, dist = 150, base = 150, zoom = 1, e = 0, u = 0;
    var tgt = new T.Vector3(0, S.centerY, 0), tgtGoal = tgt.clone(), distGoal = 150, thGoal = null, hold = 0, idle = 0, last = 0;
    var raf = 0, alive = true, box3 = new T.Box3(), bx = new T.Box3(), tmp = new T.Vector3();

    function unitInfo(id) { for (var i = 0; i < UNITS.length; i++) if (UNITS[i][0] === id) return UNITS[i]; }
    function setCard() { var info = unitInfo(st.sel); cardB.textContent = info[1]; cardS.textContent = info[2]; card.classList.toggle('on', st.sel !== 'all'); }
    function select(id) {
      st.sel = id;
      S.units.forEach(function (un) { un.ft = (id === 'all' || un.id === id) ? 1 : 0; });
      ui.querySelectorAll('[data-u]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.u === id)); });
      if (id !== 'all' && FACE[id] != null) { var f = FACE[id], d = f - th; d = Math.atan2(Math.sin(d), Math.cos(d)); thGoal = th + d; }
      else thGoal = null;
      hold = id === 'all' ? 0 : 5.5; zoom = 1;
      setCard();
    }
    function toggle(k) {
      st[k] = !st[k];
      ui.querySelector('[data-t="' + k + '"]').setAttribute('aria-pressed', String(st[k]));
      S.eye.visible = st.use; S.cone.visible = st.use;
    }
    S.eye.visible = false; S.cone.visible = false;
    S.units.forEach(function (un) { un.f = un.ft = 1; applyFade(un); });
    setCard();

    ui.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.u) select(b.dataset.u); else if (b.dataset.t) toggle(b.dataset.t);
    });

    function applyFade(un) {
      var k = 0.1 + 0.9 * un.f;
      un.mats.forEach(function (m) {
        var d = m.userData, tr = d.t0 || un.f < 0.999;
        if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
        m.opacity = d.o0 * k; m.depthWrite = d.d0 && un.f >= 0.999;
      });
    }

    /* orbit: mouse by pointer events, fingers by touch events; touches on the model never turn the page */
    var drag = false, lx = 0, ly = 0, pinch = 0;
    function poke() { idle = 3; thGoal = null; hold = 0; }
    function onPD(ev) { if (ev.pointerType === 'touch') return; drag = true; lx = ev.clientX; ly = ev.clientY; poke(); try { canvas.setPointerCapture(ev.pointerId); } catch (x) {} }
    function onPM(ev) { if (ev.pointerType === 'touch' || !drag) return; th -= (ev.clientX - lx) * 0.009; ph -= (ev.clientY - ly) * 0.009; lx = ev.clientX; ly = ev.clientY; poke(); }
    function onPU(ev) { if (ev.pointerType === 'touch') return; drag = false; }
    function onWheel(ev) { ev.preventDefault(); zoom *= 1 + Math.sign(ev.deltaY) * 0.08; poke(); }
    function onTS(ev) { ev.stopPropagation(); if (ev.touches.length === 1) { drag = true; lx = ev.touches[0].clientX; ly = ev.touches[0].clientY; } pinch = 0; poke(); }
    function onTM(ev) { ev.stopPropagation(); ev.preventDefault(); var t = ev.touches;
      if (t.length === 1 && drag) { th -= (t[0].clientX - lx) * 0.009; ph -= (t[0].clientY - ly) * 0.009; lx = t[0].clientX; ly = t[0].clientY; }
      if (t.length === 2) { var d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); if (pinch) zoom *= pinch / d; pinch = d; }
      poke(); }
    function onTE(ev) { ev.stopPropagation(); drag = false; pinch = 0; if (ev.touches.length === 1) { drag = true; lx = ev.touches[0].clientX; ly = ev.touches[0].clientY; } }
    canvas.addEventListener('pointerdown', onPD); canvas.addEventListener('pointermove', onPM); canvas.addEventListener('pointerup', onPU);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTS, { passive: true }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onTE);
    ui.addEventListener('touchstart', function (ev) { ev.stopPropagation(); }, { passive: true });

    var W = 0, Hh = 0, PANEL = 150, ck = 0;
    function size() {
      var w = frame.clientWidth, h = frame.clientHeight; if (!w || !h) return;
      var screenScale = frame.getBoundingClientRect().width / w;
      var pr = Math.min(2.5, (window.devicePixelRatio || 1) * screenScale);
      if (w !== W || h !== Hh || Math.abs(renderer.getPixelRatio() - pr) > 0.01) {
        W = w; Hh = h; renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
        base = 46 / Math.tan(cam.fov * Math.PI / 360); /* about 92 mm of height fills the frame */
      }
    }

    function frameLoop(now) {
      if (!alive) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      size();
      /* explode and fades */
      e += ((st.explode ? 1 : 0) - e) * (1 - Math.pow(0.001, dt));
      S.parts.forEach(function (g) { g.position.copy(g.userData.off).multiplyScalar(e); });
      S.wires.visible = e < 0.03;
      S.shadow.position.y = -S.BH - 0.05 - 32 * e;
      S.units.forEach(function (un) { if (Math.abs(un.f - un.ft) > 0.001) { un.f += (un.ft - un.f) * (1 - Math.pow(0.002, dt)); if (Math.abs(un.f - un.ft) < 0.002) un.f = un.ft; applyFade(un); } });
      /* where to look */
      if (st.sel === 'all') { tgtGoal.set(0, S.centerY + (st.use ? 18 : 0) - 9 * e, 0); distGoal = base * (st.use ? 1.5 : 1) * (1 + 0.55 * e); }
      else {
        var un = null; for (var i = 0; i < S.units.length; i++) if (S.units[i].id === st.sel) un = S.units[i];
        box3.makeEmpty(); un.groups.forEach(function (g) { g.updateWorldMatrix(true, true); g.traverseVisible(function (o) { if (o.isMesh && !o.userData.fixed) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bx.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); box3.union(bx); } }); });
        box3.getCenter(tgtGoal); var sz = box3.getSize(tmp).length();
        distGoal = Math.max(65, sz * 3.0);
      }
      /* keep the model clear of the button column, and of the info card while a unit is explored */
      ck += ((st.sel === 'all' ? 0 : 1) - ck) * (1 - Math.pow(0.004, dt));
      cam.setViewOffset(W, Hh, -PANEL / 2 + 115 * ck, 50 * ck, W, Hh);
      tgt.lerp(tgtGoal, 1 - Math.pow(0.004, dt));
      dist += (distGoal * zoom - dist) * (1 - Math.pow(0.004, dt));
      /* slow turn on the Y axis; turns to face an explored unit, holds, then carries on */
      if (idle > 0) idle -= dt;
      else if (thGoal != null) { th += (thGoal - th) * (1 - Math.pow(0.01, dt)); ph += (1.2 - ph) * (1 - Math.pow(0.05, dt)); if (Math.abs(thGoal - th) < 0.01) { thGoal = null; } }
      else if (hold > 0) hold -= dt;
      else th += dt * 0.26;
      ph = Math.max(0.15, Math.min(Math.PI - 0.15, ph)); zoom = Math.max(0.35, Math.min(2.5, zoom));
      cam.position.set(tgt.x + dist * Math.sin(ph) * Math.sin(th), tgt.y + dist * Math.cos(ph), tgt.z + dist * Math.sin(ph) * Math.cos(th));
      cam.lookAt(tgt);
      renderer.render(S.scene, cam);
      /* labels: all when Labels is on; otherwise only the explored unit's */
      S.tags.forEach(function (t) {
        var show = (st.labels && (t.unit !== 'use' || st.use)) || (t.unit === st.sel);
        if (show) for (var o = t.a; o; o = o.parent) if (!o.visible) { show = false; break; }
        if (show) { t.a.getWorldPosition(tmp).project(cam); show = tmp.z < 1; }
        if (!show) { if (!t.el.hidden) t.el.hidden = true; return; }
        t.el.hidden = false;
        t.el.style.transform = 'translate(' + (((tmp.x * 0.5 + 0.5) * W) | 0) + 'px,' + (((-tmp.y * 0.5 + 0.5) * Hh) | 0) + 'px) translate(-50%,-135%)';
      });
      raf = requestAnimationFrame(frameLoop);
    }
    raf = requestAnimationFrame(frameLoop);

    return function () {
      alive = false; cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPD); canvas.removeEventListener('pointermove', onPM); canvas.removeEventListener('pointerup', onPU);
      canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onTE);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (S.labelsEl.parentNode) S.labelsEl.parentNode.removeChild(S.labelsEl);
      S.parts.forEach(function (g) { g.position.set(0, 0, 0); });
    };
  };
})();
