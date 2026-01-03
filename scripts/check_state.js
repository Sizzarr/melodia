import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import addresses from frontend or hardcode for now if easier, but let's try to match logic
const MUSIC_IP_NFT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; 

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  const nftABI = JSON.parse(readFileSync(join(__dirname, "../artifacts/contracts_MusicIPNFT_sol_MusicIPNFT.abi"), "utf8"));
  
  console.log("Checking state for MusicIPNFT at:", MUSIC_IP_NFT_ADDRESS);
  
  const nftContract = new ethers.Contract(MUSIC_IP_NFT_ADDRESS, nftABI, provider);
  
  try {
      const counter = await nftContract.tokenCounter();
      console.log("Token Counter:", counter.toString());
      
      if (Number(counter) === 0) {
          console.log("No songs registered yet.");
      } else {
          for (let i = 1; i <= Number(counter); i++) {
              const item = await nftContract.getMusicIP(i);
              console.log(`\nToken #${i}:`);
              console.log(" Title:", item.title);
              console.log(" Artist:", item.artist);
              console.log(" Creator:", item.creator);
              console.log(" RoyaltyContract:", item.royaltyContract);
          }
      }
  } catch (err) {
      console.error("Error fetching data:", err);
  }
}

main();
