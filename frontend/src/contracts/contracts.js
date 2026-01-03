import MusicRoyaltyABI from "../../../artifacts/contracts_MusicRoyalty_sol_MusicRoyalty.abi?raw";
import MusicIPNFTABI from "../../../artifacts/contracts_MusicIPNFT_sol_MusicIPNFT.abi?raw";
import KYCRegistryABI from "../../../artifacts/contracts_KYCRegistry_sol_KYCRegistry.abi?raw";
import MusicRoyaltyBytecode from "../../../artifacts/contracts_MusicRoyalty_sol_MusicRoyalty.bin?raw";

export const MUSIC_IP_NFT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; 
export const KYC_REGISTRY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const MUSIC_IP_NFT_MASTER_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // The one-time deploy address

export const KYC_REGISTRY_JSON = JSON.parse(KYCRegistryABI);
export const MUSIC_IP_NFT_JSON = JSON.parse(MusicIPNFTABI);
export const MUSIC_ROYALTY_JSON = JSON.parse(MusicRoyaltyABI);
export const MUSIC_ROYALTY_BYTECODE = MusicRoyaltyBytecode;

// Legacy support if needed, but JSON is preferred
export const KYC_REGISTRY_ABI = KYC_REGISTRY_JSON;
export const MUSIC_IP_NFT_ABI = MUSIC_IP_NFT_JSON;
export const MUSIC_ROYALTY_ABI = MUSIC_ROYALTY_JSON;
