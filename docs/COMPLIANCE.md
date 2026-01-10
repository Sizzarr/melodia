# Compliance Declaration

## 📋 Project Overview

**Project Name**: Melodia  
**Network**: Mantle (L2)  
**Smart Contracts**: Solidity 0.8.20  

---

## ⚖️ Asset Classification

### Disclosure Statement

This project involves the tokenization of music royalty rights. The tokens created represent:

- **Fractional ownership shares** in future royalty earnings from specific songs
- **Utility tokens** that entitle holders to a proportional share of deposited royalties

### Regulatory Considerations

> [!IMPORTANT]
> The tokens created through this platform may be considered **securities** in certain jurisdictions. Users should consult with legal counsel before participating.

| Aspect | Description |
|--------|-------------|
| Token Type | Revenue-sharing utility token |
| Jurisdiction | Global (decentralized) |
| Regulated Asset | Potentially (jurisdiction-dependent) |
| KYC/AML | Optional KYCRegistry contract available |

---

## 🔒 Security Measures

1. **Smart Contract Security**
   - OpenZeppelin standard contracts used
   - Owner-only administrative functions
   - No upgradeable proxies (immutable logic)

2. **Access Control**
   - Admin functions protected by `onlyOwner` modifier
   - KYC verification available via `KYCRegistry.sol`

3. **Transparency**
   - All contracts open source
   - Deployed on public blockchain
   - Verifiable on block explorer

---

## ⚠️ Risk Warnings

### Investment Risks

- **Volatility**: Token values may fluctuate significantly
- **Liquidity**: Secondary market may have limited liquidity
- **Royalty Risk**: Actual royalty earnings may differ from projections
- **Smart Contract Risk**: Bugs or vulnerabilities may exist

### Regulatory Risks

- **Securities Laws**: May be subject to securities regulations
- **Tax Implications**: Token transactions may have tax consequences
- **Jurisdictional Bans**: Some jurisdictions may prohibit participation

---

## 📜 Legal Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. THE CREATORS AND CONTRIBUTORS ARE NOT RESPONSIBLE FOR ANY LOSSES INCURRED THROUGH THE USE OF THIS PLATFORM.

Users are solely responsible for:
- Complying with applicable laws and regulations
- Understanding the risks involved
- Conducting their own due diligence

---

## ✅ Declaration

We hereby declare that:

- [x] This project is built for **educational and demonstration purposes**
- [x] We have disclosed the nature of assets involved in this project
- [x] We acknowledge that regulatory requirements may apply
- [x] We recommend users seek independent legal advice before participating

---

**Date**: January 2026  
**Project**: Melodia  
**Network**: Mantle  
