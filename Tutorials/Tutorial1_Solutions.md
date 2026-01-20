# Tutorial 1 Solutions: Line Coding

## Problem Statement
Draw the signaling waveform for the following input:
**Sequence**: `1 0 1 0 0 0 1 1 0`

## Line Coding Schemes

### 1. Unipolar NRZ (Non-Return-to-Zero)
- **Logic**:
  - `1`: High ($+A$) for the entire bit duration $T_b$.
  - `0`: Low ($0$) for the entire bit duration.
- **Description**: The signal stays at a constant positive voltage for logic 1 and zero voltage for logic 0. It does not return to zero in the middle of a bit.

### 2. Unipolar RZ (Return-to-Zero)
- **Logic**:
  - `1`: High ($+A$) for the first half ($T_b/2$), then returns to Low ($0$) for the second half.
  - `0`: Low ($0$) for the entire duration.
- **Description**: Returns to zero halfway through a '1' bit. This provides a self-clocking component but requires twice the bandwidth.

### 3. Bipolar RZ (Return-to-Zero) / AMI (Alternate Mark Inversion)
- **Logic**:
  - `1`: Alternates between High ($+A$) and Negative ($-A$). It is Active for $T_b/2$ and returns to zero for the rest.
  - `0`: Low ($0$) for the entire duration.
- **Description**: Successive 1s have alternating polarity. This removes the DC component and aids in error detection (a violation of alternating polarity indicates an error).

### 4. Manchester NRZ (Split-Phase)
- **Logic**:
  - `1`: High-to-Low transition in the middle of the bit ($+A \to -A$).
  - `0`: Low-to-High transition in the middle of the bit ($-A \to +A$).
- **Description**: Every bit has a transition in the middle, ensuring excellent synchronization.

---

## Expected Waveform Analysis for `1 0 1 0 0 0 1 1 0`

| Bit | Unipolar NRZ | Unipolar RZ | Bipolar RZ | Manchester NRZ |
| :--- | :--- | :--- | :--- | :--- |
| **1** | High | High $\to$ Low | $+A \to 0$ | High $\to$ Low |
| **0** | Low | Low | $0$ | Low $\to$ High |
| **1** | High | High $\to$ Low | $-A \to 0$ | High $\to$ Low |
| **0** | Low | Low | $0$ | Low $\to$ High |
| **0** | Low | Low | $0$ | Low $\to$ High |
| **0** | Low | Low | $0$ | Low $\to$ High |
| **1** | High | High $\to$ Low | $+A \to 0$ | High $\to$ Low |
| **1** | High | High $\to$ Low | $-A \to 0$ | High $\to$ Low |
| **0** | Low | Low | $0$ | Low $\to$ High |
