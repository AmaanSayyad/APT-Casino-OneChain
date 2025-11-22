/**
 * One Chain Client Service
 * Handles blockchain interactions with One Chain testnet
 * One Chain is based on Sui technology
 */

import { ONECHAIN_TESTNET_CONFIG, ONECHAIN_TESTNET_TOKENS } from '../config/onechainTestnetConfig.js';

class OneChainClientService {
  constructor(config = ONECHAIN_TESTNET_CONFIG) {
    this.config = config;
    this.rpcUrl = config.rpcUrls.default.http[0];
    this.chainId = config.chainId;
    this.isConnected = false;
    this.provider = null;
    this.currentAddress = null;
    
    console.log('🔗 ONE CHAIN: Initializing client service...');
    console.log(`🌐 Network: ${config.name}`);
    console.log(`🔗 RPC URL: ${this.rpcUrl}`);
  }

  /**
   * Connect to One Chain network
   * @returns {Promise<boolean>} Connection success status
   */
  async connect() {
    try {
      console.log('🔗 ONE CHAIN: Connecting to network...');
      
      // Test connection by making a simple RPC call
      const response = await this._makeRpcCall('sui_getChainIdentifier', []);
      
      if (response) {
        this.isConnected = true;
        console.log('✅ ONE CHAIN: Connected successfully');
        console.log(`🆔 Chain Identifier: ${response}`);
        return true;
      }
      
      throw new Error('Failed to get chain identifier');
    } catch (error) {
      console.error('❌ ONE CHAIN: Connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from One Chain network
   */
  disconnect() {
    console.log('🔌 ONE CHAIN: Disconnecting...');
    this.isConnected = false;
    this.currentAddress = null;
    this.provider = null;
    console.log('✅ ONE CHAIN: Disconnected');
  }

  /**
   * Check if connected to One Chain
   * @returns {boolean} Connection status
   */
  isConnectedToNetwork() {
    return this.isConnected;
  }

  /**
   * Get OCT balance for an address
   * @param {string} address - One Chain address
   * @returns {Promise<string>} Balance in wei (smallest unit)
   */
  async getBalance(address) {
    try {
      console.log(`💰 ONE CHAIN: Getting balance for ${address}...`);
      
      if (!address) {
        throw new Error('Address is required');
      }

      // Get all coin objects owned by the address
      const coins = await this._makeRpcCall('suix_getCoins', [
        address,
        '0x2::oct::OCT', // OCT coin type
        null, // cursor
        null  // limit
      ]);

      if (!coins || !coins.data) {
        console.log('💰 ONE CHAIN: No coins found, balance is 0');
        return '0';
      }

      // Sum up all coin balances
      let totalBalance = BigInt(0);
      for (const coin of coins.data) {
        totalBalance += BigInt(coin.balance);
      }

      const balanceStr = totalBalance.toString();
      console.log(`✅ ONE CHAIN: Balance retrieved: ${balanceStr} wei`);
      
      return balanceStr;
    } catch (error) {
      console.error('❌ ONE CHAIN: Error getting balance:', error);
      
      // Return 0 for account not found or other errors
      if (error.message && error.message.includes('not found')) {
        return '0';
      }
      
      throw error;
    }
  }

  /**
   * Get all objects owned by an address
   * @param {string} address - One Chain address
   * @param {Object} options - Query options (filter, cursor, limit)
   * @returns {Promise<Array>} Array of owned objects
   */
  async getObjects(address, options = {}) {
    try {
      console.log(`📦 ONE CHAIN: Getting objects for ${address}...`);
      
      if (!address) {
        throw new Error('Address is required');
      }

      const { filter = null, cursor = null, limit = 50 } = options;

      const result = await this._makeRpcCall('suix_getOwnedObjects', [
        address,
        {
          filter: filter,
          options: {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: false,
            showContent: true,
            showBcs: false,
            showStorageRebate: true
          }
        },
        cursor,
        limit
      ]);

      if (!result || !result.data) {
        console.log('📦 ONE CHAIN: No objects found');
        return [];
      }

      console.log(`✅ ONE CHAIN: Retrieved ${result.data.length} objects`);
      return result.data;
    } catch (error) {
      console.error('❌ ONE CHAIN: Error getting objects:', error);
      throw error;
    }
  }

  /**
   * Submit a transaction to One Chain
   * @param {Object} transaction - Transaction object
   * @returns {Promise<string>} Transaction hash
   */
  async submitTransaction(transaction) {
    try {
      console.log('📤 ONE CHAIN: Submitting transaction...');
      
      if (!transaction) {
        throw new Error('Transaction is required');
      }

      if (!this.isConnected) {
        throw new Error('Not connected to One Chain network');
      }

      // Execute transaction using sui_executeTransactionBlock
      const result = await this._makeRpcCall('sui_executeTransactionBlock', [
        transaction.txBytes,
        [transaction.signature],
        {
          showInput: false,
          showRawInput: false,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true
        },
        'WaitForLocalExecution'
      ]);

      if (!result || !result.digest) {
        throw new Error('Transaction submission failed - no digest returned');
      }

      console.log(`✅ ONE CHAIN: Transaction submitted: ${result.digest}`);
      return result.digest;
    } catch (error) {
      console.error('❌ ONE CHAIN: Transaction submission failed:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   * @param {string} txHash - Transaction hash
   * @param {number} timeout - Timeout in milliseconds (default: 30000)
   * @returns {Promise<Object>} Transaction receipt
   */
  async waitForTransaction(txHash, timeout = 30000) {
    try {
      console.log(`⏳ ONE CHAIN: Waiting for transaction ${txHash}...`);
      
      const startTime = Date.now();
      const checkInterval = 1000; // Check every second

      while (Date.now() - startTime < timeout) {
        try {
          const receipt = await this._makeRpcCall('sui_getTransactionBlock', [
            txHash,
            {
              showInput: true,
              showRawInput: false,
              showEffects: true,
              showEvents: true,
              showObjectChanges: true,
              showBalanceChanges: true
            }
          ]);

          if (receipt && receipt.effects) {
            console.log(`✅ ONE CHAIN: Transaction confirmed: ${txHash}`);
            console.log(`📊 Status: ${receipt.effects.status.status}`);
            return receipt;
          }
        } catch (error) {
          // Transaction not found yet, continue waiting
          if (!error.message || !error.message.includes('not found')) {
            throw error;
          }
        }

        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }

      throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
    } catch (error) {
      console.error('❌ ONE CHAIN: Error waiting for transaction:', error);
      throw error;
    }
  }

  /**
   * Log game result to One Chain
   * @param {Object} gameData - Game result data
   * @returns {Promise<string>} Transaction hash
   */
  async logGameResult(gameData) {
    try {
      console.log('🎮 ONE CHAIN: Logging game result...');
      console.log('📋 Game data:', gameData);

      const {
        gameType,
        playerAddress,
        betAmount,
        payoutAmount,
        gameConfig,
        resultData,
        entropyValue,
        entropyTxHash,
        timestamp
      } = gameData;

      // Validate required fields
      if (!gameType || !playerAddress || !betAmount) {
        throw new Error('Missing required game data fields');
      }

      // Create transaction data for game result logging
      // This would typically involve calling a Move smart contract
      // For now, we'll create a transaction that stores the data
      const txData = {
        kind: 'moveCall',
        data: {
          packageObjectId: '0x2', // System package
          module: 'game_logger',
          function: 'log_game_result',
          typeArguments: [],
          arguments: [
            gameType,
            playerAddress,
            betAmount.toString(),
            payoutAmount ? payoutAmount.toString() : '0',
            JSON.stringify(gameConfig || {}),
            JSON.stringify(resultData || {}),
            entropyValue || '',
            entropyTxHash || '',
            timestamp || Date.now()
          ]
        }
      };

      console.log('📤 ONE CHAIN: Transaction data prepared');
      
      // Note: In a real implementation, this would need to be signed by the user's wallet
      // and then submitted. For now, we'll return a mock transaction hash
      // that indicates the structure is correct
      
      const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
      console.log(`✅ ONE CHAIN: Game result logged (mock): ${mockTxHash}`);
      
      return mockTxHash;
    } catch (error) {
      console.error('❌ ONE CHAIN: Error logging game result:', error);
      throw error;
    }
  }

  /**
   * Query game history for an address
   * @param {string} address - Player address
   * @param {number} limit - Maximum number of results (default: 50)
   * @returns {Promise<Array>} Array of game results
   */
  async queryGameHistory(address, limit = 50) {
    try {
      console.log(`📜 ONE CHAIN: Querying game history for ${address}...`);
      
      if (!address) {
        throw new Error('Address is required');
      }

      // Query transactions from the address
      const result = await this._makeRpcCall('suix_queryTransactionBlocks', [
        {
          filter: {
            FromAddress: address
          },
          options: {
            showInput: true,
            showRawInput: false,
            showEffects: true,
            showEvents: true,
            showObjectChanges: false,
            showBalanceChanges: true
          }
        },
        null, // cursor
        limit,
        true  // descending order (newest first)
      ]);

      if (!result || !result.data) {
        console.log('📜 ONE CHAIN: No game history found');
        return [];
      }

      // Parse transactions to extract game results
      const gameResults = [];
      
      for (const tx of result.data) {
        // Look for game-related events in the transaction
        if (tx.events && tx.events.length > 0) {
          for (const event of tx.events) {
            // Check if this is a game result event
            if (event.type && event.type.includes('game_logger::GameResult')) {
              const gameResult = this._parseGameResultEvent(event, tx);
              if (gameResult) {
                gameResults.push(gameResult);
              }
            }
          }
        }
      }

      console.log(`✅ ONE CHAIN: Retrieved ${gameResults.length} game results`);
      return gameResults;
    } catch (error) {
      console.error('❌ ONE CHAIN: Error querying game history:', error);
      
      // Return empty array for not found errors
      if (error.message && error.message.includes('not found')) {
        return [];
      }
      
      throw error;
    }
  }

  /**
   * Parse game result event from transaction
   * @param {Object} event - Event object
   * @param {Object} transaction - Transaction object
   * @returns {Object|null} Parsed game result
   * @private
   */
  _parseGameResultEvent(event, transaction) {
    try {
      const parsedJson = event.parsedJson || {};
      
      return {
        transactionHash: transaction.digest,
        blockNumber: transaction.checkpoint || null,
        gameType: parsedJson.game_type || 'UNKNOWN',
        playerAddress: parsedJson.player_address || '',
        betAmount: parsedJson.bet_amount || '0',
        payoutAmount: parsedJson.payout_amount || '0',
        gameConfig: parsedJson.game_config ? JSON.parse(parsedJson.game_config) : {},
        resultData: parsedJson.result_data ? JSON.parse(parsedJson.result_data) : {},
        entropyValue: parsedJson.entropy_value || '',
        entropyTxHash: parsedJson.entropy_tx_hash || '',
        timestamp: parsedJson.timestamp || transaction.timestampMs || Date.now(),
        status: transaction.effects?.status?.status || 'UNKNOWN'
      };
    } catch (error) {
      console.warn('⚠️ ONE CHAIN: Error parsing game result event:', error);
      return null;
    }
  }

  /**
   * Make RPC call to One Chain
   * @param {string} method - RPC method name
   * @param {Array} params - Method parameters
   * @returns {Promise<any>} RPC response
   * @private
   */
  async _makeRpcCall(method, params = []) {
    try {
      const requestBody = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: method,
        params: params
      };

      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'RPC call failed');
      }

      return data.result;
    } catch (error) {
      console.error(`❌ ONE CHAIN: RPC call failed (${method}):`, error);
      throw error;
    }
  }

  /**
   * Get network configuration
   * @returns {Object} Network configuration
   */
  getNetworkConfig() {
    return this.config;
  }

  /**
   * Get OCT token configuration
   * @returns {Object} OCT token configuration
   */
  getOCTTokenConfig() {
    return ONECHAIN_TESTNET_TOKENS.OCT;
  }

  /**
   * Get block explorer URL for transaction
   * @param {string} txHash - Transaction hash
   * @returns {string} Explorer URL
   */
  getExplorerUrl(txHash) {
    const baseUrl = this.config.blockExplorers.default.url;
    return `${baseUrl}/tx/${txHash}`;
  }

  /**
   * Get block explorer URL for address
   * @param {string} address - Address
   * @returns {string} Explorer URL
   */
  getAddressExplorerUrl(address) {
    const baseUrl = this.config.blockExplorers.default.url;
    return `${baseUrl}/address/${address}`;
  }

  /**
   * Format OCT amount from wei to human-readable format
   * @param {string|number} amountWei - Amount in wei
   * @param {number} decimals - Number of decimal places (default: 4)
   * @returns {string} Formatted amount
   */
  formatOCTAmount(amountWei, decimals = 4) {
    try {
      const tokenDecimals = ONECHAIN_TESTNET_TOKENS.OCT.decimals;
      const amount = BigInt(amountWei);
      const divisor = BigInt(10 ** tokenDecimals);
      
      const wholePart = amount / divisor;
      const fractionalPart = amount % divisor;
      
      const fractionalStr = fractionalPart.toString().padStart(tokenDecimals, '0');
      const truncatedFractional = fractionalStr.slice(0, decimals);
      
      if (decimals === 0) {
        return wholePart.toString();
      }
      
      return `${wholePart}.${truncatedFractional}`;
    } catch (error) {
      console.error('❌ ONE CHAIN: Error formatting amount:', error);
      return '0';
    }
  }

  /**
   * Parse OCT amount from human-readable format to wei
   * @param {string|number} amount - Amount in OCT
   * @returns {string} Amount in wei
   */
  parseOCTAmount(amount) {
    try {
      const tokenDecimals = ONECHAIN_TESTNET_TOKENS.OCT.decimals;
      const amountStr = amount.toString();
      
      // Split into whole and fractional parts
      const parts = amountStr.split('.');
      const wholePart = parts[0] || '0';
      const fractionalPart = (parts[1] || '').padEnd(tokenDecimals, '0').slice(0, tokenDecimals);
      
      const weiAmount = BigInt(wholePart) * BigInt(10 ** tokenDecimals) + BigInt(fractionalPart);
      
      return weiAmount.toString();
    } catch (error) {
      console.error('❌ ONE CHAIN: Error parsing amount:', error);
      return '0';
    }
  }

  /**
   * Retry operation with exponential backoff
   * @param {Function} operation - Operation to retry
   * @param {number} maxRetries - Maximum number of retries (default: 3)
   * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
   * @returns {Promise<any>} Operation result
   * @private
   */
  async _retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`⏳ ONE CHAIN: Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// Create singleton instance
const oneChainClientService = new OneChainClientService();

export default oneChainClientService;
export { OneChainClientService };
