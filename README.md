# Melodia - Decentralized Music Royalty Platform 🎵

**Melodia** adalah platform Web3 yang memungkinkan musisi untuk mentokenisasi karya mereka, membagi kepemilikan hak cipta (royalti) kepada penggemar atau investor secara transparan menggunakan teknologi Blockchain Ethereum.

![Melodia DApp Demo](./frontend/public/vite.svg)

## 🚀 Fitur Utama

*   **Creator Hub**: Musisi dapat mempublikasikan lagu dan langsung membuat kontrak royalti otomatis.
*   **Invest/Buy**: Penggemar dapat membeli saham lagu (Token Royalti) dan memiliki bukti kepemilikan di Blockchain.
*   **Portfolio**: Dashboard untuk melihat aset musik yang dimiliki dan nilai sahamnya.
*   **Transparansi**: Semua data kepemilikan dan pembagian hasil tercatat di blockchain.

## 📂 Dokumentasi

Dokumentasi lengkap proyek ini tersedia di folder `docs/`:

*   [**Smart Contracts & Architecture**](./docs/SMART_CONTRACTS.md): Penjelasan detail tentang bagaimana kontrak bekerja (KYC, Royalty Token, NFT).
*   [**Alur Kerja & Deployment**](./docs/DEPLOYMENT.md): Cara menjalankan aplikasi di Localhost dan cara deploy ke Public Testnet (Sepolia).

## 🛠️ Instalasi & Menjalankan (Local)

1.  **Install Dependencies**
    ```bash
    npm install
    cd frontend && npm install
    ```

2.  **Jalankan Blockchain Lokal (Hardhat)**
    ```bash
    # Di terminal baru
    npx hardhat node
    ```

3.  **Deploy Kontrak ke Localhost**
    ```bash
    npx hardhat run scripts/deploy_direct.js --network localhost
    ```
    *Copy alamat kontrak yang muncul dan update di `frontend/src/contracts/contracts.js` jika perlu.*

4.  **Jalankan Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    Buka `http://localhost:5173` di browser.

5.  **Setup MetaMask**
    *   Pastikan MetaMask Anda terhubung ke **Localhost 8545**.
    *   Import Akun Developer (untuk saldo ETH) menggunakan Private Key berikut:
        `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## 📜 Lisensi
MIT License
