# Lab 1 Solutions: Amplitude Modulation and Demodulation

## 1. Fourier Coefficients and Spectra

### (a) Sinusoidal Signal
$$ x_1(t) = A_m \cos(2\pi f_m t) $$
Using Euler's identity:
$$ A_m \cos(2\pi f_m t) = \frac{A_m}{2} e^{j 2\pi f_m t} + \frac{A_m}{2} e^{-j 2\pi f_m t} $$
Comparing to the Fourier Series definition $x(t) = \sum c_n e^{j 2\pi n f_0 t}$ (where $f_0 = f_m$):
- **Coefficients**:
  - $c_1 = \frac{A_m}{2}$
  - $c_{-1} = \frac{A_m}{2}$
  - $c_n = 0$ for all other $n$.
- **Spectrum**: Two Dirac impulses at $\pm f_m$.

### (b) Rectangular Pulse Train
- **Signal**: Period $T$, Pulse Width $\tau$, Amplitude $A$. Centered at $t=0$.
- **Formula**:
  $$ c_n = \frac{1}{T} \int_{-T/2}^{T/2} x_2(t) e^{-j 2\pi n t / T} dt $$
  $$ c_n = \frac{1}{T} \int_{-\tau/2}^{\tau/2} A e^{-j 2\pi n t / T} dt $$
  Using $\int e^{at} dt = \frac{1}{a} e^{at}$:
  $$ c_n = \frac{A}{T} \left[ \frac{e^{-j 2\pi n t / T}}{-j 2\pi n / T} \right]_{-\tau/2}^{\tau/2} $$
  $$ c_n = \frac{A}{T} \frac{1}{\pi n / T} \frac{e^{j \pi n \tau / T} - e^{-j \pi n \tau / T}}{2j} $$
  $$ c_n = \frac{A \tau}{T} \frac{\sin(\pi n \tau / T)}{\pi n \tau / T} $$
- **Result**:
  $$ c_n = \frac{A \tau}{T} \text{sinc}\left( \frac{n \tau}{T} \right) $$
  where $\text{sinc}(x) = \frac{\sin(\pi x)}{\pi x}$.

### (c) Triangular Pulse Train
- **Signal**: Period $T$, Base Width $\tau$, Peak Amplitude $A$.
- **Derivation**: Can be seen as the convolution of two rectangular pulses of width $\tau/2$ (appropriately scaled), or derived via integration by parts.
- **Area**: Area of triangle = $\frac{1}{2} \text{base} \times \text{height} = \frac{A \tau}{2}$.
- **DC Component ($c_0$)**: Average value = $\frac{A \tau}{2T}$.
- **Coefficients**:
  $$ c_n = \frac{A \tau}{2T} \text{sinc}^2 \left( \frac{n \tau}{2T} \right) $$
- **Spectrum**: Discrete harmonics weighted by a squared sinc function (decays faster than rectangular pulse).

---

## 2. AM Modulation Spectrum

**Given**:
- Modulated Signal: $y(t) = A_c [1 + x(t)] \cos(2\pi f_c t)$
- Note: This is Standard AM with modulation index $\mu = 1$ if normalized.

**Derivation**:
$$ y(t) = A_c \cos(2\pi f_c t) + A_c x(t) \cos(2\pi f_c t) $$
Taking the Fourier Transform, using the frequency shifting property ($\mathcal{F}[x(t)\cos(2\pi f_c t)] = \frac{1}{2}[X(f-f_c) + X(f+f_c)]$):
$$ Y(f) = \frac{A_c}{2}[\delta(f-f_c) + \delta(f+f_c)] + \frac{A_c}{2} [ X(f-f_c) + X(f+f_c) ] $$

The spectrum consists of:
1.  **Carrier components** at $\pm f_c$.
2.  **Shifted sidebands** of $X(f)$ centered at $\pm f_c$, scaled by $A_c/2$.

### (a) For $x_1(t)$ (Tone)
- $X_1(f)$ has peaks at $\pm f_m$.
- $Y_1(f)$ will have:
  - Carrier at $\pm f_c$.
  - Upper Sidebands at $\pm (f_c + f_m)$.
  - Lower Sidebands at $\pm (f_c - f_m)$.

### (b) For $x_2(t)$ (Rect Train)
- $X_2(f)$ has discrete harmonics at $n/T$.
- $Y_2(f)$ will have groups of harmonics centered around $f_c$ and $-f_c$.
- Each harmonic line at $f_c + n/T$ follows the $\text{sinc}$ envelope derived in Q1(b).

### (c) For $x_3(t)$ (Tri Train)
- $Y_3(f)$ will have groups of harmonics centered around $f_c$ and $-f_c$.
- Each harmonic line at $f_c + n/T$ follows the $\text{sinc}^2$ envelope derived in Q1(c).
