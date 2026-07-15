<h1 align='center'>
  Linked Scanner
</h1>

<p align="center">
A lightweight application that turns your smartphone into a wireless barcode scanner for your computer. The app establishes a peer-to-peer connection between your phone and computer, allowing you to seamlessly scan barcodes using your phone's camera and have the results automatically inputted on your computer.
</p>

<p align="center">
    <a href="https://github.com/newish0/linked-scanner/releases"><img src="https://img.shields.io/github/downloads/newish0/linked-scanner/total?style=for-the-badge">
    <a href="https://github.com/newish0/linked-scanner/releases/latest">
        <img src="https://img.shields.io/github/v/release/newish0/linked-scanner?style=for-the-badge">
    </a>
    <img src="https://img.shields.io/github/release-date/newish0/linked-scanner?style=for-the-badge">
    <img src="https://img.shields.io/github/package-json/v/newish0/linked-scanner?style=for-the-badge">
    <a href="#">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/newish0/linked-scanner?style=for-the-badge">
    </a>&nbsp;&nbsp;
</p>

<br />

## Getting Started

### Installation

Install the desktop app (Receiver) via the [release page](https://github.com/Newish0/linked-scanner/releases).

| [Windows installer](https://github.com/newish0/linked-scanner/releases/latest/) | [macOS (Apple Silicon) installer](https://github.com/newish0/linked-scanner/releases/latest/) |
| :-----------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: |

Open the Scanner PWA on a mobile device.

| [Scanner Web App](https://newish0.github.io/linked-scanner/scanner) |
| :-----------------------------------------------------------------: |

## Key Features

- **Wireless Scanning**: Use phone camera as barcode scanner - no extra hardware needed.
- **Plug and Play**: Install Receiver on desktop, open Scanner on phone, scan QR code to pair.
- **Cross-Platform**: Windows, macOS, Linux desktop (Tauri) + PWA on any mobile browser.
- **Peer-to-Peer**: Direct connection via WebRTC (PeerJS) for low-latency scans.

## Development

### Prerequisites

- [pnpm](https://pnpm.io/)
- [Rust](https://rustup.rs/) (for Tauri desktop app)

### Project Structure

The repo is a pnpm workspace monorepo with three packages:

1. **`receiver/`** - Desktop app (Tauri + SolidJS)
2. **`scanner/`** - PWA mobile app (SolidJS)
3. **`core/`** - Shared components, stores, and utilities

### Quick Start

```bash
git clone https://github.com/Newish0/linked-scanner.git
cd linked-scanner
pnpm install
```

#### Developing the Desktop App (Receiver)

```bash
cd receiver
pnpm tauri dev
```

Uses Tauri v2 with SolidJS + Tailwind (DaisyUI) + TanStack Router.

#### Developing the PWA Mobile App (Scanner)

```bash
cd scanner
pnpm dev
```

Uses SolidJS + Tailwind (DaisyUI) + TanStack Router + ZXing for barcode scanning.

### Contributing

Contributions are welcome! If you find a bug or have an idea for an improvement, please open an issue or submit a pull request.
