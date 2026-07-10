(function () {
  var wrap = document.querySelector('[data-graph]');
  var dataEl = document.getElementById('graph-data');
  var canvas = wrap && wrap.querySelector('.graph-canvas');
  if (!wrap || !dataEl || !canvas) return;

  var raw;
  try { raw = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!raw.nodes || !raw.nodes.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Colors pulled from the site palette so the graph matches the blog ── */
  var COLORS = {};
  function refreshColors() {
    var css = getComputedStyle(document.documentElement);
    function v(name, fb) { return (css.getPropertyValue(name) || fb).trim(); }
    COLORS.post = v('--theme', '#2a6b5e');
    COLORS.project = v('--accent-warm', '#b85a3c');
    COLORS.tag = v('--theme-soft', '#3d8a7a');
    COLORS.edge = v('--graph-edge', 'rgba(26,31,46,0.14)');
    COLORS.edgeHi = v('--theme', '#2a6b5e');
    COLORS.halo = v('--theme-muted', 'rgba(42,107,94,0.14)');
    COLORS.ring = v('--bg-elevated', '#fffdf9');
    COLORS.label = v('--ink', '#1a1f2e');
    COLORS.labelMuted = v('--ink-muted', '#6b7280');
  }
  refreshColors();

  /* recolor live when the theme toggles */
  new MutationObserver(function () {
    refreshColors();
    frames = 0;
    if (!running) { running = true; tick(); }
    else { draw(); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ── Dedupe nodes, index links ── */
  var nodeMap = {};
  raw.nodes.forEach(function (n) {
    if (!nodeMap[n.id]) nodeMap[n.id] = { id: n.id, label: n.label, type: n.type, url: n.url, deg: 0 };
  });
  var nodes = Object.keys(nodeMap).map(function (k) { return nodeMap[k]; });

  var adj = {};
  var links = [];
  raw.links.forEach(function (l) {
    var s = nodeMap[l.source], t = nodeMap[l.target];
    if (!s || !t) return;
    links.push({ s: s, t: t });
    s.deg++; t.deg++;
    (adj[s.id] = adj[s.id] || {})[t.id] = true;
    (adj[t.id] = adj[t.id] || {})[s.id] = true;
  });

  function neighbors(id) { return adj[id] || {}; }
  function radius(n) { return 5 + Math.min(9, n.deg * 1.6); }

  /* ── Seed positions on a circle ── */
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  nodes.forEach(function (n, i) {
    var a = (i / nodes.length) * Math.PI * 2;
    n.x = Math.cos(a) * 120 + (i % 3) * 8;
    n.y = Math.sin(a) * 120 + (i % 5) * 6;
    n.vx = 0; n.vy = 0;
  });

  /* ── View transform (zoom + pan) ──
     screen = (W/2 + ox) + world * scale */
  var view = { scale: 1, ox: 0, oy: 0 };
  var userAdjusted = false;

  var ctx = canvas.getContext('2d');
  function resize() {
    var r = wrap.getBoundingClientRect();
    W = r.width;
    var ratio = W < 380 ? 1.05 : 0.6;
    H = Math.max(220, Math.min(600, W * ratio));
    wrap.style.setProperty('--graph-h', H + 'px');
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!userAdjusted) fit();
  }

  function fit() {
    var minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
    nodes.forEach(function (n) {
      if (n.x < minx) minx = n.x; if (n.x > maxx) maxx = n.x;
      if (n.y < miny) miny = n.y; if (n.y > maxy) maxy = n.y;
    });
    var bw = (maxx - minx) || 1, bh = (maxy - miny) || 1, pad = 70;
    var s = Math.min((W - pad) / bw, (H - pad) / bh);
    view.scale = Math.max(0.45, Math.min(2.2, s));
    view.ox = -((minx + maxx) / 2) * view.scale;
    view.oy = -((miny + maxy) / 2) * view.scale;
  }

  function toWorld(ev) {
    var r = canvas.getBoundingClientRect();
    var sx = ev.clientX - r.left, sy = ev.clientY - r.top;
    return { x: (sx - W / 2 - view.ox) / view.scale, y: (sy - H / 2 - view.oy) / view.scale, sx: sx, sy: sy };
  }

  /* ── Force step (Euler with damping) ── */
  var K_REPEL = 1400, K_SPRING = 0.02, SPRING_LEN = 70, K_CENTER = 0.012, DAMP = 0.86;
  function step() {
    var i, j, a, b, dx, dy, d2, d, f;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d2 = dx * dx + dy * dy || 0.01;
        d = Math.sqrt(d2);
        f = K_REPEL / d2;
        var ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f;
        b.vx -= ux * f; b.vy -= uy * f;
      }
    }
    links.forEach(function (l) {
      dx = l.t.x - l.s.x; dy = l.t.y - l.s.y;
      d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      f = (d - SPRING_LEN) * K_SPRING;
      var ux = dx / d, uy = dy / d;
      l.s.vx += ux * f; l.s.vy += uy * f;
      l.t.vx -= ux * f; l.t.vy -= uy * f;
    });
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      a.vx += -a.x * K_CENTER; a.vy += -a.y * K_CENTER;
      a.vx *= DAMP; a.vy *= DAMP;
      if (a !== dragging) { a.x += a.vx; a.y += a.vy; }
    }
  }

  /* ── Draw ── */
  var hover = null;
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.translate(W / 2 + view.ox, H / 2 + view.oy);
    ctx.scale(view.scale, view.scale);

    var hi = hover ? neighbors(hover.id) : null;

    links.forEach(function (l) {
      var on = hover && (l.s === hover || l.t === hover);
      ctx.strokeStyle = on ? COLORS.edgeHi : COLORS.edge;
      ctx.lineWidth = (on ? 1.6 : 1) / view.scale * (view.scale < 1 ? view.scale : 1);
      ctx.globalAlpha = hover && !on ? 0.4 : 1;
      ctx.beginPath();
      ctx.moveTo(l.s.x, l.s.y);
      ctx.lineTo(l.t.x, l.t.y);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    nodes.forEach(function (n) {
      var focus = hover && (n === hover || (hi && hi[n.id]));
      var dim = hover && !focus;
      var r = radius(n) * (n === hover ? 1.35 : 1);

      if (focus) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 7, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.halo;
        ctx.fill();
      }

      ctx.globalAlpha = dim ? 0.32 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[n.type] || COLORS.tag;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = COLORS.ring;
      ctx.stroke();

      var showLabel = n.type !== 'tag' || focus;
      if (showLabel) {
        ctx.globalAlpha = dim ? 0.4 : 1;
        ctx.font = (n.type === 'tag' ? '10px ' : '600 11px ') + 'system-ui, sans-serif';
        ctx.fillStyle = n === hover ? COLORS.edgeHi : (n.type === 'tag' ? COLORS.labelMuted : COLORS.label);
        ctx.textAlign = 'center';
        ctx.fillText(trim(n.label), n.x, n.y - r - 6);
      }
    });
    ctx.globalAlpha = 1;
  }
  function trim(s) { return s.length > 22 ? s.slice(0, 21) + '…' : s; }

  /* ── Loop ── */
  var frames = 0, MAX = prefersReduced ? 220 : Infinity, running = true, fitted = false;
  function tick() {
    if (!running) return;
    step();
    if (!fitted && !userAdjusted && frames === 90) { fit(); fitted = true; }
    draw();
    frames++;
    if (frames >= MAX) { running = false; }
    requestAnimationFrame(tick);
  }
  function wake() { frames = Math.min(frames, 60); if (!running) { running = true; tick(); } }

  /* ── Pointer: hover, node drag, background pan, click ── */
  var dragging = null, panning = false, panLast = null, moved = false;
  function pick(p) {
    var best = null, bd = 1e9;
    nodes.forEach(function (n) {
      var dx = n.x - p.x, dy = n.y - p.y, d = dx * dx + dy * dy;
      var rr = (radius(n) + 8) * (radius(n) + 8);
      if (d < rr && d < bd) { bd = d; best = n; }
    });
    return best;
  }

  canvas.addEventListener('pointermove', function (ev) {
    var p = toWorld(ev);
    if (dragging) {
      dragging.x = p.x; dragging.y = p.y; dragging.vx = 0; dragging.vy = 0;
      moved = true; wake();
      return;
    }
    if (panning) {
      view.ox += p.sx - panLast.sx; view.oy += p.sy - panLast.sy;
      panLast = p; moved = true; userAdjusted = true;
      if (!running) draw();
      return;
    }
    var n = pick(p);
    if (n !== hover) {
      hover = n;
      canvas.style.cursor = n ? 'pointer' : 'grab';
      if (!running) draw();
    }
  });

  canvas.addEventListener('pointerdown', function (ev) {
    var p = toWorld(ev);
    moved = false;
    dragging = pick(p);
    if (dragging) { canvas.setPointerCapture(ev.pointerId); wake(); }
    else { panning = true; panLast = p; canvas.setPointerCapture(ev.pointerId); canvas.style.cursor = 'grabbing'; }
  });

  canvas.addEventListener('pointerup', function (ev) {
    if (dragging && !moved && dragging.url) { window.location.href = dragging.url; }
    dragging = null; panning = false;
    canvas.style.cursor = hover ? 'pointer' : 'grab';
  });

  canvas.addEventListener('pointerleave', function () {
    if (!panning && !dragging) { hover = null; if (!running) draw(); }
  });

  /* ── Wheel zoom toward the cursor ── */
  canvas.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    var p = toWorld(ev);
    var factor = Math.exp(-ev.deltaY * 0.0015);
    var ns = Math.max(0.4, Math.min(3.2, view.scale * factor));
    view.scale = ns;
    view.ox = p.sx - W / 2 - p.x * ns;
    view.oy = p.sy - H / 2 - p.y * ns;
    userAdjusted = true;
    if (!running) draw();
  }, { passive: false });

  /* ── Double-click resets the view ── */
  canvas.addEventListener('dblclick', function () {
    userAdjusted = false; fit(); if (!running) draw();
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); wake(); }, 150);
  }, { passive: true });

  wrap.classList.add('is-live');
  canvas.style.cursor = 'grab';
  resize();
  tick();
})();
