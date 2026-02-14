# Single Sideband (SSB) Modulation Simulation
# Using Hilbert Transform Method (Hartley Modulator concept)

import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert

# Parameters
fc = 100        # Carrier Frequency (Hz)
fm = 10         # Message Frequency (Hz)
Ac = 1          # Carrier Amplitude
Am = 1          # Message Amplitude
f_sim = 2000    # Simulation Frequency (Hz)
duration = 0.5  # Seconds
t = np.linspace(0, duration, int(f_sim * duration), endpoint=False)

# 1. Message Signal m(t)
m_t = Am * np.cos(2 * np.pi * fm * t)

# 2. Hilbert Transform m_hat(t)
# scipy.signal.hilbert returns the analytic signal: m(t) + j*m_hat(t)
analytic_signal = hilbert(m_t)
m_hat_t = np.imag(analytic_signal)

# 3. Carrier Signals
c_i = Ac * np.cos(2 * np.pi * fc * t) # In-phase carrier
c_q = Ac * np.sin(2 * np.pi * fc * t) # Quadrature carrier

# 4. SSB Generation
# USSB = 0.5 * (m*c - m_hat*c_q)
# LSSB = 0.5 * (m*c + m_hat*c_q)
# Note: The 0.5 factor comes from product-to-sum identity scaling. 
# Usually we might omit it to keep amplitude high, but for strict math we keep it.

ussb_signal = 0.5 * (m_t * c_i - m_hat_t * c_q)
lssb_signal = 0.5 * (m_t * c_i + m_hat_t * c_q)
dsb_sc_signal = m_t * c_i # For comparison

# 5. Frequency Domain Analysis
def get_spectrum(sig):
    N = len(sig)
    spec = np.fft.fftshift(np.fft.fft(sig)) / N
    freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/f_sim))
    return freqs, np.abs(spec)

freqs, spec_m = get_spectrum(m_t)
_, spec_ussb = get_spectrum(ussb_signal)
_, spec_lssb = get_spectrum(lssb_signal)
_, spec_dsb = get_spectrum(dsb_sc_signal)

# 6. Plotting
plt.figure(figsize=(14, 12))

# Time Domain: Message & Hilbert
plt.subplot(3, 2, 1)
plt.plot(t, m_t, 'b', label='$m(t)$')
plt.plot(t, m_hat_t, 'g--', label='$\\hat{m}(t)$ (Hilbert)')
plt.title('Message and its Hilbert Transform')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(0, 0.2)

# Time Domain: Modulated Signals
plt.subplot(3, 2, 2)
plt.plot(t, dsb_sc_signal, 'k', alpha=0.3, label='DSB-SC')
plt.plot(t, ussb_signal, 'r', label='USSB (Upper)')
plt.title('Time Domain: USSB vs DSB-SC')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(0, 0.2)

plt.subplot(3, 2, 3)
plt.plot(t, dsb_sc_signal, 'k', alpha=0.3, label='DSB-SC')
plt.plot(t, lssb_signal, 'b', label='LSSB (Lower)')
plt.title('Time Domain: LSSB vs DSB-SC')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.grid(True)
plt.xlim(0, 0.2)

# Frequency Domain comparison
plt.subplot(3, 2, 4)
plt.plot(freqs, spec_dsb, 'k', alpha=0.5, label='DSB-SC')
plt.plot(freqs, spec_ussb, 'r', label='USSB')
plt.title('Spectrum: USSB Selection')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.legend()
plt.grid(True)
plt.xlim(fc-2*fm, fc+2*fm)

plt.subplot(3, 2, 5)
plt.plot(freqs, spec_dsb, 'k', alpha=0.5, label='DSB-SC')
plt.plot(freqs, spec_lssb, 'b', label='LSSB')
plt.title('Spectrum: LSSB Selection')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.legend()
plt.grid(True)
plt.xlim(fc-2*fm, fc+2*fm)

# Full Spectrum View
plt.subplot(3, 2, 6)
plt.plot(freqs, spec_m, 'g', label='Message')
plt.plot(freqs, spec_ussb, 'r', label='USSB')
plt.plot(freqs, spec_lssb, 'b--', label='LSSB')
plt.title('Full Spectrum Overview')
plt.xlabel('Frequency (Hz)')
plt.grid(True)
plt.legend()
plt.xlim(-150, 150)

plt.tight_layout()
plt.savefig('../Output_Plots/SSB_Output.png')
print("Graph saved to ../Output_Plots/SSB_Output.png")
try:
    plt.show()
except:
    pass
