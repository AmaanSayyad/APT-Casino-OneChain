"use client";

import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';

/**
 * One Chain Wallet Connection Button
 * Provides UI for connecting OneWallet and other Sui-compatible wallets
 */
export default function OneChainWalletButton() {

  return (
    <div className="flex items-center gap-3">
      <ConnectButton 
        className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !text-white !font-medium !px-6 !py-2 !rounded-lg hover:!from-purple-700 hover:!to-blue-700 !transition-all"
      />
    </div>
  );
}
