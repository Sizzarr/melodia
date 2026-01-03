# Roadmap Proyek Melodia 🗺️

Dokumen ini merangkum status saat ini dari proyek Melodia dan fitur-fitur apa saja yang **belum diimplementasikan** dan perlu dikerjakan pada tahap selanjutnya.

---

## ✅ Current Status (Tahap 1 - MVP Selesai)

Saat ini, core foundation dari aplikasi sudah berjalan:
1.  **Smart Contract Architecture**:
    *   `MusicIPNFT`: Sebagai database lagu terpusat (Master).
    *   `MusicRoyalty`: Token ERC-20 yang mewakili kepemilikan saham lagu.
2.  **Frontend Basic**:
    *   **Creator**: Bisa mempublikasikan lagu (Deploy Contract otomatis).
    *   **Explorer**: Bisa melihat daftar lagu yang ada di blockchain.
    *   **Wallet**: Integrasi MetaMask (Connect/Disconnect/Network Check).
3.  **Local Environment**:
    *   Full support untuk development di Localhost Hardhat.

---

## 🚧 Missing Features (Tahap 2 & 3 - Future Work)

Berikut adalah daftar fitur kritikal yang belum ada dan harus menjadi prioritas pengembangan selanjutnya:

### 1. Revenue Distribution Logic (Penting!)
Smart contract `MusicRoyalty.sol` saat ini baru berfungsi sebagai **pencatat kepemilikan** (siapa punya berapa saham).
**Belum ada fitur pembagian uang.**

*   **To Do**:
    *   Implementasi fungsi `depositRoyalty()`: Agar platform streaming/admin bisa menyetor ETH pendapatan ke kontrak.
    *   Implementasi fungsi `claimReward()`: Agar pemegang token bisa menarik jatah ETH mereka sesuai % saham yang dimiliki.
    *   Update kontrak `MusicRoyalty.sol` untuk mendukung standar *Dividend-Paying Token*.

### 2. Marketplace (Jual Beli Saham)
Saat ini tombol "Invest" tidak melakukan apa-apa selain pengecekan saldo. User tidak bisa membeli saham dari orang lain.

*   **To Do**:
    *   Buat Smart Contract `Marketplace.sol`.
    *   Fitur `listToken()`: User A menjual token seharga X ETH.
    *   Fitur `buyToken()`: User B membayar ETH untuk mendapatkan token User A.
    *   Integrasi Frontend: Menampilkan Order Book dan grafik harga.

### 3. Real IPFS Integration
Saat ini fitur upload MP3 dan Cover Art hanya simulasi. Frontend menghasilkan link palsu (`ipfs://QmSongMetadata...`).

*   **To Do**:
    *   Integrasi layanan Pinning IPFS (seperti Pinata atau Web3.Storage).
    *   Upload file asli ke IPFS saat user klik "Publish".
    *   Simpan CID (Content ID) asli ke dalam NFT Metadata.

### 4. KYC System
Kontrak memilki modifier `onlyVerified`, tapi sistem verifikasi user (KYC) belum ada UI-nya.

*   **To Do**:
    *   Halaman "Identity Verification" di frontend.
    *   Admin Dashboard untuk menyetujui/menolak verifikasi user.

### 5. Backend Indexer (The Graph)
Saat ini frontend mengambil data dengan cara *looping* satu per satu ke blockchain. Ini tidak *scalable* jika ada 1000+ lagu.

*   **To Do**:
    *   Membuat Subgraph di **The Graph Protocol**.
    *   Meng-index event `MusicIPMinted` dan `Transfer`.
    *   Frontend query data via GraphQL untuk performa yang jauh lebih cepat.

---

## 📅 Rencana Deployment

1.  **Fase 1 (Selesai)**: Localhost Development.
2.  **Fase 2**: Deploy Contracts ke **Sepolia Testnet**.
3.  **Fase 3**: Audit Smart Contract (Keamanan).
4.  **Fase 4**: Mainnet Launch (Ethereum / L2 seperti Arbitrum).
