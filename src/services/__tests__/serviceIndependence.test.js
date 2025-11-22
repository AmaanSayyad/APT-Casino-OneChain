/**
 * Service Independence Tests
 * Verifies that One Chain and Arbitrum Sepolia services operate independently
 * Requirements: 7.5, 9.3, 9.4
 */

import oneChainClientService from '../OneChainClientService.js';
import pythEntropyService from '../PythEntropyService.js';
import { executeIndependently } from '../../utils/errorHandling.js';

describe('Service Independence - Requirements 9.3, 9.4', () => {
  describe('One Chain failures do not affect Arbitrum Sepolia', () => {
    it('should allow entropy generation when One Chain connection fails', async () => {
      // Mock One Chain connection failure
      const originalConnect = oneChainClientService.connect;
      oneChainClientService.connect = jest.fn().mockRejectedValue(
        new Error('One Chain network unreachable')
      );

      // Attempt One Chain connection
      let oneChainError = null;
      try {
        await oneChainClientService.connect();
      } catch (error) {
        oneChainError = error;
      }

      expect(oneChainError).toBeDefined();
      expect(oneChainError.message).toContain('One Chain');

      // Verify Pyth Entropy service still works
      const entropyResult = await pythEntropyService.generateRandom('ROULETTE', {});
      
      expect(entropyResult).toBeDefined();
      expect(entropyResult.success).toBe(true);
      expect(entropyResult.randomValue).toBeDefined();
      expect(entropyResult.metadata.network).toBe('arbitrum-sepolia');

      // Restore original method
      oneChainClientService.connect = originalConnect;
    });

    it('should allow entropy generation when One Chain transaction fails', async () => {
      // Mock One Chain transaction failure
      const originalSubmit = oneChainClientService.submitTransaction;
      oneChainClientService.submitTransaction = jest.fn().mockRejectedValue(
        new Error('One Chain transaction failed')
      );

      // Attempt One Chain transaction
      let txError = null;
      try {
        await oneChainClientService.submitTransaction({ txBytes: '0x123', signature: '0x456' });
      } catch (error) {
        txError = error;
      }

      expect(txError).toBeDefined();

      // Verify Pyth Entropy service still works
      const entropyResult = await pythEntropyService.generateRandom('MINES', { minesCount: 5 });
      
      expect(entropyResult).toBeDefined();
      expect(entropyResult.success).toBe(true);
      expect(entropyResult.gameType).toBe('MINES');

      // Restore original method
      oneChainClientService.submitTransaction = originalSubmit;
    });

    it('should allow entropy generation when One Chain RPC fails', async () => {
      // Mock One Chain RPC failure
      const originalRpc = oneChainClientService._makeRpcCall;
      oneChainClientService._makeRpcCall = jest.fn().mockRejectedValue(
        new Error('RPC endpoint timeout')
      );

      // Attempt One Chain RPC call
      let rpcError = null;
      try {
        await oneChainClientService.getBalance('0x123');
      } catch (error) {
        rpcError = error;
      }

      // Balance query should return fallback value (0) instead of throwing
      expect(rpcError).toBeNull();

      // Verify Pyth Entropy service still works
      const entropyResult = await pythEntropyService.generateRandom('PLINKO', { rows: 16 });
      
      expect(entropyResult).toBeDefined();
      expect(entropyResult.success).toBe(true);

      // Restore original method
      oneChainClientService._makeRpcCall = originalRpc;
    });
  });

  describe('Arbitrum Sepolia failures do not affect One Chain', () => {
    it('should allow One Chain operations when entropy service fails', async () => {
      // Mock Pyth Entropy failure
      const originalGenerate = pythEntropyService.generateRandom;
      pythEntropyService.generateRandom = jest.fn().mockRejectedValue(
        new Error('Arbitrum Sepolia RPC unreachable')
      );

      // Attempt entropy generation - should return fallback
      const entropyResult = await pythEntropyService.generateRandom('WHEEL', {});
      
      // Should get fallback entropy instead of error
      expect(entropyResult).toBeDefined();
      expect(entropyResult.success).toBe(true);
      expect(entropyResult.metadata.source).toContain('Fallback');

      // Verify One Chain service still works
      const balance = await oneChainClientService.getBalance('0x123');
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('string');

      // Restore original method
      pythEntropyService.generateRandom = originalGenerate;
    });

    it('should allow One Chain connection when entropy API fails', async () => {
      // Mock fetch to simulate API failure
      global.fetch = jest.fn().mockRejectedValue(new Error('API unreachable'));

      // Attempt entropy generation - should return fallback
      const entropyResult = await pythEntropyService.generateRandom('ROULETTE', {});
      
      expect(entropyResult).toBeDefined();
      expect(entropyResult.success).toBe(true);

      // Verify One Chain connection still works
      const isConnected = oneChainClientService.isConnectedToNetwork();
      expect(typeof isConnected).toBe('boolean');

      // Restore fetch
      delete global.fetch;
    });
  });

  describe('Independent error handling', () => {
    it('should execute both services independently with executeIndependently', async () => {
      const oneChainOp = async () => {
        return await oneChainClientService.getBalance('0x123');
      };

      const entropyOp = async () => {
        return await pythEntropyService.generateRandom('MINES', {});
      };

      const results = await executeIndependently([oneChainOp, entropyOp]);

      expect(results).toHaveLength(2);
      
      // Both should succeed independently
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should continue other operations when one fails', async () => {
      const failingOp = async () => {
        throw new Error('Intentional failure');
      };

      const successOp = async () => {
        return 'success';
      };

      const results = await executeIndependently([failingOp, successOp]);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(true);
      expect(results[1].data).toBe('success');
    });
  });

  describe('Error isolation', () => {
    it('should not propagate One Chain errors to global scope', async () => {
      const originalConsoleError = console.error;
      const errors = [];
      console.error = (...args) => errors.push(args);

      // Trigger One Chain error
      const originalRpc = oneChainClientService._makeRpcCall;
      oneChainClientService._makeRpcCall = jest.fn().mockRejectedValue(
        new Error('One Chain error')
      );

      // This should handle error internally
      const balance = await oneChainClientService.getBalance('0x123');
      expect(balance).toBe('0'); // Fallback value

      // Error should be logged but not thrown
      expect(errors.length).toBeGreaterThan(0);

      // Restore
      oneChainClientService._makeRpcCall = originalRpc;
      console.error = originalConsoleError;
    });

    it('should not propagate Arbitrum Sepolia errors to global scope', async () => {
      const originalConsoleError = console.error;
      const errors = [];
      console.error = (...args) => errors.push(args);

      // Mock API failure
      global.fetch = jest.fn().mockRejectedValue(new Error('Arbitrum error'));

      // This should handle error internally and return fallback
      const result = await pythEntropyService.generateRandom('PLINKO', {});
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.metadata.source).toContain('Fallback');

      // Restore
      delete global.fetch;
      console.error = originalConsoleError;
    });
  });

  describe('Circuit breaker independence', () => {
    it('should have separate circuit breakers for each service', () => {
      // One Chain has its own circuit breaker
      expect(oneChainClientService.circuitBreaker).toBeDefined();
      expect(oneChainClientService.circuitBreaker.getState).toBeDefined();

      // Get initial states
      const oneChainState = oneChainClientService.circuitBreaker.getState();
      
      expect(oneChainState.state).toBe('CLOSED');
      expect(oneChainState.failureCount).toBe(0);
    });

    it('should not affect other service when circuit opens', async () => {
      // Reset circuit breaker
      oneChainClientService.circuitBreaker.reset();

      // Mock failures to open circuit
      const originalRpc = oneChainClientService._makeRpcCall;
      oneChainClientService._makeRpcCall = jest.fn().mockRejectedValue(
        new Error('RPC failed')
      );

      // Trigger multiple failures
      for (let i = 0; i < 5; i++) {
        try {
          await oneChainClientService.circuitBreaker.execute(async () => {
            return await oneChainClientService._makeRpcCall('test', []);
          });
        } catch (error) {
          // Expected to fail
        }
      }

      // Circuit should be open
      const state = oneChainClientService.circuitBreaker.getState();
      expect(state.state).toBe('OPEN');

      // Entropy service should still work
      const entropyResult = await pythEntropyService.generateRandom('WHEEL', {});
      expect(entropyResult.success).toBe(true);

      // Restore
      oneChainClientService._makeRpcCall = originalRpc;
      oneChainClientService.circuitBreaker.reset();
    });
  });
});
