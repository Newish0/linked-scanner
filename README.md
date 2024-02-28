






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

Install the desktop application via the the [release page](https://github.com/Newish0/linked-scanner/releases) or try the links below. 

| [Windows installer](https://github.com/newish0/linked-scanner/releases/latest/download/#) | [Apple Silicon Mac installer](https://github.com/newish0/linked-scanner/releases/latest/download/#) |
| :---------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |

Open the web app on a mobile device.

| [PWA Web App](https://newish0.github.io/linked-scanner/client) |
| :------------------------------------------------------------: |

## Key Features 
- **Wireless Scanning**: Scan barcodes using your smartphone's camera, eliminating the need for a physical barcode scanner device.
- **Plug and Play**: Simple setup process with no additional hardware required. Just install the app on your phone and computer, and you're ready to go.
- **Cross-Platform Compatibility**: Works on Windows, macOS, and Linux, ensuring flexibility across different operating systems.
- **Blazing Fast Connection**: Utilizes a secure peer-to-peer connection for data transfer, ensuring the minimal latency from scan.


## Development

### Project Structure 
The repo contains two separate applications: 
1. Desktop app in the `host` sub directory
2. PWA mobile app in the `client` sub directory

All code shared between the two (i.e types) are in the `shared` directory.

#### Developing the Desktop App

```bash
git clone https://github.com/Newish0/linked-scanner.git
```

```bash
cd host
npm i
npm run tauri dev
```

The desktop app uses Tauri with Vite + React + Tailwind (DaisyUI). 

#### Developing the PWA Mobile App

```bash
git clone https://github.com/Newish0/linked-scanner.git
```

```bash
cd client
npm i
npm run dev
```
The PWA uses Vite + React + Tailwind (DaisyUI). 

### Contributing
Contributions are welcome! If you find a bug or have an idea for an improvement, please open an issue or submit a pull request.