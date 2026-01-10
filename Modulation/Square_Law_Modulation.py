import numpy as np
import matplotlib.pyplot as plt

# Parameters
fs = 2000  # Sampling frequency (Hz) - high enough to resolve 2*fc
T = 1.0    # Duration (seconds)
t = np.linspace(0, T, int(fs * T), endpoint=False)

# Frequencies
fc = 200   # Carrier frequency (Hz)
fm = 10    # Message frequency (Hz)

# Constants
Ac = 1.0   # Carrier amplitude
Am = 0.5   # Message amplitude
a1 = 1.0   # Linear coefficient
a2 = 0.5   # Non-linear coefficient (controls modulation index effectively)

# Signals
# Message signal x(t)
x_t = Am * np.cos(2 * np.pi * fm * t) 
# Note: Using cos for message to match a typical single-tone test. 
# The image assumes x(t) is arbitrary band-limited, but we verify with a tone.

# Carrier signal c(t)
c_t = Ac * np.cos(2 * np.pi * fc * t)

# Input signal to the non-linear device
v_in = x_t + c_t

# Non-Linear Device Output: v_out = a1*v_in + a2*v_in^2
v_out = a1 * v_in + a2 * (v_in**2)

# --- Frequency Domain Analysis ---
# Compute FFT
freqs = np.fft.fftfreq(len(t), 1/fs)
# fftshift to center 0 Hz
freqs_shifted = np.fft.fftshift(freqs)
spectrum = np.fft.fftshift(np.fft.fft(v_out))
spectrum_mag = np.abs(spectrum) / len(t) # Normalize magnitude

# --- Plotting ---
plt.figure(figsize=(14, 10))

# 1. Time Domain: Input Signals
plt.subplot(3, 1, 1)
plt.plot(t, x_t, label='$x(t)$ (Message)')
plt.plot(t, c_t, alpha=0.5, label='$c(t)$ (Carrier)')
plt.title('Input Signals: Message and Carrier')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend(loc='upper right')
plt.xlim(0, 0.2) # Zoom in to see waveforms
plt.grid(True)

# 2. Time Domain: Output of Square Law Modulator
plt.subplot(3, 1, 2)
plt.plot(t, v_out, color='green', label='$v_{out}(t)$')
plt.title(f'Square Law Output: $v_{{out}} = {a1}v_{{in}} + {a2}v_{{in}}^2$')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend(loc='upper right')
plt.xlim(0, 0.2)
plt.grid(True)

# 3. Frequency Domain: Spectrum of Output
plt.subplot(3, 1, 3)
plt.plot(freqs_shifted, spectrum_mag, color='red')
plt.title('Spectrum of Output Signal $V_{out}(f)$')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.xlim(0, 2.5 * fc) # Show up to slight past 2*fc
plt.grid(True)

# Annotate peaks based on the derivation
# DC term
plt.annotate('DC & Baseband', xy=(0, np.max(spectrum_mag)*0.1), xytext=(20, np.max(spectrum_mag)*0.3),
             arrowprops=dict(facecolor='black', shrink=0.05))

# Fc components (AM Signal)
plt.annotate('AM Signal (around $f_c$)', xy=(fc, np.max(spectrum_mag[np.abs(freqs_shifted - fc) < 10])), 
             xytext=(fc + 50, np.max(spectrum_mag)*0.8),
             arrowprops=dict(facecolor='blue', shrink=0.05))

# 2*Fc components
plt.annotate('2$f_c$ term', xy=(2*fc, np.max(spectrum_mag[np.abs(freqs_shifted - 2*fc) < 10])), 
             xytext=(2*fc - 80, np.max(spectrum_mag)*0.6),
             arrowprops=dict(facecolor='purple', shrink=0.05))

plt.tight_layout()
plt.savefig('Square_Law_Modulation_Output.png')
plt.show()

print("Simulation complete. Output image saved to Square_Law_Modulation_Output.png")
