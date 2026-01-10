##This code provides the implementation of DSB SC Modulation

import numpy as np
import matplotlib.pyplot as plt

# Parameters
t = np.linspace(0, 1, 1000, endpoint=False)
carrier = np.cos(2 * np.pi * 100 * t)
modulating_signal = np.sin(2 * np.pi * 10 * t)

dsb_sc_modulated_signal = carrier * modulating_signal

#frequency domain
f = np.fft.fftfreq(len(t))
carrier_fft = np.fft.fft(carrier)
modulating_signal_fft = np.fft.fft(modulating_signal)
dsb_sc_modulated_signal_fft = np.fft.fft(dsb_sc_modulated_signal)


#time domain
plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
plt.plot(t, carrier)
plt.title('Carrier Signal')
plt.subplot(3, 1, 2)
plt.plot(t, modulating_signal)
plt.title('Modulating Signal')
plt.subplot(3, 1, 3)
plt.plot(t, dsb_sc_modulated_signal)
plt.title('DSB SC Modulated Signal')
plt.tight_layout()
plt.show()

#frequency domain
plt.figure(figsize=(12, 8))
plt.subplot(3, 1, 1)
plt.plot(f, np.abs(carrier_fft))
plt.title('Carrier Signal')
plt.subplot(3, 1, 2)
plt.plot(f, np.abs(modulating_signal_fft))
plt.title('Modulating Signal')
plt.subplot(3, 1, 3)
plt.plot(f, np.abs(dsb_sc_modulated_signal_fft))
plt.title('DSB SC Modulated Signal')
plt.tight_layout()
plt.show()
