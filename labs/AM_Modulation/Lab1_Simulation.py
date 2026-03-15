# Lab 1 Simulation: Fourier Coefficients and AM Spectra

import numpy as np
import matplotlib.pyplot as plt

# Parameters
fc = 1000       # Carrier Frequency
fm = 50         # Modulation Frequency
Ac = 1.0        # Carrier Amplitude
Am = 0.5        # Message Amplitude
T = 1/fm        # Period of pulse trains
tau = T/4       # Pulse width
f_sim = 10000   # Simulation Frequency
duration = 1.0  # Duration
t = np.linspace(0, duration, int(f_sim * duration), endpoint=False)

def get_spectrum(sig):
    N = len(sig)
    spec = np.fft.fftshift(np.fft.fft(sig)) / N
    freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/f_sim))
    return freqs, np.abs(spec)

# Q1 Signals
# (a) Cosine
x1 = Am * np.cos(2 * np.pi * fm * t)

# (b) Rectangular Pulse Train
# Generated using modulo time
x2 = np.zeros_like(t)
t_mod = np.mod(t + T/2, T) - T/2 # Center at 0 in period [-T/2, T/2]
x2[np.abs(t_mod) <= tau/2] = Am

# (c) Triangular Pulse Train
x3 = np.zeros_like(t)
# Triangle: 1 - |t|/(tau/2) for |t| < tau/2
# Base is tau. Peak is Am.
mask = np.abs(t_mod) <= tau/2
x3[mask] = Am * (1 - np.abs(t_mod[mask]) / (tau/2))

# Q2 AM Signals
# y(t) = Ac * (1 + x(t)) * cos(wc t)
# To avoid overmodulation with Am=0.5, usually we normalize x(t).
# Here we just use the formula directly.
y1 = Ac * (1 + x1/Am) * np.cos(2 * np.pi * fc * t) # Normalize x1 to 1 for standard AM index
# Wait, problem says y = Ac * (1 + x(t)) * cos...
# If x(t) has amplitude Am, then modulation index is Am.
# Let's stick to strict formula.
y1 = Ac * (1 + x1) * np.cos(2 * np.pi * fc * t)
y2 = Ac * (1 + x2) * np.cos(2 * np.pi * fc * t)
y3 = Ac * (1 + x3) * np.cos(2 * np.pi * fc * t)

# Compute Spectra
f, X1 = get_spectrum(x1)
_, X2 = get_spectrum(x2)
_, X3 = get_spectrum(x3)

_, Y1 = get_spectrum(y1)
_, Y2 = get_spectrum(y2)
_, Y3 = get_spectrum(y3)

# Plotting Q1
plt.figure(figsize=(12, 10))

plt.subplot(3, 2, 1)
plt.plot(t, x1)
plt.xlim(0, 0.1)
plt.title('x1(t): Cosine')

plt.subplot(3, 2, 2)
plt.plot(f, X1)
plt.xlim(-500, 500)
plt.title('X1(f): Spectrum')
plt.grid()

plt.subplot(3, 2, 3)
plt.plot(t, x2)
plt.xlim(0, 0.1)
plt.title('x2(t): Rect Train')

plt.subplot(3, 2, 4)
plt.plot(f, X2)
plt.xlim(-500, 500)
plt.title('X2(f): Spectrum (Sinc)')
plt.grid()

plt.subplot(3, 2, 5)
plt.plot(t, x3)
plt.xlim(0, 0.1)
plt.title('x3(t): Tri Train')

plt.subplot(3, 2, 6)
plt.plot(f, X3)
plt.xlim(-500, 500)
plt.title('X3(f): Spectrum (Sinc^2)')
plt.grid()

plt.tight_layout()
plt.savefig('Lab1_Q1_Spectra.png')

# Plotting Q2 (AM)
plt.figure(figsize=(12, 10))

plt.subplot(3, 1, 1)
plt.plot(f, Y1)
plt.xlim(fc - 500, fc + 500)
plt.title('Y1(f): AM Spectrum (Tone)')
plt.grid()

plt.subplot(3, 1, 2)
plt.plot(f, Y2)
plt.xlim(fc - 500, fc + 500)
plt.title('Y2(f): AM Spectrum (Rect)')
plt.grid()

plt.subplot(3, 1, 3)
plt.plot(f, Y3)
plt.xlim(fc - 500, fc + 500)
plt.title('Y3(f): AM Spectrum (Tri)')
plt.grid()

plt.tight_layout()
plt.savefig('Lab1_Q2_AM_Spectra.png')
print("Plots saved to labs/Lab1_Q1_Spectra.png and labs/Lab1_Q2_AM_Spectra.png")
