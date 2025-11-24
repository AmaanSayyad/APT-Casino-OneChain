"use client";

import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

const SmartAccountInfo = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const isConnected = !!currentAccount;
  const [smartAccountInfo, setSmartAccountInfo] = useState(null);
  const [isSmartAccount, setIsSmartAccount] = useState(false);

  useEffect(() => {
    const checkSmartAccount = async () => {
      if (!isConnected || !address) return;

      try {
        // For Sui/One Chain, all accounts are regular accounts (not smart contracts)
        setIsSmartAccount(false);
        setSmartAccountInfo({
          address,
          type: 'Sui Account',
          hasCode: false
        });
      } catch (error) {
        console.error('Error checking account:', error);
      }
    };

    checkSmartAccount();
  }, [isConnected, address]);

  if (!isConnected || !smartAccountInfo) return null;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Address:</span>
          <span className="text-white font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className={`font-medium ${isSmartAccount ? 'text-blue-400' : 'text-green-400'}`}>
            {smartAccountInfo.type}
          </span>
        </div>
        {isSmartAccount && (
          <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-300 text-xs">Smart Account Features Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartAccountInfo;