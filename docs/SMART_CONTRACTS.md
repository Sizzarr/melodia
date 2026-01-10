# Smart Contract Architecture

Melodia consists of **3 Smart Contracts** that interact with each other.

## Contracts Overview

### 1. KYCRegistry.sol

**Purpose**: Whitelist verified users

```solidity
// Verify user
function verify(address user) external onlyOwner;

// Check verification status
function isVerified(address user) external view returns (bool);
```

---

### 2. MusicRoyalty.sol

**Type**: Custom Token (ERC-20 style)

**Purpose**: 
- Each song has 1 unique MusicRoyalty contract
- Tokens represent "Shares" of royalty ownership
- Investors can buy/sell shares

**Constructor Parameters**:
```solidity
constructor(
    string memory _name,       // Token name (e.g., "My Song Token")
    string memory _symbol,     // Symbol (e.g., "MST")
    address _kycRegistry,      // KYC contract address
    string memory _title,      // Song title
    string memory _artist,     // Artist name
    uint256 _totalRoyaltyValue,// Total value in wei
    uint256 _totalShares,      // Total shares (e.g., 1000 * 1e18)
    string memory _legalDocument // IPFS URI for legal docs
)
```

**Key Functions**:
```solidity
// Buy shares
function buyShares(uint256 amount) external payable;

// Set price per share (admin only)
function setPricePerShare(uint256 price) external onlyAdmin;

// Transfer shares
function transfer(address to, uint256 amount) external;
```

---

### 3. MusicIPNFT.sol

**Type**: ERC-721 NFT

**Purpose**:
- Master Copyright Certificate
- Stores metadata: title, artist, IPFS link
- Links to MusicRoyalty contract

**Key Functions**:
```solidity
// Request listing (creator)
function requestListing(
    string calldata _title,
    string calldata _artist,
    string calldata _metadataURI,
    address _royaltyContract
) external;

// Approve listing (admin only)
function approveListing(uint256 _requestId) external onlyOwner;

// Get song data
function getMusicIP(uint256 tokenId) external view returns (MusicIP memory);

// Get all pending requests
function getPendingRequests() external view returns (Request[] memory);
```

---

## Workflow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Creator   │────>│ MusicRoyalty │     │   Investor  │
│   (Deploy)  │     │  (ERC-20)    │<────│   (Buy)     │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │
       │ requestListing    │ link to
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│  MusicIPNFT │<────│    Admin     │
│  (ERC-721)  │     │  (Approve)   │
└─────────────┘     └──────────────┘
```

## Song Publishing Flow

1. **Creator Request**:
   - Deploy MusicRoyalty contract via Creator Hub
   - Call `MusicIPNFT.requestListing()`
   - Status: Pending

2. **Admin Approval**:
   - Admin opens Admin Dashboard
   - Call `approveListing(requestId)`
   - NFT is minted to Creator's wallet

3. **Investor Buy**:
   - Open song detail
   - Call `buyShares()` + send MNT
   - Shares transfer to investor

## Technical Specifications

**Solidity Version**: `0.8.20`

**Dependencies**:
- OpenZeppelin Contracts (ERC721, Ownable)

**Network**: Mantle (L2)
- Testnet Chain ID: 5001
- Mainnet Chain ID: 5000
