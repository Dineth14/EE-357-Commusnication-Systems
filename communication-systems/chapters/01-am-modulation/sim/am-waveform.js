/* ============================================================
   AM Waveform Builder — Chapter 1 Simulation 1
   Real-time canvas animator: message, carrier, AM output
   ============================================================ */
(function() {
  const state = {
    fc: 8, fm: 1, mu: 0.7, harmonics: 1,
    playing: true, speed: 1, time: 0
  };
  let canvas, ctx, W, H, animId;
  let lastTs = 0;

  function init() {
    canvas = document.getElementById('am-waveform-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    bindControls();
    animId = requestAnimationFrame(draw);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = rect.width; H = 420;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function message(t) {
    let m = 0;
    for (let h = 1; h <= state.harmonics; h++) {
      m += Math.sin(2 * Math.PI * state.fm * h * t) / h;
    }
    return m;
  }

  function draw(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (state.playing) state.time += dt * state.speed;

    const panelH = H / 3;
    ctx.clearRect(0, 0, W, H);

    // Draw three panels
    for (let p = 0; p < 3; p++) {
      const yOff = p * panelH;
      const mid = yOff + panelH / 2;
      const amp = panelH * 0.38;

      // Grid
      ctx.strokeStyle = '#1e2d4a';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, yOff); ctx.lineTo(W, yOff);
      ctx.stroke();

      // Zero line
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      const labels = ['m(t) — Message', 'c(t) — Carrier', 's_AM(t) — AM Output'];
      ctx.fillText(labels[p], 8, yOff + 16);

      // Waveform
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x < W; x++) {
        const t = state.time + (x / W) * (6 / state.fm);
        let y;

        if (p === 0) {
          // Message signal
          ctx.strokeStyle = '#fbbf24';
          y = mid - amp * message(t);
        } else if (p === 1) {
          // Carrier
          ctx.strokeStyle = '#64748b';
          y = mid - amp * 0.6 * Math.cos(2 * Math.PI * state.fc * t);
        } else {
          // AM signal
          const m = message(t);
          const env = 1 + state.mu * m;
          const s = env * Math.cos(2 * Math.PI * state.fc * t);
          y = mid - amp * 0.6 * s;

          // Draw envelope as dashed overlay
          if (x === 0) {
            ctx.strokeStyle = '#38bdf8';
          }
        }

        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // For AM panel: draw envelope dashed
      if (p === 2) {
        // Upper envelope
        ctx.strokeStyle = '#fbbf2480';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const t = state.time + (x / W) * (6 / state.fm);
          const m = message(t);
          const env = 1 + state.mu * m;
          const y = mid - amp * 0.6 * Math.abs(env);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Lower envelope
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const t = state.time + (x / W) * (6 / state.fm);
          const m = message(t);
          const env = 1 + state.mu * m;
          const y = mid + amp * 0.6 * Math.abs(env);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Overmodulation warning
        if (state.mu > 1) {
          // Shade clipped regions in rose
          ctx.fillStyle = 'rgba(251, 113, 133, 0.15)';
          for (let x = 0; x < W; x++) {
            const t = state.time + (x / W) * (6 / state.fm);
            const m = message(t);
            const env = 1 + state.mu * m;
            if (env < 0) {
              ctx.fillRect(x, yOff, 1, panelH);
            }
          }
        }
      }
    }

    // Bottom separator
    ctx.strokeStyle = '#1e2d4a';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(0, H - 1); ctx.lineTo(W, H - 1); ctx.stroke();

    // Update readouts
    updateReadouts();

    animId = requestAnimationFrame(draw);
  }

  function updateReadouts() {
    const Pc = 0.5; // normalized carrier power
    const Ps = state.mu * state.mu * Pc / 2;
    const Pt = Pc + Ps;
    const eta = (state.mu * state.mu / 2) / (1 + state.mu * state.mu / 2) * 100;

    setVal('am-readout-pc', Pc.toFixed(3));
    setVal('am-readout-pusb', (Ps / 2).toFixed(3));
    setVal('am-readout-plsb', (Ps / 2).toFixed(3));
    setVal('am-readout-pt', Pt.toFixed(3));
    setVal('am-readout-eta', eta.toFixed(1) + '%');

    // Warning badge
    const badge = document.getElementById('am-overmod-warning');
    if (badge) badge.style.display = state.mu > 1 ? 'inline-flex' : 'none';
  }

  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  function bindControls() {
    bind('am-fc', 'fc', 'am-fc-val');
    bind('am-fm', 'fm', 'am-fm-val');
    bind('am-mu', 'mu', 'am-mu-val');
    bind('am-harmonics', 'harmonics', 'am-harmonics-val');
    bind('am-speed', 'speed', 'am-speed-val');

    const playBtn = document.getElementById('am-play-btn');
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    const resetBtn = document.getElementById('am-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetSim);

    registerSimKeys({ toggle: togglePlay, reset: resetSim });
  }

  function bind(sliderId, prop, valId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    slider.addEventListener('input', debounce(function() {
      state[prop] = parseFloat(slider.value);
      const valEl = document.getElementById(valId);
      if (valEl) valEl.textContent = slider.value;
    }, 16));
  }

  function togglePlay() {
    state.playing = !state.playing;
    const btn = document.getElementById('am-play-btn');
    if (btn) btn.textContent = state.playing ? '⏸ Pause' : '▶ Play';
  }

  function resetSim() {
    state.time = 0;
    state.fc = 8; state.fm = 1; state.mu = 0.7; state.harmonics = 1; state.speed = 1;
    ['am-fc','am-fm','am-mu','am-harmonics','am-speed'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) {
        el.value = el.defaultValue;
        el.dispatchEvent(new Event('input'));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
