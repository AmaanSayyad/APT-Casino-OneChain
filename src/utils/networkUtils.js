// Network utilities for One Chain Testnet
import { onechainTestnet } from '@/config/chains';
import { ONECHAIN_TESTNET_CONFIG } from '@/config/onechainTestnetConfig';

// One Chain Testnet Configuration
export const ONECHAIN_NETWORK_CONFIG = {
  chainId: '0x' + (parseInt(process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID || '0', 10)).toString(16),
  chainName: 'One Chain Testnet',
  nativeCurrency: {
    name: 'One Chain Token',
    symbol: 'OCT',
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_RPC || 'https://rpc-testnet.onelabs.cc:443'],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_EXPLORER || 'https://explorer-testnet.onelabs.cc'],
};

// Legacy Monad Testnet Configuration (kept for reference)
export const MONAD_TESTNET_CONFIG = {
  chainId: '0x279f', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

export const switchToOneChainTestnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to One Chain Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ONECHAIN_NETWORK_CONFIG.chainId }],
    });
  } catch (switchError) {
    // If the chain is not added, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ONECHAIN_NETWORK_CONFIG],
        });
      } catch (addError) {
        throw new Error('Failed to add One Chain Testnet to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to One Chain Testnet');
    }
  }
};

// Legacy function (kept for backward compatibility)
export const switchToMonadTestnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MONAD_TESTNET_CONFIG],
        });
      } catch (addError) {
        throw new Error('Failed to add Monad Testnet to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Monad Testnet');
    }
  }
};

export const isOneChainTestnet = (chainId) => {
  const onechainChainId = parseInt(process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID || '0', 10);
  return chainId === onechainChainId || chainId === ONECHAIN_NETWORK_CONFIG.chainId;
};

export const isMonadTestnet = (chainId) => {
  return chainId === 10143 || chainId === '0x279f';
};

export const formatOCTBalance = (balance, decimals = 5) => {
  const numBalance = parseFloat(balance || '0');
  return `${numBalance.toFixed(decimals)} OCT`;
};

export const formatMonBalance = (balance, decimals = 5) => {
  const numBalance = parseFloat(balance || '0');
  return `${numBalance.toFixed(decimals)} MON`;
};

export const getOneChainTestnetExplorerUrl = (txHash) => {
  return `${process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_EXPLORER || 'https://explorer-testnet.onelabs.cc'}/tx/${txHash}`;
};

export const getMonadTestnetExplorerUrl = (txHash) => {
  return `https://testnet.monadexplorer.com/tx/${txHash}`;
};