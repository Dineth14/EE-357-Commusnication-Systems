# Pulse Width Modulation (PWM) Simulation
# Using Trailing-Edge Definition

import numpy as np
import matplotlib.pyplot as plt
import scipy.signal as signal

# Parameters
fs = 200        # Sampling Frequency of message (Hz) - determines pulse rate
fm = 10         # Message Frequency (Hz)
A = 1           # Amplitude of PWM pulse
f_sim = 10000   # Simulation Frequency (high res for sharp edges)
duration = 0.5  # Seconds
t = np.linspace(0, duration, int(f_sim * duration), endpoint=False)

# Message Signal
m_t = np.sin(2 * np.pi * fm * t)
# Normalized message for easy width calculation (-1 to 1)

# PWM Construction
# Formula: Sum of A * Rect( (t - center_n) / tau_n )
# Trailing Edge: center_n = n*Ts + tau_n/2
# Implies Pulse starts at n*Ts and ends at n*Ts + tau_n

Ts = 1/fs
kp_w = 0.8 * Ts / 2 # Sensitivity. Max shift should ensure tau_n < Ts.
# tau_n = tau_0 + kp * m(nTs).
# Let basic width tau_0 be Ts/2 (50% duty cycle at 0)
tau_0 = Ts/2

pwm_signal = np.zeros_like(t)

# Loop over pulse indices
num_pulses = int(duration / Ts)
for n in range(num_pulses):
    # Sample message at start of period n*Ts
    t_sample = n * Ts
    if t_sample >= duration: break
    
    # We need sample index in high res grid
    idx = int(t_sample * f_sim) 
    sample_val = m_t[idx] if idx < len(m_t) else 0
    
    # Calculate Pulse Width
    tau_n = tau_0 + kp_w * sample_val
    
    # Ensure physical limits (0 < tau_n < Ts)
    tau_n = np.clip(tau_n, 0, Ts)
    
    # Trailing Edge Logic: Pulse is ON from [n*Ts] to [n*Ts + tau_n]
    # In 'center' terms: center = t_sample + tau_n/2. Width = tau_n.
    
    # Generate Pulse in Time Array
    # Start Index
    start_idx = idx
    # End Index
    end_idx = start_idx + int(tau_n * f_sim)
    
    if start_idx < len(t):
        pwm_signal[start_idx : min(end_idx, len(t))] = A

# Demodulation
# Simple LPF recovers the baseband from PWM
# Design Butterworth Low Pass Filter
cutoff = 4 * fm # Cutoff slightly above message frequency
b, a = signal.butter(4, cutoff / (f_sim / 2), btype='low')
demod_signal = signal.filtfilt(b, a, pwm_signal)

# Remove Delay/Phase shift for visual comparison (filtfilt does zero phase, but Amplitude is scaled)
# PWM DC component is A * (tau_0/Ts). AC component is proportional to kp_w.
# We normalize to match m(t) for plotting
# The DC offset of demod is A * 0.5 (since tau_0 = Ts/2).
demod_ac = demod_signal - np.mean(demod_signal)
# Empiric scaling for visualization
scale_factor = np.max(np.abs(m_t)) / (np.max(np.abs(demod_ac)) + 1e-6)
demod_final = demod_ac * scale_factor

# Plotting
plt.figure(figsize=(14, 10))

# Message
plt.subplot(3, 1, 1)
plt.plot(t, m_t, 'g', label='Message Signal $m(t)$')
plt.title('Message Signal')
plt.grid(True)
plt.ylabel('Amplitude')

# PWM
plt.subplot(3, 1, 2)
plt.plot(t, pwm_signal, 'b', label='PWM Signal (Trailing Edge)')
plt.step(t, pwm_signal, where='post', color='b', linewidth=1) # Step plot looks cleaner for pulses
plt.title('Pulse Width Modulation (Trailing Edge)')
plt.ylabel('Amplitude')
plt.grid(True)
# Zoom in
plt.xlim(0, 5/fm) # Show 5 cycles

# Demod
plt.subplot(3, 1, 3)
plt.plot(t, m_t, 'g--', label='Original', alpha=0.5)
plt.plot(t, demod_final, 'r', label='Demodulated (LPF)')
plt.title('Demodulation (Low Pass Filter)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(0, 5/fm)

plt.tight_layout()
plt.savefig('../Output_Plots/PWM_Output.png')
print("Saved to ../Output_Plots/PWM_Output.png")
try:
    plt.show()
except:
    pass
