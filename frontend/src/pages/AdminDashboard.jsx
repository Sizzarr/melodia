import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { CONTRACTS } from "../config/contracts";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
      if (!window.ethereum) {
          navigate("/admin");
          return;
      }
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          
          const contract = new ethers.Contract(CONTRACTS.musicIPNFT.address, CONTRACTS.musicIPNFT.abi, provider);
          const owner = await contract.owner();

          if (userAddress.toLowerCase() !== owner.toLowerCase()) {
              toast.error("Access denied: You are not the admin.");
              navigate("/admin");
              return;
          }

          fetchRequests();
          fetchActiveSongs();
      } catch (err) {
          console.error("Auth Fail:", err);
          navigate("/admin");
      }
  }

  async function fetchRequests() {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACTS.musicIPNFT.address,
        CONTRACTS.musicIPNFT.abi,
        provider
      );
      
      const pendingData = await contract.getPendingRequests();

      const formatted = pendingData.map(req => {
          try {
              return {
                requestId: req.requestId?.toString() || req[0]?.toString(),
                creator: req.creator || req[1],
                title: req.title || req[2],
                artist: req.artist || req[3],
                royaltyContract: req.royaltyContract || req[5]
              };
          } catch (err) {
              console.error("Error parsing request:", req, err);
              return null;
          }
      }).filter(Boolean);

      setRequests(formatted);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }

  const [activeSongs, setActiveSongs] = useState([]);
  const [priceInputs, setPriceInputs] = useState({});

  useEffect(() => {
    fetchActiveSongs();
  }, [loading]);

  async function fetchActiveSongs() {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACTS.musicIPNFT.address, CONTRACTS.musicIPNFT.abi, provider);
        
        const counter = await contract.tokenCounter();
        const songs = [];

        for (let i = 1; i <= counter; i++) {
            const song = await contract.getMusicIP(i);
            if (song.isActive) {
                // Get Royalty Contract Details
                const royalty = new ethers.Contract(song.royaltyContract, CONTRACTS.musicRoyalty.abi, provider);
                const currentPrice = await royalty.pricePerShare();
                const songAdmin = await royalty.admin();

                songs.push({
                    tokenId: i,
                    title: song.title,
                    artist: song.artist,
                    contractAddr: song.royaltyContract,
                    currentPrice: ethers.formatEther(currentPrice),
                    admin: songAdmin
                });
            }
        }
        setActiveSongs(songs);
      } catch (err) {
        console.error("Error fetching active songs", err);
      }
  }

  async function updatePrice(song, newPrice) {
      if (!newPrice) return toast.error("Enter a price");
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const royalty = new ethers.Contract(song.contractAddr, CONTRACTS.musicRoyalty.abi, signer);

          const tx = await royalty.setPricePerShare(ethers.parseEther(newPrice));
          await tx.wait();
          
          toast.success(`Price updated for ${song.title}`);
          fetchActiveSongs(); // Refresh
      } catch (err) {
          console.error(err);
          toast.error("Failed to update price (Are you the owner?)");
      }
  }

  async function approveRequest(requestId) {
    try {
      setProcessing(requestId);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACTS.musicIPNFT.address,
        CONTRACTS.musicIPNFT.abi,
        signer
      );

      const tx = await contract.approveListing(requestId);
      await tx.wait();
      
      toast.success(`Request #${requestId} Approved!`);
      fetchRequests(); // Refresh list
      fetchActiveSongs();
    } catch (error) {
      console.error(error);
      toast.error("Approval failed");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* PENDING REQUESTS */}
      <h2 className="text-xl text-gray-400 mb-6 border-b border-gray-800 pb-2">Pending Verifications</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 mb-10">No pending requests.</p>
      ) : (
        <div className="grid gap-6 mb-12">
          {requests.map((req) => (
            <div key={req.requestId} className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{req.title}</h3>
                <p className="text-purple-400">{req.artist}</p>
                <p className="text-sm text-gray-500 mt-2">Creator: {req.creator}</p>
                <p className="text-sm text-gray-500">Contract: {req.royaltyContract}</p>
              </div>
              <button
                onClick={() => approveRequest(req.requestId)}
                disabled={processing === req.requestId}
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
              >
                {processing === req.requestId ? "Approving..." : "Approve Listing"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE LISTINGS MANAGEMENT */}
      <h2 className="text-xl text-gray-400 mb-6 border-b border-gray-800 pb-2">Manage Active Songs</h2>
      <div className="grid gap-6">
          {activeSongs.map((song) => (
              <div key={song.tokenId} className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="text-lg font-bold">{song.title}</h3>
                          <p className="text-gray-400">{song.artist}</p>
                          <p className="text-xs text-gray-500 mt-1">Contract: {song.contractAddr}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-sm text-gray-400">Current Price</p>
                          <p className="text-xl font-bold text-green-400">{song.currentPrice} ETH</p>
                      </div>
                  </div>
                  
                  <div className="flex gap-2 items-center bg-black p-2 rounded-lg border border-gray-800">
                      <input 
                          type="number" 
                          step="0.001"
                          placeholder="New Price (ETH)"
                          className="bg-transparent text-white outline-none px-2 flex-1"
                          onChange={(e) => setPriceInputs({...priceInputs, [song.tokenId]: e.target.value})}
                          value={priceInputs[song.tokenId] || ""}
                      />
                      <button 
                          onClick={() => updatePrice(song, priceInputs[song.tokenId])}
                          className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-md font-bold text-sm"
                      >
                          Set Price
                      </button>
                  </div>
              </div>
          ))}
          {activeSongs.length === 0 && <p className="text-gray-500">No active songs found.</p>}
      </div>
    </div>
  );
}
