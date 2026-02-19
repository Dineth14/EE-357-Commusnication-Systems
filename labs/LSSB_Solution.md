# LSSB Modulation Solution

## Problem Statement
**Carrier**: $c(t) = 40 \cos(2\pi \cdot 10^6 t)$ V. ($A_c = 40$ V, $f_c = 1$ MHz)
**Message**: $m(t) = \cos(10000\pi t) + 4\sin(10000\pi t)$. ($f_m = 5$ kHz)
**Goal**: Generate Lower Sideband (LSSB) signal.

## 1. Time Domain Expression

The canonical equation for an LSSB signal is:
$$ s_{LSSB}(t) = \frac{A_c}{2} [ m(t)\cos(2\pi f_c t) + \hat{m}(t)\sin(2\pi f_c t) ] $$
*(Note: Some conventions use effective amplitude $A_c$ without the $1/2$ factor depending on if $A_c$ is peak of unmodulated carrier or envelope. The problem states "Carrier amplitude is 40V", usually implying the unmodulated carrier $c(t)=A_c \cos \omega_c t$. The product modulator output is usually scaled. Let's assume standard mixer scaling or just $A_c$ as the envelope factor. If we strictly follow product modulation $m(t)c(t)$, DSB-SC has amplitude $A_c A_m$. Filtering to LSSB halves it. So $A_c/2$ is appropriate to represent the filtering loss.)*

### Step 1: Find $\hat{m}(t)$
The message is:
$$ m(t) = \cos(2\pi f_m t) + 4\sin(2\pi f_m t) $$
where $f_m = 5000$ Hz.

The Hilbert Transform properties are:
- $H[\cos(\omega t)] = \sin(\omega t)$
- $H[\sin(\omega t)] = -\cos(\omega t)$

Applying this to $m(t)$:
$$ \hat{m}(t) = \sin(2\pi f_m t) - 4\cos(2\pi f_m t) $$

### Step 2: Substitute into LSSB Equation
$$ s_{LSSB}(t) = \frac{40}{2} [ (\cos \omega_m t + 4\sin \omega_m t)\cos \omega_c t + (\sin \omega_m t - 4\cos \omega_m t)\sin \omega_c t ] $$
$$ = 20 [ \underbrace{\cos \omega_m t \cos \omega_c t + \sin \omega_m t \sin \omega_c t}_{\cos(\omega_c - \omega_m)t} + 4(\underbrace{\sin \omega_m t \cos \omega_c t - \cos \omega_m t \sin \omega_c t}_{\sin(\omega_m - \omega_c)t}) ] $$

Using $\sin(\omega_m - \omega_c)t = -\sin(\omega_c - \omega_m)t$:
$$ s_{LSSB}(t) = 20 [ \cos(2\pi(f_c - f_m)t) - 4\sin(2\pi(f_c - f_m)t) ] $$

Substituting frequencies ($f_c - f_m = 1 \text{ MHz} - 5 \text{ kHz} = 995 \text{ kHz}$):
$$ s_{LSSB}(t) = 20 [ \cos(1.99 \pi \cdot 10^6 t) - 4\sin(1.99 \pi \cdot 10^6 t) ] \text{ V} $$

## 2. Magnitude Spectrum
The signal is a single tone at $f_{LSSB} = 995$ kHz.
The combined amplitude is $20\sqrt{1^2 + (-4)^2} = 20\sqrt{17} \approx 82.46$ V.
The spectrum will show a single delta function (peak) at $995$ kHz.

## 3. Applications of SSB
1.  **Amateur Radio (Ham Radio)**:
    -   **Frequency Range**: HF Bands (3 - 30 MHz).
    -   **Why**: Power efficiency and bandwidth conservation in noisy, long-distance ionospheric propagation.
2.  **HF Air-Ground Communications**:
    -   **Frequency Range**: 2 - 30 MHz.
    -   **Why**: Long-range voice communication for aircraft over oceans/remote areas.
3.  **Military Communications**:
    -   **Frequency Range**: HF (3 - 30 MHz) and VHF (30 - 88 MHz).
    -   **Why**: Reliable, difficult-to-detect (low probability of intercept compared to AM), and efficient tactical voice links.
