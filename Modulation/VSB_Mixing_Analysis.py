# VSB Modulation and Frequency Mixing Analysis
# 1. Verify VSB Symmetry Condition
# 2. Visualize Frequency Mixing (Up/Down Conversion)

import numpy as np
import matplotlib.pyplot as plt

def get_spectrum(sig, fs):
    N = len(sig)
    spec = np.fft.fftshift(np.fft.fft(sig)) / N
    freqs = np.fft.fftshift(np.fft.fftfreq(N, 1/fs))
    return freqs, np.abs(spec)

# ==========================================================
# PART 1: VSB SYMMETRY CONDITION
# ==========================================================
# We will simulate the Frequency Domain response of a VSB filter
# and show that H(f-fc) + H(f+fc) is constant.

freq_range = np.linspace(900, 1100, 1000) # Range around fc
fc = 1000
fv = 25 # Vestige width / Roll-off width

# Define a VSB Filter shape (Linear Roll-off)
# Passes lower frequencies, cuts higher frequencies transition at fc
def vsb_filter_response(f):
    # Ensure f is an array for boolean indexing, or handle scalar
    f = np.atleast_1d(f)
    
    # Normalized freq relative to fc
    delta = f - fc
    
    # Linear roll-off from fc-fv to fc+fv
    # At fc-fv: 1
    # At fc+fv: 0
    # Slope = -1/(2fv)
    
    response = np.zeros_like(f, dtype=float)
    mask_pass = delta <= -fv
    mask_trans = (delta > -fv) & (delta < fv)
    mask_stop = delta >= fv
    
    response[mask_pass] = 1.0
    # Linear crossing 0.5 at fc
    # When delta = 0, response = 0.5.
    # When delta = -fv, response = 0.5 - (-1) * 0.5 = 1. Correct.
    response[mask_trans] = 0.5 - (delta[mask_trans] / (2*fv)) 
    response[mask_stop] = 0.0
    
    # Return scalar if input was scalar
    if response.size == 1:
        return response[0]
    return response

H_f = vsb_filter_response(freq_range)

# Check Symmetry: M_out ~ H(f+fc) + H(f-fc)? 
# Wait, for demodulation of VSB signal centered at fc:
# The condition is H(f-fc) + H(f+fc) = 1 for baseband f.
# Let's visualize the "Equivalent Baseband Filter" formed by the vestige sum.
# Shift right by fc (H(f)) -> becomes H(f+fc) relative to baseband? 
# Let's simply plot H(f) and its mirror around fc.
# Actually, let's plot the sum at Baseband frequencies.

f_bb = np.linspace(-50, 50, 500)
# H(f_bb + fc)
H_upper = vsb_filter_response(fc + f_bb)
# H(f_bb - fc)? No, the condition is usually H(f+fc) + H(f-fc) where H is the bandpass filter?
# Let's stick to the visual intuition:
# At fc, value is 0.5.
# At fc+10, value is 0.3.
# At fc-10, value is 0.7.
# 0.3 + 0.7 = 1.0. Perfect reconstruction.

plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
plt.plot(freq_range, H_f, 'b', label='VSB Filter $H(f)$')
plt.axvline(fc, color='k', linestyle='--', label='$f_c$')
plt.title('VSB Filter Magnitude Response')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Gain')
plt.grid(True)
plt.legend()

# Visualize Symmetry
# Pick a point
test_f = 10
val_plus = vsb_filter_response(fc + test_f)
val_minus = vsb_filter_response(fc - test_f)
plt.plot(fc + test_f, val_plus, 'ro')
plt.plot(fc - test_f, val_minus, 'go')
plt.text(fc + test_f, val_plus, f'  {val_plus:.2f}', color='r')
plt.text(fc - test_f, val_minus, f'  {val_minus:.2f}', color='g')
plt.text(950, 0.2, f"Sum at $\pm{test_f}$Hz: {val_plus+val_minus:.2f}")

plt.savefig('../Output_Plots/VSB_Filter_Response.png')

# ==========================================================
# PART 2: FREQUENCY MIXING
# ==========================================================
fs_mix = 10000
dur_mix = 0.1
t_mix = np.linspace(0, dur_mix, int(fs_mix*dur_mix), endpoint=False)

f_in = 1000
sig_in = np.cos(2 * np.pi * f_in * t_mix)

f_lo = 3000
lo = np.cos(2 * np.pi * f_lo * t_mix)

mixed = sig_in * lo

freqs, spec = get_spectrum(mixed, fs_mix)

plt.figure(figsize=(10, 6))
plt.subplot(1, 1, 1)
plt.plot(freqs, spec, 'k')
plt.title(f'Mixer Output Spectrum ($f_{{in}}={f_in}, f_{{LO}}={f_lo}$)')
plt.xlabel('Frequency (Hz)')
plt.xlim(0, 5000)
plt.grid(True)

# Annotate peaks
sum_freq = f_in + f_lo
diff_freq = abs(f_in - f_lo)
plt.annotate('Difference ($|f_c - f_{LO}|$)', xy=(diff_freq, 0.25), xytext=(diff_freq, 0.4),
             arrowprops=dict(facecolor='black', shrink=0.05), ha='center')
plt.annotate('Sum ($f_c + f_{LO}$)', xy=(sum_freq, 0.25), xytext=(sum_freq, 0.4),
             arrowprops=dict(facecolor='black', shrink=0.05), ha='center')

plt.tight_layout()
plt.savefig('../Output_Plots/Mixing_Analysis.png')

print("Plots saved.")
