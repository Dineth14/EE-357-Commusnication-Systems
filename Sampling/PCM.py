# Pulse Code Modulation (PCM) Simulation
# Demonstrates Sampling, Quantization, and SNR Analysis

import numpy as np
import matplotlib.pyplot as plt

def uniform_pcm(x, n_bits, V_min=-1, V_max=1):
    """
    Applies uniform PCM quantization to a signal.
    """
    # 1. Levels
    L = 2**n_bits
    
    # 2. Step Size (Delta)
    delta = (V_max - V_min) / L
    
    # 3. Quantization
    # x_norm ranges roughly 0 to L
    x_norm = (x - V_min) / delta
    x_q_int = np.round(x_norm)
    
    # Clip to valid limits [0, L-1]
    # In mid-tread or mid-rise, getting exact boundary handling is key for SNR
    # This maps to integer indices
    x_q_int = np.clip(x_q_int, 0, L - 1)
    
    # Reconstruction
    x_q = x_q_int * delta + V_min
    
    return x_q, delta

# Parameters
fm = 5          # Message Frequency (Hz)
Am = 1.0        # Message Amplitude (V)
fs = 100        # Sampling Frequency (Hz) - 20x Oversampled for smooth visual of steps
duration = 0.5  # Seconds
t = np.linspace(0, duration, int(fs * duration), endpoint=False) # Discrete time samples

# 1. Analog / Discrete Signal Generation
# Ideally we'd have a high-res analog, but for PCM logic we just operate on samples
x_s = Am * np.cos(2 * np.pi * fm * t)

# 2. Quantization (3-bit for visual, 8-bit for SNR check)
n_bits_visual = 3
x_q3, delta3 = uniform_pcm(x_s, n_bits_visual, -1.2, 1.2) 
# Note: V_min/max slightly larger than signal to avoid clipping saturation at peaks

# 8-bit quantization for SNR
n_bits_snr = 8
x_q8, delta8 = uniform_pcm(x_s, n_bits_snr, -1.2, 1.2)

# 3. Error Analysis
error3 = x_q3 - x_s
error8 = x_q8 - x_s

def calculate_snr_db(signal, noise):
    power_s = np.mean(signal**2)
    power_n = np.mean(noise**2)
    if power_n == 0: return float('inf')
    return 10 * np.log10(power_s / power_n)

snr3_real = calculate_snr_db(x_s, error3)
snr8_real = calculate_snr_db(x_s, error8)

# Theoretical SNR = 1.76 + 6.02 * n
# (Strictly for full-scale sine wave in range)
# Our V_range (-1.2 to 1.2) is 2.4. Signal pk-pk is 2.
# Factor due to loading: 20*log10(2/2.4) = -1.58 dB loss
snr3_theo = 1.76 + 6.02 * n_bits_visual + 20*np.log10(2/2.4)
snr8_theo = 1.76 + 6.02 * n_bits_snr + 20*np.log10(2/2.4)

# 4. Binary Encoding (Demonstration for first few samples)
# Code samples as binary strings
def get_binary_codes(x_val, n_bits, V_min, V_max):
    L = 2**n_bits
    delta = (V_max - V_min) / L
    x_norm = (x_val - V_min) / delta
    idx = int(np.clip(np.round(x_norm), 0, L-1))
    return format(idx, f'0{n_bits}b')

sample_codes = [get_binary_codes(val, 3, -1.2, 1.2) for val in x_s[:5]]
print(f"Sample Binary Codes (3-bit): {sample_codes}")

# 5. Plotting
plt.figure(figsize=(12, 10))

# Time Domain (Visual 3-bit)
plt.subplot(3, 1, 1)
# Plot "Analog" (High res interpolation)
t_high = np.linspace(0, duration, 1000)
x_high = Am * np.cos(2 * np.pi * fm * t_high)
plt.plot(t_high, x_high, 'g--', label='Analog Signal', alpha=0.5)

# Plot Quantized (Staircase)
# We use step plot to show the 'Hold' nature of DAC or just the levels
plt.step(t, x_q3, 'b', where='mid', label=f'{n_bits_visual}-bit Quantized')
plt.plot(t, x_s, 'ro', label='Samples', markersize=4)
plt.title(f'PCM: Sampling & {n_bits_visual}-bit Quantization (SNR={snr3_real:.2f} dB)')
plt.legend()
plt.grid(True)
plt.ylabel('Amplitude(V)')

# Quantization Error
plt.subplot(3, 1, 2)
plt.plot(t, error3, 'r', label='Error $e(t)$')
plt.hlines([delta3/2, -delta3/2], 0, duration, colors='k', linestyles=':', label='$\pm \Delta/2$')
plt.title(f'Quantization Error ({n_bits_visual}-bit)')
plt.legend()
plt.grid(True)
plt.ylabel('Error(V)')

# SNR Comparison
plt.subplot(3, 1, 3)
bits = [3, 8]
snrs = [snr3_real, snr8_real]
theos = [snr3_theo, snr8_theo]
x_pos = np.arange(len(bits))
width = 0.35

plt.bar(x_pos - width/2, snrs, width, label='Realized SNR')
plt.bar(x_pos + width/2, theos, width, label='Theoretical SNR', alpha=0.7)
plt.xticks(x_pos, [f'{b}-bit' for b in bits])
plt.ylabel('SNR (dB)')
plt.title('SNR vs Bit Depth (6dB Rule Verification)')
for i, v in enumerate(snrs):
    plt.text(i - width/2, v + 1, f'{v:.1f}', ha='center')
for i, v in enumerate(theos):
    plt.text(i + width/2, v + 1, f'{v:.1f}', ha='center')

plt.legend()
plt.grid(True, axis='y')

plt.tight_layout()
plt.savefig('../Output_Plots/PCM_Output.png')
print("PCM Simulation plots saved to ../Output_Plots/PCM_Output.png")
try:
    plt.show()
except:
    pass
