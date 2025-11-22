"use client";

import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { useOneChainWallet } from '@/hooks/useOneChainWallet';

/**
 * One Chain Wallet Connection Button
 * Provides UI for connecting OneWallet and other Sui-compatible wallets
 */
export default function OneChainWalletButton() {
  const { address, isConnected, balance, formatOCTAmount } = useOneChainWallet();

  return (
    <div className="flex items-center gap-3">
      {isConnected && balance && (
        <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-lg font-bold text-white">
            {formatOCTAmount(balance)} OCT
          </div>
        </div>
      )}
      
      <ConnectButton 
        className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !text-white !font-medium !px-6 !py-2 !rounded-lg hover:!from-purple-700 hover:!to-blue-700 !transition-all"
      />
    </div>
  );
}
