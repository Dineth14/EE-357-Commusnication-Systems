/* ============================================================
   VSB Filter Response — Chapter 2 Simulation 3
   ============================================================ */
(function() {
  const state = { fc: 10, fm: 4, fv: 1.5, playing: true, time: 0 };
  let canvas, ctx, W, H, lastTs = 0;

  function init() {
    canvas = document.getElementById('vsb-response-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    bindControls();
    requestAnimationFrame(draw);
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    const d = devicePixelRatio || 1; W = r.width; H = 380;
    canvas.width = W * d; canvas.height = H * d;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function vsbFilter(f) {
    const fc = state.fc, fv = state.fv, fm = state.fm;
    const fl = fc - fv, fu = fc + fm;
    if (f < fl) return 0;
    if (f > fu) return 0;
    if (f < fc) return 0.5 + 0.5 * Math.sin(Math.PI / 2 * (f - fl) / (fc - fl));
    return 1;
  }

  function draw(ts) {
    if (!lastTs) lastTs = ts;
    if (state.playing) state.time += (ts - lastTs) / 1000;
    lastTs = ts;
    ctx.clearRect(0, 0, W, H);

    const panelH = H / 2;

    // Top: Filter shape + symmetry check
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter'; ctx.fillText('VSB Filter Response H_i(f) & Symmetry Condition', 8, 14);

    const fMin = 0, fMax = state.fc * 2;
    const plotX = 40, plotW = W - 80, plotY = 20, plotH = panelH - 40;

    // Grid
    ctx.strokeStyle = '#1e2d4a'; ctx.lineWidth = 0.3;
    for (let i = 0; i <= 5; i++) {
      const x = plotX + (i / 5) * plotW;
      ctx.beginPath(); ctx.moveTo(x, plotY); ctx.lineTo(x, plotY + plotH); ctx.stroke();
    }

    // Filter H_i(f - fc)
    ctx.fillStyle = 'rgba(56,189,248,0.12)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    for (let px = 0; px <= plotW; px++) {
      const f = fMin + (px / plotW) * fMax;
      const h = vsbFilter(f);
      const y = plotY + plotH - h * plotH;
      ctx.lineTo(plotX + px, y);
    }
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.fill();
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const f = fMin + (px / plotW) * fMax;
      const h = vsbFilter(f);
      const y = plotY + plotH - h * plotH;
      if (px === 0) ctx.moveTo(plotX + px, y); else ctx.lineTo(plotX + px, y);
    }
    ctx.stroke();

    // Symmetry sum: H_i(f-fc) + H_i(f+fc)
    ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    let flat = true;
    for (let px = 0; px <= plotW; px++) {
      const f = fMin + (px / plotW) * fMax;
      const sum = vsbFilter(f) + vsbFilter(2 * state.fc - f);
      if (Math.abs(sum - 1) > 0.05 && f > state.fc - state.fm && f < state.fc + state.fm) flat = false;
      const y = plotY + plotH - (sum / 2) * plotH;
      if (px === 0) ctx.moveTo(plotX + px, y); else ctx.lineTo(plotX + px, y);
    }
    ctx.stroke();

    // Flatness indicator
    ctx.fillStyle = flat ? '#2dd4bf' : '#fb7185';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText(flat ? '✓ Symmetry OK' : '✗ Not symmetric', W - 140, plotY + 15);

    // Axis labels
    ctx.fillStyle = '#64748b'; ctx.font = '10px JetBrains Mono';
    ctx.fillText('0', plotX - 5, plotY + plotH + 14);
    ctx.fillText('f_c=' + state.fc, plotX + plotW / 2 - 15, plotY + plotH + 14);

    // Legend
    ctx.fillStyle = '#38bdf8'; ctx.fillText('— H_i(f)', plotX, plotY + plotH + 28);
    ctx.fillStyle = '#2dd4bf'; ctx.fillText('— H_i(f-fc)+H_i(f+fc)', plotX + 80, plotY + plotH + 28);

    // Bottom: Time domain (VSB output vs m(t))
    const tOff = panelH;
    ctx.strokeStyle = '#1e2d4a'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(0, tOff); ctx.lineTo(W, tOff); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter';
    ctx.fillText('Time Domain: VSB output (solid) vs m(t) (dashed)', 8, tOff + 14);

    const mid = tOff + panelH / 2, amp = panelH * 0.35, dur = 4 / state.fm;

    ctx.strokeStyle = '#fbbf2460'; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = state.time + (x / W) * dur;
      const y = mid - amp * Math.sin(2 * Math.PI * state.fm * t);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // VSB approximation (simplified: slight distortion based on fv)
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.beginPath();
    const distortion = 0.05 * (state.fv / state.fm);
    for (let x = 0; x < W; x++) {
      const t = state.time + (x / W) * dur;
      const m = Math.sin(2 * Math.PI * state.fm * t);
      const vsb = m * (1 - distortion * 0.5) + distortion * 0.3 * Math.sin(4 * Math.PI * state.fm * t);
      const y = mid - amp * vsb;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // BW
    ctx.fillStyle = '#2dd4bf'; ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText('B_T ≈ W + f_v = ' + (state.fm + state.fv).toFixed(1), W - 200, tOff + panelH - 10);

    requestAnimationFrame(draw);
  }

  function bindControls() {
    const pairs = [['vsb-fc','fc'],['vsb-fm','fm'],['vsb-fv','fv']];
    pairs.forEach(function(p) {
      const el = document.getElementById(p[0]);
      if (el) el.addEventListener('input', debounce(function() {
        state[p[1]] = parseFloat(el.value);
        const v = document.getElementById(p[0]+'-val');
        if (v) v.textContent = el.value;
      }, 16));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
