import { ethers } from "ethers";

/**
 * Mantle Sepolia Testnet config
 * Chain ID: 5003 (0x138B)
 */
const MANTLE_SEPOLIA = {
  chainId: "0x138b", // MetaMask requires hex format
  chainName: "Mantle Sepolia Testnet",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
  blockExplorerUrls: ["https://sepolia.mantlescan.xyz"],
};

export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask tidak ditemukan! Silakan install MetaMask extension.");
  }

  // 1️⃣ Request accounts first
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (err) {
    if (err.code === 4001) {
      throw new Error("User menolak koneksi wallet.");
    }
    throw err;
  }

  // 2️⃣ Try to switch to Mantle Sepolia
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MANTLE_SEPOLIA.chainId }],
    });
  } catch (error) {
    // 3️⃣ If chain doesn't exist, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [MANTLE_SEPOLIA],
        });
      } catch (addError) {
        throw new Error("Gagal menambahkan Mantle Sepolia network.");
      }
    } else if (error.code === 4001) {
      throw new Error("User menolak switch network.");
    } else {
      throw error;
    }
  }

  // 4️⃣ Create provider & signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 5️⃣ Validate network
  const network = await provider.getNetwork();
  if (network.chainId !== 5003n) {
    throw new Error("Network salah. Silakan switch ke Mantle Sepolia.");
  }

  return signer;
}
