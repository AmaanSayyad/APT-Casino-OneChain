"use client";

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const useSmartAccount = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const isConnected = !!currentAccount;
  
  const [smartAccountInfo, setSmartAccountInfo] = useState(null);
  const [isSmartAccount, setIsSmartAccount] = useState(false);
  const [capabilities, setCapabilities] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSmartAccountInfo = async () => {
      if (!isConnected || !address) {
        setSmartAccountInfo(null);
        setIsSmartAccount(false);
        setCapabilities(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // For One Chain, all accounts are regular accounts (not smart contracts)
        const accountInfo = {
          address,
          type: 'One Chain Account',
          isSmartAccount: false,
          features: {}
        };
        setSmartAccountInfo(accountInfo);
        setIsSmartAccount(false);
        setCapabilities({ isSupported: false, capabilities: {}, provider: 'One Chain' });

        console.log('Account Info:', accountInfo);
      } catch (err) {
        console.error('Error loading account info:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSmartAccountInfo();
  }, [isConnected, address]);

  const enableSmartAccountFeatures = async () => {
    // Not applicable for One Chain accounts
    console.log('Smart account features not available on One Chain');
    return false;
  };

  const batchTransactions = async (transactions) => {
    // Sui has native batch transaction support through PTB (Programmable Transaction Blocks)
    throw new Error('Use Sui PTB (Programmable Transaction Blocks) for batch transactions');
  };

  return {
    // State
    smartAccountInfo,
    isSmartAccount,
    capabilities,
    isLoading,
    error,
    
    // Actions
    enableSmartAccountFeatures,
    batchTransactions,
    
    // Computed values
    hasSmartAccountSupport: !!capabilities?.isSupported,
    supportedFeatures: smartAccountInfo?.features || {},
  };
};