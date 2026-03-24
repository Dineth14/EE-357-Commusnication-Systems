# 📡 Communication Systems — Interactive Web Textbook

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue?logo=github)](https://pages.github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![KaTeX](https://img.shields.io/badge/KaTeX-0.16.9-blueviolet)](https://katex.org)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.1-ff6384)](https://www.chartjs.org)

A **fully self-contained**, visually rich, interactive web-based textbook covering Communication Systems theory — from analog AM/FM modulation through digital receivers and constellations. No build tools, no npm, no bundler — pure **HTML / CSS / JavaScript** served from CDNs.

---

## Table of Contents

- [Features](#features)
- [Chapters](#chapters)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Mathematics Notation](#mathematics-notation)
- [Bibliography](#bibliography)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **9 comprehensive chapters** with full derivations and theory
- **27+ interactive simulations** — real-time Canvas animations and Chart.js visualizations
- **Dark-first theme** with light mode toggle (persisted in localStorage)
- **KaTeX math rendering** — inline `$...$` and display `$$...$$` equations
- **Responsive design** — works on desktop, tablet, and mobile
- **Progress tracking** — chapter visits stored in localStorage
- **Zero dependencies** — no npm, no bundler, pure static files
- **GitHub Pages ready** — deploy with a single workflow

---

## Chapters

| # | Chapter | Key Topics | Simulations |
|---|---------|-----------|-------------|
| 1 | **AM Modulation** | Standard AM, DSB-FC, modulation index, power analysis | AM waveform, spectrum, demodulation comparison |
| 2 | **DSB-SC / SSB / VSB** | Suppressed carrier, Hilbert transform, vestigial sideband | DSB-SC waveform, SSB filter method, VSB response |
| 3 | **Angle Modulation** | PM, FM, Carson's rule, Bessel functions, NBFM/WBFM | PM/FM waveforms, FM spectrum, FM demodulation |
| 4 | **Sampling & Quantization** | Nyquist theorem, aliasing, SQNR, reconstruction | Sampling modes, quantization, reconstruction filters |
| 5 | **Pulse Modulation** | PAM, PWM, PPM | PAM waveform, PDM/PWM, PPM visualization |
| 6 | **PCM & TDM** | PCM encoding, μ-law/A-law companding, TDM, T1/E1 | PCM encoder, companding curves, PCM SNR |
| 7 | **Line Coding** | NRZ, RZ, Manchester, AMI, PSD analysis | Line code viewer, PSD plots, eye diagrams |
| 8 | **ISI & Pulse Shaping** | Nyquist ISI criterion, raised cosine, matched filter | ISI demo, RC filter explorer, matched filter |
| 9 | **Digital Receivers** | ASK, FSK, BPSK, DPSK, QPSK, QAM, BER analysis | Modulation waveforms, BER curves, constellation diagrams |

---

## Tech Stack

| Component | Details |
|-----------|---------|
| **Markup** | Semantic HTML5 |
| **Styling** | Custom CSS with CSS variables (dark/light themes) |
| **Math** | [KaTeX 0.16.9](https://katex.org) via CDN |
| **Charts** | [Chart.js 4.4.1](https://www.chartjs.org) via CDN |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts |
| **Animations** | HTML5 Canvas with `requestAnimationFrame` (60 fps) |

---

## Getting Started

No installation or build step required. Just serve the files:

### Option 1 — VS Code Live Server

1. Open this folder in VS Code
2. Install the **Live Server** extension
3. Right-click `communication-systems/index.html` → **Open with Live Server**

### Option 2 — Python

```bash
cd communication-systems
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000).

### Option 3 — Node.js

```bash
npx serve communication-systems
```

---

## Project Structure

```
communication-systems/
├── index.html                   # Landing page with chapter grid
├── assets/
│   ├── css/
│   │   ├── main.css             # Global stylesheet + design tokens
│   │   └── math.css             # KaTeX overrides + equation cards
│   └── js/
│       ├── simulations.js       # Shared utilities (FFT, Bessel, Q-function, etc.)
│       ├── theme.js             # Dark/light toggle
│       └── nav.js               # Sidebar, progress bar, TOC
├── chapters/
│   ├── 01-am-modulation/
│   │   ├── index.html           # Chapter page (theory + sims)
│   │   └── sim/                 # Simulation scripts
│   ├── 02-dsbsc-ssb-vsb/
│   ├── 03-angle-modulation/
│   ├── 04-sampling-quantization/
│   ├── 05-pulse-modulation/
│   ├── 06-pcm/
│   ├── 07-line-coding/
│   ├── 08-isi-pulse-shaping/
│   └── 09-digital-receivers/
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Pages deployment
```

---

## Deployment

### GitHub Pages (recommended)

Push this repository to GitHub and enable Pages:

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. The included `.github/workflows/deploy.yml` workflow will build and deploy automatically on push to `main`

The site will be available at `https://<username>.github.io/<repo>/communication-systems/`.

---

## Mathematics Notation

All equations are rendered with KaTeX using standard LaTeX syntax:

- **Inline**: `$E_b/N_0$` renders as *E_b/N_0*
- **Display**: `$$P_e = Q\left(\sqrt{2E_b/N_0}\right)$$` renders as a centered block equation
- **Highlighted boxes**: `.eq-card`, `.eq-highlight`, `.eq-gold`, `.eq-rose` CSS classes

---

## Bibliography

1. **Haykin, S.** — *Communication Systems*, 4th Edition, Wiley, 2001
2. **Proakis, J.G. & Salehi, M.** — *Communication Systems Engineering*, 2nd Edition, Prentice Hall, 2002
3. **Lathi, B.P. & Ding, Z.** — *Modern Digital and Analog Communication Systems*, 5th Edition, Oxford University Press, 2019
4. **Sklar, B.** — *Digital Communications: Fundamentals and Applications*, 2nd Edition, Prentice Hall, 2001
5. **Rappaport, T.S.** — *Wireless Communications: Principles and Practice*, 2nd Edition, Prentice Hall, 2002

---

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-improvement`
3. Commit changes: `git commit -m 'Add improvement'`
4. Push and open a Pull Request

Please ensure:
- All equations render correctly with KaTeX
- Simulations run at 60 fps without console errors
- Both dark and light themes look correct
- No external dependencies beyond the listed CDNs

---

## License

This project is released under the **MIT License**. See [LICENSE](LICENSE) for details.
