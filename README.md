# Melodia - Decentralized Music Royalty Platform

<p align="center">
  <img src="frontend/public/melodia_logo.png" alt="Melodia Logo" width="200"/>
</p>

Platform Web3 untuk tokenisasi royalti musik. Musisi dapat menjual bagian kepemilikan royalti lagu kepada investor/penggemar secara transparan menggunakan Ethereum blockchain.

## Fitur Utama

- **Creator Hub**: Deploy kontrak royalti untuk lagu baru
- **Marketplace**: Jual beli kepemilikan royalti lagu
- **Portfolio**: Lihat aset musik yang dimiliki
- **Admin Dashboard**: Approve/reject listing requests

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Setup Environment

Buat file `.env` di root:

```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

### 3. Deploy Contracts (Sepolia)

```bash
npx hardhat run scripts/deploy-admin.js --network sepolia
```

Update alamat di `frontend/src/config/contracts.js`

### 4. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Buka http://localhost:5173

## Network

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111

## Contract Addresses (Current Deployment)

| Contract | Address |
|----------|---------|
| KYCRegistry | `0x381D28F516f3951203A29E3B636e00B6e79AC220` |
| MusicIPNFT | `0x57cFb035C6DFCB71f01AE6EA24196328E8b352f6` |

## Admin Access

Wallet yang deploy MusicIPNFT otomatis menjadi admin.

Login: http://localhost:5173/admin

## Dokumentasi

- [Deployment Guide](./docs/DEPLOYMENT.md) - Cara deploy dan setup
- [Smart Contracts](./docs/SMART_CONTRACTS.md) - Arsitektur kontrak
- [Roadmap](./docs/ROADMAP.md) - Rencana pengembangan

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Smart Contracts**: Solidity 0.8.20
- **Framework**: Hardhat
- **Library**: ethers.js v6

## Deployment

### Netlify

1. Push repo ke GitHub
2. Connect repo di Netlify
3. Netlify akan auto-detect `netlify.toml`
4. Deploy otomatis setiap push

### Docker

```bash
# Build image
docker build -t melodia .

# Run container
docker run -p 3000:80 melodia
```

Atau dengan docker-compose:

```bash
docker-compose up -d
```

Akses di http://localhost:3000

## License

MIT