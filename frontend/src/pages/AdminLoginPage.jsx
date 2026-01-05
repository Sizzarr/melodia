import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { CONTRACTS } from "../config/contracts";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkIfAlreadyConnected();
    }, []);

    async function checkIfAlreadyConnected() {
        if (typeof window.ethereum === "undefined") return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
            login(); // Auto-login if connected
        }
    }

    async function login() {
        if (typeof window.ethereum === "undefined") return toast.error("MetaMask not found");
        
        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // 1. Check Network/Contract Existence
            const nftContract = new ethers.Contract(CONTRACTS.musicIPNFT.address, CONTRACTS.musicIPNFT.abi, provider);
            let owner;
            try {
                owner = await nftContract.owner();
            } catch (err) {
                console.error("Contract Error:", err);
                toast.error("Error: Could not find Contract. Wrong Network?");
                return;
            }

            // 2. Check Ownership
            if (address.toLowerCase() === owner.toLowerCase()) {
                toast.success("Welcome, Admin!");
                navigate("/admin/dashboard");
            } else {
                console.warn(`User: ${address}, Owner: ${owner}`);
                toast.error(`Unauthorized! Owner is: ${owner.slice(0,6)}...`);
            }
        } catch (error) {
            console.error(error);
            if (error.code === "ACTION_REJECTED" || error.code === 4001) {
                toast.error("Connection cancelled");
            } else {
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function switchNetwork() {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }], // Sepolia
            });
            window.location.reload();
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0xaa36a7",
                                chainName: "Sepolia Testnet",
                                rpcUrls: ["https://rpc.sepolia.org"],
                                nativeCurrency: {
                                    name: "ETH",
                                    symbol: "ETH",
                                    decimals: 18,
                                },
                            },
                        ],
                    });
                } catch (addError) {
                    toast.error("Failed to add network");
                }
            } else {
                toast.error("Failed to switch network");
            }
        }
    }

    async function switchAccount() {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }],
            });
            // After permission is granted, we need to get the new accounts
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            // Auto login attempt after switch
            login();
        } catch (error) {
            console.error(error);
            toast.error("Failed to switch account");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                
                <div className="mb-6 text-left bg-black/50 p-4 rounded-lg text-sm space-y-2 border border-white/5">
                    <p className="text-gray-400">Status: <span className="text-white font-mono">
                        {loading ? "Verifying..." : "Waiting for Admin"}
                    </span></p>
                </div>

                <button 
                    onClick={login}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold w-full mb-3"
                >
                    {loading ? "Verifying..." : "Connect Owner Wallet"}
                </button>

                <div className="flex flex-col gap-2">
                    <button 
                        onClick={switchAccount}
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        Switch Wallet Account
                    </button>

                    <button 
                        onClick={switchNetwork}
                        className="text-sm text-gray-500 hover:text-gray-300 underline"
                    >
                        Switch to Localhost
                    </button>
                </div>
            </div>
        </div>
    );
}
