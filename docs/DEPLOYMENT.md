# Panduan Deployment ke Public Testnet (Sepolia)

Saat ini proyek berjalan di **Localhost** (Simulasi). Untuk membawanya ke jaringan publik agar bisa diakses orang lain, ikuti panduan ini.

## Persiapan
Sebelum memulai, Anda membutuhkan:
1.  **RPC URL**: Daftar di [Alchemy](https://www.alchemy.com/) atau [Infura](https://infura.io/) dan buat App baru untuk "Ethereum Sepolia". Copy HTTPS URL-nya.
2.  **Private Key**: Export Private Key dari MetaMask Anda (Gunakan wallet khusus dev/test, JANGAN wallet utama).
3.  **Testnet ETH**: Minta faucet ETH gratis di [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) atau [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia).

## Langkah 1: Update Konfigurasi Hardhat

Buka file `hardhat.config.js` di root folder dan update bagian `networks`.

> **⚠️ PENTING**: Jangan pernah menulis Private Key langsung di kode (hardcode) jika akan di-upload ke GitHub. Gunakan file `.env`.

**Contoh menggunakan `.env` (Direkomendasikan):**

1. Install dotenv: `npm install dotenv`
2. Buat file `.env` di root:
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   PRIVATE_KEY=your_private_key_here_without_0x
   ```
3. Update `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: process.env.SEPOLIA_RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```

## Langkah 2: Deploy Kontrak

Jalankan perintah ini di terminal untuk deploy ke Sepolia:

```bash
npx hardhat run scripts/deploy_direct.js --network sepolia
```

Jika sukses, terminal akan menampilkan:
```
KYCRegistry deployed to: 0x...
MusicIPNFT deployed to: 0x...
```

**Simpan alamat-alamat ini!**

## Langkah 3: Update Frontend

Agar website Anda terhubung ke kontrak yang baru di Sepolia:

1.  Buka `frontend/src/contracts/contracts.js`.
2.  Ganti alamat lama dengan alamat baru dari langkah deploy di atas.
3.  Buka `frontend/src/App.jsx`.
4.  Cari bagian konfigurasi Network/Provider.
5.  Ubah target Chain ID dari `31337` (Localhost) ke `11155111` (Sepolia).
    *   *Note: Sepolia Chain ID adalah 11155111 (atau 0xAA36A7 in hex).*
6.  Ubah RPC Provider fallback dari `http://127.0.0.1:8545` menjadi URL Alchemy/Infura Anda (agar user tanpa wallet tetap bisa melihat data).

## Langkah 4: Build & Host

1.  Build aplikasi React:
    ```bash
    cd frontend
    npm run build
    ```
2.  Upload folder `dist` yang dihasilkan ke layanan hosting seperti **Vercel**, **Netlify**, atau **GitHub Pages**.
