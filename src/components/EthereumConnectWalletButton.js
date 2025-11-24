"use client";
import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';

export default function EthereumConnectWalletButton() {
  return (
    <div className="relative">
      <ConnectButton 
        connectText="Connect Wallet"
        className="bg-gradient-to-r from-red-magic to-blue-magic hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-semibold"
      />
    </div>
  );
} 