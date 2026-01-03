import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MUSIC_IP_NFT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; 
const KYC_REGISTRY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  const nftABI = JSON.parse(readFileSync(join(__dirname, "../artifacts/contracts_MusicIPNFT_sol_MusicIPNFT.abi"), "utf8"));
  const royaltyABI = JSON.parse(readFileSync(join(__dirname, "../artifacts/contracts_MusicRoyalty_sol_MusicRoyalty.abi"), "utf8"));
  const royaltyBin = readFileSync(join(__dirname, "../artifacts/contracts_MusicRoyalty_sol_MusicRoyalty.bin"), "utf8");

  console.log("Simulating publish flow...");

  // 1. Deploy Royalty
  console.log("Deploying Royalty...");
  const RoyaltyFactory = new ethers.ContractFactory(royaltyABI, royaltyBin, wallet);
  const royalty = await RoyaltyFactory.deploy(
      "Test Song Royalty",
      "TSR",
      KYC_REGISTRY_ADDRESS,
      "Test Song",
      "Test Artist",
      ethers.parseEther("1"),
      1000
  );
  await royalty.waitForDeployment();
  const royaltyAddress = await royalty.getAddress();
  console.log("Royalty deployed at:", royaltyAddress);

  // 2. Mint NFT
  console.log("Minting NFT...");
  
  // Refresh nonce
  const currentNonce = await provider.getTransactionCount(wallet.address);
  console.log("Using nonce:", currentNonce);
  
  const nftContract = new ethers.Contract(MUSIC_IP_NFT_ADDRESS, nftABI, wallet);
  const tx = await nftContract.mintMusicIP(
      wallet.address,
      "Test Song",
      "Test Artist",
      "ipfs://test",
      royaltyAddress,
      { nonce: currentNonce }
  );
  await tx.wait();
  console.log("NFT Minted!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
