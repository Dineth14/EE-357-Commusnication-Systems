# Lab 2: AM Synchronous Demodulation Simulation
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import butter, filtfilt

# Parameters
fm = 1000       
fc = 20000      
fs = 400000     
duration = 0.005 
t = np.linspace(0, duration, int(fs*duration), endpoint=False)

# 1. Generate Basic Signals (Part 1 of Procedure)
Am1 = 1.0       
Ac = 2.0        
m_t_basic = Am1 * np.cos(2 * np.pi * fm * t)
c_t = Ac * np.cos(2 * np.pi * fc * t)

# 2. Generate AM Signal (Part 2 of Procedure)

mu = 0.8
Am_mod = mu * Ac
m_t_mod = Am_mod * np.cos(2 * np.pi * fm * t)

# AM Signal
s_t = (Ac + m_t_mod) * np.cos(2 * np.pi * fc * t)

# 3. Synchronous Demodulation
local_carrier = np.cos(2 * np.pi * fc * t)
v_t = s_t * local_carrier

# Step B: Low Pass Filter (Specifics: 5kHz cutoff, 2nd order)
def butter_lowpass_filter(data, cutoff, fs, order=5):
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    y = filtfilt(b, a, data)
    return y

# Cutoff = 5 kHz, Order = 2
demodulated_raw = butter_lowpass_filter(v_t, 5000, fs, order=2)

# Remove DC Component (0.5 * Ac) to recover AC message
demodulated_ac = demodulated_raw - np.mean(demodulated_raw)

# Scale to match original amplitude (Factor of 0.5 introduced by mixing)
demodulated_scaled = demodulated_ac * 2

# Plotting
plt.figure(figsize=(12, 14))

# 1. Message Signal
plt.subplot(5, 1, 1)
plt.plot(t * 1000, m_t_basic)
plt.title(f'Message Signal $m(t)$')
plt.ylabel('Amplitude (V)')
plt.grid(True)

# 2. Carrier Signal
plt.subplot(5, 1, 2)
plt.plot(t * 1000, c_t)
plt.title(f'Carrier Signal $c(t)$')
plt.ylabel('Amplitude (V)')
plt.grid(True)

# 3. AM Signal
plt.subplot(5, 1, 3)
plt.plot(t * 1000, s_t)
plt.plot(t * 1000, Ac + m_t_mod, 'g', linewidth=1, label='Upper Envelope')
plt.title(f'AM Signal $s(t)$ ($\mu=0.8$)')
plt.ylabel('Amplitude (V)')
plt.legend(loc='upper right')
plt.grid(True)

# 4. Product Signal v(t)
plt.subplot(5, 1, 4)
plt.plot(t * 1000, v_t)
plt.title(f'Product Signal $v(t) = s(t) \cdot c_{{LO}}(t)$')
plt.ylabel('Amplitude (V)')
plt.grid(True)

# 5. Demodulated Signal comparison
plt.subplot(5, 1, 5)
plt.plot(t * 1000, m_t_mod, 'r--',label='Original Message (Scaled)', linewidth=2, alpha=0.5)
plt.plot(t * 1000, demodulated_scaled, label='Demodulated Output')
plt.title('Demodulation Result (2nd Order LPF, $f_c=5$kHz)')
plt.xlabel('Time (ms)')
plt.ylabel('Amplitude (V)')
plt.legend(loc='upper right')
plt.grid(True)

plt.tight_layout()
plt.savefig('Lab2_Output.png')
print("Plot saved to Lab2_Output.png")
