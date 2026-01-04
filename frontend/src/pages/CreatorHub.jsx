import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import MusicRoyaltyArtifact from "../artifacts/contracts/MusicRoyalty.sol/MusicRoyalty.json";
import { CONTRACTS } from "../config/contracts";



export default function CreatorHub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tokenName: "",
    tokenSymbol: "",
    title: "",
    artist: "",
    totalRoyaltyValue: "",
    totalShares: "",
    legalDocument: "",
  });

  const [deployedAddress, setDeployedAddress] = useState(null);
  const [royaltyContract, setRoyaltyContract] = useState(null);
  const [price, setPrice] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [status, setStatus] = useState("");



  async function handleDeploy(e) {
    e.preventDefault();
    if (typeof window.ethereum === "undefined") return toast.error("MetaMask not found!");

    try {
      setLoading(true);
      
      setStatus("Step 1/2: Deploying Contract... (Please Sign)");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const bytecode = MusicRoyaltyArtifact.bytecode?.object || MusicRoyaltyArtifact.bytecode;

      const factory = new ethers.ContractFactory(
        MusicRoyaltyArtifact.abi,
        bytecode,
        signer
      );

      const legalDocURI = `ipfs://${btoa(form.legalDocument)}`;

      if (!CONTRACTS.kycRegistry?.address) throw new Error("KYC Registry Address is missing in config!");

      const contract = await factory.deploy(
        form.tokenName,
        form.tokenSymbol,
        CONTRACTS.kycRegistry.address, 
        form.title,
        form.artist,
        ethers.parseEther(form.totalRoyaltyValue),
        ethers.parseEther(form.totalShares),
        legalDocURI 
      );

      await contract.waitForDeployment();

      try {
        setStatus("Step 2/2: Submitting to Admin... (Please Sign)");
        const ipNFT = new ethers.Contract(
          CONTRACTS.musicIPNFT.address,
          CONTRACTS.musicIPNFT.abi,
          signer
        );

        const requestTx = await ipNFT.requestListing(
          form.title,
          form.artist,
          legalDocURI,
          contract.target
        );
        await requestTx.wait();
        toast.success("Success! Song deployed and submitted for approval.");
      } catch (listingError) {
        toast.success("Contract deployed successfully. Auto-listing failed - please request listing manually.");
      }

      setDeployedAddress(contract.target);
      setRoyaltyContract(contract);

    } catch (err) {
      if (err.code === "ACTION_REJECTED" || err.message?.includes("rejected")) {
          toast.error("Transaction rejected. You must sign ALL transactions.");
      } else {
          toast.error("Deployment Failed: " + (err.reason || err.message));
      }
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  async function updatePrice() {
     if (!royaltyContract || !price) return;
     try {
         const tx = await royaltyContract.setPricePerShare(ethers.parseEther(price));
         await tx.wait();
         toast.success("Price set successfully!");
     } catch (err) {
         console.error(err);
         toast.error("Failed to set price");
     }
  }

  const [errors, setErrors] = useState({});



  const validate = () => {
    let newErrors = {};
    if (!form.tokenName) newErrors.tokenName = "Token Name wajib diisi";
    if (!form.tokenSymbol) newErrors.tokenSymbol = "Token Symbol wajib diisi";
    if (!form.title) newErrors.title = "Song Title wajib diisi";
    if (!form.artist) newErrors.artist = "Artist Name wajib diisi";
    if (!form.totalRoyaltyValue || isNaN(form.totalRoyaltyValue)) newErrors.totalRoyaltyValue = "Total Royalty harus angka valid";
    if (!form.totalShares || isNaN(form.totalShares)) newErrors.totalShares = "Total Shares harus angka valid";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
           Creator Hub
        </h1>

        {!deployedAddress ? (
            <form onSubmit={(e) => {
                e.preventDefault();
                if (validate()) handleDeploy(e);
                else toast.error("Mohon perbaiki input yang salah");
            }} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input
                        type="text"
                        name="tokenName"
                        placeholder="Token Name (e.g. SongToken)"
                        className={`w-full p-3 bg-white/10 border ${errors.tokenName ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.tokenName}
                    />
                    {errors.tokenName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.tokenName}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="tokenSymbol"
                        placeholder="Symbol (e.g. SNG)"
                        className={`w-full p-3 bg-white/10 border ${errors.tokenSymbol ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.tokenSymbol}
                    />
                    {errors.tokenSymbol && <p className="text-red-400 text-xs mt-1 ml-1">{errors.tokenSymbol}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <input
                        type="text"
                        name="title"
                        placeholder="Song Title"
                        className={`w-full p-3 bg-white/10 border ${errors.title ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.title}
                     />
                    {errors.title && <p className="text-red-400 text-xs mt-1 ml-1">{errors.title}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="artist"
                        placeholder="Artist Name"
                        className={`w-full p-3 bg-white/10 border ${errors.artist ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.artist}
                    />
                    {errors.artist && <p className="text-red-400 text-xs mt-1 ml-1">{errors.artist}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input
                        type="number"
                        name="totalRoyaltyValue"
                        min="0"
                        step="0.001"
                        placeholder="Total Royalty Value (ETH)"
                        className={`w-full p-3 bg-white/10 border ${errors.totalRoyaltyValue ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.totalRoyaltyValue}
                    />
                    {errors.totalRoyaltyValue && <p className="text-red-400 text-xs mt-1 ml-1">{errors.totalRoyaltyValue}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        name="totalShares"
                        min="1"
                        step="1"
                        placeholder="Total Shares (e.g. 1000)"
                        className={`w-full p-3 bg-white/10 border ${errors.totalShares ? "border-red-500" : "border-white/20"} rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400`}
                        onChange={handleChange}
                        value={form.totalShares}
                    />
                     {errors.totalShares && <p className="text-red-400 text-xs mt-1 ml-1">{errors.totalShares}</p>}
                </div>
            </div>

            <textarea
                name="legalDocument"
                placeholder="Legal Document / IP Info"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 h-24"
                onChange={handleChange}
                value={form.legalDocument}
            ></textarea>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95 ${
                    loading 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-purple-500/50"
                }`}
            >
                {loading ? (status || "Processing...") : "Deploy Music Contract"}
            </button>

            </form>
        ) : (
            <div className="space-y-6 text-center animate-fade-in">
                <div className="p-6 bg-green-500/20 border border-green-500/50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Deployment Successful!</h3>
                    <p className="text-gray-300 break-all mb-4">Contract: <span className="font-mono text-white">{deployedAddress}</span></p>
                    
                    <div className="flex flex-col gap-4 mt-6">
                        <label className="text-left text-sm text-gray-400 font-semibold">Set Price Per Share (ETH)</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                min="0"
                                step="any"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="e.g. 0.01"
                                className="flex-1 p-3 bg-black/30 border border-white/10 rounded-xl focus:border-purple-500 outline-none"
                            />
                            <button 
                                onClick={updatePrice}
                                className="px-6 py-2 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition"
                            >
                                Set Price
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        setDeployedAddress(null);
                        setForm({  tokenName: "", tokenSymbol: "", title: "", artist: "", totalRoyaltyValue: "", totalShares: "", legalDocument: "" });
                    }}
                    className="text-gray-400 hover:text-white underline"
                >
                    Deploy Another Contract
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
