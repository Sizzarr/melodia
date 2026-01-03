# Arsitektur Smart Contract

Melodia terdiri dari **3 Smart Contract Utama** yang saling berinteraksi untuk menciptakan ekosistem royalti musik yang terdesentralisasi.

## 1. `KYCRegistry.sol` (Gerbang Keamanan)
*   **Fungsi**: Menyimpan daftar user yang sudah terverifikasi (Whitelisting).
*   **Tujuan**: Memastikan hanya user yang sah yang bisa berpartisipasi (opsional, untuk kepatuhan regulasi/KYC).
*   **Lokasi**: `contracts/KYCRegistry.sol`

## 2. `MusicRoyalty.sol` (Token Saham)
*   **Jenis**: ERC-20 Token (Standard).
*   **Fungsi**:
    *   Setiap lagu yang di-publish akan men-deploy **1 Kontrak MusicRoyalty unik**.
    *   Mewakili "Saham" dari lagu tersebut.
    *   Jika lagu "Cinta Abadi" di-publish dengan 1000 saham, maka akan ada 1000 Token "Cinta Abadi" yang dicetak.
    *   Token ini yang diperjualbelikan investor dan disimpan di wallet mereka.
*   **Lokasi**: `contracts/MusicRoyalty.sol`

## 3. `MusicIPNFT.sol` (Sertifikat Master)
*   **Jenis**: ERC-721 (NFT Standard).
*   **Fungsi**:
    *   Bertindak sebagai "Sertifikat Hak Cipta Master" (Induk).
    *   Menyimpan Metadata utama: Judul Lagu, Artis, Link File (IPFS).
    *   Menyimpan link ke **Alamat Kontrak Royalty** (ERC-20) yang terkait.
*   **Alur Data**:
    *   Frontend membaca NFT ini untuk menampilkan daftar lagu di menu "Explore".
    *   Dari NFT ini, frontend mendapatkan alamat kontrak royalti untuk mengecek harga dan saham.
*   **Lokasi**: `contracts/MusicIPNFT.sol`

---

## Diagram Alur "Publish Song"

1.  **User Input**: Musisi mengisi Judul, Artis, Total Saham.
2.  **Step 1 (Deploy)**: Frontend memanggil Factory untuk deploy kontrak `MusicRoyalty` baru.
    *   *Result*: Alamat Kontrak Baru (misal: `0xABC...`).
3.  **Step 2 (Mint)**: Frontend memanggil `MusicIPNFT` untuk mint 1 NFT baru.
    *   Data: `MetadataURI`, `0xABC...` (Alamat Royalti).
4.  **Finish**: Lagu terdaftar dan saham (token) dikirim ke wallet musisi.
