/**
 * ROYALTY DISTRIBUTION SCRIPT (Langkah 4)
 * Run this script when you want to distribute stablecoins to token holders.
 */

const { ethers } = require("ethers");

// Configuration
const RPC_URL = "https://..."; 
const ADMIN_PRIVATE_KEY = "0x...";
const ROYALTY_TOKEN_ADDRESS = "0x..."; 
const STABLECOIN_ADDRESS = "0x..."; // USDT/USDC

const ROYALTY_ABI = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const ERC20_ABI = [
  "function transfer(address to, uint256 value) returns (bool)"
];

async function distribute(totalAmount) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const admin = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
  
  const royaltyToken = new ethers.Contract(ROYALTY_TOKEN_ADDRESS, ROYALTY_ABI, provider);
  const stablecoin = new ethers.Contract(STABLECOIN_ADDRESS, ERC20_ABI, admin);

  const totalSupply = await royaltyToken.totalSupply();
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} tokens`);

  // In a real scenario, you'd fetch holders via indexer (The Graph) or event logs.
  // Here we assume a list of holders.
  const holders = ["0xHolder1...", "0xHolder2..."]; 

  for (const holder of holders) {
    const balance = await royaltyToken.balanceOf(holder);
    if (balance > 0n) {
      const share = (balance * BigInt(totalAmount)) / totalSupply;
      console.log(`Sending ${ethers.formatUnits(share, 6)} stablecoins to ${holder}`);
      
      // const tx = await stablecoin.transfer(holder, share);
      // await tx.wait();
    }
  }
  
  console.log("Distribution complete!");
}

// distribute(1000000000); // Distribute 1000 USDT (6 decimals)
