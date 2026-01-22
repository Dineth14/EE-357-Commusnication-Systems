## EE-357 Communication Systems
## Simulation Repository

This repository contains Python implementations of various communication systems concepts, focusing on Analog Modulation and Pulse Modulation techniques.

### Prerequisites

Ensure you have Python installed with the following libraries:
- `numpy`
- `matplotlib`

You can install the dependencies using:
```bash
pip install -r requirements.txt
```

### Repository Structure

#### 1. Modulation (`/Modulation`)
Contains scripts for Analog Amplitude Modulation techniques.
- **[AM_Modulation.py](Modulation/AM_Modulation.py)**: Basic Amplitude Modulation implementation.
- **[DSB_SC_Modulation.py](Modulation/DSB_SC_Modulation.py)**: Double Sideband Suppressed Carrier (DSB-SC) modulation.
- **[Square_Law_Modulation.py](Modulation/Square_Law_Modulation.py)**: Implementation of AM generation using a non-linear device (Square Law Modulator).
- **[PWM.py](Modulation/PWM.py)**: Pulse Width Modulation.
    - Implements Trailing-Edge PWM using the rigorous summation formula.
    - Includes demodulation via LPF.
- **[PPM.py](Modulation/PPM.py)**: Pulse Position Modulation.
    - Implements shifted-center PPM ($t_{center} = nT_s + k_p m(t)$).
    - Demonstrates demodulation by converting to PWM first.
- **[SSB_Modulation.py](Modulation/SSB_Modulation.py)**: Single Sideband Modulation.
    - Implements the Phase Shift Method (Hilbert Transform).
    - Demonstrates cancellation of undesired sideband to generate USSB or LSSB.

#### 2. Sampling (`/Sampling`)
Contains scripts for Pulse Modulation and Sampling Theory.
- **[Natural_sampling.py](Sampling/Natural_sampling.py)**: Simulates Natural Sampling (PAM) and Demodulation.
    - Demonstrates the sampling theorem.
    - Visualizes the time-domain chopping and frequency-domain harmonics.
    - Implements Product Detection and Low Pass Filtering for signal recovery.
- **[Flat_Top_Sampling.py](Sampling/Flat_Top_Sampling.py)**: Simulates Flat Top Sampling.
    - Implements "Sample and Hold" logic.
    - Visualizes the **Aperture Effect** in the frequency domain (spectrum shaping by sinc function).
    - Includes reconstruction via Low Pass Filtering.
- **[PCM.py](Sampling/PCM.py)**: Pulse Code Modulation simulation.
    - Demonstrates Sampling and Uniform Quantization ($n$ bits).
    - Calculates Quantization Error and Signal-to-Noise Ratio (SNR).
    - Verifies the $6$ dB/bit improvement rule.

#### 6. Notes (`/notes`)
- **[SSB_Theory.md](notes/SSB_Theory.md)**: Detailed notes on SSB applications, the "Horn" problem, and Generation Methods (Filter, Hartley, Weaver).
- **[VSB_Theory.md](notes/VSB_Theory.md)**: Notes on VSB Modulation (Symmetry Condition) and Frequency Mixing.

#### New Simulations
- **[SSB_Analysis.py](Modulation/SSB_Analysis.py)**: Advanced SSB analysis.
    - Demonstrates the **Horn Effect** (Hilbert transform singularities).
    - Simulates **Weaver's Method** for SSB generation.
- **[VSB_Mixing_Analysis.py](Modulation/VSB_Mixing_Analysis.py)**: VSB and Mixing analysis.
    - Visualizes VSB Filter Symmetry.
    - Demonstrates Frequency Translation (Up/Down Conversion).

#### 4. Labs (`/labs`)
Contains solutions and simulations for laboratory assignments.
- **[Lab1_Solutions.md](labs/Lab1_Solutions.md)**: Mathematical derivations for Lab 1.
- **[Lab1_Simulation.py](labs/Lab1_Simulation.py)**: Python script to verify Lab 1 results.

#### 5. Tutorials (`/Tutorials`)
- **[Tutorial1_Solutions.md](Tutorials/Tutorial1_Solutions.md)**: Solutions for Line Coding waveforms.
- **[Tutorial1_LineCodes.py](Tutorials/Tutorial1_LineCodes.py)**: Simulation of NRZ, RZ, and Manchester codes.

- Check [Output_Plots/README.md](Output_Plots/README.md) for details on the visualization results.

### Usage

To run any simulation, navigate to the specific directory or run from the root using python.

**Example: Running Natural Sampling**
```bash
cd Sampling
python Natural_sampling.py
```
This will display the plots and save a copy to the current directory (which you can then move to `Output_Plots` if you wish to keep it).

### Authors
- Dineth14