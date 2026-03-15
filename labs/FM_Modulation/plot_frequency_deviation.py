import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import linregress

# Data
vdc = np.array([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])
frequency_mhz = np.array([0.9718, 0.9765, 0.9812, 0.9859, 0.9906, 0.9953, 1.0000, 1.0046, 1.0097, 1.0144, 1.0191, 1.0238, 1.0285])

# Linear regression
slope, intercept, r_value, p_value, std_err = linregress(vdc, frequency_mhz)
line = slope * vdc + intercept

plt.figure(figsize=(10, 6))
plt.plot(vdc, frequency_mhz, 'o', label='Measured Data', markersize=8, color='black')
plt.plot(vdc, line, '-', label=f'Linear Fit: f = {slope:.4f}$V_{{DC}}$ + {intercept:.4f}\n$R^2$ = {r_value**2:.4f}', color='black', linewidth=2)

plt.xlabel('Control Voltage, $V_{DC}$ (V)', fontsize=12)
plt.ylabel('Frequency (MHz)', fontsize=12)

# Improve grid and ticks
plt.grid(True, which='both', linestyle='--', alpha=0.7)
plt.minorticks_on()
plt.grid(True, which='minor', linestyle=':', alpha=0.4)


plt.tight_layout()

# Save plot
plt.savefig('VCO_Characteristics.png', dpi=300, bbox_inches='tight')
print('Plot saved as VCO_Characteristics.png')
# plt.show() # Uncomment to show plot if running interactively
