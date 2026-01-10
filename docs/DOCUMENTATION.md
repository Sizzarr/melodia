# Project Documentation

## 1. Project Structure

```
├── contracts
│   ├── KYCRegistry.sol          # KYC verification (optional for demo)
│   ├── MusicIPNFT.sol           # Music IP NFT
│   └── MusicRoyalty.sol         # Main tokenization & royalty contract
├── docs
│   ├── COMPLIANCE.md            # Compliance declaration
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── DOCUMENTATION.md         # This file
│   ├── PITCH.md                 # One-pager pitch
│   ├── ROADMAP.md               # Project roadmap
│   ├── SMART_CONTRACTS.md       # Contract documentation
│   └── TEAM.md                  # Team information
├── frontend
│   ├── src
│   │   ├── config
│   │   │   ├── contracts.js     # Contract addresses & ABIs
│   │   │   └── networks.js      # Network configuration
│   │   ├── pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── CreatorHub.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   └── SongDetail.jsx
│   │   └── web3
│   │       └── provider.js
│   └── vite.config.js
├── hardhat.config.js
├── package.json
└── README.md
```

---

## 2. Contracts Overview

### 2.1 MusicRoyalty.sol

- **Main function**: Song tokenization & royalty distribution
- `buyShares` → users can buy tokens from admin
- `pricePerShare` & `setPricePerShare` → admin can change token price
- Event `SharesPurchased` → records purchases
- Modifier `onlyVerifiedOrDemo` → bypasses KYC for demo

### 2.2 MusicIPNFT.sol

- NFT for Music Intellectual Property
- Unchanged for demo, only for minting IP NFTs

### 2.3 KYCRegistry.sol

- Optional for demo
- Can return `true` always to allow all accounts to buy tokens

---

## 3. Frontend Pages

| Page | Function |
|------|----------|
| HomePage.jsx | Landing page with stats and links |
| CreatorHub.jsx | Deploy MusicRoyalty & simulate music upload |
| SongDetail.jsx | Display song metadata from IPFS & buy tokens |
| Marketplace.jsx | Display all songs/NFTs |
| Portfolio.jsx | Show user's token balance & royalties |
| AdminLoginPage.jsx | Admin wallet connection |
| AdminDashboard.jsx | Approve/reject listing requests |

---

## 4. Frontend Integration

### Update ABI & Address

File: `frontend/src/config/contracts.js`

```js
export const CONTRACTS = {
  musicRoyalty: {
    address: "0xYourDeployedContractAddress",
    abi: MusicRoyaltyABI,
  },
};
```

### Network Configuration

File: `frontend/src/config/networks.js`

Change `VITE_NETWORK` environment variable to switch networks:
- `mantleTestnet` - Mantle Testnet
- `mantleMainnet` - Mantle Mainnet

---

## 5. Demo Checklist

- [x] Deploy `MusicRoyalty` via **Creator Hub**
- [x] HomePage displays song data
- [x] SongDetail reads metadata
- [x] Users can buy tokens (KYC bypassed)
- [x] Admin can change token price
- [x] Optional: mint IP NFT for new song
