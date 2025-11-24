// Casino Treasury Configuration
// This file contains the treasury wallet address and related configuration

// One Chain Testnet Treasury Address
export const TREASURY_CONFIG = {
  // One Chain Testnet Treasury Wallet (for deposits/withdrawals)
  ADDRESS: process.env.NEXT_PUBLIC_ONECHAIN_TREASURY_ADDRESS || '0xaa85c365e2f28e483e63129120c1182c0e826bd8e0e0a0e8c7e8e8e8e8e8e8e8',
  
  // Network configuration for One Chain Testnet
  NETWORK: {
    CHAIN_ID: 'onechain-testnet',
    CHAIN_NAME: 'One Chain Testnet',
    RPC_URL: process.env.NEXT_PUBLIC_ONECHAIN_RPC || 'https://testnet.onechain.ai',
    EXPLORER_URL: process.env.NEXT_PUBLIC_ONECHAIN_EXPLORER || 'https://testnet.onechain.ai'
  },
  
  // Gas settings for Sui transactions (in MIST - 1 OCT = 1,000,000,000 MIST)
  GAS: {
    BUDGET: parseInt(process.env.GAS_BUDGET) || 10000000, // 0.01 OCT default gas budget
  },
  
  // Minimum and maximum deposit amounts (in OCT)
  LIMITS: {
    MIN_DEPOSIT: parseFloat(process.env.MIN_DEPOSIT) || 0.001, // 0.001 OCT minimum
    MAX_DEPOSIT: parseFloat(process.env.MAX_DEPOSIT) || 100, // 100 OCT maximum
  }
};

// Helper function to validate Sui treasury address
export const isValidTreasuryAddress = (address) => {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

// Helper function to get treasury info
export const getTreasuryInfo = () => {
  return {
    address: TREASURY_CONFIG.ADDRESS,
    network: TREASURY_CONFIG.NETWORK.CHAIN_NAME,
    chainId: TREASURY_CONFIG.NETWORK.CHAIN_ID,
    explorerUrl: TREASURY_CONFIG.NETWORK.EXPLORER_URL
  };
};
