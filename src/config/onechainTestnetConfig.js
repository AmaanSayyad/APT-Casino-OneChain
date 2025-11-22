/**
 * One Chain Testnet Configuration
 * Configuration for One Chain testnet with OCT token
 * One Chain is based on Sui technology
 */

// One Chain Testnet Chain Configuration
export const ONECHAIN_TESTNET_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID || '0', 10),
  name: 'One Chain Testnet',
  network: 'onechain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'One Chain Token',
    symbol: 'OCT',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_RPC || 'https://rpc-testnet.onelabs.cc:443',
      ],
    },
    public: {
      http: [
        'https://rpc-testnet.onelabs.cc:443',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'One Chain Testnet Explorer',
      url: process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_EXPLORER || 'https://explorer-testnet.onelabs.cc',
    },
  },
  testnet: true,
  faucetUrl: process.env.NEXT_PUBLIC_ONECHAIN_FAUCET_URL || 'https://faucet-testnet.onelabs.cc',
};

// One Chain Testnet Tokens
export const ONECHAIN_TESTNET_TOKENS = {
  OCT: {
    symbol: 'OCT',
    name: 'One Chain Token',
    decimals: parseInt(process.env.NEXT_PUBLIC_OCT_DECIMALS || '18', 10),
    address: 'native',
    isNative: true,
    icon: '⛓️',
    faucet: process.env.NEXT_PUBLIC_ONECHAIN_FAUCET_URL || 'https://faucet-testnet.onelabs.cc',
  }
};

// Casino configuration for One Chain
export const ONECHAIN_CASINO_CONFIG = {
  // Deposit/Withdraw settings
  minDeposit: '0.001', // 0.001 OCT
  maxDeposit: '100',   // 100 OCT
  minWithdraw: '0.001', // 0.001 OCT
  maxWithdraw: '100',   // 100 OCT
  
  // Game settings
  games: {
    MINES: {
      minBet: '0.001',
      maxBet: '1.0',
      minMines: 1,
      maxMines: 24,
      defaultMines: 3,
      gridSize: 25
    },
    ROULETTE: {
      minBet: '0.001',
      maxBet: '1.0',
      houseEdge: 0.027
    },
    PLINKO: {
      minBet: '0.001',
      maxBet: '1.0',
      rows: [8, 12, 16],
      defaultRows: 12
    },
    WHEEL: {
      minBet: '0.001',
      maxBet: '1.0',
      segments: [2, 10, 20, 40, 50]
    }
  }
};

// Network switching helper for One Chain
export const switchToOneChainTestnet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found');
  }

  const chainIdHex = '0x' + ONECHAIN_TESTNET_CONFIG.chainId.toString(16);

  try {
    // Try to switch to One Chain Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: 'One Chain Testnet',
          nativeCurrency: {
            name: 'One Chain Token',
            symbol: 'OCT',
            decimals: 18,
          },
          rpcUrls: [ONECHAIN_TESTNET_CONFIG.rpcUrls.default.http[0]],
          blockExplorerUrls: [ONECHAIN_TESTNET_CONFIG.blockExplorers.default.url],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

// Export default configuration
export default ONECHAIN_TESTNET_CONFIG;
