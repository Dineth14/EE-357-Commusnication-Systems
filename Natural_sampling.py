# Natural Sampling Implementation
# Example 3-1: Spectrum of a Naturally Sampled PAM Signal

import numpy as np
import matplotlib.pyplot as plt

# Parameters
B = 5       # Bandwidth of the signal (Hz)
fs = 20     # Sampling frequency (Hz)
d = 1/3     # Duty cycle
tau = d / fs # Pulse width

# Simulation Parameters (High resolution for continuous time approximation)
f_sim = 1000        # Simulation sampling frequency (Hz) - must be >> fs and B
T_duration = 2.0    # Duration of signal (seconds) - enough to capture sinc decay
t = np.linspace(-T_duration/2, T_duration/2, int(f_sim * T_duration), endpoint=False)

# 1. Analog Signal Generation (Baseband with Rectangular Spectrum)
# Inverse Fourier Transform of Rect(f/2B) is 2B * sinc(2Bt)
# Note: np.sinc(x) is sin(pi*x)/(pi*x)
x_t = 2 * B * np.sinc(2 * B * t)

# 2. Pulse Train Generation
# Rectangular pulses with width tau and period Ts = 1/fs
pulse_train = np.zeros_like(t)
Ts = 1/fs
# Generate pulses
# We want pulse centered at n*Ts? Or starting at n*Ts? 
# Usually theoretical analysis assumes ideal sampling centered or consistent.
# Let's create pulses centered at n*Ts for symmetry or start at 0. 
# "Switching waveform" usually implies a square wave type. 
# Let's implement modulo based pulse train for simplicity and correctness over time.
# Pulse is high if |t % Ts| < tau/2 ? No, standard pulse train starts at 0 often.
# Let's do: High if (t % Ts) < tau.
# But since we have negative time, we need to be careful with modulo.
pulse_train = np.where((t % Ts) < tau, 1, 0)

# Shift pulse train to center the pulses on the samples implies aligning with t=0?
# If we want a pulse centered at t=0, we should adjust phase.
# The sinc is centered at t=0. The sample at t=0 should be captured.
# So we want a pulse active around t=0.
# Current (t % Ts) < tau means it is high from n*Ts to n*Ts + tau.
# At t=0, it goes high. So index 0 is high. This is consistent with sample at t=0.
# However, for correct "natural sampling", the pulse is usually symmetric around the sampling instant?
# Or just a gate open for tau. If gate opens at n*Ts, it captures subsequent signal.
# Let's use the simple modulo definition which effectively puts pulses at [nTs, nTs+tau].
# This will capture x(0) if x(t) is slow varying.
# To be precise with "sampling at rate fs", usually implies t_n = n/fs.
# Let's center the pulses for better theoretical alignment with "sampling at t=0".
# Pulse interval: [-tau/2, tau/2] + n*Ts
pulse_train = np.zeros_like(t)
for n in range(int(-T_duration/2 * fs) - 1, int(T_duration/2 * fs) + 2):
    center = n * Ts
    # Find indices within [center - tau/2, center + tau/2]
    indices = np.where(np.abs(t - center) <= tau/2)
    pulse_train[indices] = 1

# 3. Natural Sampling
x_s = x_t * pulse_train

# 4. Frequency Domain Analysis (FFT)
N = len(t)
freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/f_sim))

# Compute FFT and scale for continuous spectrum approximation
# Multiply by dt (1/f_sim) to approximate the integral
X_f = np.fft.fftshift(np.fft.fft(x_t)) * (1/f_sim)
Xs_f = np.fft.fftshift(np.fft.fft(x_s)) * (1/f_sim)

# Theoretical Scaling Check:
# The sampled spectrum should have peaks scaled by d * sinc(n*d).
# DC component (n=0) should be d * X(f).
# Since D = 1/3, max envelope should be 1/3 of original? 
# Eq: W_s(f) = d * sum( sinc(n*d) * W(f - n*fs) )
# So main lobe is scaled by d * sinc(0) = d.

# 5. Plotting
plt.figure(figsize=(14, 10))

# Time Domain
plt.subplot(3, 1, 1)
plt.plot(t, x_t, label='Original Signal $x(t)$')
plt.plot(t, x_s, label='Sampled Signal $x_s(t)$', alpha=0.7)
plt.title('Time Domain Signals')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.xlim(-0.5, 0.5) # Zoom in to see pulses
plt.legend()
plt.grid(True)

plt.subplot(3, 1, 2)
plt.plot(t, pulse_train, 'r', label='Switching Signal $s(t)$')
plt.title('Switching Signal (Pulse Train) with $d=1/3$')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.xlim(-0.5, 0.5)
plt.grid(True)

# Frequency Domain
plt.subplot(3, 1, 3)
plt.plot(freqs, np.abs(X_f), label='Original Spectrum $|X(f)|$')
plt.plot(freqs, np.abs(Xs_f), label='Sampled Spectrum $|X_s(f)|$')
plt.title('Frequency Domain')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.xlim(-50, 50) # Show enough harmonics
plt.legend()
plt.grid(True)

# Annotations for harmonics
for n in range(-2, 3):
    plt.axvline(n * fs, color='k', linestyle='--', alpha=0.3)
    if n != 0:
        plt.text(n * fs, 0.1, f'{n}$f_s$', ha='center')

plt.tight_layout()
plt.show()



