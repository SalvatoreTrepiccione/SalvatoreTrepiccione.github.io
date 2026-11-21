/* Regional aircraft drawing (top view, nose up), shared by the site and the link-preview image.
   Proportions follow the HEART planforms: span ≈ 34.5 m, length ≈ 28.5 m (16 px per metre),
   five-abreast cabin, LH₂ tanks behind the cabin, kerosene wing tanks, two or four propellers. */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var CX = 300, NOSE = 20, TAIL = 476, STRETCH = 1.067;           // 28.5 m → 30.4 m with the LH₂ tanks
  var DY = +((TAIL - NOSE) * (STRETCH - 1)).toFixed(1);
  var S = function (y) { return +(NOSE + (y - NOSE) * STRETCH).toFixed(1); };
  var INNER = 64, OUTER = 150;                                    // nacelle stations from the centreline [px]
  var UID = 0;

  function comp(archs, tip, inner) {
    return '<g class="comp" data-a="' + archs + '" data-tip="' + esc(tip) + '">' + inner + '</g>';
  }
  function part(archs, inner) { return '<g class="part" data-a="' + archs + '">' + inner + '</g>'; }
  function flow(archs, cls, d) { return '<path class="flow ' + cls + '" data-a="' + archs + '" d="' + d + '"/>'; }

  function planform() {
    var u = 'ac' + (UID++);
    var g = function (n) { return 'url(#' + u + n + ')'; };
    var edge = ' stroke="rgba(6,8,12,.22)" stroke-width=".8"';
    var defs = '<defs>' +
      // cylinder shading across the span direction (fuselage, nacelles)
      '<linearGradient id="' + u + 'b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d899b"/><stop offset=".26" stop-color="#e9eef4"/><stop offset=".46" stop-color="#ffffff"/><stop offset=".72" stop-color="#d3dae4"/><stop offset="1" stop-color="#747f92"/></linearGradient>' +
      // wing and tail: bright leading edge, darker trailing edge
      '<linearGradient id="' + u + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e4e9f0"/><stop offset="1" stop-color="#a7b2c1"/></linearGradient>' +
      '<linearGradient id="' + u + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ee7ff"/><stop offset="1" stop-color="#8bff9c"/></linearGradient>' +
      '<radialGradient id="' + u + 'p"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".26"/></radialGradient>' +
      '<linearGradient id="' + u + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4c66"/><stop offset="1" stop-color="#04080d"/></linearGradient>' +
      '</defs>';

    // five-abreast cabin (2 + 3), 19 rows
    var seats = '<rect x="279.5" y="86" width="41" height="232" rx="6" fill="rgba(110,125,145,.13)"/>';
    [281, 289, 300, 308, 316].forEach(function (x) {
      for (var y = 92; y <= 308; y += 12) seats += '<rect x="' + x + '" y="' + y + '" width="6" height="7.5" rx="1.6"/>';
    });

    var nacelle = function (x) {
      return '<path fill="' + g('b') + '"' + edge + ' d="M' + x + ' 146 C' + (x + 7) + ' 146 ' + (x + 9.5) + ' 152 ' + (x + 9.5) + ' 160 L' + (x + 8) + ' 240 C' +
        (x + 6.5) + ' 262 ' + (x + 3.5) + ' 276 ' + x + ' 283 C' + (x - 3.5) + ' 276 ' + (x - 6.5) + ' 262 ' + (x - 8) + ' 240 L' + (x - 9.5) + ' 160 C' +
        (x - 9.5) + ' 152 ' + (x - 7) + ' 146 ' + x + ' 146 Z"/>' +
        '<path d="M' + (x - 9) + ' 157 L' + (x + 9) + ' 157" stroke="rgba(6,8,12,.3)" stroke-width="1.1"/>';
    };
    var blade = function (x) {
      return '<path class="ac-blade" d="M' + x + ' 141 L' + (x - 29) + ' 139.5 Q' + (x - 32.5) + ' 141 ' + (x - 29) + ' 142.5 Z M' + x + ' 141 L' +
        (x + 29) + ' 139.5 Q' + (x + 32.5) + ' 141 ' + (x + 29) + ' 142.5 Z"/>';
    };
    var prop = function (x, d) {
      return '<ellipse cx="' + x + '" cy="141" rx="32" ry="4.5" fill="' + g('p') + '"/>' +
        '<g class="ac-bladesx" style="animation-delay:' + d + 's">' + blade(x) + '</g>' +
        '<g class="ac-bladesx" style="animation-delay:' + (d - 0.035) + 's">' + blade(x) + '</g>' +
        '<path fill="' + g('b') + '"' + edge + ' d="M' + (x - 6.5) + ' 147 Q' + x + ' 127 ' + (x + 6.5) + ' 147 Z"/>';
    };
    var both = function (off, fn) { return fn(CX - off, 0) + fn(CX + off, 1); };

    var nacelleSystems = function (x, outer) {
      return (outer ? '' :
          comp('conv sp', 'Gas turbine|Burns kerosene and drives the propeller.',
            '<rect class="c-kero" x="' + (x - 6) + '" y="162" width="12" height="28" rx="3"/>') +
          comp('te', 'Turbogenerator|Burns kerosene to generate electric power.',
            '<rect class="c-kero" x="' + (x - 6) + '" y="162" width="12" height="28" rx="3"/>')) +
        comp(outer ? 'fc te' : 'fc te sp', 'Electric motor|Turns the propeller using electric power.',
          '<rect class="c-elec" x="' + (x - 5.5) + '" y="149" width="11" height="10" rx="3"/>') +
        comp(outer ? 'fc te' : 'fc sp', 'Fuel-cell stack|Converts hydrogen into electric power for this propeller.',
          '<rect class="c-elec" x="' + (x - 5) + '" y="250" width="10" height="22" rx="2"/>');
    };

    var flows =
      flow('fc te sp', 'f-h2', 'M300 ' + S(324) + ' L300 250') +
      flow('fc te', 'f-h2', 'M' + (CX - OUTER) + ' 250 L' + (CX + OUTER) + ' 250') +
      flow('sp', 'f-h2', 'M' + (CX - INNER) + ' 250 L' + (CX + INNER) + ' 250') +
      both(INNER, function (x, r) {
        var s = r ? 1 : -1;
        return flow('conv te sp', 'f-kero', 'M' + (x + s * 18) + ' 221 Q' + (x + s * 13) + ' 202 ' + (x + s * 6) + ' 190') +
          flow('fc sp', 'f-elec', 'M' + x + ' 249 L' + x + ' 160') +
          flow('sp', 'f-batt', 'M' + (300 + s * 12) + ' 262 Q' + (x + s * 4) + ' 250 ' + (x + s * 3) + ' 160');
      }) +
      both(OUTER, function (x) { return flow('fc te', 'f-elec', 'M' + x + ' 249 L' + x + ' 160'); }) +
      flow('te', 'f-elec', 'M' + (CX - OUTER) + ' 196 L' + (CX + OUTER) + ' 196');

    return '<svg viewBox="0 0 600 540" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + defs +
      // fuselage with cabin and hydrogen tank bay (stretches for LH₂)
      '<g class="ac-body" style="transform-origin:300px ' + NOSE + 'px">' +
        '<path fill="' + g('b') + '"' + edge + ' d="M300 20 C311 20 320 36 322.5 60 L323 76 L323 356 C322 410 310 452 303.5 476 L296.5 476 C290 452 278 410 277 356 L277 76 L277.5 60 C280 36 289 20 300 20 Z"/>' +
        '<g class="ac-seats">' + seats + '</g>' +
        comp('fc te sp', 'Liquid-hydrogen tanks|Two cryogenic tanks behind the cabin; the fuselage stretches until they fit.',
          '<rect class="c-h2" x="283" y="323" width="34" height="31" rx="15"/><rect class="c-h2" x="286" y="358" width="28" height="26" rx="13"/>') +
        '<path fill="' + g('g') + '" d="M288 48 C292 40 308 40 312 48 L310.5 53 C304 50 296 50 289.5 53 Z"/>' +
        '<path d="M292 46 C296 43 300 43 303 44" stroke="#9fe9ff" stroke-opacity=".7" stroke-width="1" fill="none"/>' +
      '</g>' +
      // T-tail, moves aft with the stretch
      '<g class="ac-tail">' +
        '<path fill="' + g('a') + '" d="M300 382 L303 466 Q300 486 297 466 Z"/>' +
        '<path fill="' + g('w') + '"' + edge + ' d="M300 448 L246 466 Q241 468 241 472 L241 477 Q241 480 246 480 L300 476 L354 480 Q359 480 359 477 L359 472 Q359 468 354 466 Z"/>' +
        '<path d="M243 470 L243 478 M357 470 L357 478" stroke="#8bff9c" stroke-width="2.2" stroke-linecap="round"/>' +
      '</g>' +
      // high wing (34.5 m)
      '<path fill="' + g('w') + '"' + edge + ' d="M300 204 L32 208.5 Q24 209 24 214 L24 228 Q24 232 30 232 L300 246 L570 232 Q576 232 576 228 L576 214 Q576 209 568 208.5 Z"/>' +
      '<path d="M32 208.7 L300 204.3 L568 208.7" stroke="#fff" stroke-width="1.6" fill="none"/>' +
      '<path d="M60 229.3 L288 240.6 M312 240.6 L540 229.3" stroke="rgba(6,8,12,.16)" stroke-width="1" fill="none"/>' +
      '<path d="M24.5 215 L24.5 227 M575.5 215 L575.5 227" stroke="#8bff9c" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="300" cy="226" rx="15" ry="38" fill="' + g('b') + '"' + edge + '/>' +
      comp('conv te sp', 'Kerosene wing tanks|Fuel stored in the wing box, between the spars.',
        '<rect class="c-kero" x="' + (CX - 214) + '" y="213" width="186" height="17" rx="3"/><rect class="c-kero" x="' + (CX + 28) + '" y="213" width="186" height="17" rx="3"/>') +
      comp('sp', 'Battery packs|Two independent battery sources of the four-source architecture.',
        '<rect class="c-batt" x="268" y="254" width="26" height="16" rx="3"/><rect class="c-batt" x="306" y="254" width="26" height="16" rx="3"/>') +
      // nacelles: two inboard always, two outboard for the distributed architectures
      both(INNER, nacelle) + part('fc te', both(OUTER, nacelle)) +
      both(INNER, function (x) { return nacelleSystems(x, false); }) +
      both(OUTER, function (x) { return nacelleSystems(x, true); }) +
      flows +
      both(INNER, function (x, r) { return prop(x, r ? -0.05 : 0); }) +
      part('fc te', both(OUTER, function (x, r) { return prop(x, r ? -0.09 : -0.02); })) +
      '<text class="stretch-note" x="18" y="528">↕ fuselage stretched for the LH₂ tanks</text>' +
    '</svg>';
  }

  function setArch(root, id) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-a]'), function (el) {
      el.classList.toggle('on', el.getAttribute('data-a').split(' ').indexOf(id) !== -1);
    });
    var st = id !== 'conv';
    var body = root.querySelector('.ac-body'), tail = root.querySelector('.ac-tail'), note = root.querySelector('.stretch-note');
    if (body) body.style.transform = st ? 'scaleY(' + STRETCH + ')' : 'none';
    if (tail) tail.style.transform = st ? 'translateY(' + DY + 'px)' : 'none';
    if (note) note.classList.toggle('on', st);
  }

  window.Aircraft = { planform: planform, setArch: setArch, esc: esc };
})();
