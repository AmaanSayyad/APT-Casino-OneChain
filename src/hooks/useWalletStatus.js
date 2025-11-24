'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useCurrentAccount, useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit';

const WalletStatusContext = createContext(null);

export function WalletStatusProvider({ children }) {
  // Always use real wallet - no dev wallet
  const isDev = false;

  // Use Sui wallet hooks instead of Wagmi
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  const [devWallet, setDevWallet] = useState({
    isConnected: false,
    address: null,
    chain: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isDev) return;

    const savedState = localStorage.getItem('dev-wallet-state');
    if (savedState === 'connected') {
      setDevWallet({
        isConnected: true,
        address: '0x1234...dev',
        chain: { id: 'arbitrum_testnet', name: 'Arbitrum Sepolia' },
      });
    }

    const handleToggle = () => {
      setDevWallet((prev) => {
        const newState = !prev.isConnected;
        localStorage.setItem(
          'dev-wallet-state',
          newState ? 'connected' : 'disconnected'
        );

        return newState
          ? {
            isConnected: true,
            address: '0x1234...dev',
            chain: { id: 'arbitrum_testnet', name: 'Arbitrum Sepolia' },
          }
          : {
            isConnected: false,
            address: null,
            chain: null,
          };
      });
    };

    window.addEventListener('dev-wallet-toggle', handleToggle);
    return () => {
      window.removeEventListener('dev-wallet-toggle', handleToggle);
    };
  }, [isDev]);

  const connectWallet = useCallback(async () => {
    if (isDev) {
      localStorage.setItem('dev-wallet-state', 'connected');
      setDevWallet({
        isConnected: true,
        address: '0x1234...dev',
        chain: { id: 'onechain-testnet', name: 'One Chain Testnet' },
      });
      return;
    }

    try {
      // Sui wallet will show connection modal automatically
      connect(
        { wallet: undefined }, // Let user choose wallet
        {
          onSuccess: () => console.log('Wallet connected successfully'),
          onError: (err) => setError('Failed to connect wallet: ' + err.message)
        }
      );
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  }, [connect, isDev]);

  const disconnectWallet = useCallback(async () => {
    if (isDev) {
      localStorage.setItem('dev-wallet-state', 'disconnected');
      setDevWallet({
        isConnected: false,
        address: null,
        chain: null,
      });
      return;
    }

    try {
      await disconnect();
    } catch (err) {
      setError('Failed to disconnect wallet: ' + err.message);
    }
  }, [disconnect, isDev]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const currentStatus = {
    isConnected: !!currentAccount,
    address: currentAccount?.address,
    chain: { id: 'onechain-testnet', name: 'One Chain Testnet' },
  };

  // Debug currentStatus calculation
  console.log('🔍 currentStatus calculation:', {
    currentAccount,
    address: currentAccount?.address,
    finalIsConnected: !!currentAccount
  });

  useEffect(() => {
    console.log('🔌 Wallet connection changed:');
    console.log('=== CURRENT STATUS ===');
    console.log('Connected:', currentStatus.isConnected);
    console.log('Address:', currentStatus.address);
    console.log('Chain:', currentStatus.chain);
    console.log('=== RAW SUI VALUES ===');
    console.log('Current account:', currentAccount);
    console.log('=== ENVIRONMENT ===');
    console.log('Is Dev:', isDev);
    console.log('Dev Wallet:', devWallet);
  }, [currentStatus, currentAccount, isDev, devWallet]);

  return (
    <WalletStatusContext.Provider
      value={{
        ...currentStatus,
        isDev,
        connectWallet,
        disconnectWallet,
        resetError,
        error,
      }}
    >
      {children}
    </WalletStatusContext.Provider>
  );
}

export default function useWalletStatus() {
  const context = useContext(WalletStatusContext);
  if (!context) {
    throw new Error('useWalletStatus must be used within a WalletStatusProvider');
  }
  return context;
}
