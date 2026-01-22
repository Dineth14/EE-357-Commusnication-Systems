# Single Sideband (SSB) Modulation: Theory and Methods

## 1. Applications of SSB
SSB is a spectrally efficient modulation technique used where bandwidth is critical.
- **Bandwidth Efficiency**: Occupies $B$ Hz compared to $2B$ Hz for AM or DSB-SC. Allows 2x channels.
- **Power Efficiency**: Transmits only the information-bearing component, saving >80% power compared to AM.
- **Typical Uses**:
    - Shortwave Broadcasting (3-30 MHz).
    - Long-Range Aviation/Maritime Communication (HF bands).
    - Amateur Radio (Voice transmission).
    - Frequency Division Multiplexing (Telephone networks).

---

## 2. The "Horn" Problem (Pulse Modulation)
When transmitting digital data (pulses) via SSB, a specific distortion arises known as "Horns".

### Mathematical Origin
SSB generation relies on the Hilbert Transform $\hat{m}(t)$.
$$ x_{SSB}(t) = \frac{A_c}{2} [ m(t) \cos(\omega_c t) \mp \hat{m}(t) \sin(\omega_c t) ] $$
- If $m(t)$ is a square wave (digital data), it has instantaneous jumps.
- The Hilbert Transform of a step function $\text{sgn}(t)$ involves a logarithmic singularity: $\ln|t|$.
- At every transition of the square wave, $\hat{m}(t)$ shoots to $\pm \infty$.

### Consequences
- **Envelope Spikes**: The envelope $\sqrt{m^2 + \hat{m}^2}$ will have infinite spikes ("Horns") at edges.
- **Transmitter Clipping**: Real PAs cannot handle infinite peak power. They clip the horns, causing severe spectral splatter (regrowth of the sideband) and distortion.

### Solution
- **Pre-filtering**: Apply a Low Pass Filter (shape the pulses) to smooth transitions before modulation. This limits the slope and keeps $\hat{m}(t)$ finite.

---

## 3. SSB Generation Methods

### Method 1: The Filtering Method
- **Concept**: Generate DSB-SC, then filter out one sideband.
- **Process**: $m(t) \times \cos(\omega_c t) \xrightarrow{BPF} x_{SSB}(t)$.
- **Challenge**: Requires a filter with extremely sharp rolloff to separate USB and LSB meeting at $f_c$.
- **Constraint**: Cannot handle signals with low-frequency DC components (e.g., video).
- **Workaround**: Works for voice because voice has no energy < 300 Hz, leaving a $600$ Hz gap for the filter transition.

### Method 2: Phase-Shift Method (Hartley Modulator)
- **Concept**: Cancel the unwanted sideband algebraically.
- **Process**: 
    - Path I: $m(t) \cos(\omega_c t)$
    - Path Q: $\hat{m}(t) \sin(\omega_c t)$  (where $\hat{m}$ is $m$ shifted by $-90^\circ$)
    - Sum: $I \mp Q$.
- **Challenge**: Designing a wideband phase shifter (Hilbert Transformer) that provides exactly $-90^\circ$ shift for all audio frequencies (e.g., 300-3400 Hz) is very difficult analog hardware.

### Method 3: Weaver's Method (The "Third Method")
- **Concept**: Uses two stages of mixing to avoid the wideband phase shifter and sharp filters.
- **Process**:
    1.  **First Mixing**: Mix audio with a sub-carrier $f_o$ (center of audio band, e.g., 1.8 kHz).
        - This folds the spectrum around DC.
    2.  **Low Pass Filtering**: Use LPFs (easy to build) to select the desired portion.
    3.  **Second Mixing**: Upconvert to final carrier $f_c$.
        - Combine quadrature paths to cancel aliased image.
- **Advantage**: No sideband filter needed at $f_c$. No wideband phase shifter needed. Relies on accurate matching of gains and phases at single frequencies.
