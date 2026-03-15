import numpy as np
import matplotlib.pyplot as plt
import os

# Parameters
fc = 1000000    # Carrier 1 MHz
fm = 5000       # Message 5 kHz
Ac = 40.0       # Carrier Amp
fs = 4000000    # Sampling 4 MHz (Nyquist > 2MHz)
duration = 0.002 # 2 ms (Enough for basic resolution)

t = np.linspace(0, duration, int(fs*duration), endpoint=False)

# Message m(t) = cos(wm t) + 4sin(wm t)
wm = 2 * np.pi * fm
wc = 2 * np.pi * fc
m_t = np.cos(wm * t) + 4 * np.sin(wm * t)

# Hilbert Transform m_hat(t) = sin(wm t) - 4cos(wm t)
# (Analytic Hilbert for exactness in simulation)
m_hat_t = np.sin(wm * t) - 4 * np.cos(wm * t)

# LSSB Signal Generation
# s(t) = (Ac/2) * [ m(t)cos(wc t) + m_hat(t)sin(wc t) ]
s_lssb = (Ac / 2) * (m_t * np.cos(wc * t) + m_hat_t * np.sin(wc * t))

# FFT
N = len(s_lssb)
freqs = np.fft.rfftfreq(N, d=1/fs)
spectrum = np.abs(np.fft.rfft(s_lssb)) / N * 2 # Scale for single-sided amplitude

# Plotting
plt.figure(figsize=(10, 6))

# Plot full spectrum centered around 1 MHz
plt.plot(freqs / 1000, spectrum, 'b')
plt.title('Magnitude Spectrum of LSSB Signal')
plt.xlabel('Frequency (kHz)')
plt.ylabel('Amplitude (V)')
plt.grid(True)

# Zoom in around carrier
plt.xlim(980, 1020) # Show 980 kHz to 1020 kHz
plt.axvline(1000, color='k', linestyle='--', alpha=0.3, label='Carrier (1 MHz)')

# Annotate Peak
peak_idx = np.argmax(spectrum)
peak_freq = freqs[peak_idx] / 1000
peak_amp = spectrum[peak_idx]
plt.annotate(f'LSSB Peak\n{peak_freq:.2f} kHz\n{peak_amp:.2f} V', 
             xy=(peak_freq, peak_amp), 
             xytext=(peak_freq-10, peak_amp),
             arrowprops=dict(facecolor='red', shrink=0.05))

plt.legend()

# Save
output_dir = os.path.join(os.path.dirname(__file__), '../Output_Plots')
# os.makedirs(output_dir, exist_ok=True) # Assumed to exist
output_file = 'LSSB_Output.png'
plt.savefig(output_file)
print(f"Plot saved to {output_file}")
