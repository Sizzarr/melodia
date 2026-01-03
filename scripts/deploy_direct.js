import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Hardhat's first default account
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  console.log("Deploying contracts with the account:", wallet.address);

  const startNonce = await provider.getTransactionCount(wallet.address);
  console.log("Current nonce:", startNonce);

  // Load artifacts
  const kycABI = JSON.parse(readFileSync(join(__dirname, "../artifacts/contracts_KYCRegistry_sol_KYCRegistry.abi"), "utf8"));
  const kycBin = readFileSync(join(__dirname, "../artifacts/contracts_KYCRegistry_sol_KYCRegistry.bin"), "utf8");

  const nftABI = JSON.parse(readFileSync(join(__dirname, "../artifacts/contracts_MusicIPNFT_sol_MusicIPNFT.abi"), "utf8"));
  const nftBin = readFileSync(join(__dirname, "../artifacts/contracts_MusicIPNFT_sol_MusicIPNFT.bin"), "utf8");

  // Deploy KYCRegistry
  console.log("Deploying KYCRegistry...");
  const KYCRegistryFactory = new ethers.ContractFactory(kycABI, kycBin, wallet);
  const kycRegistry = await KYCRegistryFactory.deploy({ nonce: startNonce });
  await kycRegistry.waitForDeployment();
  const kycAddress = await kycRegistry.getAddress();
  console.log("KYCRegistry deployed to:", kycAddress);

  // Deploy MusicIPNFT
  console.log("Deploying MusicIPNFT...");
  const MusicIPNFTFactory = new ethers.ContractFactory(nftABI, nftBin, wallet);
  const musicIPNFT = await MusicIPNFTFactory.deploy({ nonce: startNonce + 1 });
  await musicIPNFT.waitForDeployment();
  const nftAddress = await musicIPNFT.getAddress();
  console.log("MusicIPNFT deployed to:", nftAddress);

  console.log("\nUpdate your frontend/src/contracts/contracts.js with these addresses:");
  console.log(`export const KYC_REGISTRY_ADDRESS = "${kycAddress}";`);
  console.log(`export const MUSIC_IP_NFT_ADDRESS = "${nftAddress}";`);
  console.log(`export const MUSIC_IP_NFT_MASTER_ADDRESS = "${nftAddress}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
