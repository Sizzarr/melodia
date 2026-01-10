# Melodia Project Roadmap 🗺️

This document outlines the current status of the Melodia project and planned future development.

---

## ✅ Current Status (Phase 1 - MVP Complete)

The core foundation of the application is now functional:

1. **Smart Contract Architecture**:
   - `MusicIPNFT`: Centralized song database (Master)
   - `MusicRoyalty`: ERC-20 tokens representing song ownership shares

2. **Frontend Features**:
   - **Creator Hub**: Publish songs (automatic contract deployment)
   - **Marketplace**: View songs available on the blockchain
   - **Portfolio**: View owned music assets
   - **Wallet**: MetaMask integration (Connect/Disconnect/Network Check)

3. **Blockchain Integration**:
   - Mantle Testnet deployment ready
   - Easy switch to Mantle Mainnet

---

## 🚧 Planned Features (Phase 2 & 3)

### 1. Revenue Distribution Logic (Priority!)

Current `MusicRoyalty.sol` only tracks ownership (who owns how many shares).
**No revenue distribution yet.**

**To Do**:
- Implement `depositRoyalty()`: For streaming platforms/admin to deposit MNT earnings
- Implement `claimReward()`: For token holders to withdraw their share of MNT
- Update `MusicRoyalty.sol` to support *Dividend-Paying Token* standard

### 2. Secondary Marketplace

Currently, the "Invest" button only checks balance. Users cannot buy shares from others.

**To Do**:
- Create `Marketplace.sol` smart contract
- Feature `listToken()`: User A sells token for X MNT
- Feature `buyToken()`: User B pays MNT to get User A's tokens
- Frontend: Display Order Book and price charts

### 3. Real IPFS Integration

Currently, MP3 and Cover Art uploads are simulated. Frontend generates fake links (`ipfs://QmSongMetadata...`).

**To Do**:
- Integrate IPFS Pinning service (Pinata or Web3.Storage)
- Upload actual files to IPFS on "Publish"
- Store real CID (Content ID) in NFT Metadata

### 4. KYC System UI

Contract has `onlyVerified` modifier, but no user verification UI exists.

**To Do**:
- Create "Identity Verification" page in frontend
- Admin Dashboard for approving/rejecting user verification

### 5. Backend Indexer (The Graph)

Currently, frontend fetches data by looping through blockchain one by one. Not scalable for 1000+ songs.

**To Do**:
- Create Subgraph on **The Graph Protocol**
- Index `MusicIPMinted` and `Transfer` events
- Frontend queries via GraphQL for much faster performance

---

## 📅 Deployment Plan

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Local Development | ✅ Complete |
| 2 | Mantle Testnet Deployment | 🔄 In Progress |
| 3 | Smart Contract Audit | ⏳ Planned |
| 4 | Mantle Mainnet Launch | ⏳ Planned |

---

## 🎯 Vision

Melodia aims to revolutionize the music industry by:

1. **Democratizing Music Investment**: Allow fans to invest in their favorite artists
2. **Transparent Royalty Distribution**: On-chain, verifiable payments
3. **Artist Empowerment**: Direct access to capital without middlemen
4. **Community Building**: Create stakeholder communities around artists
