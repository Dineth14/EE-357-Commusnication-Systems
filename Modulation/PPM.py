# Pulse Position Modulation (PPM) Simulation
# Using Shifted Center Definition

import numpy as np
import matplotlib.pyplot as plt
import scipy.signal as signal

# Parameters
fs = 200        # Sampling Frequency (Hz)
fm = 10         # Message Frequency
A = 1           # Amplitude
f_sim = 10000   # Simulation Frequency
duration = 0.5 
t = np.linspace(0, duration, int(f_sim * duration), endpoint=False)

# Message
m_t = np.sin(2 * np.pi * fm * t)

# PPM Construction
# Formula: Sum of A * Rect( (t - center_n) / tau )
# center_n = n*Ts + kp * m(nTs)
# tau is fixed.

Ts = 1/fs
tau = Ts / 5        # Fixed pulse width (20% of slot)
kp_p = 0.4 * Ts     # Max shift sensitivity (40% of slot)
# Constraint check: |Shift| + tau/2 < Ts/2
# 0.4*Ts + 0.1*Ts = 0.5*Ts. Valid limit.

ppm_signal = np.zeros_like(t)
clock_ticks = np.zeros_like(t) # For visualization

num_pulses = int(duration / Ts)
for n in range(num_pulses):
    t_clock = n * Ts
    if t_clock >= duration: break
    
    idx_clock = int(t_clock * f_sim)
    if idx_clock < len(t):
        clock_ticks[idx_clock] = 1 # Marker
    
    # Sample Message
    sample_val = m_t[idx_clock] if idx_clock < len(m_t) else 0
    
    # Calculate Center Position
    t_center = t_clock + kp_p * sample_val
    
    # Generate Pulse
    # Pulse exists in [t_center - tau/2, t_center + tau/2]
    t_start = t_center - tau/2
    t_end = t_center + tau/2
    
    idx_start = int(t_start * f_sim)
    idx_end = int(t_end * f_sim)
    
    if idx_start < len(t) and idx_end > 0:
        ppm_signal[max(0, idx_start) : min(len(t), idx_end)] = A

# Demodulation
# Strategy: PPM -> PWM -> LPF
# Convert PPM to PWM:
# Set High at Clock Tick (n*Ts)
# Reset Low at PPM Pulse Leading Edge

pwm_conv = np.zeros_like(t)
current_state = 0

# Edge Detection Loop
# efficient iteration
clock_period_samples = int(f_sim * Ts)

for i in range(1, len(t)):
    # 1. Synchronization (Clock Tick)
    # Using modulo logic or pre-calculated clock ticks
    if (i % clock_period_samples) == 0:
        current_state = 1
        
    # 2. Reset on PPM Pulse (Rising Edge)
    # Detect rising edge: current is high, previous was low
    if ppm_signal[i] > 0.5 and ppm_signal[i-1] < 0.5 and current_state == 1:
        current_state = 0
        
    pwm_conv[i] = current_state

# Filter Design
# A high order Butterworth can cause ringing on step inputs.
# Let's use a 2nd order filter or Bessel (better group delay/no ringing).
# Or just lower the cutoff slightly.
cutoff = 2 * fm # Nyquist is 2*fm, usually we want some buffer. 
# Previous was 4*fm, might let too much switching noise through.
# Let's try 3rd order Butterworth.
b, a = signal.butter(3, cutoff / (f_sim / 2), btype='low')
demod_signal = signal.filtfilt(b, a, pwm_conv)

# Normalization and Offset Removal
# Remove DC
demod_ac = demod_signal - np.mean(demod_signal)

# Scale to match original message for comparison
# Check correlation to determine sign
correlation = np.mean(demod_ac * m_t)
sign = np.sign(correlation)
if np.abs(correlation) < 1e-10: sign = 1

scale_factor = np.max(np.abs(m_t)) / (np.max(np.abs(demod_ac)) + 1e-6)
demod_final = demod_ac * scale_factor * sign

# Tuning note: If "distorted", it might be phase shift? 
# filtfilt removes phase shift. 
# It might be the "staircase" nature of PWM conversion being filtered. 
# Increasing f_sim would help resolution but is computationally expensive.
# The current f_sim=10000 with fs=200 gives 50 samples/cycle, which is usually sufficient.

# Plotting
plt.figure(figsize=(14, 12))

# Message
plt.subplot(4, 1, 1)
plt.plot(t, m_t, 'g', label='Message $m(t)$')
plt.title('Message Signal')
plt.grid(True)
plt.xlim(0, 0.2)

# PPM
plt.subplot(4, 1, 2)
# Plot clock ticks for reference
for n in range(int(duration/Ts)):
    plt.axvline(n*Ts, color='k', linestyle=':', alpha=0.3)
plt.plot(t, ppm_signal, 'b', label='PPM Signal')
plt.title(f'PPM Signal (Shifted Center). Fixed $\\tau={tau*1000:.1f}$ms')
plt.ylabel('Amplitude')
plt.grid(True)
plt.xlim(0, 0.2)
plt.ylim(-0.2, 1.2)

# Converted PWM
plt.subplot(4, 1, 3)
plt.step(t, pwm_conv, where='post', color='r', linewidth=1, label='Converted PWM')
plt.title('Internal PPM-to-PWM Conversion (Variable Width)')
plt.grid(True)
plt.xlim(0, 0.2)
plt.ylim(-0.2, 1.2)

# Demod
plt.subplot(4, 1, 4)
plt.plot(t, m_t, 'g--', label='Original', alpha=0.5)
plt.plot(t, demod_final, 'k', label='Demodulated')
plt.title('Demodulation (via PWM Conversion + LPF)')
plt.legend()
plt.grid(True)
plt.xlim(0, 0.2)

plt.tight_layout()
plt.savefig('../Output_Plots/PPM_Output.png')
print("Saved to ../Output_Plots/PPM_Output.png")
try:
    plt.show()
except:
    pass
