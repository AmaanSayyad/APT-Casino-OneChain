"use client";
import { useEffect, useRef } from 'react';
import { useCurrentAccount, useAutoConnectWallet } from '@mysten/dapp-kit';

/**
 * Global Wallet Persistence Hook
 * Works across all pages and components
 * Updated for Sui/One Chain wallet integration
 */
export const useGlobalWalletPersistence = () => {
  const currentAccount = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const reconnectAttempted = useRef(false);

  // Log wallet connection status
  useEffect(() => {
    console.log('🌐 Sui wallet status:', {
      isConnected: !!currentAccount,
      address: currentAccount?.address,
      autoConnectionStatus
    });
  }, [currentAccount, autoConnectionStatus]);

  // Only show reconnecting during the initial idle state, not after connection
  const isReconnecting = autoConnectionStatus === 'idle' && !currentAccount;

  return {
    isConnected: !!currentAccount,
    address: currentAccount?.address,
    isReconnecting
  };
};
