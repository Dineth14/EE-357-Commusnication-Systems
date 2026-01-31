import numpy as np
import matplotlib.pyplot as plt

# Parameters
f1 = 500.0
f2 = 500.0 * np.sqrt(2)
fc = 20000.0  # Carrier frequency (chosen for visualization, not given)
Ac = 100.0    # Carrier Amplitude

fs = 200000.0 # Sampling rate (high enough for carrier)
duration = 0.0002 # Short duration to see waveform details (20ms = 10 cycles of f1)
t = np.arange(0, duration, 1/fs)

# Frequencies in rad/s
w1 = 2 * np.pi * f1
w2 = 2 * np.pi * f2
wc = 2 * np.pi * fc

# Message Signal
# Note: Assuming second term is w2 based on provided f2
m_t = 0.2 * np.sin(w1 * t) + 0.5 * np.cos(w2 * t)

# AM Signal
# s(t) = (Ac + m(t)) cos(wc t)
s_t = (Ac + m_t) * np.cos(wc * t)

# Modulation Percentage
# mu = (max(|m(t)|) / Ac) * 100
# The theoretical max of m(t) is sum of amplitudes since frequencies are irrational
max_m = 0.2 + 0.5
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
m_t_spec = 0.2 * np.sin(w1 * t_spec) + 0.5 * np.cos(w2 * t_spec)
s_t_spec = (Ac + m_t_spec) * np.cos(wc * t_spec)

N = len(s_t_spec)
yf = np.fft.fft(s_t_spec)
xf = np.fft.fftfreq(N, 1/fs)

# Shift for plotting
yf_shifted = np.fft.fftshift(yf)
xf_shifted = np.fft.fftshift(xf)
magnitude = np.abs(yf_shifted) / N

# Theory says sidebands magnitude is related to m(t) coeffs / 2
# Ac term -> Ac/2 at +/- fc (since we look at one side or normalized)
# Actually FFT outputs A/2 for sinusoids A cos(wt) in two-sided spectrum

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
plt.text(fc, np.max(magnitude), f'$f_c$ ({Ac/2})', ha='center', va='bottom')

# Sidebands
# f1
plt.annotate(f'$f_c+f_1$', xy=(fc+f1, 0.2/4), xytext=(fc+f1, 5), arrowprops=dict(arrowstyle='->'))
plt.annotate(f'$f_c-f_1$', xy=(fc-f1, 0.2/4), xytext=(fc-f1, 5), arrowprops=dict(arrowstyle='->'))

# f2
plt.annotate(f'$f_c+f_2$', xy=(fc+f2, 0.5/4), xytext=(fc+f2, 10), arrowprops=dict(arrowstyle='->'))
plt.annotate(f'$f_c-f_2$', xy=(fc-f2, 0.5/4), xytext=(fc-f2, 10), arrowprops=dict(arrowstyle='->'))

plt.tight_layout()
plt.savefig('AM_Spectrum.png')

print("Plots saved.")
