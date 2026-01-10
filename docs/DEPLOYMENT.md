# Deployment Guide - Mantle Network

## Prerequisites

Before deploying, prepare:

1. **Mantle Testnet MNT**: Get testnet tokens from [Mantle Faucet](https://faucet.testnet.mantle.xyz)
2. **Private Key**: Export from MetaMask (use a dedicated testing wallet)
3. **Node.js 18+**: Required for Hardhat

## Step 1: Configure Environment

Create a `.env` file in the project root:

```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
MANTLE_TESTNET_RPC_URL=https://rpc.testnet.mantle.xyz
MANTLE_MAINNET_RPC_URL=https://rpc.mantle.xyz
VITE_NETWORK=mantleTestnet
```

> **IMPORTANT**: Never commit the `.env` file to git. It's already in `.gitignore`.

## Step 2: Deploy Contracts

### Deploy to Mantle Testnet

```bash
npx hardhat run scripts/deploy-admin.js --network mantleTestnet
```

### Deploy to Mantle Mainnet

```bash
npx hardhat run scripts/deploy-admin.js --network mantleMainnet
```

Output will display contract addresses:

```
Deploying to Mantle Testnet...
Deploying with: 0xYourWalletAddress
KYCRegistry: 0x...
MusicIPNFT: 0x...

=== UPDATE contracts.js WITH THESE ADDRESSES ===
kycRegistry: 0x...
musicIPNFT: 0x...
```

## Step 3: Update Frontend Config

Edit `frontend/src/config/contracts.js`:

```javascript
export const CONTRACTS = {
  musicRoyalty: {
    address: "0x...", // Dynamic, deployed per song
    abi: MusicRoyaltyABI,
  },
  musicIPNFT: {
    address: "0xYOUR_NEW_MUSICIPNFT_ADDRESS",
    abi: MusicIPNFTABI,
  },
  kycRegistry: {
    address: "0xYOUR_NEW_KYCREGISTRY_ADDRESS",
    abi: KYCRegistryABI,
  },
};
```

## Step 4: Run Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Step 5: Build for Production

```bash
cd frontend
npm run build
```

Upload the `dist` folder to Netlify, Vercel, or any static hosting.

---

# Admin Dashboard Access

## Who Can Access?

The wallet that **deploys** the `MusicIPNFT` contract automatically becomes the **Admin/Owner**.

## Admin Login

1. Open `http://localhost:5173/admin`
2. Connect the same wallet used for deployment
3. System verifies on-chain if wallet = contract owner
4. If matched, redirect to Admin Dashboard

## Admin Features

- View pending listing requests
- Approve/Reject song submissions
- Mint NFTs for approved songs

## Troubleshooting

**Error "Unauthorized":**
- Connected wallet is not the contract owner
- Use the same wallet that deployed the contracts

**Error "Contract not found":**
- Check network in MetaMask (must be Mantle Testnet/Mainnet)
- Verify contract addresses in `contracts.js`

---

# Network Information

| Network | Chain ID | Currency | Block Explorer |
|---------|----------|----------|----------------|
| Mantle Testnet | 5001 | MNT | https://explorer.testnet.mantle.xyz |
| Mantle Mainnet | 5000 | MNT | https://explorer.mantle.xyz |

---

# Application Workflow

## 1. Creator Flow
1. Open Creator Hub
2. Fill form (token name, song title, royalty value, shares)
3. Deploy contract (Step 1) - Creates MusicRoyalty contract
4. Request listing (Step 2) - Submit to Admin for approval

## 2. Admin Flow
1. Login to Admin Dashboard
2. Review pending requests
3. Approve listing → NFT is minted, song appears in Marketplace

## 3. Investor Flow
1. Open Marketplace
2. Click on an interesting song
3. Buy shares (requires MNT based on share price)
4. View portfolio on the Portfolio page
