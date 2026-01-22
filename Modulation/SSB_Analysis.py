# SSB Analysis: The Horn Effect and Weaver's Modulator
# 1. Visualize "Horns" (Hilbert of Square Wave)
# 2. Simulate Weaver's Method for sideband cancellation

import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert, butter, filtfilt

# Parameters
fs = 10000
duration = 0.5
t = np.linspace(0, duration, int(fs*duration), endpoint=False)

def get_spectrum(sig):
    N = len(sig)
    spec = np.fft.fftshift(np.fft.fft(sig)) / N
    freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
    return freqs, np.abs(spec)

# ==========================================================
# PART 1: THE HORN PROBLEM
# ==========================================================
# Generate Square Wave
f_sq = 10
m_sq = np.sign(np.sin(2 * np.pi * f_sq * t))

# Hilbert Transform (Ideal)
m_hat_sq = np.imag(hilbert(m_sq))

# Filtered Square Wave
# Apply LPF to smooth edges
b, a = butter(2, 5 * f_sq / (fs/2), btype='low')
m_filt = filtfilt(b, a, m_sq)
m_hat_filt = np.imag(hilbert(m_filt))

# Plot Horns
plt.figure(figsize=(12, 8))

plt.subplot(2, 2, 1)
plt.plot(t, m_sq, 'b')
plt.title('Original Square Wave $m(t)$')
plt.xlim(0, 0.2)
plt.grid(True)

plt.subplot(2, 2, 2)
plt.plot(t, m_hat_sq, 'r')
plt.title('Hilbert Transform $\\hat{m}(t)$ ("Horns")')
plt.xlim(0, 0.2)
plt.ylim(-5, 5) # Peaks go to infinity, clip for view
plt.grid(True)

plt.subplot(2, 2, 3)
plt.plot(t, m_filt, 'b')
plt.title('Pre-Filtered Signal (LPF)')
plt.xlim(0, 0.2)
plt.grid(True)

plt.subplot(2, 2, 4)
plt.plot(t, m_hat_filt, 'r')
plt.title('Hilbert Transform of Filtered Signal')
plt.xlim(0, 0.2)
plt.ylim(-5, 5)
plt.grid(True)

plt.tight_layout()
plt.savefig('../Output_Plots/SSB_Analysis_Horns.png')

# ==========================================================
# PART 2: WEAVER'S METHOD
# ==========================================================
# Input: Tone
fm = 100
m_t = np.cos(2 * np.pi * fm * t)

# Parameters
f_sub = 1500 # Sub-carrier (Audio Center)
f_final = 5000 # Final Carrier

# Path I: Cosine Mixing
v1_i = m_t * np.cos(2 * np.pi * f_sub * t)
# Path Q: Sine Mixing
v1_q = m_t * np.sin(2 * np.pi * f_sub * t)

# LPF Stage (Select Lower side of mix?)
# Weaver LPF cutoff usually at W/2 (bandwidth/2)
# Here our "Bandwidth" is just the tone.
# Sub-carrier mixing shifts tone to f_sub +/- fm.
# We want to keep difference?
# Weaver Logic:
# Step 1 shifts spectrum so audio band is centered at DC.
# Audio 300-3000. Center 1650.
# Mix with 1650.
# 300 -> 1350 and -1350.
# 3000 -> 1350 and -1350? No.
# Let's simple tone. Mix with f_sub.
# Result: f_sub+fm, f_sub-fm.
# LPF removes f_sub+fm? No, Weaver folds.
# Standard Weaver:
# Mix with center freq W/2.
# LPF with cutoff W/2.
# Mix with final carrier f_c + W/2 +/- ...

# Simplification for Simulation:
# Just demonstrate cancellation via quadrature mixing
# Path 1: m(t) cos(w_sub t) -> LPF -> cos(w_c t)
# Path 2: m(t) sin(w_sub t) -> LPF -> sin(w_c t)
# This effectively implements the phase shift method math but using mixing.

cutoff = 200 # LPF cutoff
b, a = butter(4, cutoff / (fs/2), btype='low')

v2_i = filtfilt(b, a, v1_i) # Filtered I
v2_q = filtfilt(b, a, v1_q) # Filtered Q

# Second Mixing (Upconversion)
y_weaver = v2_i * np.cos(2 * np.pi * f_final * t) + v2_q * np.sin(2 * np.pi * f_final * t)
# Depending on sign (+/-) we get USB or LSB relative to f_final (+/- f_sub?)

# Spectrum
freqs, spec_weaver = get_spectrum(y_weaver)

plt.figure(figsize=(10, 6))
plt.plot(freqs, spec_weaver)
plt.title(f"Weaver's Method Output Spectrum (Carrier={f_final}Hz)")
plt.xlabel('Frequency (Hz)')
plt.xlim(f_final - 2000, f_final + 2000)
plt.grid(True)
plt.savefig('../Output_Plots/SSB_Analysis_Weaver.png')

print("Plots saved.")
