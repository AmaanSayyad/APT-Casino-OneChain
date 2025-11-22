// Arbitrum Sepolia Treasury Configuration
// This file contains the Arbitrum Sepolia treasury wallet configuration for Pyth Entropy operations

export const ARBITRUM_TREASURY_CONFIG = {
  // Arbitrum Sepolia Treasury Wallet (for Pyth Entropy operations)
  ADDRESS: process.env.ARBITRUM_TREASURY_ADDRESS,
  
  // Private key must be provided via environment variable
  PRIVATE_KEY: process.env.ARBITRUM_TREASURY_PRIVATE_KEY,
  
  // Network configuration for Arbitrum Sepolia
  NETWORK: {
    CHAIN_ID: '0x66eee', // Arbitrum Sepolia (421614 in hex)
    CHAIN_NAME: 'Arbitrum Sepolia',
    RPC_URL: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc',
    EXPLORER_URL: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_EXPLORER || 'https://sepolia.arbiscan.io'
  },
  
  // Gas settings for Pyth Entropy transactions
  GAS: {
    ENTROPY_REQUEST_LIMIT: '0x7A120', // 500000 gas for entropy requests
    MAX_GAS_PRICE: '0x3B9ACA00', // 1 gwei
  },
  
  // Pyth Entropy specific configuration
  ENTROPY: {
    CONTRACT: process.env.NEXT_PUBLIC_PYTH_ENTROPY_ARBITRUM_SEPOLIA || '0x549Ebba8036Ab746611B4fFA1423eb0A4Df61440',
    PROVIDER: process.env.NEXT_PUBLIC_PYTH_ENTROPY_PROVIDER || '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_ENTROPY_TIMEOUT) || 30000,
    MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES) || 3,
    RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY) || 1000
  }
};

// Helper function to validate Arbitrum treasury address
export const isValidArbitrumTreasuryAddress = (address) => {
  return address && /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Helper function to validate Arbitrum treasury private key
export const isValidArbitrumTreasuryPrivateKey = (privateKey) => {
  return privateKey && /^0x[a-fA-F0-9]{64}$/.test(privateKey);
};

// Helper function to get Arbitrum treasury info
export const getArbitrumTreasuryInfo = () => {
  return {
    address: ARBITRUM_TREASURY_CONFIG.ADDRESS,
    network: ARBITRUM_TREASURY_CONFIG.NETWORK.CHAIN_NAME,
    chainId: ARBITRUM_TREASURY_CONFIG.NETWORK.CHAIN_ID,
    entropyContract: ARBITRUM_TREASURY_CONFIG.ENTROPY.CONTRACT
  };
};

// Validate configuration on load
if (!ARBITRUM_TREASURY_CONFIG.ADDRESS) {
  console.warn('⚠️ ARBITRUM_TREASURY_ADDRESS not set in environment variables');
}

if (!ARBITRUM_TREASURY_CONFIG.PRIVATE_KEY) {
  console.warn('⚠️ ARBITRUM_TREASURY_PRIVATE_KEY not set in environment variables');
}

if (ARBITRUM_TREASURY_CONFIG.ADDRESS && !isValidArbitrumTreasuryAddress(ARBITRUM_TREASURY_CONFIG.ADDRESS)) {
  console.error('❌ Invalid ARBITRUM_TREASURY_ADDRESS format');
}

if (ARBITRUM_TREASURY_CONFIG.PRIVATE_KEY && !isValidArbitrumTreasuryPrivateKey(ARBITRUM_TREASURY_CONFIG.PRIVATE_KEY)) {
  console.error('❌ Invalid ARBITRUM_TREASURY_PRIVATE_KEY format');
}
