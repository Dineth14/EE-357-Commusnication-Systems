# Natural Sampling Implementation
import numpy as np
import matplotlib.pyplot as plt

# Parameters
B = 5       # Bandwidth of the signal (Hz)
fs = 20     # Sampling frequency (Hz)
d = 1/3     # Duty cycle
tau = d / fs # Pulse width

# Simulation Parameters (High resolution for continuous time approximation)
f_sim = 1000        
T_duration = 2.0    
t = np.linspace(-T_duration/2, T_duration/2, int(f_sim * T_duration), endpoint=False)

# 1. Analog Signal Generation (Baseband with Rectangular Spectrum)

x_t = 2 * B * np.sinc(2 * B * t)

# 2. Pulse Train Generation
# 2. Pulse Train Generation
# Rectangular pulses with width tau and period Ts = 1/fs
Ts = 1/fs
pulse_train = np.zeros_like(t)
for n in range(int(-T_duration/2 * fs) - 1, int(T_duration/2 * fs) + 2):
    center = n * Ts
    # Find indices within [center - tau/2, center + tau/2]
    # Use boolean mask for efficiency
    mask = np.abs(t - center) <= tau/2
    pulse_train[mask] = 1

# 3. Natural Sampling
x_s = x_t * pulse_train

# 4. Demodulation (Product Detection + LPF)
# We use n=0 for baseband recovery
n_demod = 0 
# For n=0, cos(0) = 1. The mixer effectively just passes x_s.
# If we want to simulate the mixer explicitly:
lo_signal = np.cos(2 * np.pi * n_demod * fs * t)
x_mixed = x_s * lo_signal

# Ideal Low Pass Filter (Frequency Domain)
# Cutoff frequency should be > B and < (fs - B)
# Here fs=20, B=5. fs-B = 15. So 5 < f_cutoff < 15. Let's pick 10 Hz.
f_cutoff = 10 

# Apply LPF in Frequency Domain
X_mixed_f = np.fft.fft(x_mixed)
freqs_full = np.fft.fftfreq(len(t), 1/f_sim)
# Create Ideal Filter Mask
H_f = np.zeros_like(freqs_full)
H_f[np.abs(freqs_full) <= f_cutoff] = 1

# Filter
X_demod_f = X_mixed_f * H_f
x_demod = np.fft.ifft(X_demod_f)
x_demod = np.real(x_demod)

# Scaling Correction: 
x_demod_scaled = x_demod / d

# 5. Frequency Domain Analysis (FFT)
N = len(t)
freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/f_sim))

# Compute FFT and scale for continuous spectrum approximation
X_f = np.fft.fftshift(np.fft.fft(x_t)) * (1/f_sim)
Xs_f = np.fft.fftshift(np.fft.fft(x_s)) * (1/f_sim)
Xd_f = np.fft.fftshift(np.fft.fft(x_demod_scaled)) * (1/f_sim)

# 6. Plotting
plt.figure(figsize=(14, 12))

# Time Domain
plt.subplot(4, 1, 1)
plt.plot(t, x_t, label='Original Signal $x(t)$', linewidth=2)
# plt.plot(t, x_s, label='Sampled Signal $x_s(t)$', alpha=0.5)
plt.title('Original Signal')
plt.ylabel('Amplitude')
plt.xlim(-0.5, 0.5)
plt.legend()
plt.grid(True)

plt.subplot(4, 1, 2)
plt.plot(t, pulse_train, 'r', label='Switching Signal $s(t)$', alpha=0.6)
plt.plot(t, x_s, 'k', label='Sampled Signal $x_s(t)$', alpha=0.8)
plt.title('Natural Sampling')
plt.ylabel('Amplitude')
plt.xlim(-0.5, 0.5)
plt.legend()
plt.grid(True)

plt.subplot(4, 1, 3)
plt.plot(t, x_t, 'g--', label='Original $x(t)$', alpha=0.5)
plt.plot(t, x_demod_scaled, 'b', label='Demodulated Output $y(t)$')
plt.title('Demodulated Signal (LPF Output)')
plt.ylabel('Amplitude')
plt.xlim(-0.5, 0.5)
plt.legend()
plt.grid(True)

# Frequency Domain
plt.subplot(4, 1, 4)
plt.plot(freqs, np.abs(X_f), label='Original $|X(f)|$')
plt.plot(freqs, np.abs(Xs_f), label='Sampled $|X_s(f)|$', alpha=0.6)
plt.plot(freqs, np.abs(Xd_f), 'k--', label='Demodulated $|Y(f)|$')
plt.title('Frequency Domain')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.xlim(-50, 50)
plt.legend()
plt.grid(True)

# Annotations for harmonics
for n in range(-2, 3):
    plt.axvline(n * fs, color='k', linestyle=':', alpha=0.2)
    if n != 0:
        plt.text(n * fs, 0.1, f'{n}$f_s$', ha='center')

plt.tight_layout()
plt.savefig('natural_sampling_plots.png')
try:
    plt.show()
except:
    pass


