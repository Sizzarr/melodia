import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { getSigner } from "./web3/provider";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import CreatorHub from "./pages/CreatorHub";
import Portfolio from "./pages/Portfolio";
import SongDetail from "./pages/SongDetail";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// ... imports remain the same

export default function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  // ... connectWallet logic remain the same ...

  // Persist connection & Listen for changes
  useEffect(() => {
    async function checkConnection() {
      try {
        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
             connectWallet();
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
             if (accounts.length > 0) connectWallet();
             else {
                 setAccount(null);
                 setSigner(null);
             }
          });
        }
      } catch (err) {
        console.warn("Wallet check failed:", err);
      }
    }
    checkConnection();
    
    // Cleanup listeners (optional, but good practice)
    return () => {
        if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', checkConnection);
        }
    };
  }, []);

  const connectWallet = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setAccount(address);

      console.log("Connected:", address);
    } catch (err) {
      console.error(err.message);
    }
  };

  // --- NETWORK CHECK ---
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
       window.ethereum.on('chainChanged', () => {
          window.location.reload();
       });
       
       checkNetwork();
    }
  }, [account]);

  async function checkNetwork() {
      if (!window.ethereum) return;
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // 0xaa36a7 is Chain ID 11155111 (Sepolia)
      if (chainId !== "0xaa36a7") {
          setIsWrongNetwork(true);
      } else {
          setIsWrongNetwork(false);
      }
  }

  async function switchNetwork() {
      try {
          await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }],
          });
          window.location.reload();
      } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
              try {
                  await window.ethereum.request({
                      method: "wallet_addEthereumChain",
                      params: [
                          {
                              chainId: "0xaa36a7",
                              chainName: "Sepolia Testnet",
                              rpcUrls: ["https://sepolia.infura.io/v3/"], // or public rpc
                              nativeCurrency: {
                                  name: "SepoliaETH",
                                  symbol: "ETH",
                                  decimals: 18,
                              },
                              blockExplorerUrls: ["https://sepolia.etherscan.io"],
                          },
                      ],
                  });
              } catch (addError) {
                  toast.error("Failed to add Sepolia network");
              }
          } else {
              toast.error("Could not switch network automatically.");
          }
      }
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Add padding top if banner is visible */}
      <div>
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route element={<Layout account={account} onConnect={connectWallet} isWrongNetwork={isWrongNetwork} onSwitchNetwork={switchNetwork} />}>
                <Route path="/" element={<HomePage />} />
                <Route
                path="/marketplace"
                element={<Marketplace signer={signer} account={account} />}
                />
                <Route
                path="/creator"
                element={<CreatorHub signer={signer} />}
                />
                <Route
                path="/portfolio"
                element={<Portfolio signer={signer} account={account} />}
                />
                <Route path="/song/:id" element={<SongDetail />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route element={<AdminLayout account={account} onConnect={connectWallet} />}>
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
