"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import oneChainClientService from '../services/OneChainClientService.js';

/**
 * useOneChainCasino Hook
 * React hook for One Chain casino operations
 * Integrates with OneChainClientService for blockchain interactions
 */
export const useOneChainCasino = () => {
  const { address: account, isConnected: connected } = useAccount();
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
   */
  const updateBalance = useCallback(async () => {
    if (!account) return;
    
    try {
      setLoading(true);
      const balanceWei = await getAccountBalance(account);
      const formattedBalance = formatOCTAmount(balanceWei);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
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
   * @param {string} betType - Type of bet (straight, split, etc.)
   * @param {number} betValue - Value being bet on
   * @param {string} amount - Bet amount in OCT
   * @param {number[]} numbers - Array of numbers for the bet
   * @param {string} entropyValue - Random value from Pyth Entropy
   * @returns {Promise<string>} Transaction hash
   */
  const placeRouletteBet = useCallback(async (betType, betValue, amount, numbers = [], entropyValue) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(amount);

      // Create game data for logging
      const gameData = {
        gameType: 'ROULETTE',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: '0', // Will be updated after game result
        gameConfig: {
          betType,
          betValue,
          numbers
        },
        resultData: {},
        entropyValue: entropyValue || '',
        entropyTxHash: '', // Will be populated if available
        timestamp: Date.now()
      };

      // Log game result to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('Roulette bet failed:', error);
      setError(error.message);
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
   * @returns {Promise<string>} Transaction hash (game ID)
   */
  const startMinesGame = useCallback(async (betAmount, minesCount, entropyValue) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);

      // Create game data for logging
      const gameData = {
        gameType: 'MINES',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: '0',
        gameConfig: {
          minesCount,
          gridSize: 25
        },
        resultData: {
          status: 'started',
          revealedTiles: []
        },
        entropyValue: entropyValue || '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      // Log game start to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('Mines game start failed:', error);
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
   * @returns {Promise<string>} Transaction hash
   */
  const revealMinesTile = useCallback(async (gameId, tileIndex) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Create game data for tile reveal
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
          status: 'revealed'
        },
        entropyValue: '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      // Log tile reveal to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      return txHash;
    } catch (error) {
      console.error('Mines tile reveal failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [connected, account]);

  /**
   * Cashout from mines game
   * @param {string} gameId - Game ID (transaction hash)
   * @returns {Promise<string>} Transaction hash
   */
  const cashoutMinesGame = useCallback(async (gameId) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Create game data for cashout
      const gameData = {
        gameType: 'MINES',
        playerAddress: account,
        betAmount: '0',
        payoutAmount: '0', // Will be calculated based on revealed tiles
        gameConfig: {
          gameId,
          action: 'cashout'
        },
        resultData: {
          status: 'completed'
        },
        entropyValue: '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      // Log cashout to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      // Update balance after cashout
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('Mines cashout failed:', error);
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
   * @returns {Promise<string>} Transaction hash
   */
  const playPlinko = useCallback(async (betAmount, rows, entropyValue) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);

      // Create game data for plinko
      const gameData = {
        gameType: 'PLINKO',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: '0',
        gameConfig: {
          rows
        },
        resultData: {},
        entropyValue: entropyValue || '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      // Log plinko game to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('Plinko game failed:', error);
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
   * @returns {Promise<string>} Transaction hash
   */
  const spinWheel = useCallback(async (betAmount, segments, entropyValue) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const betAmountWei = parseOCTAmount(betAmount);

      // Create game data for wheel
      const gameData = {
        gameType: 'WHEEL',
        playerAddress: account,
        betAmount: betAmountWei,
        payoutAmount: '0',
        gameConfig: {
          segments
        },
        resultData: {},
        entropyValue: entropyValue || '',
        entropyTxHash: '',
        timestamp: Date.now()
      };

      // Log wheel spin to One Chain
      const txHash = await oneChainClientService.logGameResult(gameData);
      
      // Wait for transaction confirmation
      await oneChainClientService.waitForTransaction(txHash);
      
      // Update balance after transaction
      await updateBalance();
      
      return txHash;
    } catch (error) {
      console.error('Wheel spin failed:', error);
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
