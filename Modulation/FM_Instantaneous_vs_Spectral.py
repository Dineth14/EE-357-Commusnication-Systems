import numpy as np
import matplotlib.pyplot as plt

# Parameters
fc = 10000       # Carrier Frequency (10 kHz)
fm = 2000        # Message Frequency (2 kHz)
delta_f = 100    # Frequency Deviation (100 Hz)
beta = delta_f / fm # Modulation Index (0.05)
fs = 200000      # Sampling Frequency (200 kHz)
duration = 1.0   # 1 second duration for high spectral resolution
t = np.linspace(0, duration, int(fs*duration), endpoint=False)

# Generate FM Signal
# s(t) = cos(2*pi*fc*t + beta*sin(2*pi*fm*t))
phase = 2 * np.pi * fc * t + beta * np.sin(2 * np.pi * fm * t)
s_t = np.cos(phase)

# Instantaneous Frequency Calculation
# f_inst(t) = fc + delta_f * cos(2*pi*fm*t)
# We calculate it theoretically for the plot to be clean and exact
f_inst = fc + delta_f * np.cos(2 * np.pi * fm * t)

# Plotting Setup
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# --- Pane 1: Time Domain (Instantaneous Frequency) ---
cycles_to_plot = 3
t_plot_duration = cycles_to_plot / fm
samples_zoom = int(t_plot_duration * fs)

ax1.plot(t[:samples_zoom] * 1000, f_inst[:samples_zoom], 'b-', linewidth=2)
ax1.set_title('Instantaneous Frequency vs Time')
ax1.set_xlabel('Time (ms)')
ax1.set_ylabel('Frequency (Hz)')
ax1.grid(True)

# Highlight bounds
ax1.axhline(fc + delta_f, color='r', linestyle='--', alpha=0.5, label='Max Freq (10,100 Hz)')
ax1.axhline(fc - delta_f, color='r', linestyle='--', alpha=0.5, label='Min Freq (9,900 Hz)')
ax1.axhline(fc, color='k', linestyle=':', alpha=0.5, label='Carrier (10,000 Hz)')
ax1.legend(loc='upper right')

# Set Y-axis specifically to show constraints
ax1.set_ylim(fc - delta_f * 2, fc + delta_f * 2)

# Annotation for Pane 1
ax1.text(t[samples_zoom//2]*1000, fc - delta_f*1.5, 
         f"Strictly confined to\n{fc-delta_f} Hz - {fc+delta_f} Hz", 
         ha='center', va='center', bbox=dict(facecolor='white', alpha=0.8))


# --- Pane 2: Frequency Domain (Spectral Bandwidth) ---
# Compute FFT
N = len(s_t)
freqs = np.fft.rfftfreq(N, d=1/fs)
spectrum = np.abs(np.fft.rfft(s_t)) / N
spectrum_db = 20 * np.log10(spectrum + 1e-12) # Use dB for better visibility if needed, or linear for "footprint"
# User asked for "Spectral Footprint", linear magnitude is often clearer for "peaks" existence unless dynamic range is huge.
# Given beta=0.05, J0(0.05)~=1, J1(0.05)~=0.025. The sidebands are small (-32dB). 
# We should probably use dB or zoom in on Y, otherwise sidebands might be invisible on linear scale relative to carrier.
# Let's use Linear Amplitude but annotate clearly, or normalized.
# Actually, J1(0.05) is approx 0.025. 2.5% of Carrier. Visible if we look closely.
# Let's sticking to Linear but maybe normalized to Carrier Peak.

spectrum_norm = spectrum / np.max(spectrum)

ax2.plot(freqs, spectrum_norm, 'k')
ax2.set_xlim(0, 20000) # 0 to 20 kHz
ax2.set_title('Spectral Footprint (FFT)')
ax2.set_xlabel('Frequency (Hz)')
ax2.set_ylabel('Normalized Amplitude')
ax2.grid(True)

# Annotations
peaks_to_mark = [fc, fc-fm, fc+fm]
labels = ['$f_c$\n(10k)', '$f_c-f_m$\n(8k)', '$f_c+f_m$\n(12k)']

for f_val, lbl in zip(peaks_to_mark, labels):
    # Find closest index
    idx = np.argmin(np.abs(freqs - f_val))
    amp = spectrum_norm[idx]
    ax2.annotate(lbl, xy=(f_val, amp), xytext=(f_val, amp + 0.1),
                 arrowprops=dict(facecolor='red', shrink=0.05),
                 ha='center')

# Highlight the contradiction
ax2.text(10000, 0.5, "Spectral Width spans\n8 kHz - 12 kHz\n(Even though Inst Freq\nonly varies $\pm$100 Hz!)", 
         ha='center', bbox=dict(facecolor='yellow', alpha=0.2))

import os

# Save content
output_dir = os.path.join(os.path.dirname(__file__), '../Output_Plots')
output_file = os.path.join(output_dir, 'FM_Instantaneous_vs_Spectral.png')

# Ensure directory exists (optional, but good practice, though we know it exists)
# os.makedirs(output_dir, exist_ok=True) 

plt.suptitle(f'FM: Instantaneous Freq ($\Delta f=100$Hz) vs Spectral Bandwidth ($f_m=2$kHz)', fontsize=14)
plt.tight_layout()
plt.savefig(output_file)
print(f"Plot saved to {output_file}")
