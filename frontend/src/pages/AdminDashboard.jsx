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
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="grid gap-6">
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
    </div>
  );
}

