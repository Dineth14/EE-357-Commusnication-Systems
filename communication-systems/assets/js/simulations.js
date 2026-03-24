/* ============================================================
   Communication Systems — Shared Simulation Utilities
   FFT, RK4, linspace, colormaps, Q-function
   ============================================================ */

/**
 * In-place Cooley-Tukey FFT.
 * @param {Float64Array} re - Real parts (length must be power of 2)
 * @param {Float64Array} im - Imaginary parts (same length)
 */
function fft(re, im) {
  const n = re.length;
  if (n <= 1) return;

  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      let tmp = re[i]; re[i] = re[j]; re[j] = tmp;
      tmp = im[i]; im[i] = im[j]; im[j] = tmp;
    }
    let k = n >> 1;
    while (k <= j) { j -= k; k >>= 1; }
    j += k;
  }

  // FFT butterfly
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = -2 * Math.PI / len;
    const wRe = Math.cos(angle);
    const wIm = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      for (let k = 0; k < halfLen; k++) {
        const evenIdx = i + k;
        const oddIdx = i + k + halfLen;
        const tRe = curRe * re[oddIdx] - curIm * im[oddIdx];
        const tIm = curRe * im[oddIdx] + curIm * re[oddIdx];
        re[oddIdx] = re[evenIdx] - tRe;
        im[oddIdx] = im[evenIdx] - tIm;
        re[evenIdx] += tRe;
        im[evenIdx] += tIm;
        const newCurRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = newCurRe;
      }
    }
  }
}

/**
 * Inverse FFT using the forward FFT.
 */
function ifft(re, im) {
  const n = re.length;
  // Conjugate
  for (let i = 0; i < n; i++) im[i] = -im[i];
  fft(re, im);
  for (let i = 0; i < n; i++) {
    re[i] /= n;
    im[i] = -im[i] / n;
  }
}

/**
 * Compute magnitude spectrum from real/imag arrays.
 */
function fftMagnitude(re, im) {
  const n = re.length;
  const mag = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }
  return mag;
}

/**
 * 4th-order Runge-Kutta integrator step.
 * @param {Float64Array} state - Current state vector
 * @param {Function} deriv - deriv(state, t) returns derivative array
 * @param {number} t - Current time
 * @param {number} dt - Time step
 * @returns {Float64Array} New state
 */
function rk4(state, deriv, t, dt) {
  const n = state.length;
  const k1 = deriv(state, t);
  const s2 = new Float64Array(n);
  for (let i = 0; i < n; i++) s2[i] = state[i] + 0.5 * dt * k1[i];
  const k2 = deriv(s2, t + 0.5 * dt);
  const s3 = new Float64Array(n);
  for (let i = 0; i < n; i++) s3[i] = state[i] + 0.5 * dt * k2[i];
  const k3 = deriv(s3, t + 0.5 * dt);
  const s4 = new Float64Array(n);
  for (let i = 0; i < n; i++) s4[i] = state[i] + dt * k3[i];
  const k4 = deriv(s4, t + dt);
  const result = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = state[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return result;
}

/**
 * Generate linearly spaced array.
 */
function linspace(start, stop, n) {
  const arr = new Float64Array(n);
  if (n === 1) { arr[0] = start; return arr; }
  const step = (stop - start) / (n - 1);
  for (let i = 0; i < n; i++) arr[i] = start + i * step;
  return arr;
}

/**
 * Viridis colormap — t in [0,1] → [r, g, b] each 0-255.
 */
function viridis(t) {
  t = Math.max(0, Math.min(1, t));
  const c = [
    [68,1,84],[72,35,116],[64,67,135],[52,94,141],
    [41,120,142],[32,144,140],[34,167,132],[53,189,118],
    [94,208,89],[149,222,47],[220,227,25],[253,231,37]
  ];
  const idx = t * (c.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, c.length - 1);
  const f = idx - lo;
  return [
    Math.round(c[lo][0] + f * (c[hi][0] - c[lo][0])),
    Math.round(c[lo][1] + f * (c[hi][1] - c[lo][1])),
    Math.round(c[lo][2] + f * (c[hi][2] - c[lo][2]))
  ];
}

/**
 * Cividis colormap (colour-blind safe) — t in [0,1] → [r, g, b] 0-255.
 */
function cividis(t) {
  t = Math.max(0, Math.min(1, t));
  const c = [
    [0,32,76],[0,67,105],[42,98,115],[91,124,120],
    [137,149,120],[182,175,112],[225,200,92],[253,231,37]
  ];
  const idx = t * (c.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, c.length - 1);
  const f = idx - lo;
  return [
    Math.round(c[lo][0] + f * (c[hi][0] - c[lo][0])),
    Math.round(c[lo][1] + f * (c[hi][1] - c[lo][1])),
    Math.round(c[lo][2] + f * (c[hi][2] - c[lo][2]))
  ];
}

/**
 * Q-function approximation: Q(x) = 0.5 * erfc(x / sqrt(2)).
 * Uses Horner polynomial approximation for erfc.
 */
function qFunc(x) {
  if (x < 0) return 1 - qFunc(-x);
  // Abramowitz and Stegun approximation 7.1.26
  const p = 0.3275911;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429;
  const t = 1 / (1 + p * x / Math.SQRT2);
  const t2 = t * t, t3 = t2 * t, t4 = t3 * t, t5 = t4 * t;
  const erfc = (a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) *
    Math.exp(-x * x / 2);
  return 0.5 * erfc;
}

/**
 * sinc(x) = sin(pi*x)/(pi*x), sinc(0) = 1
 */
function sinc(x) {
  if (Math.abs(x) < 1e-12) return 1;
  const px = Math.PI * x;
  return Math.sin(px) / px;
}

/**
 * Bessel function of the first kind J_n(x) via series.
 */
function besselJ(n, x) {
  n = Math.abs(n);
  let sum = 0;
  let term = 1;
  // term_0 = (x/2)^n / n!
  const halfX = x / 2;
  for (let k = 0; k < n; k++) term *= halfX / (k + 1);
  // Actually compute correctly
  term = Math.pow(halfX, n);
  let factorial = 1;
  for (let k = 1; k <= n; k++) factorial *= k;
  term /= factorial;
  sum = term;
  for (let m = 1; m <= 40; m++) {
    term *= -(halfX * halfX) / (m * (m + n));
    sum += term;
    if (Math.abs(term) < 1e-15 * Math.abs(sum)) break;
  }
  return sum;
}

/**
 * Draw grid lines on a canvas context.
 */
function drawGrid(ctx, w, h, color, stepX, stepY) {
  ctx.strokeStyle = color || '#1e2d4a';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x <= w; x += stepX) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y <= h; y += stepY) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
}

/**
 * Draw axes on a canvas context.
 */
function drawAxes(ctx, w, h, originX, originY, color) {
  ctx.strokeStyle = color || '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(w, originY);
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, h);
  ctx.stroke();
}

/**
 * Debounce utility — standard leading-edge debounce at ~16ms.
 */
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms || 16);
  };
}

/**
 * Generate Gaussian white noise sample.
 */
function gaussianNoise(mean, stddev) {
  mean = mean || 0;
  stddev = stddev || 1;
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stddev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Compute CSS color string from theme tokens.
 */
function getThemeColor(token) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

/**
 * Next power of 2 >= n.
 */
function nextPow2(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/**
 * Register common keyboard shortcuts for simulation panels.
 * @param {Object} sim - { toggle(), reset(), setSpeed(s) }
 */
function registerSimKeys(sim) {
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); sim.toggle(); }
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); sim.reset(); }
  });
}
