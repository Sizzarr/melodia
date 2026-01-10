// Network configuration for Melodia
// Easy switch between Mantle Sepolia, Mainnet, etc.

// Change this to switch networks: 'mantleSepolia' | 'mantleMainnet' | 'mantleTestnet'
const ACTIVE_NETWORK = import.meta.env.VITE_NETWORK || 'mantleSepolia';

export const NETWORKS = {
  // Mantle Sepolia (Primary - Recommended for development)
  mantleSepolia: {
    chainId: 5003,
    chainIdHex: '0x138b',
    name: 'Mantle Sepolia Testnet',
    rpcUrl: import.meta.env.VITE_MANTLE_SEPOLIA_RPC || 'https://rpc.sepolia.mantle.xyz',
    blockExplorer: 'https://explorer.sepolia.mantle.xyz',
    currency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    faucet: 'https://faucet.sepolia.mantle.xyz',
  },
  // Mantle Testnet (Legacy)
  mantleTestnet: {
    chainId: 5001,
    chainIdHex: '0x1389',
    name: 'Mantle Testnet',
    rpcUrl: 'https://rpc.testnet.mantle.xyz',
    blockExplorer: 'https://explorer.testnet.mantle.xyz',
    currency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    faucet: 'https://faucet.testnet.mantle.xyz',
  },
  mantleMainnet: {
    chainId: 5000,
    chainIdHex: '0x1388',
    name: 'Mantle',
    rpcUrl: 'https://rpc.mantle.xyz',
    blockExplorer: 'https://explorer.mantle.xyz',
    currency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    faucet: null,
  },
  // Keep Sepolia for backward compatibility
  sepolia: {
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    blockExplorer: 'https://sepolia.etherscan.io',
    currency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    faucet: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
  },
};

// Get active network configuration
export const getActiveNetwork = () => NETWORKS[ACTIVE_NETWORK];

// Get network by chain ID
export const getNetworkByChainId = (chainId) => {
  const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
  return Object.values(NETWORKS).find((n) => n.chainId === chainIdNum);
};

// Check if current network is correct
export const isCorrectNetwork = (chainIdHex) => {
  return chainIdHex === getActiveNetwork().chainIdHex;
};

// Get network switch params for MetaMask
export const getSwitchNetworkParams = () => {
  const network = getActiveNetwork();
  return {
    chainId: network.chainIdHex,
  };
};

// Get network add params for MetaMask (if network doesn't exist)
export const getAddNetworkParams = () => {
  const network = getActiveNetwork();
  return {
    chainId: network.chainIdHex,
    chainName: network.name,
    nativeCurrency: network.currency,
    rpcUrls: [network.rpcUrl],
    blockExplorerUrls: [network.blockExplorer],
  };
};

export default NETWORKS;
