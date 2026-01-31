import numpy as np
import matplotlib.pyplot as plt

# Parameters
f1 = 500.0
f2 = 500.0 * np.sqrt(2)
fc = f2       # Carrier frequency is f2
Ac = 100.0    # Carrier Amplitude

fs = 200000.0 # Sampling rate
duration = 0.01 # 10ms
t = np.arange(0, duration, 1/fs)

# Frequencies in rad/s
w1 = 2 * np.pi * f1
w2 = 2 * np.pi * f2
wc = 2 * np.pi * fc

# Message Signal
# User specified: omega in message signal is equal for cos and sine terms (w1)
m_t = 0.2 * np.sin(w1 * t) + 0.5 * np.cos(w1 * t)

# AM Signal
# s(t) = (Ac + m(t)) cos(wc t)
s_t = (Ac + m_t) * np.cos(wc * t)

# Modulation Percentage
# m(t) = 0.2 sin(w1 t) + 0.5 cos(w1 t)
# This is a single sinusoid of form R cos(w1 t - phi)
# R = sqrt(0.2^2 + 0.5^2)
max_m = np.sqrt(0.2**2 + 0.5**2)
mu = (max_m / Ac) * 100

print(f"Modulation Percentage: {mu:.2f}%")

# Plotting

# 1. Waveform
plt.figure(figsize=(10, 6))
plt.plot(t, s_t, 'b', label='AM Signal $s(t)$')
# Plot Envelope
plt.plot(t, Ac + m_t, 'r--', linewidth=2, label='Upper Envelope $A_c + m(t)$')
plt.plot(t, -(Ac + m_t), 'r--', linewidth=2)
plt.title(f'AM Waveform (Modulation Index $\mu \\approx {mu:.2f}\%$)')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude (V)')
plt.legend(loc='upper right')
plt.grid(True)
plt.tight_layout()
plt.savefig('AM_Waveform.png')

# 2. Spectrum
# Need longer duration for better frequency resolution
T_spec = 1.0 
t_spec = np.arange(0, T_spec, 1/fs)
m_t_spec = 0.2 * np.sin(w1 * t_spec) + 0.5 * np.cos(w1 * t_spec)
s_t_spec = (Ac + m_t_spec) * np.cos(wc * t_spec)

N = len(s_t_spec)
yf = np.fft.fft(s_t_spec)
xf = np.fft.fftfreq(N, 1/fs)

# Shift for plotting
yf_shifted = np.fft.fftshift(yf)
xf_shifted = np.fft.fftshift(xf)
magnitude = np.abs(yf_shifted) / N

plt.figure(figsize=(12, 6))
# Only plot positive frequencies around carrier
mask = (xf_shifted >= fc - 2000) & (xf_shifted <= fc + 2000)
plt.plot(xf_shifted[mask], magnitude[mask], 'k')
plt.title('Spectrum of AM Signal (Zoomed around Carrier)')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude (V)')
plt.grid(True)

# Annotations
plt.axvline(x=fc, color='r', linestyle='--', alpha=0.3)
plt.text(fc, np.max(magnitude), f'$f_c={fc:.1f}$', ha='center', va='bottom')

# Sidebands (Only f1 exists now)
# Combined amplitude of m(t) is R = sqrt(0.2^2 + 0.5^2) = 0.5385
# Sideband amplitude = R/2 = 0.269
plt.annotate(f'$f_c+f_1$', xy=(fc+f1, 0.269), xytext=(fc+f1, 0.4), arrowprops=dict(arrowstyle='->'))
plt.annotate(f'$f_c-f_1$', xy=(fc-f1, 0.269), xytext=(fc-f1, 0.4), arrowprops=dict(arrowstyle='->'))

plt.tight_layout()
plt.savefig('AM_Spectrum.png')

print("Plots saved.")
