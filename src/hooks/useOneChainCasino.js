"use client";
import { useState, useEffect, useCallback } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import oneChainClientService from '../services/OneChainClientService.js';
import {
  ServiceError,
  ErrorType,
  getUserFriendlyMessage,
  executeIndependently
} from '../utils/errorHandling.js';

/**
 * useOneChainCasino Hook
 * React hook for One Chain casino operations
 * Integrates with OneChainClientService for blockchain interactions
 * Ensures service independence between One Chain and Arbitrum Sepolia
 */
export const useOneChainCasino = () => {
  const currentAccount = useCurrentAccount();
  const account = currentAccount?.address;
  const connected = !!currentAccount;
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update balance when wallet connects
  useEffect(() => {
    if (connected && account) {
      updateBalance();
    } else {
      setBalance('0');
    }
  }, [connected, account]);

  /**
   * Update balance from One Chain
   * Errors here don't affect other services
   */
  const updateBalance = useCallback(async () => {
    if (!account) return;
    
    try {
      setLoading(true);
      setError(null);
      const balanceWei = await getAccountBalance(account);
      const formattedBalance = formatOCTAmount(balanceWei);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      const userMessage = getUserFriendlyMessage(error, 'Balance Update');
      setError(userMessage);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, [account]);

  /**
   * Get account balance from One Chain
   * @param {string} address - Account address
   * @returns {Promise<string>} Balance in wei
   */
  const getAccountBalance = async (address) => {
    try {
      const balance = await oneChainClientService.getBalance(address);
      return balance;
    } catch (error) {
      console.error("Error getting account balance:", error);
      return "0";
    }
  };

  /**
   * Place a roulette bet on One Chain
   * Errors in One Chain don't affect Arbitrum Sepolia entropy service
   * @param {string} betType - Type of bet (straight, split, etc.)
   * @param {number} betValue - Value being bet on
   * @param {string} amount - Bet amount in OCT
   * @param {number[]} numbers - Array of numbers for the bet
   * @param {string} entropyValue - Random value from Pyth Entropy
   * @param {string} entropyTxHash - Arbitrum Sepolia entropy transaction hash
   * @param {Object} resultData - Game result data (number, color, isWin, etc.)
   * @param {string} payoutAmount - Payout amount in OCT (if game completed)
   * @returns {Promise<string>} Transaction hash
   */
  const placeRouletteBet = useCallback(async (betType, betValue, amount, numbers = [], entropyValue, entropyTxHash = '', resultData = {}, payoutAmount = '0') => {
    if (!connected || !account) {
      const error = new ServiceError(
        'Wallet not connected',
        ErrorType.CONNECTION,
        'HIGH'
      );
      setError(getUserFriendlyMessage(error));
      throw error;
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(amount);
      const payoutAmountWei = parseOCTAmount(payoutAmount);

      // Create game data for logging with all required fields
      const gameData = {
        gameType: 'ROULETTE',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: payoutAmountWei,
        gameConfig: {
          betType,
          betValue,
          numbers,
          wheelType: 'european'
        },
        resultData: {
          ...resultData,
          timestamp: Date.now()
        },
        entropyValue: entropyValue || '',
        entropyTxHash: entropyTxHash || '',
        timestamp: Date.now()
      };

      console.log('🎰 ONE CHAIN: Logging roulette game result...', gameData);

      // Log game result to One Chain
      // This operation is isolated - errors here don't affect entropy service
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Roulette game logged successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      // Update balance after transaction (independent operation)
      // Balance update failure doesn't fail the game
      updateBalance().catch(err => {
        console.warn('⚠️ Balance update failed after game:', err);
      });
      
      return txHash;
    } catch (error) {
      console.error('❌ Roulette bet failed:', error);
      const userMessage = getUserFriendlyMessage(error, 'Roulette Bet');
      setError(userMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account, updateBalance]);

  /**
   * Get roulette game state
   * @returns {Promise<Object>} Game state
   */
  const getRouletteGameState = useCallback(async () => {
    try {
      // Query game state from One Chain
      // For now, return a default state
      return {
        isActive: false,
        currentRound: 1,
        lastResult: null
      };
    } catch (error) {
      console.error('Error getting roulette game state:', error);
      return null;
    }
  }, []);

  /**
   * Start a mines game on One Chain
   * @param {string} betAmount - Bet amount in OCT
   * @param {number} minesCount - Number of mines
   * @param {string} entropyValue - Random value from Pyth Entropy
   * @param {string} entropyTxHash - Arbitrum Sepolia entropy transaction hash
   * @returns {Promise<string>} Transaction hash (game ID)
   */
  const startMinesGame = useCallback(async (betAmount, minesCount, entropyValue, entropyTxHash = '') => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);

      // Create game data for logging with all required fields
      const gameData = {
        gameType: 'MINES',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: '0',
        gameConfig: {
          minesCount,
          gridSize: 25,
          action: 'start'
        },
        resultData: {
          status: 'started',
          revealedTiles: [],
          minePositions: [], // Will be generated from entropy
          timestamp: Date.now()
        },
        entropyValue: entropyValue || '',
        entropyTxHash: entropyTxHash || '',
        timestamp: Date.now()
      };

      console.log('💣 ONE CHAIN: Logging mines game start...', gameData);

      // Log game start to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Mines game started successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('❌ Mines game start failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account, updateBalance]);

  /**
   * Reveal a tile in mines game
   * @param {string} gameId - Game ID (transaction hash)
   * @param {number} tileIndex - Index of tile to reveal
   * @param {boolean} isMine - Whether the revealed tile is a mine
   * @param {number} currentMultiplier - Current multiplier after reveal
   * @returns {Promise<string>} Transaction hash
   */
  const revealMinesTile = useCallback(async (gameId, tileIndex, isMine = false, currentMultiplier = 1.0) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Create game data for tile reveal with all required fields
      const gameData = {
        gameType: 'MINES',
        playerAddress: account,
        betAmount: '0', // No additional bet
        payoutAmount: '0',
        gameConfig: {
          gameId,
          action: 'reveal'
        },
        resultData: {
          tileIndex,
          isMine,
          currentMultiplier,
          status: isMine ? 'lost' : 'revealed',
          timestamp: Date.now()
        },
        entropyValue: '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      console.log('💣 ONE CHAIN: Logging mines tile reveal...', gameData);

      // Log tile reveal to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Mines tile reveal logged successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      return txHash;
    } catch (error) {
      console.error('❌ Mines tile reveal failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account]);

  /**
   * Cashout from mines game
   * @param {string} gameId - Game ID (transaction hash)
   * @param {string} payoutAmount - Payout amount in OCT
   * @param {number} finalMultiplier - Final multiplier achieved
   * @param {number} tilesRevealed - Number of tiles revealed
   * @returns {Promise<string>} Transaction hash
   */
  const cashoutMinesGame = useCallback(async (gameId, payoutAmount, finalMultiplier = 1.0, tilesRevealed = 0) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const payoutAmountWei = parseOCTAmount(payoutAmount);

      // Create game data for cashout with all required fields
      const gameData = {
        gameType: 'MINES',
        playerAddress: account,
        betAmount: '0',
        payoutAmount: payoutAmountWei,
        gameConfig: {
          gameId,
          action: 'cashout'
        },
        resultData: {
          status: 'completed',
          finalMultiplier,
          tilesRevealed,
          isWin: true,
          timestamp: Date.now()
        },
        entropyValue: '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      console.log('💣 ONE CHAIN: Logging mines cashout...', gameData);

      // Log cashout to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Mines cashout logged successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      // Update balance after cashout
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('❌ Mines cashout failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account, updateBalance]);

  /**
   * Play plinko game on One Chain
   * @param {string} betAmount - Bet amount in OCT
   * @param {number} rows - Number of rows (8, 12, or 16)
   * @param {string} entropyValue - Random value from Pyth Entropy
   * @param {string} entropyTxHash - Arbitrum Sepolia entropy transaction hash
   * @param {Object} resultData - Game result data (path, landingSlot, multiplier, etc.)
   * @param {string} payoutAmount - Payout amount in OCT
   * @returns {Promise<string>} Transaction hash
   */
  const playPlinko = useCallback(async (betAmount, rows, entropyValue, entropyTxHash = '', resultData = {}, payoutAmount = '0') => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);
      const payoutAmountWei = parseOCTAmount(payoutAmount);

      // Create game data for plinko with all required fields
      const gameData = {
        gameType: 'PLINKO',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: payoutAmountWei,
        gameConfig: {
          rows,
          risk: resultData.risk || 'medium'
        },
        resultData: {
          ...resultData,
          timestamp: Date.now()
        },
        entropyValue: entropyValue || '',
        entropyTxHash: entropyTxHash || '',
        timestamp: Date.now()
      };

      console.log('🎯 ONE CHAIN: Logging plinko game result...', gameData);

      // Log plinko game to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Plinko game logged successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('❌ Plinko game failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account, updateBalance]);

  /**
   * Get plinko game state
   * @returns {Promise<Object>} Game state
   */
  const getPlinkoGameState = useCallback(async () => {
    try {
      // Query game state from One Chain
      // For now, return a default state
      return {
        isActive: false,
        lastResult: null
      };
    } catch (error) {
      console.error('Error getting plinko game state:', error);
      return null;
    }
  }, []);

  /**
   * Spin wheel game on One Chain
   * @param {string} betAmount - Bet amount in OCT
   * @param {number} segments - Number of segments
   * @param {string} entropyValue - Random value from Pyth Entropy
   * @param {string} entropyTxHash - Arbitrum Sepolia entropy transaction hash
   * @param {Object} resultData - Game result data (segment, multiplier, isWin, etc.)
   * @param {string} payoutAmount - Payout amount in OCT
   * @returns {Promise<string>} Transaction hash
   */
  const spinWheel = useCallback(async (betAmount, segments, entropyValue, entropyTxHash = '', resultData = {}, payoutAmount = '0') => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);
      const payoutAmountWei = parseOCTAmount(payoutAmount);

      // Create game data for wheel with all required fields
      const gameData = {
        gameType: 'WHEEL',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: payoutAmountWei,
        gameConfig: {
          segments,
          risk: resultData.risk || 'medium'
        },
        resultData: {
          ...resultData,
          timestamp: Date.now()
        },
        entropyValue: entropyValue || '',
        entropyTxHash: entropyTxHash || '',
        timestamp: Date.now()
      };

      console.log('🎡 ONE CHAIN: Logging wheel spin result...', gameData);

      // Log wheel spin to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      console.log('⏳ ONE CHAIN: Waiting for transaction confirmation...');
      
      // Wait for transaction confirmation before marking game complete
      const receipt = await oneChainClientService.waitForTransaction(txHash);
      
      console.log('✅ ONE CHAIN: Wheel spin logged successfully');
      console.log('📋 Transaction receipt:', receipt);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('❌ Wheel spin failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account, updateBalance]);

  /**
   * Get game history from One Chain
   * @param {string} gameType - Type of game (ROULETTE, MINES, PLINKO, WHEEL)
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Array of game results
   */
  const getGameHistory = useCallback(async (gameType, limit = 10) => {
    if (!account) {
      return [];
    }

    try {
      // Query game history from One Chain
      const history = await oneChainClientService.queryGameHistory(account, limit);
      
      // Filter by game type if specified
      if (gameType) {
        return history.filter(game => game.gameType === gameType);
      }
      
      return history;
    } catch (error) {
      console.error('Error getting game history:', error);
      return [];
    }
  }, [account]);

  /**
   * Format OCT amount from wei to human-readable format
   * @param {string|number} amountWei - Amount in wei
   * @param {number} decimals - Number of decimal places (default: 4)
   * @returns {string} Formatted amount
   */
  const formatOCTAmount = useCallback((amountWei, decimals = 4) => {
    return oneChainClientService.formatOCTAmount(amountWei, decimals);
  }, []);

  /**
   * Parse OCT amount from human-readable format to wei
   * @param {string|number} amount - Amount in OCT
   * @returns {string} Amount in wei
   */
  const parseOCTAmount = useCallback((amount) => {
    return oneChainClientService.parseOCTAmount(amount);
  }, []);

  return {
    // State
    balance,
    loading,
    error,
    connected,
    account,
    
    // Balance operations
    updateBalance,
    getAccountBalance,
    
    // Roulette operations
    placeRouletteBet,
    getRouletteGameState,
    
    // Mines operations
    startMinesGame,
    revealMinesTile,
    cashoutMinesGame,
    
    // Plinko operations
    playPlinko,
    getPlinkoGameState,
    
    // Wheel operations
    spinWheel,
    
    // Game history operations
    getGameHistory,
    
    // Utility functions
    formatOCTAmount,
    parseOCTAmount,
  };
};
