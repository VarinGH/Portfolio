/* Eye drop compliance tracker: a to-scale 3D model of the bench prototype, in millimetres.
   Bottle and cap are modelled from a photo of a Vigamox Drop-Tainer. The XIAO board is the real Seeed CAD model
   (STEP converted to media/xiao.bin by tools: 16-bit positions, 8-bit normals, grouped by material).
   Uses the local copy of three.js (lib/), so it works offline.
   One renderer is kept for the whole session and its canvas is moved into the figure each time the page is shown,
   so turning pages never leaks WebGL contexts. */
(function () {
  if (!window.ANIMS) window.ANIMS = {};
  var S = null; /* the scene, built once */

  var UNITS = [
    ['all', 'Overview', 'Bench prototype clipped to a Vigamox bottle, drawn to scale: about 25 mm wide, 33 mm deep, 46 mm tall. Tap a part to look at it on its own.'],
    ['bottle', 'Bottle', 'Vigamox Drop-Tainer, modelled from a photo: frosted LDPE, yellow solution, white ribbed cap, maroon shield label. 18.5 mm wide, 46 mm tall with the cap.'],
    ['camera', 'Camera + IR', 'OV2640 camera on its ribbon, brought up to the shoulder and tilted 23° so it looks past the nozzle at the eye. The 850 nm infrared LED beside it is angled at the same spot.'],
    ['board', 'XIAO board', 'Seeed XIAO ESP32, 21 × 17.5 mm, upright on the side of the bottle with USB-C at the bottom for the dock. It wakes when the bottle turns upside down, time-stamps each drop and stores the clip.'],
    ['battery', 'Button cell', 'CR2450 lithium button cell, 24.5 mm across and 5 mm thick, between the cradle and the board. A supercapacitor is planned beside it to carry the camera burst.'],
    ['cradle', 'Cradle', 'Printed TPU cradle: two bands round the bottle, a plate that carries the cell and the board, and a post that holds the camera at the shoulder.']
  ];
  /* the angle to show each unit from when it is picked (radians around the Y axis; 0 = the side the electronics are on) */
  var FACE = { bottle: 1.25, camera: 0.55, board: 0.35, battery: 0.45, cradle: 0.85 };

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
    var camera = new T.PerspectiveCamera(30, 1, 6, 900); /* a tight near/far range keeps depth precise, so nothing flickers */
    var key = new T.DirectionalLight(0xfff6ea, 2.2); key.position.set(70, 120, 90); scene.add(key);
    var rimL = new T.DirectionalLight(0xdfe9ff, 1.2); rimL.position.set(-90, 50, -80); scene.add(rimL);
    scene.add(new T.HemisphereLight(0xffffff, 0x9aa3ad, 0.35));

    function mat(c, o) { var m = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); return m; }
    function phys(c, o) { var m = new T.MeshPhysicalMaterial(Object.assign({ color: c, roughness: 0.5, metalness: 0 }, o || {})); m.color.convertSRGBToLinear(); return m; }
    function box(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x || 0, y || 0, z || 0); return o; }
    function cyl(r1, r2, h, m, x, y, z, seg) { var o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 32), m); o.position.set(x || 0, y || 0, z || 0); return o; }
    /* round loft through stations [y, r]; ribs = [count, depth, yFrom, yTo] cuts vertical ribs into that height range */
    function loft(st, m, closed, ribs) {
      var seg = ribs ? ribs[0] * 6 : 72, v = [], idx = [];
      st.forEach(function (s) {
        var rib = ribs && s[0] >= ribs[2] - 1e-6 && s[0] <= ribs[3] + 1e-6;
        for (var j = 0; j < seg; j++) { var a = j / seg * Math.PI * 2, r = s[1];
          if (rib) r -= ribs[1] * (0.5 - 0.5 * Math.tanh(4 * Math.cos(ribs[0] * a)));
          v.push(Math.cos(a) * r, s[0], Math.sin(a) * r); }
      });
      for (var i = 0; i < st.length - 1; i++) for (var j = 0; j < seg; j++) { var a = i * seg + j, b = (i + 1) * seg + j, c = i * seg + (j + 1) % seg, d = (i + 1) * seg + (j + 1) % seg; idx.push(a, b, c, b, d, c); }
      if (closed !== false) { var n = v.length / 3; v.push(0, st[0][0], 0, 0, st[st.length - 1][0], 0); var top = (st.length - 1) * seg;
        for (var k = 0; k < seg; k++) { idx.push(n, k, (k + 1) % seg); idx.push(n + 1, top + (k + 1) % seg, top + k); } }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.computeVertexNormals();
      return new T.Mesh(g, m);
    }
    function ribbon(pts, w, m) {
      var cur = new T.CatmullRomCurve3(pts), N = 40, v = [], idx = [];
      for (var i = 0; i <= N; i++) { var p = cur.getPoint(i / N); v.push(p.x - w / 2, p.y, p.z, p.x + w / 2, p.y, p.z); }
      for (var j = 0; j < N; j++) { var a = j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.setIndex(idx); g.computeVertexNormals();
      return new T.Mesh(g, m);
    }
    function wire(pts, color) { return new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 32, 0.45, 8, false), phys(color, { roughness: 0.32, clearcoat: 0.5 })); }

    var root = new T.Group(); scene.add(root);
    var U = {}; UNITS.forEach(function (u) { if (u[0] !== 'all') U[u[0]] = []; });
    var tags = [], labelsEl = document.createElement('div'); labelsEl.className = 'ed3-labels';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'ed3-lead'); labelsEl.appendChild(svg);
    function tag(group, x, y, z, text, unit) {
      var a = new T.Object3D(); a.position.set(x, y, z); group.add(a);
      var el = document.createElement('div'); el.className = 'ed3-tag'; el.textContent = text; el.hidden = true; labelsEl.appendChild(el);
      var ln = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); svg.appendChild(ln);
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('r', '2.2'); svg.appendChild(dot);
      tags.push({ a: a, el: el, ln: ln, dot: dot, unit: unit });
    }

    /* ---- bottle, from the photo (scaled to the 18.5 mm body) */
    var R = 9.25, HB = 23.4, HS = 25.8, HN = 27.9, HR = 39.2, HT = 45.4, TOP = 46.2;
    var yTip = 42;
    var bottle = new T.Group(); root.add(bottle); U.bottle.push(bottle);
    var st = [[0, R - 2.4], [0.25, R - 1.3], [0.8, R - 0.5], [1.8, R - 0.05], [2.4, R], [HB, R]];
    [0.25, 0.5, 0.75, 1].forEach(function (t) { st.push([HB + (HS - HB) * t, R - (R - 8.3) * (1 - Math.cos(t * Math.PI / 2))]); });
    st.push([HS + 0.5, 7.95], [HN, 7.95], [HN + 0.01, 6.4], [31, 6.4], [31.6, 4.3], [36, 3.0], [40.6, 1.6], [41.6, 1.2], [yTip, 0.7]);
    var liq = loft([[1.3, R - 0.95], [HB, R - 0.95], [HB + 1.0, R - 1.15], [HB + 1.7, 7.7], [HB + 2.0, 6.9]], phys(0xcfd23c, { roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.9 }));
    liq.renderOrder = 1; bottle.add(liq);
    var shell = loft(st, phys(0xf4f5f0, { transparent: true, opacity: 0.66, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.5, depthWrite: false, side: T.DoubleSide }));
    shell.renderOrder = 2; bottle.add(shell);
    /* paper label: off-white all round, the maroon shield on the face (no text) */
    var LB = 1.9, LT = 20.4, lc = document.createElement('canvas'); lc.width = 2048; lc.height = 640; var lx = lc.getContext('2d');
    lx.fillStyle = '#f3f1ea'; lx.fillRect(0, 0, 2048, 640);
    var pxmm = 640 / (LT - LB), cx = 1024, hw = 6.9 * 2048 / (2 * Math.PI * R);                       /* shield half-width, 6.9 mm, in texture pixels */
    var yS = (LT - 19.9) * pxmm, yK = (LT - 8.7) * pxmm, yP = (LT - 2.4) * pxmm;
    function shield(inset) {
      var w = hw - inset; lx.beginPath(); lx.moveTo(cx - w, yS + inset); lx.lineTo(cx + w, yS + inset); lx.lineTo(cx + w, yK);
      lx.bezierCurveTo(cx + w, yK + (yP - yK) * 0.55, cx + w * 0.42, yP - inset * 1.2 - 8, cx, yP - inset * 1.4); lx.bezierCurveTo(cx - w * 0.42, yP - inset * 1.2 - 8, cx - w, yK + (yP - yK) * 0.55, cx - w, yK); lx.closePath();
    }
    shield(0); var sg = lx.createLinearGradient(0, yS, 0, yP); sg.addColorStop(0, '#80302a'); sg.addColorStop(1, '#6a2420'); lx.fillStyle = sg; lx.fill();
    shield(9); lx.strokeStyle = 'rgba(232,206,196,.55)'; lx.lineWidth = 3; lx.stroke();
    var lTex = new T.CanvasTexture(lc); lTex.encoding = T.sRGBEncoding; lTex.anisotropy = 8;
    (function () { /* label band with UVs; the shield faces +x */
      var seg = 96, v = [], uv = [], idx = [], rr = R + 0.07;
      for (var i = 0; i <= 1; i++) for (var j = 0; j <= seg; j++) { var u = j / seg, a = (u - 0.5) * Math.PI * 2; v.push(Math.cos(a) * rr, i ? LT : LB, -Math.sin(a) * rr); uv.push(u, i); }
      for (var k = 0; k < seg; k++) idx.push(k, k + 1, k + seg + 1, k + 1, k + seg + 2, k + seg + 1);
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(v, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      bottle.add(new T.Mesh(g, new T.MeshStandardMaterial({ map: lTex, roughness: 0.7, side: T.DoubleSide })));
    })();
    tag(bottle, R * 0.7, 10, -R * 0.7, 'Vigamox bottle', 'bottle');
    /* white cap: ribbed lower part, smooth taper to a rounded top */
    var cap = new T.Group(), capIn = new T.Group(); cap.add(capIn); root.add(cap); U.bottle.push(cap); cap.userData.off = V(0, 16, 0);
    var cst = [[HN, 7.95], [HN + 0.4, 8.2]], ys;
    for (ys = HN + 0.8; ys < HR; ys += 1.4) cst.push([ys, 8.2 - 0.12 * (ys - HN) / (HR - HN)]);
    cst.push([HR, 8.08], [HR + 0.6, 8.0], [HR + 2.5, 7.6], [HR + 4.5, 7.0], [HT, 6.7], [HT + 0.35, 6.5], [HT + 0.65, 6.0], [TOP, 5.2], [TOP + 0.02, 0.01]);
    capIn.add(loft(cst, phys(0xf3f5f1, { roughness: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.5 }), true, [40, 0.32, HN + 0.8, HR - 0.4]));
    tag(capIn, 0, TOP, 0, 'Cap', 'bottle');

    /* ---- printed TPU cradle: two bands, a plate on the electronics side (+z), a post up to the shoulder */
    var cradle = new T.Group(); root.add(cradle); U.cradle.push(cradle);
    var cradleMat = mat(0x3f4348, { roughness: 0.9 });
    var bandIn = R + 0.15, bandOut = bandIn + 1.6, zP0 = R + 0.2, zP1 = zP0 + 2;
    var bs = new T.Shape(); bs.absarc(0, 0, bandOut, 0, Math.PI * 2, false);
    var bh = new T.Path(); bh.absarc(0, 0, bandIn, 0, Math.PI * 2, true); bs.holes.push(bh);
    [[0.3, 3.0], [20.6, 2.8]].forEach(function (b) { var g = new T.ExtrudeGeometry(bs, { depth: b[1], bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.25, bevelSegments: 2, curveSegments: 56 }); g.rotateX(-Math.PI / 2); var m = new T.Mesh(g, cradleMat); m.position.y = b[0] + 0.3; cradle.add(m); });
    cradle.add(box(20, 23.6, 2, cradleMat, 0, 11.9, (zP0 + zP1) / 2));
    var CY = 12.3, CR = 12.25, czC = zP1 + 2.5;            /* button cell centre */
    var zB = czC + 2.5 + 0.7;                               /* back of the board */
    [[-7, 4], [7, 4], [-7, 20.6], [7, 20.6]].forEach(function (p) { cradle.add(cyl(0.9, 0.9, zB - zP1, cradleMat, p[0], p[1], (zP1 + zB) / 2, 16).rotateX(Math.PI / 2)); }); /* standoffs */
    var camY = 29.2, camZ = 14.2, tilt = -23 * Math.PI / 180;
    cradle.add(box(5, camY - 23.5, 2, cradleMat, 0, (camY + 23.5) / 2 - 0.6, zP0 + 2.2));
    tag(cradle, 0, 2, bandOut, 'Printed TPU cradle', 'cradle');

    /* ---- CR2450 button cell, + face outward */
    var coin = new T.Group(); root.add(coin); U.battery.push(coin); coin.userData.off = V(0, 0, 11);
    var cell = new T.Group(); cell.position.set(0, CY, czC); cell.rotation.x = Math.PI / 2; coin.add(cell);
    var ct = document.createElement('canvas'); ct.width = ct.height = 512; var cg2 = ct.getContext('2d');
    var cgr = cg2.createRadialGradient(256, 256, 20, 256, 256, 256); cgr.addColorStop(0, '#dcdfe2'); cgr.addColorStop(1, '#b4b9be'); cg2.fillStyle = cgr; cg2.fillRect(0, 0, 512, 512);
    cg2.strokeStyle = 'rgba(255,255,255,.22)'; cg2.lineWidth = 1; for (var cr = 20; cr < 250; cr += 3) { cg2.beginPath(); cg2.arc(256, 256, cr, 0, 6.2832); cg2.stroke(); }
    cg2.strokeStyle = 'rgba(55,61,68,.6)'; cg2.lineWidth = 3; cg2.beginPath(); cg2.arc(256, 256, 228, 0, 6.2832); cg2.stroke();
    cg2.fillStyle = '#3a4046'; cg2.textAlign = 'center'; cg2.textBaseline = 'middle';
    cg2.font = '700 64px "Source Sans 3",Arial,sans-serif'; cg2.fillText('+', 256, 118);
    cg2.font = '700 80px "Source Sans 3",Arial,sans-serif'; cg2.fillText('CR2450', 256, 230);
    cg2.font = '600 56px "Source Sans 3",Arial,sans-serif'; cg2.fillText('3 V  LITHIUM', 256, 312);
    var cTex = new T.CanvasTexture(ct); cTex.encoding = T.sRGBEncoding; cTex.anisotropy = 8;
    var canM = phys(0xd6dade, { metalness: 0.7, roughness: 0.32, envMapIntensity: 1.7 });
    cell.add(cyl(CR, CR, 4.6, canM, 0, -0.2, 0, 72));
    var topFace = new T.Mesh(new T.CircleGeometry(CR - 0.35, 72), new T.MeshStandardMaterial({ map: cTex, metalness: 0.35, roughness: 0.42, envMapIntensity: 1.2 }));
    topFace.rotation.x = Math.PI / 2; topFace.rotation.z = Math.PI; topFace.position.y = -2.51; cell.add(topFace);
    var rim = new T.Mesh(new T.TorusGeometry(CR - 0.35, 0.35, 12, 72), canM); rim.rotation.x = Math.PI / 2; rim.position.y = -2.15; cell.add(rim);
    cell.add(cyl(CR - 1.0, CR - 1.0, 0.3, mat(0x15171a, { roughness: 0.75 }), 0, 2.25, 0, 72));
    cell.add(cyl(CR - 2.6, CR - 2.6, 0.25, canM, 0, 2.375, 0, 72));
    tag(coin, CR * 0.72, CY - CR * 0.72, czC + 2.5, 'CR2450 button cell', 'battery');

    /* ---- XIAO board, upright, components outward, USB-C down. Geometry arrives from media/xiao.bin. */
    var board = new T.Group(); root.add(board); U.board.push(board); board.userData.off = V(0, 0, 23);
    var xg = new T.Group(); board.add(xg);
    xg.setRotationFromMatrix(new T.Matrix4().makeBasis(V(0, -1, 0), V(0, 0, 1), V(-1, 0, 0))); xg.position.set(0, CY, zB);
    var XM = {
      pcb: phys(0x141518, { roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.3, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
      core: mat(0x4a3c27, { roughness: 0.8 }),
      gold: mat(0xe2b862, { metalness: 1, roughness: 0.25, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }),
      steel: mat(0xc3c7cc, { metalness: 1, roughness: 0.32 }),
      black: mat(0x0e0f11, { roughness: 0.5 }),
      white: mat(0xf2f0e8, { roughness: 0.5 })
    };
    var flexM = phys(0xc07a22, { roughness: 0.3, clearcoat: 0.7, side: T.DoubleSide });
    xg.add(box(3.6, 1.1, 6.6, mat(0xe9e2cc, { roughness: 0.55 }), -8.2, 1.55, -1.2)); /* ribbon connector near the top */
    function loadBoard() {
      var fb = box(21, 1, 17.8, XM.pcb, 0, 0.5, 0); xg.add(fb); /* stand-in until the real model has loaded */
      if (!window.fetch) return;
      fetch('media/xiao.bin').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (buf) {
        var hl = new DataView(buf).getUint32(0, true), head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, hl))), off = 4 + hl;
        head.forEach(function (h) {
          var p16 = new Int16Array(buf, off, h.n * 3); off += h.n * 6;
          var n8 = new Int8Array(buf, off, h.n * 3); off += h.n * 3; off += off % 2;
          var id = new Uint16Array(buf, off, h.i); off += h.i * 2; off += (4 - off % 4) % 4;
          var pos = new Float32Array(h.n * 3), nor = new Float32Array(h.n * 3);
          for (var i = 0; i < h.n * 3; i++) { pos[i] = p16[i] * 0.001; nor[i] = n8[i] / 127; }
          var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nor, 3)); g.setIndex(new T.BufferAttribute(new Uint16Array(id), 1));
          g.computeBoundingBox(); xg.add(new T.Mesh(g, XM[h.k] || XM.black));
        });
        xg.remove(fb);
      }).catch(function () {});
    }
    loadBoard();
    tag(board, -1, CY + 3, zB + 3.2, 'XIAO ESP32 board', 'board');

    /* ---- camera head and IR LED at the shoulder, both aimed at the cornea 25 mm above the tip */
    var camU = new T.Group(); root.add(camU); U.camera.push(camU); camU.userData.off = V(0, 6, 17);
    var cam = new T.Group(), blk = mat(0x101113, { roughness: 0.45 });
    cam.add(box(17, 1.6, 9, cradleMat, -2.8, -0.8, 0));                                     /* bracket on the post */
    cam.add(box(8, 1.0, 8, phys(0x1b3a2a, { roughness: 0.4, clearcoat: 0.6 }), 0, 0.5, 0)); /* camera PCB */
    cam.add(box(6.2, 2.0, 6.2, blk, 0, 2, 0), cyl(3.1, 3.1, 3.0, blk, 0, 4.4, 0), cyl(2.4, 2.7, 0.5, blk, 0, 6.15, 0));
    cam.add(cyl(1.6, 1.6, 0.2, phys(0x1a2a55, { roughness: 0.02, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0 }), 0, 6.42, 0));
    var aim = V(0, yTip + 25, 0), lensW = V(0, camY + 6.4 * Math.cos(tilt), camZ + 6.4 * Math.sin(tilt));
    var led = new T.Group(), ledM = phys(0xe8eefb, { transparent: true, opacity: 0.6, roughness: 0.05, clearcoat: 1 });
    led.add(cyl(2.9, 2.9, 1, ledM, 0, 0.5, 0), cyl(2.5, 2.5, 5, ledM, 0, 3.5, 0));
    var dome = new T.Mesh(new T.SphereGeometry(2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), ledM); dome.position.y = 6; led.add(dome);
    led.add(cyl(0.9, 0.9, 1.2, mat(0x3a3f47, { metalness: 0.6, roughness: 0.4 }), 0, 2.4, 0));
    led.position.set(-7, 0, 0);
    var ledToe = Math.atan2(7, aim.distanceTo(lensW) + 6); led.rotation.z = -ledToe; cam.add(led);
    var L = 46, cg = new T.ConeGeometry(L * Math.tan(30 * Math.PI / 180), L, 40, 1, true); cg.translate(0, -L / 2, 0); cg.rotateX(Math.PI);
    var cone = new T.Mesh(cg, new T.MeshBasicMaterial({ color: new T.Color(0x3d8bff).convertSRGBToLinear(), transparent: true, opacity: 0.13, side: T.DoubleSide, depthWrite: false }));
    cone.position.y = 6.4; cam.add(cone);
    cam.position.set(0, camY, camZ); cam.rotation.x = tilt; cam.updateMatrix(); camU.add(cam);
    tag(cam, 0, 6.6, 0, 'OV2640 camera', 'camera');
    tag(led, 0, 8.6, 0, 'IR LED, 850 nm', 'camera');
    /* ribbon from the connector at the top of the board up to the back of the camera */
    var flex = new T.Group(); root.add(flex); U.camera.push(flex);
    var pc = V(0, -0.2, 3.8).applyMatrix4(cam.matrix), pConn = V(1.2, CY + 8.2, zB + 2.1);
    flex.add(ribbon([pConn, V(1.2, CY + 10.6, zB + 2.6), V(0.6, CY + 12.6, zB + 0.4), V(0, pc.y - 1.6, pc.z + 1.6), pc], 5.8, flexM));

    /* ---- leads (hidden in the exploded view and when one unit is shown on its own) */
    var wires = new T.Group(); root.add(wires);
    [[-1.5, 0xd23b3b], [1.5, 0x222428]].forEach(function (w) { wires.add(wire([V(w[0], CY + CR - 0.3, czC + 1.8), V(w[0], CY + CR + 0.8, czC + 2.8), V(w[0] * 1.3, CY + 9.6, zB - 0.3), V(w[0] * 1.3, CY + 8.6, zB + 0.1)], w[1])); });
    [[-1.27, 0xe2b100], [1.27, 0x2f9e55]].forEach(function (w) { var p = V(-7 + w[0], -0.2, 0).applyMatrix4(cam.matrix);
      wires.add(wire([p, V(p.x, p.y - 2.5, p.z + 0.6), V(-7 + w[0] * 1.6, CY + 11.5, zB + 1.4), V(-6.6 + w[0], CY + 10.2, zB + 1.3)], w[1])); });

    /* ---- the eye in use, 25 mm above the tip */
    var eye = new T.Group(); root.add(eye); eye.visible = false;
    var ball = new T.Mesh(new T.SphereGeometry(12, 48, 32), phys(0xf6f1ea, { roughness: 0.25, clearcoat: 1 })); ball.position.y = yTip + 37; eye.add(ball);
    eye.add(cyl(5.9, 5.9, 0.5, mat(0x6a4a2e, { roughness: 0.6 }), 0, yTip + 25.4, 0, 48), cyl(2, 2, 0.6, mat(0x050506), 0, yTip + 25.3, 0, 24));
    tag(eye, 12, yTip + 34, 0, 'Eye, 25 mm from the tip', 'use');

    /* ---- soft contact shadow */
    var sc = document.createElement('canvas'); sc.width = sc.height = 128; var sx = sc.getContext('2d'), grd = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, 'rgba(20,24,30,.5)'); grd.addColorStop(.45, 'rgba(20,24,30,.2)'); grd.addColorStop(1, 'rgba(20,24,30,0)'); sx.fillStyle = grd; sx.fillRect(0, 0, 128, 128);
    var shadow = new T.Mesh(new T.PlaneGeometry(56, 60), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -0.06, 4); scene.add(shadow);

    var units = Object.keys(U).map(function (id) { return { id: id, groups: U[id] }; });
    return { renderer: renderer, canvas: canvas, scene: scene, camera: camera, root: root, units: units, tags: tags, labelsEl: labelsEl, svg: svg,
      parts: [cap, coin, board, camU], flex: flex, capGroup: cap, wires: wires, eye: eye, cone: cone, shadow: shadow, centerY: 22 };
  }

  window.ANIMS.eyedrop = function (frame) {
    if (!window.THREE) { frame.innerHTML = '<p class="ed3-err">The 3D library did not load.</p>'; return function () {}; }
    if (!S) { try { S = build(); } catch (e) { frame.innerHTML = '<p class="ed3-err">This tablet could not start 3D drawing.</p>'; return function () {}; } }
    var T = THREE, cam = S.camera, renderer = S.renderer, canvas = S.canvas;
    frame.classList.add('ed3');
    var ui = document.createElement('div'); ui.className = 'ed3-ui';
    ui.innerHTML = '<div class="ed3-list" role="group" aria-label="Explore the units"><div class="ed3-h">Explore</div>' +
      UNITS.map(function (u) { return '<button type="button" data-u="' + u[0] + '" aria-pressed="' + (u[0] === 'all') + '">' + u[1] + '</button>'; }).join('') + '</div>' +
      '<div class="ed3-tools"><button type="button" data-t="explode" aria-pressed="false">Explode</button><i></i><button type="button" data-t="use" aria-pressed="false">In use</button><i></i><button type="button" data-t="labels" aria-pressed="false">Labels</button></div>' +
      '<div class="ed3-card"><b></b><span></span></div>' +
      '<div class="ed3-hint">Drag to turn · pinch to zoom</div>';
    frame.appendChild(canvas); frame.appendChild(S.labelsEl); frame.appendChild(ui);
    var card = ui.querySelector('.ed3-card'), cardB = card.querySelector('b'), cardS = card.querySelector('span'), hint = ui.querySelector('.ed3-hint');

    var st = { sel: 'all', explode: false, use: false, labels: false };
    /* Everything that moves is a spring or has friction, so nothing jumps: {x: value, v: speed} */
    function sp(x) { return { x: x, v: 0 }; }
    function stepS(o, goal, k, z, h) { o.v += (k * (goal - o.x) - 2 * z * Math.sqrt(k) * o.v) * h; o.x += o.v * h; }
    var A = sp(0.75), P = sp(1.22), Z = sp(1), E = sp(0), D = sp(150), TX = sp(0), TY = sp(S.centerY), TZ = sp(4);
    var zmGoal = 1, distGoal = 150, gx = 0, gy = S.centerY, gz = 4;
    var autoV = 0, quiet = 20; /* spin speed; seconds since the last touch */
    var AUTO = 0.6, RESUME = 20, PH_MIN = 0.3, PH_MAX = 2.5, ZM_MIN = 0.55, ZM_MAX = 2.2, SENS = 0.011;
    var raf = 0, alive = true, last = 0, box3 = new T.Box3(), bx = new T.Box3(), tmp = new T.Vector3(), swapT = 0;
    var W = 0, Hh = 0, PANEL = 156, sc = 1, base = 150;

    function unitInfo(id) { for (var i = 0; i < UNITS.length; i++) if (UNITS[i][0] === id) return UNITS[i]; }
    function setCard() { var info = unitInfo(st.sel); cardB.textContent = info[1]; cardS.textContent = info[2]; card.classList.toggle('on', st.sel !== 'all'); }
    function showOnly(id) {
      S.units.forEach(function (un) { var on = id === 'all' || un.id === id; un.groups.forEach(function (g) { g.visible = on; }); });
      S.capGroup.visible = (id === 'all' || id === 'bottle') && !st.use;
      S.shadow.visible = id === 'all';
    }
    function goal() { /* what to centre on and how far away to stand */
      var e = Math.max(0, E.x);
      if (st.sel === 'all') { gx = 0; gy = S.centerY + (st.use ? 22 : 0) + 4 * e; gz = 4 + 6 * e; distGoal = base * (st.use ? 1.5 : 1) * (1 + 0.5 * e); return; }
      var un = null; for (var i = 0; i < S.units.length; i++) if (S.units[i].id === st.sel) un = S.units[i];
      box3.makeEmpty();
      un.groups.forEach(function (g) { g.updateWorldMatrix(true, true); g.traverseVisible(function (o) { if (o.isMesh && o !== S.cone) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bx.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); box3.union(bx); } }); });
      if (box3.isEmpty()) return;
      box3.getCenter(tmp); gx = tmp.x; gy = tmp.y; gz = tmp.z; distGoal = Math.max(70, box3.getSize(tmp).length() * 3.4);
    }
    /* Picking a unit: a quick dip of the picture, the others are hidden, and the chosen part sits in the middle. No fading of materials, so nothing stutters. */
    function select(id) {
      if (id === st.sel) return;
      st.sel = id;
      ui.querySelectorAll('[data-u]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.u === id)); });
      setCard();
      canvas.classList.add('dip'); S.labelsEl.classList.add('dip'); swapT = 0.13;
    }
    function swap() {
      canvas.classList.remove('dip'); S.labelsEl.classList.remove('dip');
      showOnly(st.sel); S.eye.visible = st.use && st.sel === 'all'; S.wires.visible = st.sel === 'all' && E.x < 0.03;
      goal(); TX.x = gx; TY.x = gy; TZ.x = gz; TX.v = TY.v = TZ.v = 0;
      D.x = distGoal * 1.14; D.v = 0; zmGoal = 1; Z.x = 1; Z.v = 0;           /* settles in with a small spring */
      if (FACE[st.sel] != null) { var d = FACE[st.sel] - A.x; A.x += Math.atan2(Math.sin(d), Math.cos(d)); P.x = 1.2; }
      A.v = 0; P.v = 0;
    }
    function toggle(k) {
      st[k] = !st[k];
      ui.querySelector('[data-t="' + k + '"]').setAttribute('aria-pressed', String(st[k]));
      S.eye.visible = st.use && st.sel === 'all'; S.cone.visible = st.use;
      S.capGroup.visible = (st.sel === 'all' || st.sel === 'bottle') && !st.use; /* the cap is off while the drop goes in */
    }
    st.sel = 'all'; showOnly('all'); S.eye.visible = false; S.cone.visible = false;
    setCard();
    ui.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.u) select(b.dataset.u); else if (b.dataset.t) toggle(b.dataset.t);
    });

    /* Turning by hand: the model follows the finger 1:1, keeps its momentum when let go, and stays where it stops.
       The spin only comes back after 20 s untouched. Past the pitch or zoom limits it resists, then springs back with a small bounce. */
    var drag = false, pinching = false, lx = 0, ly = 0, lt = 0, pd = 0, wheelT = 0;
    function down(x, y, t) { drag = true; lx = x; ly = y; lt = t; A.v = 0; P.v = 0; quiet = 0; hint.classList.add('off'); }
    function move(x, y, t) {
      var dt = Math.max(0.004, (t - lt) / 1000), dth = -(x - lx) / sc * SENS, dph = -(y - ly) / sc * SENS; lx = x; ly = y; lt = t;
      if ((P.x < PH_MIN && dph < 0) || (P.x > PH_MAX && dph > 0)) dph *= 0.3;
      A.x += dth; P.x += dph;
      A.v = A.v * 0.55 + (dth / dt) * 0.45; P.v = P.v * 0.55 + (dph / dt) * 0.45;
      quiet = 0;
    }
    function up(t) { drag = false; if (t - lt > 90) { A.v = 0; P.v = 0; } }
    function zoomBy(f) { var g = zmGoal * f; if (g < ZM_MIN || g > ZM_MAX) g = zmGoal * Math.pow(f, 0.35); zmGoal = g; quiet = 0; hint.classList.add('off'); }
    function onPD(ev) { if (ev.pointerType === 'touch') return; down(ev.clientX, ev.clientY, ev.timeStamp); try { canvas.setPointerCapture(ev.pointerId); } catch (x) {} }
    function onPM(ev) { if (ev.pointerType === 'touch' || !drag) return; move(ev.clientX, ev.clientY, ev.timeStamp); }
    function onPU(ev) { if (ev.pointerType === 'touch') return; up(ev.timeStamp); }
    function onWheel(ev) { ev.preventDefault(); zoomBy(1 + Math.sign(ev.deltaY) * 0.08); wheelT = 0.25; }
    function onTS(ev) { ev.stopPropagation(); var t = ev.touches;
      if (t.length === 1) down(t[0].clientX, t[0].clientY, ev.timeStamp);
      else if (t.length === 2) { drag = false; pinching = true; pd = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); A.v = 0; P.v = 0; quiet = 0; } }
    function onTM(ev) { ev.stopPropagation(); ev.preventDefault(); var t = ev.touches;
      if (t.length === 1 && drag) move(t[0].clientX, t[0].clientY, ev.timeStamp);
      else if (t.length === 2) { var d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); if (pd) zoomBy(pd / d); pd = d; } }
    function onTE(ev) { ev.stopPropagation(); var t = ev.touches;
      if (t.length === 0) { up(ev.timeStamp); pinching = false; pd = 0; }
      else if (t.length === 1) { pinching = false; pd = 0; drag = true; lx = t[0].clientX; ly = t[0].clientY; lt = ev.timeStamp; A.v = 0; P.v = 0; } }
    canvas.addEventListener('pointerdown', onPD); canvas.addEventListener('pointermove', onPM); canvas.addEventListener('pointerup', onPU); canvas.addEventListener('pointercancel', onPU);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTS, { passive: true }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onTE); canvas.addEventListener('touchcancel', onTE);
    ui.addEventListener('touchstart', function (ev) { ev.stopPropagation(); }, { passive: true });

    function size() {
      var w = frame.clientWidth, h = frame.clientHeight; if (!w || !h) return;
      sc = frame.getBoundingClientRect().width / w || 1;
      var pr = Math.min(2, (window.devicePixelRatio || 1) * sc);
      if (w !== W || h !== Hh || Math.abs(renderer.getPixelRatio() - pr) > 0.01) {
        W = w; Hh = h; renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
        cam.aspect = w / h; cam.updateProjectionMatrix();
        S.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        base = 36 / Math.tan(cam.fov * Math.PI / 360); /* about 72 mm of height fills the frame */
      }
    }
    size(); D.x = base * 1.35; /* the camera glides in when the page opens */

    function sim(h) {
      if (!drag) {
        A.x += A.v * h; A.v *= Math.exp(-3.2 * h); if (Math.abs(A.v) < 0.015) A.v = 0;
        if (P.x < PH_MIN || P.x > PH_MAX) stepS(P, P.x < PH_MIN ? PH_MIN : PH_MAX, 150, 0.55, h);
        else { P.x += P.v * h; P.v *= Math.exp(-4 * h); }
      }
      var spin = !drag && !pinching && quiet >= RESUME;
      autoV += ((spin ? AUTO : 0) - autoV) * (1 - Math.exp(-h * (spin ? 1.2 : 6)));
      A.x += autoV * h;
      stepS(Z, zmGoal, 260, 0.9, h);
      stepS(E, st.explode ? 1 : 0, 110, 0.6, h);
      stepS(D, distGoal * Z.x, 90, 0.72, h);
      stepS(TX, gx, 90, 0.9, h); stepS(TY, gy, 90, 0.9, h); stepS(TZ, gz, 90, 0.9, h);
    }

    var corners = []; for (var c = 0; c < 8; c++) corners.push(new T.Vector3());
    function frameLoop(now) {
      if (!alive) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      size();
      if (swapT > 0) { swapT -= dt; if (swapT <= 0) swap(); }
      if (!drag) quiet += dt;
      if (wheelT > 0) wheelT -= dt; else if (!pinching) zmGoal = Math.max(ZM_MIN, Math.min(ZM_MAX, zmGoal));
      var e = Math.max(0, E.x);
      S.parts.forEach(function (g) { g.position.copy(g.userData.off).multiplyScalar(e); });
      S.flex.visible = e < 0.03 && (st.sel === 'all' || st.sel === 'camera');
      S.wires.visible = e < 0.03 && st.sel === 'all';
      goal();
      var n = Math.ceil(dt / 0.008), h = dt / n; for (var j = 0; j < n; j++) sim(h);
      /* keep the model clear of the list on the left; a little higher while the info card is up */
      cam.setViewOffset(W, Hh, -PANEL / 2, st.sel === 'all' ? 0 : 52, W, Hh);
      var ph = Math.max(0.05, Math.min(Math.PI - 0.05, P.x)), dd = Math.max(30, D.x);
      cam.position.set(TX.x + dd * Math.sin(ph) * Math.sin(A.x), TY.x + dd * Math.cos(ph), TZ.x + dd * Math.sin(ph) * Math.cos(A.x));
      cam.lookAt(TX.x, TY.x, TZ.x);
      renderer.render(S.scene, cam);
      labels();
      raf = requestAnimationFrame(frameLoop);
    }

    /* Labels sit outside the model, left or right of it, with a hairline leader to the part, so none cover the bottle. */
    var mbox = new T.Box3();
    function labels() {
      var vis = [];
      S.tags.forEach(function (t) {
        var show = (st.labels && (t.unit !== 'use' || st.use)) || (t.unit === st.sel);
        if (show) for (var o = t.a; o; o = o.parent) if (!o.visible) { show = false; break; }
        if (show) { t.a.getWorldPosition(tmp).project(cam); show = tmp.z < 1; }
        if (!show) { if (!t.el.hidden) { t.el.hidden = true; t.ln.setAttribute('points', ''); t.dot.setAttribute('r', '0'); } return; }
        t.sx = (tmp.x * 0.5 + 0.5) * W; t.sy = (-tmp.y * 0.5 + 0.5) * Hh; vis.push(t);
      });
      if (!vis.length) return;
      /* the model's outline on screen */
      mbox.makeEmpty();
      S.root.traverseVisible(function (o) { if (o.isMesh && o !== S.cone) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bx.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); mbox.union(bx); } });
      var x0 = 1e9, x1 = -1e9, mn = mbox.min, mx = mbox.max;
      for (var c = 0; c < 8; c++) { corners[c].set(c & 1 ? mx.x : mn.x, c & 2 ? mx.y : mn.y, c & 4 ? mx.z : mn.z).project(cam); var px = (corners[c].x * 0.5 + 0.5) * W; if (px < x0) x0 = px; if (px > x1) x1 = px; }
      var mid = (x0 + x1) / 2, sides = { L: [], R: [] };
      vis.forEach(function (t) {
        if (t.el.hidden) t.el.hidden = false;
        if (!t.w) t.w = t.el.offsetWidth || 120;
        var s = t.sx >= mid ? 'R' : 'L';
        if (s === 'R' && Math.min(x1, W - 12) + 16 + t.w > W - 6) s = 'L';
        if (s === 'L' && Math.max(x0, PANEL) - 16 - t.w < PANEL + 6) s = 'R';
        t.side = s; sides[s].push(t);
      });
      ['L', 'R'].forEach(function (s) {
        var list = sides[s].sort(function (p, q) { return p.sy - q.sy; }), prev = -1e9;
        list.forEach(function (t) { t.ly = Math.max(t.sy, prev + 26); prev = t.ly; });
        var over = prev - (st.sel === 'all' ? Hh - 20 : Hh - card.offsetHeight - 30); if (over > 0) list.forEach(function (t) { t.ly -= over; });
        list.forEach(function (t) {
          var edge = s === 'R' ? Math.min(Math.max(x1, t.sx) + 18, W - t.w - 8) : Math.max(Math.min(x0, t.sx) - 18, PANEL + t.w + 8);
          var tx = s === 'R' ? edge : edge - t.w;
          t.el.style.transform = 'translate(' + (tx | 0) + 'px,' + ((t.ly - 11) | 0) + 'px)';
          var ex = s === 'R' ? edge - 4 : edge + 4, kx = s === 'R' ? ex - 10 : ex + 10;
          t.ln.setAttribute('points', t.sx.toFixed(1) + ',' + t.sy.toFixed(1) + ' ' + kx.toFixed(1) + ',' + t.ly.toFixed(1) + ' ' + ex.toFixed(1) + ',' + t.ly.toFixed(1));
          t.dot.setAttribute('cx', t.sx.toFixed(1)); t.dot.setAttribute('cy', t.sy.toFixed(1)); t.dot.setAttribute('r', '2.2');
        });
      });
    }
    raf = requestAnimationFrame(frameLoop);

    return function () {
      alive = false; cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPD); canvas.removeEventListener('pointermove', onPM); canvas.removeEventListener('pointerup', onPU); canvas.removeEventListener('pointercancel', onPU);
      canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onTE); canvas.removeEventListener('touchcancel', onTE);
      canvas.classList.remove('dip'); S.labelsEl.classList.remove('dip');
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      if (S.labelsEl.parentNode) S.labelsEl.parentNode.removeChild(S.labelsEl);
      S.parts.forEach(function (g) { g.position.set(0, 0, 0); });
      S.tags.forEach(function (t) { t.el.hidden = true; t.ln.setAttribute('points', ''); t.dot.setAttribute('r', '0'); });
    };
  };
})();
