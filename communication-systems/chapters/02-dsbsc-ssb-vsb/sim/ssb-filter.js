/* ============================================================
   SSB Filter & Sideband Selector — Chapter 2 Simulation 2
   ============================================================ */
(function() {
  const state = { fc: 8, fm: 1.5, showUSB: true, playing: true, time: 0 };
  let canvas, ctx, W, H, lastTs = 0;

  function init() {
    canvas = document.getElementById('ssb-filter-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    bindControls();
    requestAnimationFrame(draw);
  }

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    const d = devicePixelRatio || 1; W = r.width; H = 400;
    canvas.width = W * d; canvas.height = H * d;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  function draw(ts) {
    if (!lastTs) lastTs = ts;
    if (state.playing) state.time += (ts - lastTs) / 1000;
    lastTs = ts;
    ctx.clearRect(0, 0, W, H);

    const halfW = W / 2;
    const panelH = H / 2;

    // Top: Frequency domain (3 sub-panels side by side)
    const specH = panelH;
    const specW = W / 3;

    // Sub-panel labels
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter, sans-serif';
    ctx.fillText('DSB-SC Spectrum', 8, 14);
    ctx.fillText('Filter H(f)', specW + 8, 14);
    ctx.fillText('SSB Spectrum', 2 * specW + 8, 14);

    // Draw DSB-SC spectrum
    drawSpectrum(ctx, 0, 20, specW, specH - 30, state.fc, state.fm, 'both');

    // Draw filter
    drawFilter(ctx, specW, 20, specW, specH - 30, state.fc, state.fm, state.showUSB);

    // Draw SSB spectrum
    drawSpectrum(ctx, 2 * specW, 20, specW, specH - 30, state.fc, state.fm, state.showUSB ? 'usb' : 'lsb');

    // Bottom: Time domain
    const tOff = panelH;
    ctx.strokeStyle = '#1e2d4a'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(0, tOff); ctx.lineTo(W, tOff); ctx.stroke();

    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Time Domain: SSB (solid) vs m(t) (dashed)', 8, tOff + 14);

    const dur = 4 / state.fm;
    const mid = tOff + panelH / 2;
    const amp = panelH * 0.35;

    // Message (dashed)
    ctx.strokeStyle = '#fbbf2460'; ctx.lineWidth = 1; ctx.setLineDash([5,5]);
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = state.time + (x / W) * dur;
      const m = Math.sin(2 * Math.PI * state.fm * t);
      const y = mid - amp * m;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Hilbert transform of sin = -cos (dashed teal)
    ctx.strokeStyle = '#2dd4bf40'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = state.time + (x / W) * dur;
      const mHat = -Math.cos(2 * Math.PI * state.fm * t);
      const y = mid - amp * mHat;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#2dd4bf60'; ctx.font = '10px Inter'; ctx.fillText('ĥ(m(t))', W - 55, mid - amp - 5);

    // SSB signal
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const t = state.time + (x / W) * dur;
      const m = Math.sin(2 * Math.PI * state.fm * t);
      const mHat = -Math.cos(2 * Math.PI * state.fm * t);
      let ssb;
      if (state.showUSB) {
        ssb = 0.5 * (m * Math.cos(2 * Math.PI * state.fc * t) - mHat * Math.sin(2 * Math.PI * state.fc * t));
      } else {
        ssb = 0.5 * (m * Math.cos(2 * Math.PI * state.fc * t) + mHat * Math.sin(2 * Math.PI * state.fc * t));
      }
      const y = mid - amp * ssb * 2;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // BW labels
    ctx.fillStyle = '#2dd4bf'; ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText('B_T(SSB) = W = ' + state.fm.toFixed(1), W - 180, tOff + panelH - 10);
    ctx.fillStyle = '#64748b';
    ctx.fillText('vs B_T(DSB) = 2W = ' + (2 * state.fm).toFixed(1), W - 180, tOff + panelH - 25);

    requestAnimationFrame(draw);
  }

  function drawSpectrum(ctx, x0, y0, w, h, fc, fm, mode) {
    const mid = y0 + h / 2;
    const bottom = y0 + h;
    // Axis
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0 + w, bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, bottom); ctx.stroke();

    const scale = w / (2.5 * fc);
    const barH = h * 0.7;

    function drawBar(freq, amp, color) {
      const px = x0 + w / 2 + freq * scale;
      if (px < x0 || px > x0 + w) return;
      ctx.fillStyle = color;
      ctx.fillRect(px - 2, bottom - barH * amp, 4, barH * amp);
    }

    if (mode === 'both' || mode === 'usb') {
      drawBar(fc + fm, 0.5, '#fbbf24');
      drawBar(-(fc + fm), 0.5, '#fbbf24');
    }
    if (mode === 'both' || mode === 'lsb') {
      drawBar(fc - fm, 0.5, '#fb7185');
      drawBar(-(fc - fm), 0.5, '#fb7185');
    }
  }

  function drawFilter(ctx, x0, y0, w, h, fc, fm, isUSB) {
    const bottom = y0 + h;
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0 + w, bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + w / 2, y0); ctx.lineTo(x0 + w / 2, bottom); ctx.stroke();

    const scale = w / (2.5 * fc);
    const filterH = h * 0.7;

    ctx.fillStyle = 'rgba(56,189,248,0.15)';
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;

    // Filter passband
    if (isUSB) {
      const left = x0 + w / 2 + fc * scale;
      const right = x0 + w / 2 + (fc + fm + 1) * scale;
      ctx.fillRect(left, bottom - filterH, right - left, filterH);
      ctx.strokeRect(left, bottom - filterH, right - left, filterH);
    } else {
      const right = x0 + w / 2 + fc * scale;
      const left = x0 + w / 2 + (fc - fm - 1) * scale;
      ctx.fillRect(left, bottom - filterH, right - left, filterH);
      ctx.strokeRect(left, bottom - filterH, right - left, filterH);
    }
  }

  function bindControls() {
    const ssbToggle = document.getElementById('ssb-toggle-btn');
    if (ssbToggle) ssbToggle.addEventListener('click', function() {
      state.showUSB = !state.showUSB;
      ssbToggle.textContent = state.showUSB ? 'Showing: USB' : 'Showing: LSB';
    });
    const pairs = [['ssb-fc','fc'],['ssb-fm','fm']];
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
