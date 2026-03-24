/* ============================================================
   DSB-SC Waveform & Phase Reversal — Chapter 2 Simulation 1
   ============================================================ */
(function() {
  const state = { fc: 8, fm: 1, phaseOffset: 0, playing: true, speed: 1, time: 0, showDemod: false };
  let canvas, ctx, W, H, lastTs = 0;

  function init() {
    canvas = document.getElementById('dsbsc-waveform-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    bindControls();
    requestAnimationFrame(draw);
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    const d = devicePixelRatio || 1;
    W = r.width; H = 400;
    canvas.width = W * d; canvas.height = H * d;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function msg(t) { return Math.sin(2 * Math.PI * state.fm * t); }

  function draw(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000; lastTs = ts;
    if (state.playing) state.time += dt * state.speed;
    ctx.clearRect(0, 0, W, H);

    const panels = state.showDemod ? 4 : 3;
    const pH = H / panels;
    const dur = 6 / state.fm;
    const labels = ['m(t) — Message', 'c(t) — Carrier', 's_DSB(t) — DSB-SC'];
    if (state.showDemod) labels.push('Demod Output (cos φ scaling)');
    const colors = ['#fbbf24', '#64748b', '#38bdf8', '#2dd4bf'];

    for (let p = 0; p < panels; p++) {
      const yOff = p * pH, mid = yOff + pH / 2, amp = pH * 0.38;
      ctx.strokeStyle = '#1e2d4a'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, yOff); ctx.lineTo(W, yOff); ctx.stroke();
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.3; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif';
      ctx.fillText(labels[p], 8, yOff + 16);

      ctx.strokeStyle = colors[p]; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = state.time + (x / W) * dur;
        let y;
        if (p === 0) y = mid - amp * msg(t);
        else if (p === 1) y = mid - amp * 0.6 * Math.cos(2 * Math.PI * state.fc * t);
        else if (p === 2) y = mid - amp * 0.6 * msg(t) * Math.cos(2 * Math.PI * state.fc * t + state.phaseOffset * Math.PI / 180);
        else {
          const phi = state.phaseOffset * Math.PI / 180;
          y = mid - amp * msg(t) * Math.cos(phi);
        }
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Phase reversal markers on DSB-SC panel
      if (p === 2) {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
        for (let x = 0; x < W; x += 2) {
          const t = state.time + (x / W) * dur;
          const m1 = msg(t), m2 = msg(state.time + ((x + 2) / W) * dur);
          if (m1 * m2 < 0) {
            ctx.beginPath(); ctx.moveTo(x, yOff); ctx.lineTo(x, yOff + pH); ctx.stroke();
            // Triangle marker
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(x - 4, yOff + 4); ctx.lineTo(x + 4, yOff + 4); ctx.lineTo(x, yOff + 12); ctx.fill();
          }
        }
        ctx.setLineDash([]);
      }
    }

    // Cos phi readout
    const cosPhiEl = document.getElementById('dsbsc-cos-phi');
    if (cosPhiEl) cosPhiEl.textContent = Math.cos(state.phaseOffset * Math.PI / 180).toFixed(3);

    requestAnimationFrame(draw);
  }

  function bindControls() {
    const pairs = [['dsbsc-fc','fc'],['dsbsc-fm','fm'],['dsbsc-phase','phaseOffset'],['dsbsc-speed','speed']];
    pairs.forEach(function(p) {
      const el = document.getElementById(p[0]);
      if (el) el.addEventListener('input', debounce(function() {
        state[p[1]] = parseFloat(el.value);
        const v = document.getElementById(p[0] + '-val');
        if (v) v.textContent = el.value;
      }, 16));
    });
    const playBtn = document.getElementById('dsbsc-play-btn');
    if (playBtn) playBtn.addEventListener('click', function() { state.playing = !state.playing; playBtn.textContent = state.playing ? '⏸ Pause' : '▶ Play'; });
    const demodBtn = document.getElementById('dsbsc-demod-btn');
    if (demodBtn) demodBtn.addEventListener('click', function() { state.showDemod = !state.showDemod; demodBtn.classList.toggle('active', state.showDemod); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
