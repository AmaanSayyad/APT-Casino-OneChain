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
        className="!bg-gradient-to-r !from-[#0066FF] !to-[#00A3FF] !text-white !font-medium !px-6 !py-2 !rounded-[30px] hover:!from-[#0066FF] hover:!to-[#00A3FF] hover:!shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] !transition-all"
      />
    </div>
  );
}
