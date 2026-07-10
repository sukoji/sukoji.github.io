(function () {
  var wrap = document.querySelector('[data-graph]');
  var dataEl = document.getElementById('graph-data');
  var canvas = wrap && wrap.querySelector('.graph-canvas');
  if (!wrap || !dataEl || !canvas) return;

  var raw;
  try { raw = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!raw.nodes || !raw.nodes.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = getComputedStyle(document.documentElement);
  var COLORS = {
    post: (css.getPropertyValue('--theme') || '#2a6b5e').trim(),
    project: (css.getPropertyValue('--accent-warm') || '#b85a3c').trim(),
    tag: (css.getPropertyValue('--ink-muted') || '#6b7280').trim(),
    edge: 'rgba(26,31,46,0.14)',
    edgeHi: (css.getPropertyValue('--theme') || '#2a6b5e').trim(),
    label: (css.getPropertyValue('--ink') || '#1a1f2e').trim(),
    labelMuted: (css.getPropertyValue('--ink-muted') || '#6b7280').trim()
  };

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

  var ctx = canvas.getContext('2d');
  function resize() {
    var r = wrap.getBoundingClientRect();
    W = r.width; H = Math.max(360, Math.min(620, r.width * 0.62));
    wrap.style.setProperty('--graph-h', H + 'px');
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);

    var hi = hover ? neighbors(hover.id) : null;
    links.forEach(function (l) {
      var on = hover && (l.s === hover || l.t === hover);
      ctx.strokeStyle = on ? COLORS.edgeHi : COLORS.edge;
      ctx.lineWidth = on ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(l.s.x, l.s.y);
      ctx.lineTo(l.t.x, l.t.y);
      ctx.stroke();
    });

    nodes.forEach(function (n) {
      var dim = hover && n !== hover && !(hi && hi[n.id]);
      ctx.globalAlpha = dim ? 0.3 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius(n) * (n === hover ? 1.35 : 1), 0, Math.PI * 2);
      ctx.fillStyle = COLORS[n.type] || COLORS.tag;
      ctx.fill();
      if (n === hover) { ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); }

      var showLabel = n.type !== 'tag' || n === hover || (hi && hi[n.id]);
      if (showLabel) {
        ctx.globalAlpha = dim ? 0.4 : 1;
        ctx.font = (n.type === 'tag' ? '10px ' : '600 11px ') + 'system-ui, sans-serif';
        ctx.fillStyle = n.type === 'tag' ? COLORS.labelMuted : COLORS.label;
        ctx.textAlign = 'center';
        ctx.fillText(trim(n.label), n.x, n.y - radius(n) - 5);
      }
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  function trim(s) { return s.length > 22 ? s.slice(0, 21) + '…' : s; }

  /* ── Loop ── */
  var frames = 0, MAX = prefersReduced ? 220 : Infinity, running = true;
  function tick() {
    if (!running) return;
    step(); draw(); frames++;
    if (frames >= MAX) { running = false; }
    requestAnimationFrame(tick);
  }

  /* ── Pointer: hover, drag, click ── */
  var dragging = null, downAt = null, moved = false;
  function toLocal(ev) {
    var r = canvas.getBoundingClientRect();
    return { x: ev.clientX - r.left - W / 2, y: ev.clientY - r.top - H / 2 };
  }
  function pick(p) {
    var best = null, bd = 1e9;
    nodes.forEach(function (n) {
      var dx = n.x - p.x, dy = n.y - p.y, d = dx * dx + dy * dy;
      var rr = (radius(n) + 6) * (radius(n) + 6);
      if (d < rr && d < bd) { bd = d; best = n; }
    });
    return best;
  }
  canvas.addEventListener('pointermove', function (ev) {
    var p = toLocal(ev);
    if (dragging) {
      dragging.x = p.x; dragging.y = p.y; dragging.vx = 0; dragging.vy = 0;
      moved = true; running = true; frames = 0;
      return;
    }
    var n = pick(p);
    if (n !== hover) { hover = n; canvas.style.cursor = n ? 'pointer' : 'default'; if (!running) draw(); }
  });
  canvas.addEventListener('pointerdown', function (ev) {
    var p = toLocal(ev);
    dragging = pick(p); downAt = p; moved = false;
    if (dragging) { canvas.setPointerCapture(ev.pointerId); running = true; frames = 0; }
  });
  canvas.addEventListener('pointerup', function (ev) {
    var n = dragging || pick(toLocal(ev));
    if (n && !moved && n.url) { window.location.href = n.url; }
    dragging = null;
  });
  canvas.addEventListener('pointerleave', function () { hover = null; if (!running) draw(); });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); running = true; frames = 0; }, 150);
  }, { passive: true });

  wrap.classList.add('is-live');
  resize();
  tick();
})();
