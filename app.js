/* Salvatore Trepiccione — site interactions.
   Content comes from data.js; you normally don't need to edit this file. */
(function () {
  'use strict';

  var D = window.SITE, P = D.person;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(pointer: fine)').matches;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function onVisible(el, cb, opts) {
    if (!el) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { cb(e.isIntersecting, e); });
    }, opts || { threshold: 0.15 });
    io.observe(el);
    return io;
  }

  // Small plane glyph (top view, nose up, 24x24)
  var GLYPH = 'M12 1.5l1.7 7.7 7.6 3.8v1.7l-7.6-1.6-.8 5.6 2.7 2.1v1.3L12 21.2l-3.6.9v-1.3l2.7-2.1-.8-5.6-7.6 1.6V13l7.6-3.8z';
  function glyph(rot, cls) {
    return '<svg viewBox="0 0 24 24" class="' + (cls || '') + '"><path d="' + GLYPH + '" fill="#eef2f7" transform="rotate(' + rot + ' 12 12)"/></svg>';
  }

  /* =======================================================
     Basic content
     ======================================================= */
  $('#heroEyebrow').textContent = P.role.replace(' in Industrial Engineering', '') + ' · ' + P.affiliation;
  $('#heroSub').innerHTML = "I'm <strong>" + esc(P.name) + '</strong>, aerospace engineer in the ' + esc(P.group) +
    '. I build <strong>HEART</strong>, the tool that sizes kerosene, hydrogen and electric aircraft side by side.';
  $('#heroPhoto').src = P.photo;
  $('#footName').textContent = '© ' + new Date().getFullYear() + ' ' + P.name;

  var mq = ['Aircraft design', 'hybrid-electric propulsion', 'Liquid hydrogen', 'design optimisation', 'Fuel cells', 'regional turboprops', 'MATLAB · SHARP · JPAD', 'entry into service 2040'];
  var mqHtml = mq.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('');
  $('#marquee').innerHTML = mqHtml + mqHtml;

  /* =======================================================
     Aircraft planform (top view, nose to the right)
     ======================================================= */
  var STRETCH = 1.07;
  var S = function (x) { return +(40 + (x - 40) * STRETCH).toFixed(1); };

  function comp(archs, tip, inner) {
    return '<g class="comp" data-a="' + archs + '" data-tip="' + esc(tip) + '">' + inner + '</g>';
  }
  function flow(archs, cls, d) {
    return '<path class="flow ' + cls + '" data-a="' + archs + '" d="' + d + '"/>';
  }

  var UID = 0;
  function planform() {
    var u = 'ac' + (UID++);
    var g = function (n) { return 'url(#' + u + n + ')'; };
    var defs = '<defs>' +
      '<linearGradient id="' + u + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8592a5"/><stop offset=".28" stop-color="#eef2f7"/><stop offset=".48" stop-color="#ffffff"/><stop offset=".74" stop-color="#d5dce6"/><stop offset="1" stop-color="#7a8699"/></linearGradient>' +
      '<linearGradient id="' + u + 'w" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e6ebf2"/><stop offset="1" stop-color="#a9b4c3"/></linearGradient>' +
      '<linearGradient id="' + u + 'a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#8bff9c"/></linearGradient>' +
      '<radialGradient id="' + u + 'p"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".24"/></radialGradient>' +
      '<linearGradient id="' + u + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#25425a"/><stop offset="1" stop-color="#04080d"/></linearGradient>' +
      '</defs>';
    var edge = ' stroke="rgba(6,8,12,.2)" stroke-width=".8"';
    var nac = function (y) {
      return '<path fill="' + g('b') + '"' + edge + ' d="M350 ' + y + ' C350 ' + (y - 7) + ' 345 ' + (y - 9.5) + ' 336 ' + (y - 9.5) + ' L272 ' + (y - 8) +
        ' C252 ' + (y - 6.5) + ' 240 ' + (y - 3.5) + ' 232 ' + y + ' C240 ' + (y + 3.5) + ' 252 ' + (y + 6.5) + ' 272 ' + (y + 8) +
        ' L336 ' + (y + 9.5) + ' C345 ' + (y + 9.5) + ' 350 ' + (y + 7) + ' 350 ' + y + ' Z"/>' +
        '<path d="M338 ' + (y - 9) + ' L338 ' + (y + 9) + '" stroke="rgba(6,8,12,.28)" stroke-width="1.2"/>';
    };
    var blade = function (y) {
      return '<path class="ac-blade" d="M357 ' + y + ' L355.2 ' + (y - 44) + ' Q357 ' + (y - 48.5) + ' 358.8 ' + (y - 44) + ' Z M357 ' + y +
        ' L355.2 ' + (y + 44) + ' Q357 ' + (y + 48.5) + ' 358.8 ' + (y + 44) + ' Z"/>';
    };
    var prop = function (y, d) {
      return '<ellipse cx="357" cy="' + y + '" rx="5" ry="48" fill="' + g('p') + '"/>' +
        '<g class="ac-blades" style="animation-delay:' + d + 's">' + blade(y) + '</g>' +
        '<g class="ac-blades" style="animation-delay:' + (d - 0.035) + 's">' + blade(y) + '</g>' +
        '<path fill="' + g('b') + '"' + edge + ' d="M349 ' + (y - 7) + ' Q370 ' + y + ' 349 ' + (y + 7) + ' Z"/>';
    };
    var sides = [-1, 1];
    var nacComps = sides.map(function (s) {
      var y = 230 + s * 82;
      return comp('conv sp', 'Gas turbine|Burns kerosene and drives the propeller shaft.',
          '<rect class="c-kero" x="300" y="' + (y - 6.5) + '" width="28" height="13" rx="3"/><text x="314" y="' + (y + 4) + '" text-anchor="middle">GT</text>') +
        comp('fc te sp', 'Electric motor|Turns the propeller using electric power.',
          '<rect class="c-elec" x="331" y="' + (y - 6) + '" width="14" height="12" rx="3"/>');
    }).join('');

    var flows = sides.map(function (s) {
      var c = 230;
      return flow('conv sp', 'f-kero', 'M280 ' + (c + s * 40) + ' Q290 ' + (c + s * 62) + ' 304 ' + (c + s * 76)) +
        flow('te', 'f-kero', 'M272 ' + (c + s * 36) + ' Q256 ' + (c + s * 20) + ' ' + (S(232) + 2) + ' ' + (c + s * 8)) +
        flow('fc sp', 'f-elec', 'M' + S(355) + ' ' + (c + s * 17) + ' Q' + S(355) + ' ' + (c + s * 60) + ' 338 ' + (c + s * 77)) +
        flow('te', 'f-elec', 'M' + S(232) + ' ' + (c + s * 10) + ' Q300 ' + (c + s * 50) + ' 335 ' + (c + s * 77)) +
        flow('sp', 'f-batt', 'M' + S(214) + ' ' + (c + s * 18) + ' Q' + (S(214) + 40) + ' ' + (c + s * 70) + ' 331 ' + (c + s * 79));
    }).join('') +
      flow('fc sp', 'f-h2', 'M' + S(174) + ' 230 L' + S(330) + ' 230') +
      flow('te', 'f-h2', 'M' + S(174) + ' 230 L' + S(196) + ' 230');

    return '<svg viewBox="0 0 520 460" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + defs +
      '<g class="ac-body" style="transform-origin:40px 230px">' +
        '<path fill="' + g('b') + '"' + edge + ' d="M492 230 C490 221 472 209 442 209 L152 209 C112 209 72 221 36 227 L33 230 L36 233 C72 239 112 251 152 251 L442 251 C472 251 490 239 492 230 Z"/>' +
        '<path d="M160 221.5 L438 221.5" stroke="#fff" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/>' +
        comp('fc te sp', 'Cryogenic LH₂ tank|Sized by a surrogate inside the loop; the fuselage stretches until it fits.',
          '<rect class="c-h2" x="104" y="215" width="70" height="30" rx="15"/><text x="139" y="234" text-anchor="middle">LH₂</text>') +
        comp('fc sp', 'Fuel-cell stacks|Convert hydrogen into electric power.',
          '<rect class="c-elec" x="330" y="215" width="14" height="30" rx="2"/><rect class="c-elec" x="348" y="215" width="14" height="30" rx="2"/><rect class="c-elec" x="366" y="215" width="14" height="30" rx="2"/>') +
        comp('te', 'Turbogenerator|Burns kerosene and hydrogen to generate electric power.',
          '<rect class="c-kero" x="196" y="214" width="36" height="32" rx="6"/><text x="214" y="234" text-anchor="middle">TG</text>') +
        comp('sp', 'Battery pack A|One of the two independent battery sources.',
          '<rect class="c-batt" x="196" y="213" width="36" height="15" rx="3"/><text x="214" y="224.5" text-anchor="middle">B1</text>') +
        comp('sp', 'Battery pack B|The second battery source of the 4-source architecture.',
          '<rect class="c-batt" x="196" y="232" width="36" height="15" rx="3"/><text x="214" y="243.5" text-anchor="middle">B2</text>') +
        '<path fill="' + g('g') + '" d="M472 219 C483 223 485 237 472 241 L458 239 C463 234 463 226 458 221 Z"/>' +
        '<path d="M467 222.5 C473 225 475 229 474 232" stroke="#9fe9ff" stroke-opacity=".7" stroke-width="1.2" fill="none"/>' +
      '</g>' +
      '<path fill="' + g('a') + '" d="M30 230 L100 225.5 Q110 230 100 234.5 Z"/>' +
      '<path fill="' + g('w') + '"' + edge + ' d="M54 230 L68 170 Q70 165 75 165 L85 165 Q90 165 90 171 L102 230 L90 289 Q90 295 85 295 L75 295 Q70 295 68 290 Z"/>' +
      '<path d="M71 167 L87 167 M71 293 L87 293" stroke="#8bff9c" stroke-width="2.5" stroke-linecap="round"/>' +
      nac(148) + nac(312) +
      '<path fill="' + g('w') + '"' + edge + ' d="M248 230 L264 22 Q266 14 274 14 L290 14 Q297 14 297 22 L312 230 L297 438 Q297 446 290 446 L274 446 Q266 446 264 438 Z"/>' +
      '<path d="M270 40 L258.5 200 M258.5 260 L270 420" stroke="rgba(6,8,12,.16)" stroke-width="1" fill="none"/>' +
      '<path d="M297 24 L311 230 L297 436" stroke="#fff" stroke-width="1.6" fill="none"/>' +
      '<path d="M273 15.5 L291 15.5 M273 444.5 L291 444.5" stroke="#8bff9c" stroke-width="2.5" stroke-linecap="round"/>' +
      '<ellipse cx="282" cy="230" rx="42" ry="14" fill="' + g('b') + '"' + edge + '/>' +
      comp('conv te sp', 'Wing fuel tanks|Kerosene stored in the wing box.',
        '<path class="c-kero" d="M256 200 L268 44 L293 44 L304 200 Z"/><path class="c-kero" d="M256 260 L268 416 L293 416 L304 260 Z"/>') +
      nacComps +
      prop(148, 0) + prop(312, -0.05) +
      flows +
      '<text class="stretch-note" x="54" y="334">↔ fuselage stretched for LH₂</text>' +
    '</svg>';
  }

  function setArch(svgRoot, id) {
    $$('[data-a]', svgRoot).forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-a').split(' ').indexOf(id) !== -1);
    });
    var stretched = id !== 'conv';
    $('.ac-body', svgRoot).style.transform = stretched ? 'scaleX(' + STRETCH + ')' : 'scaleX(1)';
    var note = $('.stretch-note', svgRoot);
    if (note) note.classList.toggle('on', stretched);
  }

  /* =======================================================
     Hero: potential-flow field + flying hydrogen-electric aircraft
     ======================================================= */
  (function hero() {
    var hero = $('.hero'), cv = $('#flow'), ctx = cv.getContext('2d');
    var planeEl = $('#heroPlane');
    planeEl.innerHTML = planform();
    setArch(planeEl, 'fc');
    $('.stretch-note', planeEl).remove();

    var ring = document.createElement('div');
    ring.style.cssText = 'position:absolute;left:0;top:0;border-radius:50%;border:1px dashed rgba(139,255,156,.35);pointer-events:none;z-index:1;will-change:transform';
    hero.insertBefore(ring, $('.hero-inner'));

    var W, H, dpr, parts = [], sparks = [];
    var obs = { x: 0, y: 0, R: 64 }, mouse = { x: 0, y: 0, t: -1e9 };
    var running = true, last = performance.now();

    function spawn(p, anywhere) {
      p.x = anywhere ? Math.random() * W : -Math.random() * 60;
      p.y = Math.random() * H;
      p.age = 0; p.life = 180 + Math.random() * 320;
      return p;
    }
    function resize() {
      W = cv.clientWidth; H = cv.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      obs.R = clamp(Math.min(W, H) * 0.075, 40, 80);
      var n = Math.round(clamp(W * H / 2000, 220, 800));
      parts = []; for (var i = 0; i < n; i++) parts.push(spawn({}, true));
      if (!mouse.t || mouse.t < 0) { obs.x = W * 0.66; obs.y = H * 0.5; }
      ring.style.width = ring.style.height = obs.R * 2 + 'px';
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.t = performance.now();
    });

    var buckets = [[], [], []];
    var COLORS = ['rgba(94,231,255,.11)', 'rgba(94,231,255,.42)', 'rgba(139,255,156,.9)'];

    function planePose(now) {
      var w = planeEl.offsetWidth, h = w * 460 / 520;
      var T = 15000, t = (now % T) / T;
      var pos = function (t) {
        return [lerp(-0.35 * W, 1.25 * W, t), lerp(0.92 * H, 0.08 * H, t) + Math.sin(t * Math.PI * 2) * 0.07 * H];
      };
      var a = pos(t), b = pos(t + 0.002);
      var ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      return { x: a[0], y: a[1], ang: ang, w: w, h: h, s: w / 520 };
    }

    function frame(now) {
      if (!running) return;
      var dt = clamp((now - last) / 16.67, 0.2, 3); last = now;

      // obstacle follows the mouse, or wanders when idle
      var idle = now - mouse.t > 2500;
      var tx = idle ? W * 0.68 + Math.cos(now / 3200) * W * 0.14 : mouse.x;
      var ty = idle ? H * 0.52 + Math.sin(now / 2300) * H * 0.22 : mouse.y;
      obs.x += (tx - obs.x) * 0.08 * dt; obs.y += (ty - obs.y) * 0.08 * dt;
      ring.style.transform = 'translate(' + (obs.x - obs.R) + 'px,' + (obs.y - obs.R) + 'px)';

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,.07)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      // Uniform flow past a cylinder: u = U(1 - R²(x²-y²)/r⁴), v = -U(2R²xy/r⁴)
      var U = 1.5 * dt, R2 = obs.R * obs.R;
      buckets[0].length = buckets[1].length = buckets[2].length = 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var dx = p.x - obs.x, dy = p.y - obs.y, r2 = dx * dx + dy * dy;
        if (r2 < R2 * 1.04) { spawn(p, false); continue; }
        var r4 = r2 * r2;
        var u = U * (1 - R2 * (dx * dx - dy * dy) / r4);
        var v = -U * (2 * R2 * dx * dy / r4);
        var sp = Math.sqrt(u * u + v * v) / U;
        var b = sp > 1.4 ? 2 : sp > 1.06 ? 1 : 0;
        buckets[b].push(p.x, p.y, p.x + u, p.y + v);
        p.x += u; p.y += v; p.age += dt;
        if (p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.age > p.life) spawn(p, false);
      }
      ctx.lineWidth = 1.1;
      for (var k = 0; k < 3; k++) {
        var B = buckets[k]; if (!B.length) continue;
        ctx.strokeStyle = COLORS[k]; ctx.beginPath();
        for (var j = 0; j < B.length; j += 4) { ctx.moveTo(B[j], B[j + 1]); ctx.lineTo(B[j + 2], B[j + 3]); }
        ctx.stroke();
      }

      // aircraft + electric contrails from the nacelles
      var pose = planePose(now);
      planeEl.style.transform = 'translate(' + (pose.x - pose.w / 2) + 'px,' + (pose.y - pose.h / 2) + 'px) rotate(' + pose.ang + 'rad)';
      var ca = Math.cos(pose.ang), sa = Math.sin(pose.ang);
      [[-14, -82], [-14, 82], [-220, 0]].forEach(function (o, idx) {
        var lx = o[0] * pose.s, ly = o[1] * pose.s;
        var x = pose.x + lx * ca - ly * sa, y = pose.y + lx * sa + ly * ca;
        if (idx < 2 || Math.random() < 0.3) {
          sparks.push({ x: x, y: y, vx: -ca * 1.2 + (Math.random() - 0.5) * 0.5, vy: -sa * 1.2 + (Math.random() - 0.5) * 0.5, life: 1, c: idx === 2 ? '94,231,255' : '139,255,156' });
        }
      });
      ctx.globalCompositeOperation = 'lighter';
      for (var m = sparks.length - 1; m >= 0; m--) {
        var s = sparks[m];
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= 0.018 * dt;
        if (s.life <= 0) { sparks.splice(m, 1); continue; }
        ctx.fillStyle = 'rgba(' + s.c + ',' + (s.life * 0.55).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    if (REDUCED) {
      var pose = planePose(5200);
      planeEl.style.transform = 'translate(' + (pose.x - pose.w / 2) + 'px,' + (pose.y - pose.h / 2) + 'px) rotate(' + pose.ang + 'rad)';
      ring.remove();
      return;
    }
    onVisible(hero, function (vis) {
      if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
      else if (!vis) running = false;
    }, { threshold: 0 });
    requestAnimationFrame(frame);
  })();

  /* Rotating word in the headline */
  (function rotator() {
    var el = $('#rotator'), words = P.rotating, i = 0;
    el.textContent = words[0];
    if (REDUCED || words.length < 2) return;
    setInterval(function () {
      el.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('out'); el.classList.add('pre');
        void el.offsetWidth;
        el.classList.remove('pre');
      }, 420);
    }, 2600);
  })();

  /* Photo tilt + shine */
  (function tilt() {
    var wrap = $('.hero-photo'), card = $('#photoCard');
    if (!FINE || REDUCED) return;
    wrap.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(900px) rotateY(' + ((x - 0.5) * 12) + 'deg) rotateX(' + ((0.5 - y) * 10) + 'deg)';
      card.style.setProperty('--sx', x * 100 + '%'); card.style.setProperty('--sy', y * 100 + '%');
    });
    wrap.addEventListener('pointerleave', function () { card.style.transform = ''; });
  })();

  /* =======================================================
     About: word-by-word reveal, counters, PhD flight
     ======================================================= */
  var profileEl = $('#profileText');
  var HL = /^(HEART|hybrid-electric|hydrogen-powered|liquid-hydrogen)$/i;
  profileEl.innerHTML = P.profile.split(/\s+/).map(function (w) {
    var bare = w.replace(/[.,;:]$/, '');
    return '<span' + (HL.test(bare) ? ' class="hl"' : '') + '>' + esc(w) + '</span>';
  }).join(' ');
  var words = $$('span', profileEl);

  $('#stats').innerHTML = D.stats.map(function (s, i) {
    return '<div class="stat" data-reveal style="--d:' + (i * 0.08) + 's"><b data-count="' + s.value + '" data-dec="' + (s.decimals || 0) + '" data-pre="' + esc(s.prefix || '') + '" data-suf="' + esc(s.suffix || '') + '">' +
      esc((s.prefix || '') + '0' + (s.suffix || '')) + '</b><span>' + esc(s.label) + '</span></div>';
  }).join('');
  function countUp(el) {
    var target = +el.dataset.count, dec = +el.dataset.dec, t0 = performance.now(), dur = 1800;
    function fmt(v) { return el.dataset.pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + el.dataset.suf; }
    if (REDUCED) { el.textContent = fmt(target); return; }
    (function tick(now) {
      var t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(2, -10 * t);
      el.textContent = fmt(t >= 1 ? target : +(target * e).toFixed(dec));
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  }
  $$('[data-count]').forEach(function (el) {
    var done = false;
    onVisible(el, function (v) { if (v && !done) { done = true; countUp(el); } }, { threshold: 0.6 });
  });

  (function phdFlight() {
    var ph = D.phd, from = new Date(ph.from), to = new Date(ph.to);
    var pct = clamp((Date.now() - from) / (to - from), 0, 1);
    var pctTxt = Math.round(pct * 100) + '%';
    var mon = function (d) { return d.toLocaleString('en-US', { month: 'short' }).toUpperCase() + ' ’' + String(d.getFullYear()).slice(2); };
    var el = $('#phdFlight');
    el.innerHTML =
      '<div class="fc-top"><span>Flight PHD-XL · Doctoral programme</span><span class="status"><span class="live"></span>' + (pct < 1 ? 'En route · ' + pctTxt : 'Landed') + '</span></div>' +
      '<div class="fc-route">' +
        '<div class="fc-city"><b>' + mon(from) + '</b><span>Departure · PhD start</span></div>' +
        '<div class="fc-bar"><i></i><span class="fc-pct">' + pctTxt + '</span>' + glyph(90, 'fc-plane') + '</div>' +
        '<div class="fc-city end"><b>' + mon(to) + '</b><span>Arrival · thesis (expected)</span></div>' +
      '</div>' +
      '<p class="fc-title">Thesis — <b>' + esc(ph.title) + '</b> · Supervisor ' + esc(ph.supervisor) + ' · ' + esc(ph.funding) + '</p>';
    var started = false;
    onVisible(el, function (v) {
      if (!v || started) return; started = true;
      setTimeout(function () {
        $('.fc-bar i', el).style.width = pct * 100 + '%';
        $('.fc-plane', el).style.left = pct * 100 + '%';
        $('.fc-pct', el).style.left = pct * 100 + '%';
      }, 250);
    }, { threshold: 0.5 });
  })();

  /* Now */
  if (D.now && D.now.length) {
    $('#nowGrid').innerHTML = D.now.map(function (n, i) {
      var live = /writing|running/i.test(n.status);
      return '<article class="now-card' + (/off the clock/i.test(n.status) ? ' off' : '') + '" data-reveal style="--d:' + (i % 3) * 0.07 + 's">' +
        '<div class="now-top"><span class="now-status">' + (live ? '<span class="live"></span>' : '') + esc(n.status) + '</span><span class="now-tag">' + esc(n.tag) + '</span></div>' +
        '<h3>' + esc(n.title) + '</h3><p>' + esc(n.text) + '</p></article>';
    }).join('');
  } else { $('#now').remove(); }

  /* =======================================================
     HEART architecture viewer
     ======================================================= */
  var ARCHS = [
    { id: 'conv', short: 'Kerosene', name: 'Kerosene turboprop', tag: 'Reference configuration',
      chain: 'Kerosene → gas turbine → propeller',
      desc: 'The yardstick every alternative is measured against, sized under exactly the same top-level requirements as the hybrid concepts.',
      points: ['Mission module benchmarked against ATR 72-500 block-fuel data — within 0.5 %', 'Segment-based mission and field performance', 'Same TLARs as every other architecture'] },
    { id: 'fc', short: 'LH₂ fuel cell', name: 'Hydrogen fuel cell', tag: 'Zero in-flight CO₂',
      chain: 'LH₂ → fuel cells → electric motors → propellers',
      desc: 'Liquid hydrogen from a cryogenic tank feeds fuel-cell stacks, and electric motors turn the propellers.',
      points: ['Cryogenic LH₂ tank surrogate inside the sizing loop', 'Outer loop stretches the fuselage until the tank fits', 'Per-source energy bookkeeping along the mission'] },
    { id: 'te', short: 'Turboelectric', name: 'Kerosene–hydrogen turboelectric', tag: 'Dual fuel',
      chain: 'Kerosene + LH₂ → turbogenerator → electric motors → propellers',
      desc: 'A turbogenerator fed by kerosene and hydrogen produces electric power for the propeller motors.',
      points: ['Dual storage: wing fuel tanks plus a cryogenic LH₂ tank', 'Electric power distributed to the propulsors', 'Compared on equal footing with the other concepts'] },
    { id: 'sp', short: '4-source SPPH', name: 'Four-source serial-parallel hybrid', tag: 'MSc thesis · SHARP',
      chain: 'Gas turbine + fuel cell + battery A + battery B → propellers',
      desc: 'From my MSc thesis: I extended the SHARP Java API from three to four energy sources in a serial-parallel partial-hybrid architecture.',
      points: ['Benchmarked against conventional powerplants', 'Applied to the aircraft of the EU HERA project', 'Quantified the CO₂ reduction towards the 2050 targets'] }
  ];
  (function heartViewer() {
    var vis = $('#archVisual'), info = $('#archInfo'), tabs = $('#archTabs');
    vis.innerHTML = planform();
    tabs.innerHTML = ARCHS.map(function (a, i) {
      return '<button role="tab" data-id="' + a.id + '" aria-selected="' + (i === 0) + '">' + esc(a.short) + '</button>';
    }).join('');
    var current = null, userPicked = false, timer = null;

    function show(id) {
      if (id === current) return; current = id;
      var a = ARCHS.filter(function (x) { return x.id === id; })[0];
      setArch(vis, id);
      $$('button', tabs).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.id === id); });
      info.innerHTML = '<div class="fade"><span class="tag">' + esc(a.tag) + '</span></div>' +
        '<h3 class="fade" style="animation-delay:.05s">' + esc(a.name) + '</h3>' +
        '<p class="fade" style="animation-delay:.1s">' + esc(a.desc) + '</p>' +
        '<div class="chain fade" style="animation-delay:.15s">' + esc(a.chain) + '</div>' +
        '<ul class="fade" style="animation-delay:.2s">' + a.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>';
    }
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      userPicked = true; clearInterval(timer); show(b.dataset.id);
    });
    show('conv');
    onVisible(vis, function (v) {
      clearInterval(timer);
      if (v && !userPicked && !REDUCED) {
        timer = setInterval(function () {
          var i = ARCHS.findIndex(function (a) { return a.id === current; });
          show(ARCHS[(i + 1) % ARCHS.length].id);
        }, 5200);
      }
    }, { threshold: 0.4 });
  })();

  /* Tooltip for aircraft components */
  (function tooltips() {
    var tip = $('.tooltip');
    document.addEventListener('pointerover', function (e) {
      var c = e.target.closest && e.target.closest('.comp.on[data-tip]');
      if (!c || !c.closest('#archVisual')) return;
      var t = c.getAttribute('data-tip').split('|');
      tip.innerHTML = '<b>' + esc(t[0]) + '</b><span>' + esc(t[1] || '') + '</span>';
      tip.classList.add('on');
    });
    document.addEventListener('pointermove', function (e) {
      if (tip.classList.contains('on')) { tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; }
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.comp');
      if (c && !c.contains(e.relatedTarget)) tip.classList.remove('on');
    });
  })();

  /* =======================================================
     Sizing loop
     ======================================================= */
  (function workflows() {
    var FUEL = [
      ['W&B', 'Weights & balance', 'Component masses, take-off mass and centre of gravity.'],
      ['Aero', 'Aerodynamics', 'Lift and drag of the current configuration.'],
      ['Mission', 'Mission', 'The design mission: simplified in HEART or detailed in SHARP.'],
      ['Fuel', 'Fuel-weight update', 'New fuel weight from the mission; repeat until it stops changing.']
    ];
    var WF = {
      base: {
        name: 'HEART Baseline', tag: 'One aircraft, sized to convergence',
        lead: 'Sizes a single aircraft taken from the hangar. Every pass runs the disciplines in sequence and updates the fuel weight, until the fuel of the design mission stops changing.',
        input: ['Aircraft from the hangar', 'Run setup'],
        output: ['Converged aircraft', 'Summary & convergence plots'],
        rings: [{ label: 'Fuel-weight loop', speed: 8000, mods: FUEL }]
      },
      doe: {
        name: 'HEART DOE', tag: 'A whole design space, then the optimum',
        lead: 'Sweeps a grid of wing area, aspect ratio, gas-turbine and fuel-cell power. Each design point nests the fuel loop inside a hydrogen tank–fuselage loop; the results build a response surface for a constrained optimisation.',
        input: ['Study setup · variables & TLARs', 'Optional screening on the matching chart'],
        output: ['Response surface', 'Constrained optimum (fmincon)', 'Design-space maps'],
        rings: [
          { label: 'Design-point loop', speed: 20000, mods: [
            ['Geometry', 'Geometry', 'Wing placed for the target static margin; tails rescaled at constant volume coefficients.'],
            ['LH₂ tank', 'LH₂ tank & fuselage', 'Tanks sized on the mission fuel; the fuselage stretches behind the cabin until they fit.'],
            ['Performance', 'Performance', 'Maximum cruise Mach, block fuel and MTOW, checked against the TLARs.'],
            ['Store', 'Store result', 'One row of the response-surface table per design point.']
          ] },
          { label: 'Fuel-weight loop', speed: 5000, mods: FUEL }
        ]
      }
    };

    var svg = $('#wfSvg'), info = $('#wfInfo'), tabs = $('#wfTabs'), status = $('#wfStatus');
    var cx = 260, cy = 230, state = null, running = false, last = 0, hover = null;

    function ringHtml(ring, ri, R, small) {
      var n = ring.mods.length, arc = 0.75;
      var h = '<circle class="loop-ring" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>' +
        '<g class="wf-rot" data-r="' + ri + '"><path class="loop-arc" d="M' + (cx + R * Math.cos(-arc)) + ' ' + (cy + R * Math.sin(-arc)) +
        ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy + '"/><circle class="loop-dot" cx="' + (cx + R) + '" cy="' + cy + '" r="' + (small ? 5 : 6) + '"/></g>';
      ring.mods.forEach(function (m, i) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        h += '<g class="loop-node' + (small ? ' small' : '') + '" data-r="' + ri + '" data-i="' + i + '"><circle cx="' + x + '" cy="' + y + '" r="' + (small ? 21 : 24) + '"/>';
        if (small) h += '<text class="idx" x="' + x + '" y="' + (y + 4) + '">' + esc(m[0]) + '</text>';
        else {
          var c = Math.cos(a), anchor = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
          var lx = cx + (R + (anchor === 'middle' ? 0 : 34)) * c, ly = cy + (R + 40) * Math.sin(a) + 5;
          if (anchor !== 'middle') ly = y + 5;
          h += '<text class="idx" x="' + x + '" y="' + (y + 4) + '">0' + (i + 1) + '</text>' +
            '<text class="name" x="' + lx + '" y="' + ly + '" style="text-anchor:' + anchor + '">' + esc(m[0]) + '</text>';
        }
        h += '</g>';
      });
      return h;
    }

    function show(id) {
      var w = WF[id];
      state = { id: id, w: w, theta: w.rings.map(function () { return 0; }), prev: w.rings.map(function () { return 0; }), active: w.rings.map(function () { return 0; }), iter: 1, res: 0.21, conv: false, point: 1 };
      $$('button', tabs).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.id === id); });
      var two = w.rings.length > 1;
      svg.innerHTML = '<defs><linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8bff9c" stop-opacity="0"/><stop offset="1" stop-color="#8bff9c"/></linearGradient></defs>' +
        (two ? ringHtml(w.rings[0], 0, 185, false) + ringHtml(w.rings[1], 1, 82, true) +
          '<text class="wf-center" x="' + cx + '" y="' + (cy + 4) + '">FUEL LOOP</text>'
          : ringHtml(w.rings[0], 0, 150, false) +
          '<g class="loop-center"><text class="t1" x="' + cx + '" y="' + (cy - 18) + '"></text><text class="t2" x="' + cx + '" y="' + (cy + 6) + '"></text></g>');
      var list = w.rings.map(function (r, ri) {
        return '<li class="wf-head">' + esc(r.label) + '</li>' + r.mods.map(function (m, i) {
          return '<li data-r="' + ri + '" data-i="' + i + '"><b>' + (ri ? '·' : '0' + (i + 1)) + '</b><span>' + esc(m[1]) + '<small>' + esc(m[2]) + '</small></span></li>';
        }).join('');
      }).join('');
      info.innerHTML = '<div class="fade"><span class="tag">' + esc(w.tag) + '</span></div>' +
        '<p class="fade wf-lead">' + esc(w.lead) + '</p>' +
        '<div class="wf-io fade"><span>In</span>' + w.input.map(function (x) { return '<i>' + esc(x) + '</i>'; }).join('') + '</div>' +
        '<ul class="loop-list wf-list fade">' + list + '</ul>' +
        '<div class="wf-io fade"><span>Out</span>' + w.output.map(function (x) { return '<i>' + esc(x) + '</i>'; }).join('') + '</div>';
      $$('.wf-list li[data-r], .loop-node', $('#loop')).forEach(function (el) {
        el.addEventListener('pointerenter', function () { hover = [+el.dataset.r, +el.dataset.i]; paint(); });
        el.addEventListener('pointerleave', function () { hover = null; paint(); });
      });
      paint(); setStatus();
    }

    function paint() {
      var w = state.w;
      w.rings.forEach(function (r, ri) {
        var a = hover && hover[0] === ri ? hover[1] : state.active[ri];
        if (!r.mods[a]) a = 0;
        $$('.loop-node[data-r="' + ri + '"]', svg).forEach(function (n) { n.classList.toggle('on', +n.dataset.i === a); });
        $$('.wf-list li[data-r="' + ri + '"]', info).forEach(function (li) { li.classList.toggle('on', +li.dataset.i === a); });
        if (ri === 0 && w.rings.length === 1) {
          $('.t1', svg).textContent = r.mods[a][1];
          $('.t2', svg).textContent = r.label;
        }
      });
    }
    function setStatus() {
      var fuel = state.conv ? 'fuel weight converged ✓' : 'fuel iteration ' + state.iter + ' · Δfuel ' + state.res.toExponential(1);
      status.textContent = state.id === 'doe' ? 'Design point ' + state.point + ' · ' + fuel : fuel;
    }

    tabs.innerHTML = '<button role="tab" data-id="base" aria-selected="true">HEART Baseline</button><button role="tab" data-id="doe" aria-selected="false">HEART DOE</button>';
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(b.dataset.id); });
    show('base');

    function frame(now) {
      if (!running) return;
      var dt = Math.max(0, Math.min(50, now - last)); last = now;
      var w = state.w, inner = w.rings.length - 1;
      w.rings.forEach(function (r, ri) {
        if (!hover) state.theta[ri] += dt / r.speed * Math.PI * 2;
        var n = r.mods.length, idx = Math.floor((state.theta[ri] % (2 * Math.PI)) / (2 * Math.PI / n)) % n;
        var g = $('.wf-rot[data-r="' + ri + '"]', svg);
        if (g) g.setAttribute('transform', 'rotate(' + (state.theta[ri] * 180 / Math.PI - 90) + ' ' + cx + ' ' + cy + ')');
        if (idx === 0 && state.prev[ri] === n - 1) {
          if (ri === inner) {
            if (state.conv) { state.conv = false; state.iter = 1; state.res = 0.21; }
            else { state.iter++; state.res *= 0.3; if (state.res < 1e-3) state.conv = true; }
          } else { state.point++; }
          setStatus();
        }
        state.prev[ri] = idx; state.active[ri] = idx;
      });
      paint();
      requestAnimationFrame(frame);
    }
    if (!REDUCED) onVisible(svg, function (v) {
      if (v && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
      else if (!v) running = false;
    }, { threshold: 0.2 });
  })();

  /* =======================================================
     Design exploration: DOE → response surface → SQP
     ======================================================= */
  (function explore() {
    var cv = $('#exploreCanvas'), ctx = cv.getContext('2d');
    var W, H, dpr, pad = { l: 64, r: 26, t: 42, b: 56 };
    var rnd = (function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })(20401);

    // "True" objective (illustrative) and requirement constraint x1 + x2 ≥ 1.25
    var f = function (x, y) { return 1.3 * Math.pow(x - 0.32, 2) + Math.pow(y - 0.72, 2) + 0.7 * (x - 0.32) * (y - 0.72) + 0.035 * Math.sin(9 * x) * Math.cos(7 * y); };
    var LIM = 1.2;

    // Latin hypercube sample
    var N = 36, px = [], py = [];
    for (var i = 0; i < N; i++) { px.push((i + rnd()) / N); py.push((i + rnd()) / N); }
    for (i = N - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = py[i]; py[i] = py[j]; py[j] = t; }
    var pts = px.map(function (x, k) { return { x: x, y: py[k], f: f(x, py[k]) }; });

    // Least-squares quadratic response surface
    var basis = function (x, y) { return [1, x, y, x * x, x * y, y * y]; };
    var A = [], b = [];
    for (var r = 0; r < 6; r++) { A.push([0, 0, 0, 0, 0, 0]); b.push(0); }
    pts.forEach(function (p) {
      var v = basis(p.x, p.y);
      for (var r = 0; r < 6; r++) { b[r] += v[r] * p.f; for (var c = 0; c < 6; c++) A[r][c] += v[r] * v[c]; }
    });
    for (var c = 0; c < 6; c++) { // Gaussian elimination
      var piv = c; for (r = c + 1; r < 6; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      var tmp = A[c]; A[c] = A[piv]; A[piv] = tmp; tmp = b[c]; b[c] = b[piv]; b[piv] = tmp;
      for (r = c + 1; r < 6; r++) { var m = A[r][c] / A[c][c]; for (var k = c; k < 6; k++) A[r][k] -= m * A[c][k]; b[r] -= m * b[c]; }
    }
    var coef = [0, 0, 0, 0, 0, 0];
    for (r = 5; r >= 0; r--) { var s = b[r]; for (k = r + 1; k < 6; k++) s -= A[r][k] * coef[k]; coef[r] = s / A[r][r]; }
    var fh = function (x, y) { var v = basis(x, y), s = 0; for (var k = 0; k < 6; k++) s += coef[k] * v[k]; return s; };

    // Projected-gradient path on the surrogate (stand-in for SQP iterations)
    var path = [[0.95, 0.62]];
    for (var it = 0; it < 40; it++) {
      var q = path[path.length - 1], e = 1e-4;
      var gx = (fh(q[0] + e, q[1]) - fh(q[0] - e, q[1])) / (2 * e), gy = (fh(q[0], q[1] + e) - fh(q[0], q[1] - e)) / (2 * e);
      var nx = clamp(q[0] - 0.22 * gx, 0, 1), ny = clamp(q[1] - 0.22 * gy, 0, 1);
      if (nx + ny < LIM) { var d = (LIM - nx - ny) / 2; nx += d; ny += d; }
      if (Math.hypot(nx - q[0], ny - q[1]) < 0.002) break;
      path.push([nx, ny]);
    }

    // Field range for colouring
    var fmin = Infinity, fmax = -Infinity;
    for (var gx2 = 0; gx2 <= 1; gx2 += 0.02) for (var gy2 = 0; gy2 <= 1; gy2 += 0.02) { var vv = fh(gx2, gy2); fmin = Math.min(fmin, vv); fmax = Math.max(fmax, vv); }
    var STOPS = [[0, [139, 255, 156]], [0.3, [94, 231, 255]], [0.65, [44, 92, 170]], [1, [12, 18, 34]]];
    function cmap(t) {
      t = clamp(t, 0, 1);
      for (var s = 1; s < STOPS.length; s++) if (t <= STOPS[s][0]) {
        var a = STOPS[s - 1], z = STOPS[s], u = (t - a[0]) / (z[0] - a[0]);
        return [lerp(a[1][0], z[1][0], u), lerp(a[1][1], z[1][1], u), lerp(a[1][2], z[1][2], u)];
      }
      return STOPS[STOPS.length - 1][1];
    }
    var norm = function (v) { return Math.pow((v - fmin) / (fmax - fmin), 0.6); };

    // Pre-rendered surrogate heat map with iso-lines
    var heat = document.createElement('canvas'); heat.width = 240; heat.height = 165;
    (function () {
      var hc = heat.getContext('2d'), img = hc.createImageData(240, 165), band = [];
      for (var y = 0; y < 165; y++) for (var x = 0; x < 240; x++) band[y * 240 + x] = Math.floor(norm(fh(x / 239, 1 - y / 164)) * 14);
      for (y = 0; y < 165; y++) for (x = 0; x < 240; x++) {
        var vX = x / 239, vY = 1 - y / 164, col = cmap(norm(fh(vX, vY)));
        var bnd = band[y * 240 + x], line = (x < 239 && band[y * 240 + x + 1] !== bnd) || (y < 164 && band[(y + 1) * 240 + x] !== bnd);
        var o = (y * 240 + x) * 4, k = line ? 1.5 : 0.62;
        img.data[o] = Math.min(255, col[0] * k); img.data[o + 1] = Math.min(255, col[1] * k); img.data[o + 2] = Math.min(255, col[2] * k); img.data[o + 3] = 255;
      }
      hc.putImageData(img, 0, 0);
    })();

    var X = function (v) { return pad.l + v * (W - pad.l - pad.r); };
    var Y = function (v) { return H - pad.b - v * (H - pad.t - pad.b); };

    function resize() {
      W = cv.clientWidth; H = W * 11 / 16; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pad.l = W < 500 ? 40 : 64; pad.b = W < 500 ? 44 : 56;
      draw(performance.now());
    }

    var phase = 0, start = [0, 0, 0];
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      var pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
      // grid
      ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
      for (var g = 0; g <= 10; g++) {
        ctx.beginPath(); ctx.moveTo(X(g / 10), Y(0)); ctx.lineTo(X(g / 10), Y(1)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0), Y(g / 10)); ctx.lineTo(X(1), Y(g / 10)); ctx.stroke();
      }
      // surrogate
      var a1 = phase >= 1 ? clamp((now - start[1]) / 1100, 0, 1) : 0;
      if (a1 > 0) { ctx.globalAlpha = a1; ctx.imageSmoothingEnabled = true; ctx.drawImage(heat, X(0), Y(1), pw, ph); ctx.globalAlpha = 1; }
      // infeasible region (hatched)
      ctx.save();
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(1), Y(0)); ctx.lineTo(X(1), Y(LIM - 1)); ctx.lineTo(X(LIM - 1), Y(1)); ctx.lineTo(X(0), Y(1)); ctx.closePath();
      ctx.fillStyle = 'rgba(6,8,12,.55)'; ctx.fill(); ctx.clip();
      ctx.strokeStyle = 'rgba(255,110,110,.3)'; ctx.lineWidth = 1;
      for (var h = -H; h < W; h += 12) { ctx.beginPath(); ctx.moveTo(h, H); ctx.lineTo(h + H, 0); ctx.stroke(); }
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,120,120,.75)'; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(X(1), Y(LIM - 1)); ctx.lineTo(X(LIM - 1), Y(1)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,140,140,.85)'; ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText('INFEASIBLE · requirement violated', X(0.03), Y(0.04));
      ctx.fillStyle = 'rgba(139,255,156,.9)'; ctx.textAlign = 'right'; ctx.fillText('FEASIBLE DESIGNS', X(0.97), Y(0.95)); ctx.textAlign = 'left';
      // frame & labels
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.strokeRect(X(0), Y(1), pw, ph);
      ctx.fillStyle = '#8b95a7'; ctx.font = '500 12px "Inter Tight", sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('Design variable x₁  ·  e.g. wing loading', X(0.5), H - 16);
      ctx.save(); ctx.translate(16, Y(0.5)); ctx.rotate(-Math.PI / 2); ctx.fillText('x₂  ·  e.g. power split', 0, 0); ctx.restore();
      ctx.textAlign = 'left';
      // DOE points
      var nPts = phase === 0 ? Math.floor(clamp((now - start[0]) / 1700, 0, 1) * N) : N;
      for (var i = 0; i < nPts; i++) {
        var p = pts[i], col = cmap(norm(p.f));
        ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), W < 500 ? 4 : 5.5, 0, 6.283);
        ctx.fillStyle = 'rgb(' + col.map(Math.round).join(',') + ')'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = phase >= 1 ? 'rgba(6,8,12,.9)' : 'rgba(255,255,255,.85)'; ctx.stroke();
      }
      // optimisation path
      if (phase >= 2) {
        var prog = clamp((now - start[2]) / 2200, 0, 1) * (path.length - 1);
        var whole = Math.floor(prog), frac = prog - whole;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(139,255,156,.9)'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(X(path[0][0]), Y(path[0][1]));
        for (var k = 1; k <= whole; k++) ctx.lineTo(X(path[k][0]), Y(path[k][1]));
        if (whole < path.length - 1) ctx.lineTo(X(lerp(path[whole][0], path[whole + 1][0], frac)), Y(lerp(path[whole][1], path[whole + 1][1], frac)));
        ctx.stroke(); ctx.shadowBlur = 0;
        for (k = 0; k <= whole; k++) { ctx.beginPath(); ctx.arc(X(path[k][0]), Y(path[k][1]), 2.6, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill(); }
        if (prog >= path.length - 1) {
          var end = path[path.length - 1], ex = X(end[0]), ey = Y(end[1]), pul = 1 + 0.25 * Math.sin(now / 220);
          ctx.beginPath(); ctx.arc(ex, ey, 14 * pul, 0, 6.283); ctx.strokeStyle = 'rgba(139,255,156,.5)'; ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 6.283); ctx.fillStyle = '#8bff9c'; ctx.fill();
          ctx.fillStyle = '#eef2f7'; ctx.font = '600 13px "Inter Tight", sans-serif';
          var lbl = 'Feasible optimum', tw = ctx.measureText(lbl).width;
          ctx.fillText(lbl, Math.min(ex + 20, W - pad.r - tw - 4), ey - 16);
        }
        // start marker
        ctx.fillStyle = '#8b95a7'; ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText('start', X(path[0][0]) - 14, Y(path[0][1]) - 12);
      }
    }

    var btns = $$('#exploreSteps button[data-step]'), raf = 0, visible = false, timers = [];
    function setPhase(k) {
      phase = k; var now = performance.now();
      for (var i = 0; i <= 2; i++) start[i] = i < k ? -1e9 : now;
      btns.forEach(function (b) {
        var on = b.dataset.step === String(k);
        b.classList.remove('on'); void b.offsetWidth;
        if (on) { b.style.setProperty('--dur', (k === 2 ? 2.4 : k === 1 ? 1.2 : 1.8) + 's'); b.classList.add('on'); }
      });
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      setPhase(0);
      timers.push(setTimeout(function () { setPhase(1); }, 2300));
      timers.push(setTimeout(function () { setPhase(2); }, 4000));
    }
    function loop(now) { draw(now); if (visible) raf = requestAnimationFrame(loop); }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.step === 'replay') { play(); return; }
        timers.forEach(clearTimeout); timers = [];
        setPhase(+b.dataset.step);
      });
    });
    var played = false;
    window.addEventListener('resize', resize);
    resize();
    onVisible(cv, function (v) {
      visible = v;
      if (v) {
        if (!played) { played = true; if (REDUCED) setPhase(2); else play(); }
        cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
      }
    }, { threshold: 0.35 });
  })();

  /* =======================================================
     Journey timeline
     ======================================================= */
  (function journey() {
    var tl = $('#timeline');
    tl.insertAdjacentHTML('beforeend', D.journey.map(function (j) {
      return '<div class="tl-item" data-reveal><span class="tl-when">' + esc(j.when) + '</span><h3>' + esc(j.title) + '</h3>' +
        '<p class="tl-where">' + esc(j.where) + '</p>' + (j.badge ? '<span class="tl-badge">' + esc(j.badge) + '</span>' : '') +
        '<p class="tl-text">' + esc(j.text) + '</p></div>';
    }).join(''));
    $('#tlPlane').innerHTML = glyph(180);
  })();

  /* =======================================================
     Map with flight routes (d3 + world-atlas)
     ======================================================= */
  (function map() {
    var svgEl = $('#mapSvg'), list = $('#mapList');
    var home = D.places.filter(function (p) { return p.home; })[0];
    list.innerHTML = D.places.map(function (p) {
      return '<li data-id="' + p.id + '"><span class="what">' + esc(p.what) + '</span><b>' + esc(p.city) + '</b><p>' + esc(p.detail) + '</p></li>';
    }).join('');

    function fallback(msg) {
      $('.map-box').insertAdjacentHTML('beforeend', '<div class="map-fallback">' + esc(msg) + '</div>');
    }
    if (!window.d3 || !window.topojson) { fallback('The map needs an internet connection to load.'); return; }

    var W = 1000, H = 560;
    var proj = d3.geoNaturalEarth1().fitExtent([[24, 24], [W - 24, H - 24]],
      { type: 'MultiPoint', coordinates: [[-14, 58], [160, 58], [-14, -44], [160, -44], [70, 66]] });
    var svg = d3.select(svgEl);
    svg.append('defs').html('<linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#8bff9c"/></linearGradient>');
    var gDots = svg.append('path').attr('class', 'map-dots');
    var gRoutes = svg.append('g'), gCities = svg.append('g'), gPlanes = svg.append('g');

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json')
      .then(function (r) { return r.json(); })
      .then(function (topo) {
        var land = topojson.feature(topo, topo.objects.land);
        var off = document.createElement('canvas'); off.width = W; off.height = H;
        var oc = off.getContext('2d');
        oc.fillStyle = '#000'; oc.beginPath(); d3.geoPath(proj, oc)(land); oc.fill();
        var data = oc.getImageData(0, 0, W, H).data, d = '', step = 9;
        for (var y = step / 2; y < H; y += step) for (var x = step / 2; x < W; x += step) {
          if (data[(Math.round(y) * W + Math.round(x)) * 4 + 3] > 128) d += 'M' + x + ' ' + y + 'h0';
        }
        gDots.attr('d', d);
      })
      .catch(function () { /* routes still work without the land dots */ });

    var routes = [];
    D.places.forEach(function (p) {
      if (p.home || p.short) return;
      var interp = d3.geoInterpolate(home.coords, p.coords);
      var pts = d3.range(0, 1.0001, 1 / 90).map(function (t) { return proj(interp(t)); });
      var path = gRoutes.append('path').attr('class', 'map-route').attr('data-id', p.id).attr('d', 'M' + pts.join('L')).node();
      var len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      var plane = gPlanes.append('path').attr('class', 'map-plane').attr('d', GLYPH).style('opacity', 0).node();
      routes.push({ id: p.id, path: path, len: len, plane: plane, off: Math.random() });
    });
    var LBL = { nap: [10, 18, 'start'], trn: [-10, -8, 'end'], syd: [12, 5, 'start'], xian: [12, -8, 'start'], ham: [10, -8, 'start'], sor: [0, 0, 'start'] };
    D.places.forEach(function (p) {
      var xy = proj(p.coords), l = LBL[p.id] || [10, 4, 'start'];
      var g = gCities.append('g').attr('class', 'map-city' + (p.home ? ' home' : '')).attr('transform', 'translate(' + xy + ')');
      g.append('circle').attr('class', 'halo').attr('r', p.short ? 5 : 7);
      g.append('circle').attr('class', 'core').attr('r', p.short ? 2.5 : 4);
      if (!p.short) {
        g.append('text').attr('x', l[0]).attr('y', l[1]).attr('text-anchor', l[2]).text(p.city);
        g.append('text').attr('class', 'sub').attr('x', l[0]).attr('y', l[1] + 15).attr('text-anchor', l[2]).text(p.home ? 'home base' : (p.tag || p.what));
      }
    });

    function highlight(id) {
      routes.forEach(function (r) {
        r.path.classList.toggle('hot', r.id === id);
        r.path.classList.toggle('dim', !!id && r.id !== id);
      });
      $$('li', list).forEach(function (li) { li.classList.toggle('hot', li.dataset.id === id); });
    }
    $$('li', list).forEach(function (li) {
      li.addEventListener('pointerenter', function () { highlight(li.dataset.id); });
      li.addEventListener('pointerleave', function () { highlight(null); });
    });

    var running = false, drawn = false;
    function frame(now) {
      if (!running) return;
      routes.forEach(function (r) {
        var dur = 3500 + r.len * 6;
        var t = ((now / dur) + r.off) % 1;
        var p1 = r.path.getPointAtLength(t * r.len), p2 = r.path.getPointAtLength(Math.min(r.len, t * r.len + 1));
        var a = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI + 90;
        var fade = Math.min(1, t * 8, (1 - t) * 8);
        r.plane.setAttribute('transform', 'translate(' + (p1.x - 9) + ' ' + (p1.y - 9) + ') rotate(' + a + ' 9 9) scale(.75)');
        r.plane.style.opacity = fade;
      });
      requestAnimationFrame(frame);
    }
    onVisible(svgEl, function (v) {
      if (v && !drawn) {
        drawn = true;
        routes.forEach(function (r, i) {
          r.path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.22,1,.36,1) ' + (i * 0.25) + 's';
          r.path.style.strokeDashoffset = 0;
        });
      }
      if (v && !running && !REDUCED) { running = true; setTimeout(function () { requestAnimationFrame(frame); }, 1600); }
      else if (!v) running = false;
    }, { threshold: 0.25 });
  })();

  /* =======================================================
     Publications
     ======================================================= */
  (function publications() {
    var pubs = D.publications.slice().sort(function (a, b) { return b.year - a.year; });
    var types = ['All'];
    pubs.forEach(function (p) { if (types.indexOf(p.type) === -1) types.push(p.type); });
    var count = function (t) { return t === 'All' ? pubs.length : pubs.filter(function (p) { return p.type === t; }).length; };
    $('#pubFilters').innerHTML = types.map(function (t, i) {
      return '<button type="button" data-t="' + esc(t) + '" aria-pressed="' + (i === 0) + '">' + esc(t) + '<sup>' + count(t) + '</sup></button>';
    }).join('');
    var me = esc(P.authorName);
    $('#pubs').innerHTML = pubs.map(function (p, i) {
      var first = p.authors.indexOf(P.authorName) === 0;
      var link = p.doi ? '<a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">doi:' + esc(p.doi) + ' ↗</a>' : '';
      return '<article class="pub" data-reveal style="--d:' + (i % 2) * 0.08 + 's" data-t="' + esc(p.type) + '">' +
        '<div class="pub-meta"><span class="pub-type ' + esc(p.type) + '">' + esc(p.type) + '</span><span>' + (first ? '<span class="first">First author · </span>' : '') + p.year + '</span></div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="authors">' + esc(p.authors).split(me).join('<strong>' + me + '</strong>') + '</p>' +
        '<p class="venue">' + esc(p.venue) + '</p>' +
        (link ? '<div class="go">' + link + '</div>' : '') + '</article>';
    }).join('');
    $('#pubFilters').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('#pubFilters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('.pub').forEach(function (card) { card.classList.toggle('hide', b.dataset.t !== 'All' && card.dataset.t !== b.dataset.t); });
    });
    $('#pubs').addEventListener('pointermove', function (e) {
      var card = e.target.closest('.pub'); if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px'); card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  })();

  /* Supervised theses (shown only when present in data.js) */
  if (D.theses && D.theses.length) {
    $('#thesesBlock').hidden = false;
    $('#theses').innerHTML = D.theses.slice().sort(function (a, b) { return b.year - a.year; }).map(function (t) {
      return '<div class="thesis" data-reveal><div class="th-side"><span class="th-level">' + esc(t.level) + '</span><span class="y">' + esc(t.period || t.year) + '</span></div>' +
        '<div><b>' + esc(t.title) + '</b><span class="th-who">' + esc(t.student) + '</span>' +
        (t.summary ? '<p>' + esc(t.summary) + '</p>' : '') + (t.team ? '<small>' + esc(t.team) + '</small>' : '') + '</div>' +
        '<span class="role">' + esc(t.role) + '</span></div>';
    }).join('');
  }

  /* =======================================================
     Skills bento
     ======================================================= */
  (function bento() {
    var spans = [3, 3, 2, 4, 3, 3];
    var html = D.skills.map(function (s, i) {
      return '<div class="bento-card" data-reveal style="--span:' + spans[i] + ';--d:' + (i * 0.06) + 's"><h3>' + esc(s.title) + '</h3><div class="chips">' +
        s.items.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div></div>';
    }).join('');
    var levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    html += '<div class="bento-card" data-reveal style="--span:' + spans[5] + ';--d:.3s"><h3>Languages</h3>' + D.languages.map(function (l) {
      return '<div class="lang"><div class="lang-top"><b>' + esc(l.name) + '</b><span>' + esc(l.level) + '</span></div><div class="cefr">' +
        levels.map(function (_, k) { return '<i class="' + (k < l.cefr ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="cefr-l">' + levels.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    $('#bento').innerHTML = html;
  })();

  /* =======================================================
     Contact + take-off scene
     ======================================================= */
  $('#mailBtn').href = 'mailto:' + P.email;
  $('#mailBtn').textContent = P.email;
  $('#copyBtn').addEventListener('click', function () {
    var btn = this;
    var done = function () { btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = 'Copy address'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(P.email).then(done, function () { btn.textContent = P.email; });
    else btn.textContent = P.email;
  });
  $('#contactLinks').innerHTML = P.links.map(function (l) {
    return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a>';
  }).join('');

  var windows = '';
  for (var wx = 140; wx <= 326; wx += 13) windows += '<rect x="' + wx + '" y="70" width="7" height="8" rx="2.5" fill="#0b1520"/>';
  $('#takeoff').innerHTML =
    '<svg viewBox="0 0 400 150" aria-hidden="true"><defs>' +
      '<linearGradient id="toB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e2e8ef"/><stop offset="1" stop-color="#8f9bad"/></linearGradient>' +
      '<linearGradient id="toA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#8bff9c"/></linearGradient>' +
      '<linearGradient id="toL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8bff9c" stop-opacity="0"/><stop offset=".3" stop-color="#8bff9c"/><stop offset="1" stop-color="#5ee7ff"/></linearGradient>' +
      '<radialGradient id="toP"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></radialGradient>' +
      '<radialGradient id="exh"><stop offset="0" stop-color="#8bff9c" stop-opacity=".9"/><stop offset="1" stop-color="#8bff9c" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="toG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a4a63"/><stop offset="1" stop-color="#04080d"/></linearGradient>' +
    '</defs>' +
      '<g id="gear" style="transition:opacity .5s, transform .5s;transform-origin:270px 98px">' +
        '<path d="M232 84 L229 118" stroke="#6f7b8c" stroke-width="3.5"/><circle cx="229" cy="124" r="8" fill="#121821" stroke="#6f7b8c" stroke-width="2.5"/><circle cx="229" cy="124" r="2.5" fill="#6f7b8c"/>' +
        '<path d="M346 97 L344 119" stroke="#6f7b8c" stroke-width="3"/><circle cx="344" cy="125" r="6" fill="#121821" stroke="#6f7b8c" stroke-width="2"/>' +
      '</g>' +
      '<path fill="url(#toA)" d="M50 57 L23 9 Q22 5 27 5 L45 5 Q49 5 51 9 L98 63 Z"/>' +
      '<path fill="url(#toB)" d="M10 7 L68 7 Q72 8.5 68 10.5 L14 10.5 Z"/>' +
      '<path fill="url(#toB)" stroke="rgba(6,8,12,.2)" stroke-width=".8" d="M380 86 C379 74 364 64 338 63 L122 62 C94 62 66 58 46 54 L41 60 C63 74 97 98 129 98 L342 98 C364 98 379 94 380 86 Z"/>' +
      '<path d="M124 64.5 L336 65.5" stroke="#fff" stroke-width="1.5" opacity=".9"/>' +
      windows +
      '<path d="M112 82 L356 82" stroke="url(#toL)" stroke-width="3"/>' +
      '<rect x="330" y="67" width="9" height="22" rx="2" fill="none" stroke="rgba(6,8,12,.22)" stroke-width=".9"/>' +
      '<path fill="url(#toG)" d="M352 68 C362 69 370 73 373 78 L357 78 C355 74 354 71 352 68 Z"/>' +
      '<path fill="url(#toB)" stroke="rgba(6,8,12,.2)" stroke-width=".8" d="M176 59 C192 52 238 52 258 56 L260 62 L176 62 Z"/>' +
      '<ellipse cx="202" cy="75" rx="26" ry="5" fill="url(#exh)" id="exhaust"/>' +
      '<path fill="url(#toB)" stroke="rgba(6,8,12,.2)" stroke-width=".8" d="M204 62 L264 61 C276 61 284 67 284 73 C284 79 276 85 264 85 L214 85 C208 85 203 81 203 76 Z"/>' +
      '<path d="M272 62 L272 84" stroke="rgba(6,8,12,.25)"/>' +
      '<ellipse cx="290" cy="73" rx="3.5" ry="31" fill="url(#toP)"/>' +
      '<g class="ac-blades"><path class="ac-blade" d="M290 73 L288.6 44 Q290 41 291.4 44 Z M290 73 L288.6 102 Q290 105 291.4 102 Z"/></g>' +
      '<g class="ac-blades" style="animation-delay:-.035s"><path class="ac-blade" d="M290 73 L288.6 44 Q290 41 291.4 44 Z M290 73 L288.6 102 Q290 105 291.4 102 Z"/></g>' +
      '<path fill="url(#toB)" d="M283 66 Q300 73 283 80 Z"/>' +
    '</svg>';

  /* =======================================================
     Scroll-driven effects (one rAF-throttled handler)
     ======================================================= */
  var progressFill = $('.progress-fill'), tlEl = $('#timeline'), tlFill = $('.tl-fill'), tlPlane = $('#tlPlane');
  var scene = $('.runway-scene'), takeoff = $('#takeoff'), marks = $('.runway-marks'), gear = $('#gear');
  var tlItems = $$('.tl-item');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight, sy = window.scrollY, docH = document.documentElement.scrollHeight;
    progressFill.style.transform = 'scaleX(' + clamp(sy / (docH - vh), 0, 1) + ')';

    // word reveal
    var r = profileEl.getBoundingClientRect();
    var p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3), 0, 1);
    var n = REDUCED ? words.length : Math.round(p * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);

    // timeline
    var tr = tlEl.getBoundingClientRect();
    var tp = clamp((vh * 0.6 - tr.top) / tr.height, 0, 1);
    tlFill.style.transform = 'scaleY(' + tp + ')';
    tlPlane.style.top = tp * 100 + '%';
    tlItems.forEach(function (it) { it.classList.toggle('in', it.getBoundingClientRect().top < vh * 0.6); });

    // take-off
    var sr = scene.getBoundingClientRect();
    if (sr.top < vh && sr.bottom > -200) {
      var k = clamp((vh - sr.top) / (vh * 0.9), 0, 1);
      var sw = scene.clientWidth, pw = takeoff.offsetWidth;
      var x = sw * 0.02 + (sw * 1.05) * Math.pow(k, 2.2) - pw * 0.15;
      var lift = k > 0.5 ? Math.pow((k - 0.5) / 0.5, 1.6) : 0;
      var y = -lift * 200, rot = -Math.min(11, lift * 26);
      takeoff.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)';
      marks.style.transform = 'translateX(' + (-(k * 1400) % 900) + 'px)';
      var up = k > 0.68;
      gear.style.opacity = up ? 0 : 1;
      gear.style.transform = up ? 'scaleY(.2)' : 'none';
      var ex = $('#exhaust');
      if (ex) ex.setAttribute('rx', 20 + k * 40);
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);

  /* Reveal on scroll */
  var revealIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach(function (el) { revealIO.observe(el); });

  /* Active nav link */
  var navLinks = $$('.nav-links a');
  var navIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      navLinks.forEach(function (a) {
        var target = a.getAttribute('href').slice(1);
        var match = target === e.target.id || (target === 'explore' && e.target.id === 'loop') ||
          (target === 'journey' && e.target.id === 'map') || (target === 'publications' && (e.target.id === 'teaching' || e.target.id === 'skills'));
        a.classList.toggle('active', match);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(function (s) { navIO.observe(s); });

  /* Mobile menu */
  var burger = $('.nav-burger'), menu = $('#mobileMenu');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); menu.hidden = true; document.body.style.overflow = ''; });
  });

  /* Magnetic buttons + custom cursor (mouse only) */
  if (FINE && !REDUCED) {
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.22 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.3 + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), background .25s, border-color .25s, box-shadow .3s';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 500);
      });
    });

    var dot = $('.cursor-dot'), ringEl = $('.cursor-ring'), cx = -100, cy = -100, rx = -100, ry = -100;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      cx = e.clientX; cy = e.clientY; document.body.classList.add('has-cursor');
      var hot = e.target.closest && e.target.closest('a, button, .comp.on, .loop-node, .loop-list li, .map-list li, .chip');
      ringEl.classList.toggle('hover', !!hot);
    });
    document.addEventListener('pointerleave', function () { document.body.classList.remove('has-cursor'); });
    (function follow() {
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      ringEl.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    })();
  }

  onScroll();
})();
