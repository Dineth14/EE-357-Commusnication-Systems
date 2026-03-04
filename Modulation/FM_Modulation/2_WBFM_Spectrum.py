import numpy as np
import matplotlib.pyplot as plt
from scipy.special import jv

def generate_wbfm_plots():
    # --- 1. Bessel Functions Plot ---
    beta_vals = np.linspace(0, 15, 500)
    plt.figure(figsize=(12, 6))
    for n in range(6):
        plt.plot(beta_vals, jv(n, beta_vals), label=f'$J_{{{n}}}(\\beta)$', lw=2)
    plt.title('Bessel Functions of the First Kind $J_n(\\beta)$')
    plt.xlabel('Modulation Index ($\\beta$)')
    plt.ylabel('Amplitude of Sideband Pairs')
    plt.axhline(0, color='black', linestyle='--', alpha=0.7)
    plt.grid(True)
    plt.legend(loc='upper right')
    plt.tight_layout()
    plt.savefig('2a_Bessel_Functions.png', dpi=150)
    print("Saved 2a_Bessel_Functions.png")

    # --- 2. WBFM Spectrum and Carson's Rule ---
    fc = 1000  # Carrier Hz
    fm = 50    # Modulating frequency Hz
    fs = 10000 # Sampling Hz
    t = np.linspace(0, 0.2, int(fs * 0.2), endpoint=False) # 200 ms
    
    # Analyze multiple modulation indexes
    betas = [0.5, 2, 5, 10]
    fig, axs = plt.subplots(len(betas), 1, figsize=(12, 12), sharex=True)
    
    for i, beta in enumerate(betas):
        # Time-domain FM signal
        # s(t) = Ac * cos(2pi fc t + beta sin(2pi fm t))
        s_t = np.cos(2 * np.pi * fc * t + beta * np.sin(2 * np.pi * fm * t))
        
        # FFT to observe the spectrum
        S_f = np.fft.fftshift(np.fft.fft(s_t))
        f_axis = np.fft.fftshift(np.fft.fftfreq(len(t), 1/fs))
        S_mag = np.abs(S_f) / (len(t)/2)
        
        # Carson's rule for bandwidth
        # B = 2(Delta f + fm) = 2(beta*fm + fm) = 2*fm*(beta + 1)
        B_carson = 2 * fm * (beta + 1)
        
        ax = axs[i]
        
        # Only plot positive frequencies
        mask = (f_axis > max(0, fc - B_carson - 4*fm)) & (f_axis < fc + B_carson + 4*fm)
        f_plot = f_axis[mask]
        S_plot = S_mag[mask]
        
        # Spectrum using stem plot to look like impulses
        # Since it's continuous FFT, we extract peaks near nf_m
        ax.plot(f_plot, S_plot, color='blue', label='FFT Spectrum')
        
        # Verify with Bessel theoretically:
        # Pn = Ac * Jn(beta) at fc + n*fm
        # We will plot theoretical stems
        n_max = int(beta) + 5
        n_indices = np.arange(-n_max, n_max + 1)
        f_theoretical = fc + n_indices * fm
        mag_theoretical = np.abs(jv(n_indices, beta))
        
        ax.stem(f_theoretical, mag_theoretical, linefmt='r--', basefmt='k-', markerfmt='ro', label='Bessel Theory $|J_n(\\beta)|$')
        
        # Shade Carson's Bandwidth region
        ax.axvspan(fc - B_carson/2, fc + B_carson/2, color='green', alpha=0.15, label=f"Carson's BW: {B_carson} Hz")
        ax.set_title(f'WBFM Spectrum: $\\beta = {beta}$ (Peak Freq Deviation $\\Delta f = {beta * fm}$ Hz)')
        ax.set_ylabel('Magnitude')
        ax.grid(True)
        if i == 0:
            ax.legend(loc='upper right')

    axs[-1].set_xlabel('Frequency (Hz)')
    plt.tight_layout()
    plt.savefig('2b_WBFM_Spectrum.png', dpi=150)
    print("Saved 2b_WBFM_Spectrum.png")

if __name__ == '__main__':
    generate_wbfm_plots()
