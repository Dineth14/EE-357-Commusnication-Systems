/* ============================================================
   AM Spectrum Analyzer — Chapter 1 Simulation 2
   FFT-based spectrum display using Chart.js
   ============================================================ */
(function() {
  const state = {
    fc: 8, fm: 1, mu: 0.7, harmonics: 1,
    showDb: false, twoSided: true
  };
  let chart = null;

  function init() {
    const canvasEl = document.getElementById('am-spectrum-chart');
    if (!canvasEl || typeof Chart === 'undefined') return;

    chart = new Chart(canvasEl, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          { label: 'Carrier', backgroundColor: '#2dd4bf', data: [], barPercentage: 0.6 },
          { label: 'USB', backgroundColor: '#fbbf24', data: [], barPercentage: 0.6 },
          { label: 'LSB', backgroundColor: '#fb7185', data: [], barPercentage: 0.6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { labels: { color: '#e2e8f0', font: { family: 'Inter', size: 11 } } },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(4);
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Frequency (normalized)', color: '#64748b', font: { family: 'Inter', size: 11 } },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: '#1e2d4a' }
          },
          y: {
            title: { display: true, text: 'Magnitude', color: '#64748b', font: { family: 'Inter', size: 11 } },
            ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: '#1e2d4a' }
          }
        }
      }
    });

    computeSpectrum();
    bindControls();
  }

  function computeSpectrum() {
    if (!chart) return;

    // Build analytical spectrum for AM with multi-tone
    const lines = []; // { freq, mag, type }

    // Carrier
    lines.push({ freq: state.fc, mag: 1, type: 'carrier' });
    if (state.twoSided) {
      lines.push({ freq: -state.fc, mag: 1, type: 'carrier' });
    }

    // Sideband components for each harmonic
    for (let h = 1; h <= state.harmonics; h++) {
      const a = state.mu / (2 * h); // amplitude of each harmonic sideband
      // USB
      lines.push({ freq: state.fc + h * state.fm, mag: a, type: 'usb' });
      // LSB
      lines.push({ freq: state.fc - h * state.fm, mag: a, type: 'lsb' });

      if (state.twoSided) {
        lines.push({ freq: -(state.fc + h * state.fm), mag: a, type: 'lsb' });
        lines.push({ freq: -(state.fc - h * state.fm), mag: a, type: 'usb' });
      }
    }

    // Sort by frequency
    lines.sort(function(a, b) { return a.freq - b.freq; });

    const labels = lines.map(function(l) { return l.freq.toFixed(1); });
    const carrierData = lines.map(function(l) { return l.type === 'carrier' ? (state.showDb ? 20 * Math.log10(Math.max(l.mag, 1e-10)) : l.mag) : 0; });
    const usbData = lines.map(function(l) { return l.type === 'usb' ? (state.showDb ? 20 * Math.log10(Math.max(l.mag, 1e-10)) : l.mag) : 0; });
    const lsbData = lines.map(function(l) { return l.type === 'lsb' ? (state.showDb ? 20 * Math.log10(Math.max(l.mag, 1e-10)) : l.mag) : 0; });

    chart.data.labels = labels;
    chart.data.datasets[0].data = carrierData;
    chart.data.datasets[1].data = usbData;
    chart.data.datasets[2].data = lsbData;
    chart.options.scales.y.title.text = state.showDb ? 'Magnitude (dB)' : 'Magnitude';
    chart.update('none');

    // BW label
    const bwEl = document.getElementById('am-bw-label');
    if (bwEl) bwEl.textContent = 'B_T = 2f_m = ' + (2 * state.fm * state.harmonics).toFixed(1);
  }

  function bindControls() {
    // Reuse sliders from Sim 1 if present, otherwise own
    ['am-fc','am-fm','am-mu','am-harmonics'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', debounce(function() {
        if (id === 'am-fc') state.fc = parseFloat(el.value);
        if (id === 'am-fm') state.fm = parseFloat(el.value);
        if (id === 'am-mu') state.mu = parseFloat(el.value);
        if (id === 'am-harmonics') state.harmonics = parseInt(el.value);
        computeSpectrum();
      }, 16));
    });

    const dbBtn = document.getElementById('am-spec-db-btn');
    if (dbBtn) dbBtn.addEventListener('click', function() {
      state.showDb = !state.showDb;
      dbBtn.classList.toggle('active', state.showDb);
      computeSpectrum();
    });

    const sideBtn = document.getElementById('am-spec-sided-btn');
    if (sideBtn) sideBtn.addEventListener('click', function() {
      state.twoSided = !state.twoSided;
      sideBtn.textContent = state.twoSided ? 'Two-sided' : 'One-sided';
      computeSpectrum();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
