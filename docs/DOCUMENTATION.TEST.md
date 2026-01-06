# 📝 Melodia Platform – Testing Documentation

**Tanggal:** 05 Jan 2026
**Versi:** Demo / Testing

---

## 1. Ringkasan Perubahan & Fitur

| Fitur / Modul          | Deskripsi                                                                                   | Status |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------ |
| **Creator Hub**        | Menambahkan field **Cover Image** (dapat diupload ke IPFS).                                 | ✅ Done |
|                        | Menambahkan field **Genre**.                                                                | ✅ Done |
| **Marketplace**        | Menambahkan **genre filter** yang berfungsi sesuai input.                                   | ✅ Done |
| **Role / Permissions** | Hanya **pemilik kontrak (contract owner)** yang dapat mengubah harga token.                 | ✅ Done |
| **Wallet & Transaksi** | Wallet **terverifikasi** dapat melakukan transaksi SHARE token.                             | ✅ Done |
|                        | Wallet **belum terverifikasi** tidak dapat membeli SHARE token.                             | ✅ Done |
| **KYC / Minting**      | Untuk demo, semua wallet **dapat mint token di Creator Hub**, meskipun KYC belum dilakukan. | ✅ Done |

---

## 2. Detail Transaksi Wallet

### Wallet Terverifikasi

```
From: 0x58a8E78C...4828533d6
To:   0x58a8E78C...4828533d6
Amount: 0.1 ERC-20
Status: Success
```

### Wallet Belum Terverifikasi

```
From: 0x58a8E78C...4828533d6
To:   0x693DD46e...F76714e72
Amount: 0.1 ERC-20
Status: Failed / Not Allowed
```

> Catatan: Untuk demo, KYC sementara diabaikan agar semua wallet bisa mint token.

---

## 3. Deployment Creator Hub

* **Contract Address:** `0x9042E51ee36aaFB3bDe16FE75D1FFeAc03c52B04`
* **Transaction Hash:** `0xbe8523ba4f06749a4bcdc80701976bf624cd43f675d5aece36d26c6fd09d849a`
* **Status:** Success
* **Block:** 9988039 (2 Confirmations)
* **Timestamp:** 22 seconds ago (Jan-06-2026 04:22:24 AM UTC)

---

## 4. Catatan & Tips Testing

* Semua fitur Creator Hub dan Marketplace sudah berfungsi di demo.
* Hanya pemilik kontrak yang dapat mengubah harga token.
* Filter genre Marketplace aktif dan sesuai input.
* Wallet yang belum terverifikasi tetap bisa membeli token, tapi untuk demo semua wallet dapat mint token di Creator hub.


