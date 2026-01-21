# Tutorial 1 Simulation: Line Coding Waveforms
# Input Sequence: 1 0 1 0 0 0 1 1 0

import numpy as np
import matplotlib.pyplot as plt

# Input Data
bits = np.array([1, 0, 1, 0, 0, 0, 1, 1, 0])
Tb = 1.0  # Bit duration
Ns = 100 # Samples per bit
t = np.linspace(0, len(bits)*Tb, len(bits)*Ns, endpoint=False)

# Helper to expand bits to time array
def get_waveform(logic_func):
    sig = np.zeros_like(t)
    for i, b in enumerate(bits):
        # Time indices for this bit
        idx_start = i * Ns
        idx_end = (i + 1) * Ns
        idx_mid = i * Ns + Ns // 2
        
        # Call logic function with local time indices
        logic_func(sig, b, idx_start, idx_mid, idx_end)
    return sig

# 1. Unipolar NRZ
def logic_unipolar_nrz(sig, b, start, mid, end):
    if b == 1:
        sig[start:end] = 1
    else:
        sig[start:end] = 0

# 2. Unipolar RZ
def logic_unipolar_rz(sig, b, start, mid, end):
    if b == 1:
        sig[start:mid] = 1
        sig[mid:end] = 0
    else:
        sig[start:end] = 0

# 3. Bipolar RZ (AMI)
last_polarity = -1 # Start assuming last was negative so first is positive
def logic_bipolar_rz_factory():
    last_pol = -1
    def func(sig, b, start, mid, end):
        nonlocal last_pol
        if b == 1:
            pol = -1 * last_pol
            sig[start:mid] = pol
            sig[mid:end] = 0
            last_pol = pol
        else:
            sig[start:end] = 0
    return func

# 4. Manchester NRZ
def logic_manchester(sig, b, start, mid, end):
    if b == 1:
        # 1: Low -> High (IEEE Convention)
        sig[start:mid] = -1
        sig[mid:end] = 1
    else:
        # 0: High -> Low
        sig[start:mid] = 1
        sig[mid:end] = -1

# Generate Signals
sig_unrz = get_waveform(logic_unipolar_nrz)
sig_urz = get_waveform(logic_unipolar_rz)

logic_ami = logic_bipolar_rz_factory()
sig_ami = get_waveform(logic_ami)

sig_man = get_waveform(logic_manchester)

# Plotting
fig, axs = plt.subplots(4, 1, figsize=(12, 12), sharex=True)

# Function to style plots
def style_plot(ax, sig, title):
    ax.plot(t, sig, linewidth=2)
    ax.set_title(title)
    ax.grid(True)
    ax.set_ylim(-1.5, 1.5)
    ax.set_ylabel('Amplitude')
    # Draw bit boundaries
    for i in range(len(bits) + 1):
        ax.axvline(i * Tb, color='k', linestyle=':', alpha=0.3)
    # Add bit labels
    for i, b in enumerate(bits):
        ax.text((i + 0.5) * Tb, 1.2, str(b), ha='center', fontweight='bold')

style_plot(axs[0], sig_unrz, 'Unipolar NRZ')
style_plot(axs[1], sig_urz, 'Unipolar RZ')
style_plot(axs[2], sig_ami, 'Bipolar RZ (AMI)')
style_plot(axs[3], sig_man, 'Manchester NRZ')

plt.xlabel('Time (Tb)')
plt.tight_layout()
plt.savefig('Tutorial1_Output.png')
print("Graph saved to Tutorials/Tutorial1_Output.png")
try:
    plt.show()
except:
    pass
