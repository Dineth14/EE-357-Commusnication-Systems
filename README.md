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

#### 2. Sampling (`/Sampling`)
Contains scripts for Pulse Modulation and Sampling Theory.
- **[Natural_sampling.py](Sampling/Natural_sampling.py)**: Simulates Natural Sampling (PAM) and Demodulation.
    - Demonstrates the sampling theorem.
    - Visualizes the time-domain chopping and frequency-domain harmonics.
    - Implements Product Detection and Low Pass Filtering for signal recovery.

#### 3. Output Plots (`/Output_Plots`)
Stores generated plots from the simulations.
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