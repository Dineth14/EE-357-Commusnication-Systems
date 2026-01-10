# Flat Top Sampling Simulation
# Demonstrates "Sample and Hold" and the Aperture Effect

import numpy as np
import matplotlib.pyplot as plt

# Parameters
B = 5       # Bandwidth (Hz)
fs = 20     # Sampling Frequency (Hz)
d = 1/3     # Duty Cycle
tau = d / fs # Pulse Width (seconds)

# Simulation Parameters
f_sim = 1000       # Simulation sampling rate
T_duration = 2.0   # Duration
t = np.linspace(-T_duration/2, T_duration/2, int(f_sim * T_duration), endpoint=False)

# 1. Analog Signal (Baseband Rectangular Spectrum -> Sinc in time)
x_t = 2 * B * np.sinc(2 * B * t)

# 2. Flat Top Sampling
# Logic: Sample x(t) at n*Ts, hold for tau.
# x_flat(t) = sum( x(nTs) * rect((t - nTs)/tau) )

Ts = 1/fs
x_flat = np.zeros_like(t)

# Iterate through sample points
# Sample indices range based on time array
start_n = int(np.ceil(t[0] / Ts))
end_n = int(np.floor(t[-1] / Ts))

for n in range(start_n, end_n + 1):
    t_sample = n * Ts
    # Sample value
    # We need to interpolate x(t) at t_sample because t might not hit exactly simulation grid
    # Or just evaluate analytical function
    sample_val = 2 * B * np.sinc(2 * B * t_sample)
    
    # Pulse generation: rect((t - t_sample)/tau) centered at t_sample_center?
    # Flat top usually implies starting at sample instant or centered?
    # Usually "sample at nTs" -> pulse exists at [nTs - tau/2, nTs + tau/2] or [nTs, nTs+tau].
    # To align with Natural Sampling previous example, let's center it.
    
    mask = np.abs(t - t_sample) <= tau/2
    x_flat[mask] = sample_val

# 3. Demodulation (LPF)
# Aperture Effect Correction (Equalizer) is theoretically needed: H_eq(f) = 1/sinc(f*tau)
# But for simple LPF we just filter.
f_cutoff = 10
freqs_full = np.fft.fftfreq(len(t), 1/f_sim)
H_f = np.zeros_like(freqs_full)
H_f[np.abs(freqs_full) <= f_cutoff] = 1

X_flat_f = np.fft.fft(x_flat)
X_demod_f = X_flat_f * H_f
x_demod = np.fft.ifft(X_demod_f)
x_demod = np.real(x_demod)

# Scaling:
# Flat top pulses have energy dependent on tau.
# DC component approx: (1/Ts) * Integral(pulse) * x(t) ...
# Spectrum X_s(f) = f_s * sum( X(f - n fs) ) * H_pulse(f)
# H_pulse(0) = tau.
# So SCaling is f_s * tau = f_s * (d/f_s) = d.
# So we divide by d to normalize (same as natural sampling).
x_demod_scaled = x_demod / d

# 4. Frequency Domain Analysis
X_f = np.fft.fftshift(np.fft.fft(x_t)) * (1/f_sim)
X_flat_spectrum = np.fft.fftshift(np.fft.fft(x_flat)) * (1/f_sim)
X_demod_spectrum = np.fft.fftshift(np.fft.fft(x_demod_scaled)) * (1/f_sim)

freqs = np.fft.fftshift(freqs_full)

# 5. Plotting
plt.figure(figsize=(14, 12))

# Time Domain
plt.subplot(3, 1, 1)
plt.plot(t, x_t, label='Original $x(t)$', linewidth=1.5)
plt.plot(t, x_flat, 'r', label='Flat Top Sampled', linewidth=2, alpha=0.7)
plt.title(f'Flat Top Sampling ($B={B}$Hz, $f_s={fs}$Hz, $d={d:.2f}$)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(-0.5, 0.5)

# Demodulation
plt.subplot(3, 1, 2)
plt.plot(t, x_t, 'g--', label='Original', alpha=0.5)
plt.plot(t, x_demod_scaled, 'b', label='Demodulated')
plt.title('Demodulated Signal (LPF only)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(-0.5, 0.5)

# Frequency Domain - Aperture Effect
plt.subplot(3, 1, 3)
plt.plot(freqs, np.abs(X_f), label='Original Spectrum')
plt.plot(freqs, np.abs(X_flat_spectrum), 'r', label='Flat Top Spectrum')
# Overlay Sinc Envelope for Aperture Effect visualization
# Envelope H(f) = tau * sinc(f*tau) * fs ? 
# Peaks follow sinc(f*tau).
envelope = d * np.abs(np.sinc(freqs * tau)) # Normalized to match DC=d
plt.plot(freqs, envelope, 'k--', alpha=0.4, label='Aperture Envelope (sinc)')

plt.title('Frequency Domain & Aperture Effect')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.xlim(-50, 50)
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.savefig('../Output_Plots/Flat_Top_Sampling_Output.png')
print("Graph saved to Output_Plots/Flat_Top_Sampling_Output.png")
try:
    plt.show()
except:
    pass
