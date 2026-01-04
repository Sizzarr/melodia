import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { CONTRACTS } from "../config/contracts";

export default function SongDetail() {
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [song, setSong] = useState(null);
  const [royaltyContract, setRoyaltyContract] = useState(null);
  const [userBalance, setUserBalance] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan");
      return;
    }

    const prov = new ethers.BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const sign = await prov.getSigner();
    const addr = await sign.getAddress();

    setProvider(prov);
    setSigner(sign);
    setAccount(addr);
  }

  const [pricePerShare, setPricePerShare] = useState("0");

  const [error, setError] = useState(null);

  async function loadSong() {
    if (!provider || !id) return;

    try {
      const ipNFT = new ethers.Contract(
        CONTRACTS.musicIPNFT.address,
        CONTRACTS.musicIPNFT.abi,
        provider
      );

      const data = await ipNFT.getMusicIP(id);
      
      if (!data.title || data.title === "") {
        setError("Song not found");
        return;
      }

      let description = "";
      let cover = "";
      
      if (data.metadataURI && data.metadataURI.startsWith("ipfs://")) {
        try {
          const metaRes = await fetch(
            data.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          const meta = await metaRes.json();
          description = meta.description || "";
          cover = meta.image ? meta.image.replace("ipfs://", "https://ipfs.io/ipfs/") : "";
        } catch (e) {}
      }

      setSong({
        tokenId: id,
        title: data.title,
        artist: data.artist,
        description: description,
        cover: cover,
        royaltyContract: data.royaltyContract,
        metadataURI: data.metadataURI,
        creator: data.creator,
      });

      if (data.royaltyContract && data.royaltyContract !== "0x0000000000000000000000000000000000000000") {
        const royalty = new ethers.Contract(
          data.royaltyContract,
          CONTRACTS.musicRoyalty.abi,
          provider
        );

        setRoyaltyContract(royalty);

        const supply = await royalty.totalSupply();
        setTotalSupply(ethers.formatEther(supply));

        try {
          const price = await royalty.pricePerShare();
          setPricePerShare(ethers.formatEther(price));
        } catch (e) {}

        if (account) {
          const bal = await royalty.balanceOf(account);
          setUserBalance(ethers.formatEther(bal));
        }
      }
    } catch (err) {
      console.error("Error loading song:", err);
      setError("Failed to load song data");
    }
  }

  async function buyRoyalty(amount) {
    if (!signer || !royaltyContract) return;

    try {
      setLoading(true);

      const royaltyWithSigner = royaltyContract.connect(signer);
      
      const tokensToBuy = ethers.parseEther(amount);
      const priceWei = ethers.parseEther(pricePerShare);
      
      const totalCost = (tokensToBuy * priceWei) / ethers.parseEther("1");
      
      const balance = await signer.provider.getBalance(account);
      if (balance < totalCost) {
        const needed = ethers.formatEther(totalCost);
        const have = ethers.formatEther(balance);
        toast.error(`Insufficient funds. Need ${needed} ETH, have ${have} ETH`);
        return;
      }

      const tx = await royaltyWithSigner.buyShares(
        tokensToBuy,
        { value: totalCost }
      );

      await tx.wait();
      toast.success("Shares purchased successfully!");

      loadSong();
    } catch (err) {
      console.error(err);
      if (err.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient ETH balance for this transaction");
      } else if (err.code === "ACTION_REJECTED") {
        toast.error("Transaction cancelled");
      } else {
        toast.error("Transaction failed: " + (err.reason || err.shortMessage || err.message));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (provider) loadSong();
  }, [provider, account]);

  /* =============================
     UI
  ============================== */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <p className="text-2xl mb-4">{error}</p>
          <a href="/marketplace" className="text-purple-400 underline">Back to Marketplace</a>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading song from blockchain...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-10 pt-24">
      <div className="max-w-6xl mx-auto">
        <a href="/marketplace" className="text-purple-400 hover:underline mb-6 inline-block">Back to Marketplace</a>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {song.cover ? (
            <img src={song.cover} alt={song.title} className="rounded-xl w-full aspect-square object-cover" />
          ) : (
            <div className="rounded-xl w-full aspect-square bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center">
              <span className="text-6xl text-purple-400">&#9835;</span>
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
            <p className="text-gray-300 text-xl mb-4">{song.artist}</p>

            {song.description && <p className="mb-6 text-gray-400">{song.description}</p>}

            <div className="bg-white/10 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Token ID</span>
                <span className="font-mono">{song.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-bold">{totalSupply} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price Per Share</span>
                <span className="font-bold">{pricePerShare} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Balance</span>
                <span className="font-bold">{userBalance} shares</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Royalty Contract:</span>
                <p className="font-mono text-xs break-all text-purple-300">{song.royaltyContract}</p>
              </div>
              <div>
                <span className="text-gray-500">Creator:</span>
                <p className="font-mono text-xs break-all text-purple-300">{song.creator}</p>
              </div>
              {song.metadataURI && (
                <div>
                  <span className="text-gray-500">Metadata:</span>
                  <p className="font-mono text-xs break-all text-gray-400">{song.metadataURI}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => buyRoyalty("10")}
              disabled={loading || pricePerShare === "0"}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg font-bold disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/30 transition"
            >
              {loading ? "Processing..." : "Buy 10 Shares"}
            </button>

            {!account && (
              <button
                onClick={connectWallet}
                className="w-full mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
              >
                Connect Wallet to Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
