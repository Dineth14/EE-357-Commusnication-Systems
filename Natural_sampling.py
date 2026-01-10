#This code provides the implementation of Natural Sampling

import numpy as np
import matplotlib.pyplot as plt

#Parameters
fs = 2000  # Sampling frequency (Hz) - high enough to resolve 2*fc
T = 10    # Duration (seconds)
t = np.linspace(0, T, int(fs * T), endpoint=False)
#Frequencies
fm = 1    # Message frequency (Hz)

#Signal
x_t = np.sin(2 * np.pi * fm * t)

#duty cycle
D = 0.75

#pulse train
x_p = np.zeros_like(x_t)
x_p[::int(fs/fm)] = D   

#sampling
x_s = x_t * x_p

#plot
plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
plt.plot(t, x_t)
plt.title('Original Signal')
plt.subplot(3, 1, 2)
plt.plot(t, x_p)
plt.title('Pulse Train')
plt.subplot(3, 1, 3)
plt.plot(t, x_s)
plt.title('Sampled Signal')
plt.tight_layout()
plt.show()

#frequency domain
f = np.fft.fftfreq(len(t))
x_t_fft = np.fft.fft(x_t)
x_s_fft = np.fft.fft(x_s)

#plot
plt.figure(figsize=(12, 8))
plt.subplot(2, 1, 1)
plt.plot(f, np.abs(x_t_fft))
plt.title('Original Signal FFT')
plt.subplot(2, 1, 2)  
plt.plot(f, np.abs(x_s_fft))
plt.title('Sampled Signal FFT')
plt.tight_layout()
plt.show()


