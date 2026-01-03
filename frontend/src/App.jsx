import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Music, 
  Wallet, 
  Upload, 
  Plus, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  Disc3,
  ExternalLink,
  Globe,
  Settings,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { 
  MUSIC_IP_NFT_ADDRESS, 
  MUSIC_IP_NFT_JSON, 
  MUSIC_ROYALTY_JSON,
  MUSIC_ROYALTY_BYTECODE,
  KYC_REGISTRY_ADDRESS,
  KYC_REGISTRY_JSON
} from './contracts/contracts';

const AdminDashboard = ({ account, onSuccess }) => {
  const [step, setStep] = useState(0); 
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    totalShares: 1000,
    totalRoyaltyValue: '',
  });
  const [deployedAddress, setDeployedAddress] = useState(null);
  const [files, setFiles] = useState({ audio: null, cover: null });
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Simple mock: just take the name of the first file for now
      // In real app, you'd distinguish between audio and image inputs
      setFiles({ ...files, audio: e.target.files[0] });
    }
  };

  const publishSong = async (e) => {
    e.preventDefault();
    if (!account) return alert("Please connect your wallet first");
    if (!window.ethereum) return alert("Install MetaMask");
    
    try {
      setError(null);
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Auto-Switch Network Logic
      const network = await provider.getNetwork();
        if (network.chainId !== 31337n && network.chainId !== 1337n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x7A69' }], // 31337 in hex
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
               try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x7A69',
                        chainName: 'Localhost 8545',
                        rpcUrls: ['http://127.0.0.1:8545'],
                        nativeCurrency: {
                          name: 'ETH',
                          symbol: 'ETH',
                          decimals: 18
                        }
                      }
                    ]
                  });
               } catch (addError) {
                  return alert("Failed to add Localhost network automatically. Please add it manually.");
               }
            } else {
               return alert(`Please switch your wallet to Localhost 8545. Current: ${network.chainId}`);
            }
          }
        }

      const signer = await provider.getSigner();

      // 1. Prepare Metadata (Mock IPFS for now, but real ethers flow)
      setStep(1);
      setStatus("Preparing Metadata...");
      const metadataURI = `ipfs://QmSongMetadata${Math.random().toString(36).substring(7)}`;
      await new Promise(r => setTimeout(r, 1000));

      // 2. Deploy Royalty Token
      setStep(2);
      setStatus("Deploying Royalty Token...");
      const royaltyFactory = new ethers.ContractFactory(MUSIC_ROYALTY_JSON, MUSIC_ROYALTY_BYTECODE, signer);
      
      const royaltyContract = await royaltyFactory.deploy(
        formData.title + " Royalty", // Name
        formData.title.substring(0, 3).toUpperCase() + "R", // Symbol
        KYC_REGISTRY_ADDRESS,
        formData.title,
        formData.artist,
        ethers.parseEther(formData.totalRoyaltyValue.toString()),
        formData.totalShares
      );
      
      await royaltyContract.waitForDeployment();
      const royaltyAddress = await royaltyContract.getAddress();
      console.log("Royalty deployed to:", royaltyAddress);
      
      // 3. Mint Music IP NFT
      setStep(3);
      setStatus("Minting Music IP NFT...");
      const nftContract = new ethers.Contract(MUSIC_IP_NFT_ADDRESS, MUSIC_IP_NFT_JSON, signer);
      
      const tx = await nftContract.mintMusicIP(
        account,
        formData.title,
        formData.artist,
        metadataURI,
        royaltyAddress
      );
      
      const receipt = await tx.wait();
      
      setStep(4);
      setStatus("Success! Song published.");
      setDeployedAddress({
         contract: royaltyAddress,
         hash: receipt.hash
      });
      
      // Trigger data refresh
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      
      // Handle User Rejection
      if (err.info?.error?.code === 4001 || err.code === "ACTION_REJECTED" || err.message.includes("rejected")) {
        setError("Transaction cancelled by user.");
        setStatus("idle");
      } else {
        setError(err.reason || err.message || "Deployment failed");
        setStatus("idle"); // Reset status on error so user can try again
      }
      setStep(0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Management</h2>
        <div className="flex gap-2">
          <button 
            className="btn-ghost flex items-center gap-2 hover:bg-white/5 transition-colors"
            onClick={() => alert("Global dApp Settings: \n- Network: Localhost 8545 \n- IPFS Gateway: Mock \n\nMore configuration options coming soon!")}
          >
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-primary" /> Publish New Song
          </h3>
          
          <form onSubmit={publishSong} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Song Title</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="Enter song title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Artist Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                placeholder="Artist name"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Shares</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  value={formData.totalShares}
                  onChange={(e) => setFormData({...formData, totalShares: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Est. Royalty ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  placeholder="2500"
                  value={formData.totalRoyaltyValue}
                  onChange={(e) => setFormData({...formData, totalRoyaltyValue: e.target.value})}
                />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              accept="audio/*,image/*"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${files.audio ? 'border-primary bg-primary/10' : 'border-white/10'} rounded-3xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer`}
            >
              <Upload className={`mx-auto mb-4 ${files.audio ? 'text-primary' : 'text-gray-500'}`} size={32} />
              <p className="text-sm text-gray-400 font-medium">
                {files.audio ? files.audio.name : "Upload MP3 & Cover Art"}
              </p>
              <p className="text-xs text-gray-600 mt-1">Files will be hosted on IPFS</p>
            </div>

            <button 
              type="submit" 
              disabled={status !== "idle"}
              className={`w-full btn-primary py-4 ${status !== "idle" ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status !== "idle" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </span>
              ) : (
                "Deploy Royalty & Mint IP NFT"
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Deployment Progress</h3>
            <div className="space-y-6">
              {[
                { name: 'Prepare Metadata', desc: 'Uploading to IPFS', id: 1 },
                { name: 'Deploy MusicRoyalty', desc: 'Creating smart contract', id: 2 },
                { name: 'Mint MusicIPNFT', desc: 'Linking IP to Royalty', id: 3 }
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-primary animate-pulse text-white' : 'bg-white/5 text-gray-500'}`}>
                    {step > s.id ? <CheckCircle2 size={16} /> : step === s.id ? <Loader2 size={16} className="animate-spin" /> : i + 1}
                  </div>
                  <div>
                    <p className={`font-bold ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.name}</p>
                    <p className="text-xs text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs">
                {error}
              </div>
            )}
            
            {step === 4 && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-center break-all">
                <p className="font-bold">✓ Transaction Confirmed</p>
                <p className="text-xs opacity-70 mb-2">Your song is now live on the blockchain.</p>
                <div className="text-xs font-mono bg-black/20 p-2 rounded selectable space-y-2">
                  <p>Contract: {deployedAddress?.contract}</p>
                  <p className="text-gray-500">Tx Hash: {deployedAddress?.hash}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="glass p-8 rounded-3xl bg-primary/10 border-primary/20">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-primary">
              <ShieldCheck size={18} /> Admin Tip
            </h4>
            <p className="text-sm text-gray-400">
              Ensure you have enough ETH to cover the gas fees for deploying the Royalty contract. 
              Each song requires its own unique contract instance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = ({ account }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState({
    totalBalance: "0",
    songsOwned: 0,
    activeShares: "0",
    acquisitions: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (account && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // 1. Check KYC
          const kycContract = new ethers.Contract(KYC_REGISTRY_ADDRESS, KYC_REGISTRY_JSON, provider);
          const verified = await kycContract.isVerified(account);
          setIsVerified(verified);

          // 2. Scan for Portfolio
          const nftContract = new ethers.Contract(MUSIC_IP_NFT_ADDRESS, MUSIC_IP_NFT_JSON, provider);
          const counter = await nftContract.tokenCounter();
          
          let totalAssets = 0;
          let totalTokens = 0n;
          const userAcquisitions = [];

          for (let i = 1; i <= Number(counter); i++) {
            const item = await nftContract.getMusicIP(i);
            const royaltyContract = new ethers.Contract(item.royaltyContract, MUSIC_ROYALTY_JSON, provider);
            const balance = await royaltyContract.balanceOf(account);
            
            if (balance > 0n) {
              totalAssets++;
              totalTokens += balance;
              
              const musicInfo = await royaltyContract.music();
              const totalSupply = await royaltyContract.totalSupply();
              const sharePercent = (Number(balance) / Number(totalSupply) * 100).toFixed(2);

              userAcquisitions.push({
                title: item.title,
                artist: item.artist,
                share: sharePercent + "%",
                balance: ethers.formatEther(balance),
                contract: item.royaltyContract
              });
            }
          }

          setPortfolio({
            totalBalance: ethers.formatEther(totalTokens),
            songsOwned: totalAssets,
            activeShares: totalAssets > 0 ? (Number(totalTokens) / 100).toFixed(2) : "0", // Simplified active share calc
            acquisitions: userAcquisitions
          });

        } catch (err) {
          console.error("Portfolio fetch failed", err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [account]);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-2">My Investment Portfolio</h2>
          <p className="text-gray-400">Manage your music assets and claim rewards</p>
        </div>
        <div className={`glass px-6 py-3 rounded-2xl border-accent/20 flex items-center gap-3 ${isVerified ? 'border-accent/40' : 'border-red-500/40'}`}>
          <ShieldCheck className={isVerified ? 'text-accent' : 'text-red-500'} size={20} />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">KYC Status</p>
            <p className={`text-sm font-bold ${isVerified ? 'text-accent' : 'text-red-500'}`}>
              {loading ? "Checking..." : isVerified ? "Verified Member" : "Verification Required"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Tokens</p>
          <p className="text-2xl font-bold font-mono">{portfolio.totalBalance}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Songs Owned</p>
          <p className="text-2xl font-bold font-mono">{portfolio.songsOwned}</p>
        </div>
        <div className="glass p-6 rounded-3xl border-secondary/20 bg-secondary/5">
          <p className="text-secondary text-xs font-bold uppercase mb-1 underline">Pending Royalties</p>
          <p className="text-2xl font-bold font-mono text-secondary">$0.00</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Avg Share</p>
          <p className="text-2xl font-bold font-mono">{portfolio.activeShares}%</p>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-6">Recent Acquisitions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolio.acquisitions.length > 0 ? (
            portfolio.acquisitions.map((asset, i) => (
              <div key={i} className="glass group rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all">
                <div className="aspect-square bg-gray-800 p-8 flex items-center justify-center relative">
                   <Disc3 className="text-white/5 group-hover:text-primary/20 animate-spin-slow transition-colors" size={120} />
                   <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                   <div className="absolute bottom-6 left-6 right-6 text-center">
                      <h4 className="font-bold">{asset.title}</h4>
                      <p className="text-xs text-gray-500">{asset.artist}</p>
                   </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Your Share</span>
                    <span className="font-bold text-accent">{asset.share}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-1000" 
                      style={{ width: asset.share }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>{asset.balance} Tokens</span>
                    <span className="truncate ml-2">{asset.contract.substring(0, 10)}...</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center glass rounded-3xl border-dashed">
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No Assets Found</p>
              <p className="text-xs text-gray-700 mt-2">Start investing in the Explore tab</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [account, setAccount] = useState("");
  const [view, setView] = useState("explore"); 
  const [featuredIPs, setFeaturedIPs] = useState([]);
  const [stats, setStats] = useState({
    assets: "0",
    volume: "0",
    verified: "0"
  });

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
          
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            } else {
              setAccount("");
            }
          });
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };
    
    checkWalletConnection();
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const fetchGlobalData = async () => {
    try {
      let provider;
      // STRATEGY: Try direct local connection first. 
      // This solves the issue where MetaMask is on the wrong network (e.g. Mainnet) but we are developing on Localhost
      try {
        const localProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        await localProvider.getNetwork(); // Test connection
        provider = localProvider;
        console.log("Using Local Provider (8545)");
      } catch (e) {
        console.warn("Local node not accessible, checking wallet...", e);
        if (window.ethereum) {
           provider = new ethers.BrowserProvider(window.ethereum);
        }
      }

      if (!provider) {
         console.error("No provider available");
         return;
      }

      const nftContract = new ethers.Contract(MUSIC_IP_NFT_ADDRESS, MUSIC_IP_NFT_JSON, provider);
      
      const counter = await nftContract.tokenCounter();
      console.log("Debug: Token count fetched:", counter.toString());
      
      // Fetch NFTs
      const items = [];
      for (let i = 1; i <= Number(counter); i++) {
        const item = await nftContract.getMusicIP(i);
        
        let value = "$0";
        try {
          const royaltyContract = new ethers.Contract(item.royaltyContract, MUSIC_ROYALTY_JSON, provider);
          const info = await royaltyContract.music();
          value = ethers.formatEther(info.totalRoyaltyValue) + " ETH";
        } catch (e) {
            console.warn("Failed to load royalty details for", item.royaltyContract);
        }

        items.push({
          title: item.title,
          artist: item.artist,
          metadataURI: item.metadataURI,
          royaltyContract: item.royaltyContract,
          tokenId: i,
          share: "100%", 
          value: value
        });
      }
      console.log("Debug: Featured IPs set:", items);
      setFeaturedIPs(items);
      
      // Fetch Stats
      setStats({
        assets: counter.toString(),
        volume: "0",
        verified: "1"
      });

    } catch (err) {
      console.error("Fetch global data failed", err);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      // ... (existing wallet check code)
      if (window.ethereum) {
         // ...
      }
    };
    
    checkWalletConnection();
    fetchGlobalData(); // Initial fetch
    
    // Set up a listener or interval if needed, or just pass this down
    const interval = setInterval(fetchGlobalData, 10000); // Polling every 10s as a fallback for updates
    return () => clearInterval(interval);
  }, [account]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        localStorage.setItem("isWalletConnected", "true");
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    localStorage.setItem("isWalletConnected", "false");
  };

  const handleInvest = async (royaltyAddress) => {
    if (!account) return alert("Connect Wallet First");
    
    try {
      // Use Local Provider for reading data to avoid MetaMask network mismatch
      // This prevents "BAD_DATA" errors if user is on Mainnet/Sepolia while dev is on Localhost
      let provider;
      try {
         provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
         await provider.getNetwork();
      } catch (e) {
         // Fallback to wallet if local node is down (though unlikely for this dev setup)
         provider = new ethers.BrowserProvider(window.ethereum);
      }

      const royaltyContract = new ethers.Contract(royaltyAddress, MUSIC_ROYALTY_JSON, provider);
      
      // Check Balance
      const balance = await royaltyContract.balanceOf(account);
      const symbol = await royaltyContract.symbol();
      
      if (balance > 0n) {
        alert(`You already own ${ethers.formatEther(balance)} ${symbol} of this song! View it in your Portfolio.`);
      } else {
         // Since we don't have a marketplace yet, we can only simulate or inform
         alert(`Marketplace trading is coming soon. You can view the contract on-chain at: ${royaltyAddress}`);
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed: " + err.message);
    }
  };

  return (
    <div className="bg-background min-h-screen text-gray-100 selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 glass border-x-0 border-t-0 py-4 mb-12">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('explore')}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Music className="text-white" size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter gradient-text">MELODIA</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <button onClick={() => setView('explore')} className={`hover:text-white transition-colors ${view === 'explore' ? 'text-white' : ''}`}>Explore</button>
              <button onClick={() => setView('admin')} className={`hover:text-white transition-colors ${view === 'admin' ? 'text-white' : ''}`}>Creator Hub</button>
              <button onClick={() => setView('user')} className={`hover:text-white transition-colors ${view === 'user' ? 'text-white' : ''}`}>Portfolio</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {account ? (
              <div className="flex items-center gap-2">
                <button className="btn-primary flex items-center gap-2 text-sm cursor-default">
                  <Wallet size={18} />
                  {account.substring(0, 6)}...{account.substring(38)}
                </button>
                <button 
                  onClick={disconnectWallet} 
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                  title="Disconnect Wallet"
                >
                  <ExternalLink size={18} className="rotate-180" />
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary flex items-center gap-2 text-sm">
                <Wallet size={18} />
                Connect
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pb-24 relative">
        {view === 'explore' && (
          <div className="space-y-24">
            <header className="flex flex-col items-center text-center space-y-8 pt-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-xs font-black uppercase tracking-[0.2em] text-primary">
                <Globe size={14} /> The Future of Music Ownership
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                REVOLUTIONIZE<br />
                <span className="gradient-text">YOUR ROYALTIES.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl font-medium">
                Melodia empowers artists to tokenize their intellectual property and 
                fans to invest in the sounds they love. Secure, transparent, and built on ERC-3643.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="btn-primary px-10 py-5 text-base">Start Investing</button>
                <button className="btn-ghost px-10 py-5 text-base">Learn Standard</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Plus, label: "Music IP Assets", val: stats.assets, color: "from-primary/20" },
                { icon: TrendingUp, label: "Volume Traded", val: stats.volume === "0" ? "0.00" : stats.volume, color: "from-secondary/20" },
                { icon: ShieldCheck, label: "Verified Nodes", val: stats.verified, color: "from-accent/20" }
              ].map((s, i) => (
                <div key={i} className={`glass p-8 rounded-[2.5rem] bg-gradient-to-br ${s.color} to-transparent border-white/5`}>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <s.icon size={24} className="text-gray-300" />
                  </div>
                  <p className="text-[10px] items-center gap-2 uppercase font-black tracking-[0.2em] text-gray-500 mb-1">{s.label}</p>
                  <p className="text-4xl font-black tracking-tighter">{s.val}</p>
                </div>
              ))}
            </div>

            <section>
               <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Featured IP</h2>
                    <p className="text-gray-500 font-medium">Limited supply tokens for legendary tracks</p>
                  </div>
                  <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                    Marketplace <ChevronRight size={20} />
                  </button>
               </div>
               
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {featuredIPs.length > 0 ? (
                     featuredIPs.map((track, i) => (
                       <div key={i} className="glass group rounded-[2.5rem] p-4 hover:border-primary/40 transition-all cursor-pointer">
                         <div className="aspect-square bg-gray-800 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden relative">
                           <Disc3 className="text-white/5 group-hover:text-primary animate-spin-slow transition-all duration-700" size={100} />
                           <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleInvest(track.royaltyContract || "0x...");
                                 }}
                                 className="btn-primary text-xs py-2 px-6"
                               >
                                 Quick Buy
                               </button>
                           </div>
                         </div>
                         <div className="px-2 pb-2">
                           <h3 className="text-lg font-black tracking-tight leading-tight">{track.title}</h3>
                           <p className="text-sm font-bold text-gray-500 mb-4">{track.artist}</p>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                               <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest">Share</p>
                               <p className="font-bold text-primary">{track.share || '100.00%'}</p>
                             </div>
                             <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                               <p className="text-[9px] uppercase font-black text-gray-600 tracking-widest">Value</p>
                               <p className="font-bold text-secondary">{track.value || '$0.00'}</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))
                   ) : (
                    <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-white/10">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Disc3 size={32} className="text-gray-700" />
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-widest text-gray-500">No Music IP Found</h3>
                      <p className="text-sm text-gray-600 max-w-xs mx-auto mt-2">
                        Be the first to tokenize your sound. Go to Creator Hub to get started.
                      </p>
                    </div>
                   )}
                </div>
            </section>
          </div>
        )}

        {view === 'admin' && <AdminDashboard account={account} onSuccess={fetchGlobalData} />}
        {view === 'user' && <UserDashboard account={account} />}
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 opacity-50"><Music /></div>
             <span className="font-black text-lg opacity-50 tracking-tighter">MELODIA.NETWORK</span>
          </div>
          <div className="flex gap-12 text-xs font-black uppercase tracking-widest text-gray-600">
             <a href="#" className="hover:text-primary">Twitter</a>
             <a href="#" className="hover:text-primary">GitHub</a>
             <a href="#" className="hover:text-primary">Discord</a>
             <a href="#" className="hover:text-primary">Docs</a>
          </div>
          <p className="text-xs font-bold text-gray-700">© 2026 DECENTRALIZED PROTOCOL</p>
        </div>
      </footer>
    </div>
  );
}
