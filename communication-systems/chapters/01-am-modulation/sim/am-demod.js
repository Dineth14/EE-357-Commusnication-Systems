/* ============================================================
   AM Demodulator Comparator — Chapter 1 Simulation 3
   Envelope detector, synchronous detector, square-law
   ============================================================ */
(function() {
  const state = {
    fc: 8, fm: 1, mu: 0.7,
    rc: 0.5, phaseError: 0, noisePower: 0,
    playing: true, speed: 1, time: 0
  };
  let canvas, ctx, W, H, lastTs = 0;

  function init() {
    canvas = document.getElementById('am-demod-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    bindControls();
    requestAnimationFrame(draw);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    W = rect.width; H = 520;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function msg(t) {
    return Math.sin(2 * Math.PI * state.fm * t);
  }

  function amSignal(t) {
    const m = msg(t);
    return (1 + state.mu * m) * Math.cos(2 * Math.PI * state.fc * t);
  }

  function draw(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (state.playing) state.time += dt * state.speed;

    ctx.clearRect(0, 0, W, H);

    const panelH = H / 4;
    const panels = [
      { label: 'm(t) — Original Message', color: '#fbbf24' },
      { label: 'Envelope Detector Output', color: '#2dd4bf' },
      { label: 'Synchronous Detector Output', color: '#38bdf8' },
      { label: 'Square-Law Detector Output', color: '#fb7185' }
    ];

    const duration = 6 / state.fm;
    let envState = 0; // for envelope detector simulation

    // Pre-compute reference message
    const nPts = Math.min(W, 600);
    const tArr = [], mArr = [], envArr = [], syncArr = [], sqArr = [];

    for (let i = 0; i < nPts; i++) {
      const t = state.time + (i / nPts) * duration;
      tArr.push(t);
      mArr.push(msg(t));

      const s = amSignal(t) + gaussianNoise(0, state.noisePower * 0.1);

      // Envelope detector: simple peak hold with RC decay
      const absS = Math.abs(s);
      const rcNorm = 0.01 + state.rc * 0.2;
      if (absS > envState) {
        envState = absS;
      } else {
        envState *= (1 - rcNorm);
      }
      envArr.push(envState - 1); // remove DC

      // Synchronous detector: multiply by cos with phase error, LPF
      const phi = state.phaseError * Math.PI / 180;
      const syncRaw = s * Math.cos(2 * Math.PI * state.fc * t + phi);
      syncArr.push(syncRaw); // We'll smooth later

      // Square-law
      const sqRaw = s * s;
      sqArr.push(sqRaw);
    }

    // Simple moving average filter for sync and square-law
    const filterLen = Math.max(1, Math.floor(nPts / (duration * state.fc * 0.8)));
    const syncFilt = lowPassFilter(syncArr, filterLen);
    const sqFilt = lowPassFilter(sqArr, filterLen);

    // Normalize
    const syncDc = mean(syncFilt);
    const sqDc = mean(sqFilt);

    for (let p = 0; p < 4; p++) {
      const yOff = p * panelH;
      const mid = yOff + panelH / 2;
      const amp = panelH * 0.35;

      // Separator
      ctx.strokeStyle = '#1e2d4a';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, yOff); ctx.lineTo(W, yOff); ctx.stroke();

      // Zero line
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 0.3;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(panels[p].label, 8, yOff + 16);

      // Waveform
      ctx.strokeStyle = panels[p].color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let i = 0; i < nPts; i++) {
        const x = (i / nPts) * W;
        let v;
        if (p === 0) v = mArr[i];
        else if (p === 1) v = envArr[i] * 1.5;
        else if (p === 2) v = (syncFilt[i] - syncDc) * 3;
        else v = (sqFilt[i] - sqDc) * 2;

        const y = mid - amp * Math.max(-1.2, Math.min(1.2, v));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Also draw original message as dashed reference on panels 1-3
      if (p > 0) {
        ctx.strokeStyle = '#fbbf2440';
        ctx.lineWidth = 1;
        ctx.setLineDash([4,4]);
        ctx.beginPath();
        for (let i = 0; i < nPts; i++) {
          const x = (i / nPts) * W;
          const y = mid - amp * mArr[i] * 0.8;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // SNR estimates
    updateSNR(mArr, envArr, syncFilt, sqFilt, syncDc, sqDc);

    requestAnimationFrame(draw);
  }

  function lowPassFilter(arr, len) {
    const out = new Array(arr.length);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
      if (i >= len) sum -= arr[i - len];
      out[i] = sum / Math.min(i + 1, len);
    }
    return out;
  }

  function mean(arr) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
  }

  function updateSNR(mArr, envArr, syncArr, sqArr, syncDc, sqDc) {
    // Very simplified SNR estimation
    const setEl = function(id, v) {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };

    if (state.noisePower < 0.01) {
      setEl('am-snr-env', '∞ dB');
      setEl('am-snr-sync', '∞ dB');
      setEl('am-snr-sq', '∞ dB');
    } else {
      const baseSnr = 10 * Math.log10(1 / (state.noisePower * 0.01 + 0.001));
      setEl('am-snr-env', (baseSnr - 3).toFixed(1) + ' dB');
      const phaseAttenuation = Math.cos(state.phaseError * Math.PI / 180);
      setEl('am-snr-sync', (baseSnr + 20 * Math.log10(Math.max(phaseAttenuation, 0.01))).toFixed(1) + ' dB');
      setEl('am-snr-sq', (baseSnr - 6).toFixed(1) + ' dB');
    }
  }

  function bindControls() {
    const binds = [
      ['am-demod-rc', 'rc', 'am-demod-rc-val'],
      ['am-demod-phase', 'phaseError', 'am-demod-phase-val'],
      ['am-demod-noise', 'noisePower', 'am-demod-noise-val']
    ];
    binds.forEach(function(b) {
      const el = document.getElementById(b[0]);
      if (!el) return;
      el.addEventListener('input', debounce(function() {
        state[b[1]] = parseFloat(el.value);
        const valEl = document.getElementById(b[2]);
        if (valEl) valEl.textContent = el.value;
      }, 16));
    });

    // Also listen to sim1 sliders
    ['am-fc','am-fm','am-mu'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', debounce(function() {
        if (id === 'am-fc') state.fc = parseFloat(el.value);
        if (id === 'am-fm') state.fm = parseFloat(el.value);
        if (id === 'am-mu') state.mu = parseFloat(el.value);
      }, 16));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
