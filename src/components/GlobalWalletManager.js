"use client";
import React from 'react';
import { useOneChainWallet } from '@/hooks/useOneChainWallet';

/**
 * Global Wallet Manager
 * This component manages One Chain wallet connection state
 * Supports OneWallet and other Sui-compatible wallets
 */
export default function GlobalWalletManager() {
  const { isConnected, address, balance } = useOneChainWallet();
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔧 GlobalWalletManager state (One Chain):', {
      isConnected,
      address,
      balance: balance ? `${(parseFloat(balance) / 1e9).toFixed(4)} OCT` : '0 OCT'
    });
  }, [isConnected, address, balance]);
  
  // This component doesn't render anything, it just manages wallet state
  return null;
}
