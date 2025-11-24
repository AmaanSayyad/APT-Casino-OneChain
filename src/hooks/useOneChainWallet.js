/**
 * One Chain Wallet Hook
 * Provides wallet connection functionality for One Chain (Sui-based)
 * 
 * ARCHITECTURE:
 * - One Chain uses the same TypeScript SDK as Sui (@mysten/sui)
 * - Wallet Standard is identical to Sui's wallet standard
 * - PTB (Programmable Transaction Blocks) work the same way
 * - SerialTransactionExecutor and ParallelTransactionExecutor available
 * 
 * SUPPORTED WALLETS:
 * - Sui Wallet (official, works with One Chain)
 * - OneChain Wallet (if available, uses same standard)
 * - Any Sui-compatible wallet (Suiet, Ethos, etc.)
 * 
 * COIN TYPE:
 * - One Chain uses OCT as native token: 0x2::oct::OCT
 * - Gas payments use OCT coins
 * - SDK handles coin management, split/merge automatically
 * 
 * TRANSACTION FLOW:
 * 1. dApp creates PTB with Transaction class
 * 2. wallet.signAndExecuteTransaction({ transaction })
 * 3. Wallet handles gas selection and execution
 * 4. SDK manages coin operations automatically
 */

import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useDisconnectWallet, useConnectWallet } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useCallback, useEffect, useState } from 'react';

export function useOneChainWallet() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet();
  
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  // Get wallet address
  const address = currentAccount?.address;
  const isConnected = !!currentAccount;

  // Fetch OCT balance
  const fetchBalance = useCallback(async () => {
    if (!address || !suiClient) return;
    
    try {
      setIsLoading(true);
      
      // Try to get OCT balance (native token on One Chain)
      // Note: One Chain uses 0x2::oct::OCT as the native coin type
      try {
        const balanceData = await suiClient.getBalance({
          owner: address,
          coinType: '0x2::oct::OCT',
        });
        setBalance(balanceData.totalBalance);
      } catch (octError) {
        // Fallback: try SUI coin type (for compatibility)
        console.warn('OCT balance fetch failed, trying SUI fallback:', octError);
        const balanceData = await suiClient.getBalance({
          owner: address,
          coinType: '0x2::sui::SUI',
        });
        setBalance(balanceData.totalBalance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    } finally {
      setIsLoading(false);
    }
  }, [address, suiClient]);

  // Auto-fetch balance when connected
  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    } else {
      setBalance('0');
    }
  }, [isConnected, fetchBalance]);

  // Format OCT amount (18 decimals)
  const formatOCTAmount = useCallback((amount) => {
    const octAmount = parseFloat(amount) / 1e9; // Sui uses 9 decimals for native coin
    return octAmount.toFixed(4);
  }, []);

  // Parse OCT amount to smallest unit
  const parseOCTAmount = useCallback((amount) => {
    return Math.floor(parseFloat(amount) * 1e9).toString();
  }, []);

  // Sign and execute transaction
  const executeTransaction = useCallback(async (transaction, options = {}) => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction,
          chain: 'sui:testnet', // OneChain uses Sui testnet identifier
          ...options,
        },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            fetchBalance(); // Refresh balance after transaction
            resolve(result);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            reject(error);
          },
        }
      );
    });
  }, [signAndExecuteTransaction, fetchBalance]);

  // Connect wallet
  const connectWallet = useCallback(async (walletName) => {
    return new Promise((resolve, reject) => {
      connect(
        { wallet: walletName },
        {
          onSuccess: () => {
            console.log('Wallet connected successfully');
            resolve();
          },
          onError: (error) => {
            console.error('Wallet connection failed:', error);
            reject(error);
          },
        }
      );
    });
  }, [connect]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect();
    setBalance('0');
  }, [disconnect]);

  return {
    // Wallet state
    address,
    isConnected,
    balance,
    isLoading,
    
    // Wallet actions
    connect: connectWallet,
    disconnect: disconnectWallet,
    
    // Transaction
    executeTransaction,
    
    // Balance
    fetchBalance,
    formatOCTAmount,
    parseOCTAmount,
    
    // Sui client for advanced operations
    suiClient,
    
    // Account info
    account: currentAccount,
  };
}

export default useOneChainWallet;
