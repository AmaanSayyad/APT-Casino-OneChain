/**
 * Tests for OneChainClientService
 * Basic verification tests for One Chain client functionality
 */

import oneChainClientService, { OneChainClientService } from '../OneChainClientService.js';
import { ONECHAIN_TESTNET_CONFIG } from '../../config/onechainTestnetConfig.js';

describe('OneChainClientService', () => {
  let service;

  beforeEach(() => {
    service = new OneChainClientService();
  });

  describe('Initialization', () => {
    test('should initialize with correct configuration', () => {
      expect(service.config).toBeDefined();
      expect(service.rpcUrl).toBe(ONECHAIN_TESTNET_CONFIG.rpcUrls.default.http[0]);
      expect(service.chainId).toBe(ONECHAIN_TESTNET_CONFIG.chainId);
      expect(service.isConnected).toBe(false);
    });

    test('should have singleton instance', () => {
      expect(oneChainClientService).toBeDefined();
      expect(oneChainClientService).toBeInstanceOf(OneChainClientService);
    });
  });

  describe('Connection Management', () => {
    test('should report not connected initially', () => {
      expect(service.isConnectedToNetwork()).toBe(false);
    });

    test('should disconnect properly', () => {
      service.isConnected = true;
      service.currentAddress = '0x123';
      
      service.disconnect();
      
      expect(service.isConnected).toBe(false);
      expect(service.currentAddress).toBeNull();
    });
  });

  describe('Balance Operations', () => {
    test('should throw error for missing address', async () => {
      await expect(service.getBalance()).rejects.toThrow('Address is required');
    });

    test('should return 0 for account not found', async () => {
      // Mock the RPC call to simulate account not found
      service._makeRpcCall = jest.fn().mockRejectedValue(new Error('Account not found'));
      
      const balance = await service.getBalance('0x123');
      expect(balance).toBe('0');
    });
  });

  describe('Object Operations', () => {
    test('should throw error for missing address', async () => {
      await expect(service.getObjects()).rejects.toThrow('Address is required');
    });

    test('should return empty array when no objects found', async () => {
      service._makeRpcCall = jest.fn().mockResolvedValue({ data: [] });
      
      const objects = await service.getObjects('0x123');
      expect(objects).toEqual([]);
    });
  });

  describe('Transaction Operations', () => {
    test('should throw error for missing transaction', async () => {
      await expect(service.submitTransaction()).rejects.toThrow('Transaction is required');
    });

    test('should throw error when not connected', async () => {
      service.isConnected = false;
      
      await expect(service.submitTransaction({ txBytes: '0x123', signature: '0xabc' }))
        .rejects.toThrow('Not connected to One Chain network');
    });
  });

  describe('Game Result Logging', () => {
    test('should throw error for missing required fields', async () => {
      await expect(service.logGameResult({}))
        .rejects.toThrow('Missing required game data fields');
    });

    test('should log game result with valid data', async () => {
      const gameData = {
        gameType: 'ROULETTE',
        playerAddress: '0x123',
        betAmount: '1000000000000000000',
        payoutAmount: '2000000000000000000',
        gameConfig: { betType: 'straight', number: 7 },
        resultData: { winningNumber: 7 },
        entropyValue: '0xabc',
        entropyTxHash: '0xdef',
        timestamp: Date.now()
      };

      const txHash = await service.logGameResult(gameData);
      expect(txHash).toBeDefined();
      expect(txHash).toMatch(/^0x[a-f0-9]+$/);
    });
  });

  describe('Game History Querying', () => {
    test('should throw error for missing address', async () => {
      await expect(service.queryGameHistory()).rejects.toThrow('Address is required');
    });

    test('should return empty array when no history found', async () => {
      service._makeRpcCall = jest.fn().mockRejectedValue(new Error('not found'));
      
      const history = await service.queryGameHistory('0x123');
      expect(history).toEqual([]);
    });

    test('should return empty array when no data in result', async () => {
      service._makeRpcCall = jest.fn().mockResolvedValue({ data: [] });
      
      const history = await service.queryGameHistory('0x123');
      expect(history).toEqual([]);
    });
  });

  describe('Utility Functions', () => {
    test('should get network configuration', () => {
      const config = service.getNetworkConfig();
      expect(config).toBeDefined();
      expect(config.name).toBe('One Chain Testnet');
    });

    test('should get OCT token configuration', () => {
      const tokenConfig = service.getOCTTokenConfig();
      expect(tokenConfig).toBeDefined();
      expect(tokenConfig.symbol).toBe('OCT');
      expect(tokenConfig.decimals).toBe(18);
    });

    test('should generate explorer URL for transaction', () => {
      const txHash = '0x123abc';
      const url = service.getExplorerUrl(txHash);
      expect(url).toContain(txHash);
      expect(url).toContain('explorer-testnet.onelabs.cc');
    });

    test('should generate explorer URL for address', () => {
      const address = '0x123abc';
      const url = service.getAddressExplorerUrl(address);
      expect(url).toContain(address);
      expect(url).toContain('explorer-testnet.onelabs.cc');
    });
  });

  describe('Amount Formatting', () => {
    test('should format OCT amount correctly', () => {
      const amountWei = '1000000000000000000'; // 1 OCT
      const formatted = service.formatOCTAmount(amountWei);
      expect(formatted).toBe('1.0000');
    });

    test('should format small OCT amount correctly', () => {
      const amountWei = '1000000000000000'; // 0.001 OCT
      const formatted = service.formatOCTAmount(amountWei);
      expect(formatted).toBe('0.0010');
    });

    test('should format large OCT amount correctly', () => {
      const amountWei = '123456789000000000000'; // 123.456789 OCT
      const formatted = service.formatOCTAmount(amountWei);
      expect(formatted).toBe('123.4567');
    });

    test('should handle custom decimal places', () => {
      const amountWei = '1234567890000000000'; // 1.23456789 OCT
      const formatted = service.formatOCTAmount(amountWei, 2);
      expect(formatted).toBe('1.23');
    });

    test('should handle zero decimals', () => {
      const amountWei = '1234567890000000000'; // 1.23456789 OCT
      const formatted = service.formatOCTAmount(amountWei, 0);
      expect(formatted).toBe('1');
    });

    test('should handle formatting errors gracefully', () => {
      const formatted = service.formatOCTAmount('invalid');
      expect(formatted).toBe('0');
    });
  });

  describe('Amount Parsing', () => {
    test('should parse OCT amount correctly', () => {
      const amount = '1.0';
      const parsed = service.parseOCTAmount(amount);
      expect(parsed).toBe('1000000000000000000');
    });

    test('should parse small OCT amount correctly', () => {
      const amount = '0.001';
      const parsed = service.parseOCTAmount(amount);
      expect(parsed).toBe('1000000000000000');
    });

    test('should parse large OCT amount correctly', () => {
      const amount = '123.456789';
      const parsed = service.parseOCTAmount(amount);
      expect(parsed).toBe('123456789000000000000');
    });

    test('should handle whole numbers', () => {
      const amount = '5';
      const parsed = service.parseOCTAmount(amount);
      expect(parsed).toBe('5000000000000000000');
    });

    test('should handle numbers without leading zero', () => {
      const amount = '.5';
      const parsed = service.parseOCTAmount(amount);
      expect(parsed).toBe('500000000000000000');
    });

    test('should handle parsing errors gracefully', () => {
      const parsed = service.parseOCTAmount('invalid');
      expect(parsed).toBe('0');
    });
  });

  describe('Round-trip Amount Conversion', () => {
    test('should maintain precision in round-trip conversion', () => {
      const originalAmount = '1.5';
      const parsed = service.parseOCTAmount(originalAmount);
      const formatted = service.formatOCTAmount(parsed);
      expect(formatted).toBe('1.5000');
    });

    test('should handle small amounts in round-trip', () => {
      const originalAmount = '0.001';
      const parsed = service.parseOCTAmount(originalAmount);
      const formatted = service.formatOCTAmount(parsed);
      expect(formatted).toBe('0.0010');
    });

    test('should handle large amounts in round-trip', () => {
      const originalAmount = '999.9999';
      const parsed = service.parseOCTAmount(originalAmount);
      const formatted = service.formatOCTAmount(parsed);
      expect(formatted).toBe('999.9999');
    });
  });
});
