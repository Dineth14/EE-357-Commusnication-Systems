import numpy as np
import matplotlib.pyplot as plt

# Parameters
fc = 100  # Carrier frequency (Hz)
fm = 5    # Modulating frequency (Hz)
beta = 0.4  # Modulation index (NBFM if beta < 0.5)
Ac = 1    # Carrier amplitude
fs = 4000 # Sampling frequency
t = np.linspace(0, 0.4, int(fs * 0.4), endpoint=False) # 400ms

# Exact NBFM Signal
fm_signal = Ac * np.cos(2 * np.pi * fc * t + beta * np.sin(2 * np.pi * fm * t))

# NBFM Approximation: s(t) = Ac cos(w_c t) - Ac * beta * sin(w_m t) * sin(w_c t)
nbfm_approx = Ac * np.cos(2 * np.pi * fc * t) - Ac * beta * np.sin(2 * np.pi * fm * t) * np.sin(2 * np.pi * fc * t)

# AM Signal with identical sideband magnitudes: s(t) = Ac (1 + beta * cos(w_m t)) * cos(w_c t)
# In NBFM, the integrated message sin(w_m t) modulates the carrier's phase.
am_signal = Ac * (1 + beta * np.sin(2 * np.pi * fm * t)) * np.cos(2 * np.pi * fc * t)

# --- Phasor Diagram Representation ---
# The complex envelope (baseband analytic signal)
# Carrier phasor is a vector of Ac along the real (I) axis.
# NBFM complex envelope approx: Ac (1 + j beta sin(w_m t)) -> quadrature variation
# AM complex envelope: Ac (1 + beta sin(w_m t)) -> in-phase variation

CE_am = Ac * (1 + beta * np.sin(2 * np.pi * fm * t))
CE_nbfm = Ac * (1 + 1j * beta * np.sin(2 * np.pi * fm * t))

fig, axs = plt.subplots(2, 2, figsize=(14, 10))

# 1. AM Time Domain
axs[0, 0].plot(t, am_signal, label='AM Signal')
axs[0, 0].plot(t, Ac * (1 + beta * np.sin(2 * np.pi * fm * t)), 'r--', label='Envelope')
axs[0, 0].set_title('Amplitude Modulation (AM) Time Domain')
axs[0, 0].set_xlabel('Time (s)')
axs[0, 0].set_ylabel('Amplitude')
axs[0, 0].grid(True)
axs[0, 0].legend()

# 2. NBFM Time Domain
axs[0, 1].plot(t, fm_signal, label='FM Signal (Exact)')
axs[0, 1].plot(t, nbfm_approx, alpha=0.5, label='NBFM (Approx)')
axs[0, 1].plot(t, Ac * np.ones_like(t), 'r--', label='Carrier Envelope')
axs[0, 1].set_title('Narrowband FM (NBFM) Time Domain')
axs[0, 1].set_xlabel('Time (s)')
axs[0, 1].set_ylabel('Amplitude')
axs[0, 1].grid(True)
axs[0, 1].legend()

# 3. AM Phasor Diagram
# We plot the trajectory of the complex envelope.
# For AM, the sideband phasors are collinear with the carrier, altering amplitude.
axs[1, 0].plot(np.real(CE_am), np.imag(CE_am), 'b-', lw=3, label='Phasor Trajectory')
axs[1, 0].arrow(0, 0, Ac, 0, color='r', width=0.02, head_width=0.08, length_includes_head=True, label='Carrier Phasor')
axs[1, 0].set_xlim(0, 1.5*Ac)
axs[1, 0].set_ylim(-0.5*Ac, 0.5*Ac)
axs[1, 0].set_title('AM Phasor Diagram')
axs[1, 0].set_xlabel('In-Phase (I)')
axs[1, 0].set_ylabel('Quadrature (Q)')
axs[1, 0].axhline(0, color='black', lw=1)
axs[1, 0].axvline(0, color='black', lw=1)
axs[1, 0].grid(True)
axs[1, 0].legend()

# 4. NBFM Phasor Diagram
# For NBFM, the sideband resultant phasor is perpendicular to the carrier,
# altering the phase but keeping the amplitude approximately constant.
axs[1, 1].plot(np.real(CE_nbfm), np.imag(CE_nbfm), 'g-', lw=3, label='Phasor Trajectory')
axs[1, 1].arrow(0, 0, Ac, 0, color='r', width=0.02, head_width=0.08, length_includes_head=True, label='Carrier Phasor')
axs[1, 1].set_xlim(0, 1.5*Ac)
axs[1, 1].set_ylim(-0.5*Ac, 0.5*Ac)
axs[1, 1].set_title('NBFM Phasor Diagram')
axs[1, 1].set_xlabel('In-Phase (I)')
axs[1, 1].set_ylabel('Quadrature (Q)')
axs[1, 1].axhline(0, color='black', lw=1)
axs[1, 1].axvline(0, color='black', lw=1)
axs[1, 1].grid(True)
axs[1, 1].legend()

# Annotate difference
fig.text(0.5, 0.02, "Notice that AM varies only in Amplitude (In-phase), while NBFM varies principally in Phase (Quadrature).", ha='center', fontsize=12, bbox=dict(facecolor='yellow', alpha=0.3))

plt.tight_layout(rect=[0, 0.05, 1, 1])
plt.savefig('1_NBFM_vs_AM.png', dpi=150)
print('Saved 1_NBFM_vs_AM.png')
