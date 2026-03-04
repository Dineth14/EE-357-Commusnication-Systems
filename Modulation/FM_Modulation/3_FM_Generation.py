import numpy as np
import matplotlib.pyplot as plt

def generate_fm_methods():
    fs = 10000
    t = np.linspace(0, 0.2, int(fs * 0.2), endpoint=False)
    
    # --- 1. Direct FM Generation (VCO) ---
    fm_msg = 10    # Message frequency 10 Hz
    Am = 1.0       # Message amplitude
    fc = 100       # Carrier frequency 100 Hz
    kf = 50        # VCO Frequency sensitivity (Hz/Volt)
    
    # Message m(t)
    m_t = Am * np.cos(2 * np.pi * fm_msg * t)
    
    # Phase is integral of instantaneous frequency variation
    # int(m_t) dt = Am/(2*pi*fm_msg) * sin(2*pi*fm_msg*t)
    integral_m_t = (Am / (2 * np.pi * fm_msg)) * np.sin(2 * np.pi * fm_msg * t)
    
    # FM direct signal = cos(2*pi*fc*t + 2*pi*kf * integral[m(t)dt])
    theta_t = 2 * np.pi * fc * t + 2 * np.pi * kf * integral_m_t
    s_direct = np.cos(theta_t)
    
    # Instantaneous frequency: fi(t) = fc + kf*m(t)
    fi_t = fc + kf * m_t
    
    # Plotting Direct FM
    fig1, axs1 = plt.subplots(3, 1, figsize=(12, 10))
    axs1[0].plot(t, m_t, 'b')
    axs1[0].set_title('Message Signal $m(t)$')
    axs1[0].grid(True)
    
    axs1[1].plot(t, s_direct, 'g')
    axs1[1].set_title('Direct FM Generation (VCO Output)')
    axs1[1].grid(True)
    
    axs1[2].plot(t, fi_t, 'r')
    axs1[2].set_title('Instantaneous Frequency $f_i(t)$')
    axs1[2].set_xlabel('Time (s)')
    axs1[2].set_ylabel('Frequency (Hz)')
    axs1[2].grid(True)
    
    plt.tight_layout()
    plt.savefig('3a_Direct_FM.png', dpi=150)
    print("Saved 3a_Direct_FM.png")


    # --- 2. Indirect FM Generation (Armstrong Method) ---
    # Step 1: Generate NBFM with very low beta using a crystal oscillator
    fc_nb = 50     # NBFM Carrier
    fm_nb = 10     # NBFM Modulating frequency
    beta_nb = 0.2  # NBFM index (must be small)
    
    # NBFM formulation: cos(wc t) - beta * sin(wm t) * sin(wc t)
    s_nbfm = np.cos(2 * np.pi * fc_nb * t) - beta_nb * np.sin(2 * np.pi * fm_nb * t) * np.sin(2 * np.pi * fc_nb * t)
    
    # Step 2: Frequency Multiplier (Simulated using a polynomial non-linearity)
    # y(t) = s_t^3 leads to a 3*fc harmonic among others.
    # The phase deviation beta gets multiplied by 3 here.
    n = 3 # Multiplier factor
    # We'll use a Chebyshev polynomial mapping or simply taking power 3
    # 4*cos^3(x) - 3*cos(x) = cos(3x). 
    # Let's apply Chebyshev polynomial T_3(x) = 4*x^3 - 3*x. This purely multiplies frequency.
    
    multiplier_output = 4 * (s_nbfm**3) - 3 * s_nbfm
    
    # Compute Spectrums to visualize
    f_axis = np.fft.fftshift(np.fft.fftfreq(len(t), 1/fs))
    
    S_nbfm_f = np.abs(np.fft.fftshift(np.fft.fft(s_nbfm))) / (len(t)/2)
    S_mult_f = np.abs(np.fft.fftshift(np.fft.fft(multiplier_output))) / (len(t)/2)
    
    fig2, axs2 = plt.subplots(2, 1, figsize=(12, 8))
    
    mask_nb = (f_axis > 0) & (f_axis < 100)
    axs2[0].plot(f_axis[mask_nb], S_nbfm_f[mask_nb], 'b')
    axs2[0].set_title(f'Spectrum of NBFM Input ($f_c = {fc_nb}$ Hz, $\\beta = {beta_nb}$)')
    axs2[0].grid(True)
    
    mask_mult = (f_axis > 100) & (f_axis < 200)
    axs2[1].plot(f_axis[mask_mult], S_mult_f[mask_mult], 'r')
    axs2[1].set_title(f'Spectrum of Multiplier Output ($\\times x^{{{n}}}$) -> $f_c^{{\\prime}} = {n*fc_nb}$ Hz, $\\beta^{{\\prime}} = {n*beta_nb}$')
    axs2[1].set_xlabel('Frequency (Hz)')
    axs2[1].grid(True)
    
    plt.tight_layout()
    plt.savefig('3b_Indirect_FM.png', dpi=150)
    print("Saved 3b_Indirect_FM.png")

if __name__ == '__main__':
    generate_fm_methods()
