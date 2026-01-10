# Melodia - Decentralized Music Royalty Platform

<p align="center">
  <img src="frontend/public/melodia_logo.png" alt="Melodia Logo" width="200"/>
</p>

A Web3 platform for tokenizing music royalties. Musicians can sell ownership shares of song royalties to investors and fans transparently using blockchain technology, powered by **Mantle Network**.

🌐 **Live Demo**: [https://melodia-eth.netlify.app](https://melodia-eth.netlify.app)

## ✨ Key Features

- **Creator Hub**: Deploy royalty contracts for new songs
- **Marketplace**: Buy and sell song royalty ownership
- **Portfolio**: View your music assets and holdings
- **Admin Dashboard**: Approve/reject listing requests

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Setup Environment

Create a `.env` file in the project root:

```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
MANTLE_TESTNET_RPC_URL=https://rpc.testnet.mantle.xyz

# For frontend network selection
VITE_NETWORK=mantleTestnet
```

### 3. Deploy Contracts

**Deploy to Mantle Testnet:**
```bash
npx hardhat run scripts/deploy-admin.js --network mantleTestnet
```

**Deploy to Mantle Mainnet:**
```bash
npx hardhat run scripts/deploy-admin.js --network mantleMainnet
```

Update contract addresses in `frontend/src/config/contracts.js`

### 4. Run Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## 🔗 Network Configuration

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| **Mantle Sepolia** (Recommended) | 5003 | https://rpc.sepolia.mantle.xyz | https://explorer.sepolia.mantle.xyz |
| Mantle Mainnet | 5000 | https://rpc.mantle.xyz | https://explorer.mantle.xyz |

### Switching Networks

Change the `VITE_NETWORK` environment variable in your `.env` file:
- `mantleSepolia` - Mantle Sepolia Testnet (recommended for development)
- `mantleMainnet` - Mantle Mainnet (production)

## 📄 Contract Addresses

### Mantle Testnet (Current Deployment)

| Contract | Address |
|----------|---------|
| KYCRegistry | `TBD after deployment` |
| MusicIPNFT | `TBD after deployment` |

## 👤 Admin Access

The wallet that deploys the `MusicIPNFT` contract automatically becomes the admin.

Admin login: http://localhost:5173/admin

## 📚 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md) - How to deploy and setup
- [Smart Contracts](./docs/SMART_CONTRACTS.md) - Contract architecture
- [Roadmap](./docs/ROADMAP.md) - Development roadmap
- [Pitch](./docs/PITCH.md) - One-pager pitch document
- [Team](./docs/TEAM.md) - Team bios and contact
- [Compliance](./docs/COMPLIANCE.md) - Compliance declaration

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Smart Contracts**: Solidity 0.8.20
- **Framework**: Hardhat
- **Library**: ethers.js v6
- **Blockchain**: Mantle Network (L2)

## 🚀 Deployment

### Netlify

1. Push repository to GitHub
2. Connect repo in Netlify
3. Netlify will auto-detect `netlify.toml`
4. Auto-deploy on every push

### Docker

```bash
# Build image
docker build -t melodia .

# Run container
docker run -p 3000:80 melodia
```

Or with docker-compose:

```bash
docker-compose up -d
```

Access at http://localhost:3000

## 📄 License

MIT