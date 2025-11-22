/**
 * Error Handling Tests
 * Tests for error handling utilities and service independence
 */

import {
  ServiceError,
  ErrorType,
  ErrorSeverity,
  retryWithBackoff,
  classifyError,
  getUserFriendlyMessage,
  isRetryableError,
  withErrorHandling,
  executeIndependently,
  CircuitBreaker
} from '../../utils/errorHandling.js';

describe('Error Handling Utilities', () => {
  describe('ServiceError', () => {
    it('should create error with correct properties', () => {
      const error = new ServiceError(
        'Test error',
        ErrorType.NETWORK,
        ErrorSeverity.HIGH,
        new Error('Original'),
        { context: 'test' }
      );

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.context).toEqual({ context: 'test' });
      expect(error.timestamp).toBeDefined();
    });

    it('should serialize to JSON correctly', () => {
      const error = new ServiceError('Test', ErrorType.RPC);
      const json = error.toJSON();

      expect(json.name).toBe('ServiceError');
      expect(json.message).toBe('Test');
      expect(json.type).toBe(ErrorType.RPC);
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await retryWithBackoff(operation);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const result = await retryWithBackoff(operation, {
        maxRetries: 3,
        baseDelay: 10
      });
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(
        retryWithBackoff(operation, {
          maxRetries: 2,
          baseDelay: 10
        })
      ).rejects.toThrow('Always fails');
      
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should respect shouldRetry callback', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('No retry'));
      
      await expect(
        retryWithBackoff(operation, {
          maxRetries: 3,
          shouldRetry: () => false
        })
      ).rejects.toThrow('No retry');
      
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry callback', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue('success');
      
      const onRetry = jest.fn();
      
      await retryWithBackoff(operation, {
        maxRetries: 2,
        baseDelay: 10,
        onRetry
      });
      
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(1, 2, 10, expect.any(Error));
    });
  });

  describe('classifyError', () => {
    it('should classify network errors', () => {
      const error = new Error('Network connection failed');
      expect(classifyError(error)).toBe(ErrorType.NETWORK);
    });

    it('should classify connection errors', () => {
      const error = new Error('Failed to connect');
      expect(classifyError(error)).toBe(ErrorType.CONNECTION);
    });

    it('should classify insufficient funds errors', () => {
      const error = new Error('Insufficient balance');
      expect(classifyError(error)).toBe(ErrorType.INSUFFICIENT_FUNDS);
    });

    it('should classify timeout errors', () => {
      const error = new Error('Request timed out');
      expect(classifyError(error)).toBe(ErrorType.TIMEOUT);
    });

    it('should classify transaction errors', () => {
      const error = new Error('Transaction failed');
      expect(classifyError(error)).toBe(ErrorType.TRANSACTION);
    });

    it('should classify RPC errors', () => {
      const error = new Error('RPC call failed');
      expect(classifyError(error)).toBe(ErrorType.RPC);
    });

    it('should classify unknown errors', () => {
      const error = new Error('Something went wrong');
      expect(classifyError(error)).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for network errors', () => {
      const error = new Error('Network failed');
      const message = getUserFriendlyMessage(error);
      
      expect(message).toContain('Network connection issue');
    });

    it('should include context in message', () => {
      const error = new Error('Failed');
      const message = getUserFriendlyMessage(error, 'Balance Update');
      
      expect(message).toContain('Balance Update');
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      const networkError = new Error('Network failed');
      networkError.type = ErrorType.NETWORK;
      
      expect(isRetryableError(networkError)).toBe(true);
    });

    it('should identify non-retryable errors', () => {
      const validationError = new Error('Invalid input');
      validationError.type = ErrorType.VALIDATION;
      
      expect(isRetryableError(validationError)).toBe(false);
    });
  });

  describe('withErrorHandling', () => {
    it('should execute operation successfully', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await withErrorHandling(operation);
      
      expect(result).toBe('success');
    });

    it('should handle errors and call onError', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      const onError = jest.fn();
      
      await expect(
        withErrorHandling(operation, { onError })
      ).rejects.toThrow();
      
      expect(onError).toHaveBeenCalled();
    });

    it('should return fallback on error', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      const result = await withErrorHandling(operation, {
        fallback: 'fallback-value'
      });
      
      expect(result).toBe('fallback-value');
    });

    it('should retry when retry option is true', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Network failed'))
        .mockResolvedValue('success');
      
      const result = await withErrorHandling(operation, {
        retry: true,
        retryOptions: { maxRetries: 2, baseDelay: 10 }
      });
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe('executeIndependently', () => {
    it('should execute all operations independently', async () => {
      const op1 = jest.fn().mockResolvedValue('result1');
      const op2 = jest.fn().mockRejectedValue(new Error('Failed'));
      const op3 = jest.fn().mockResolvedValue('result3');
      
      const results = await executeIndependently([op1, op2, op3]);
      
      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true);
      expect(results[0].data).toBe('result1');
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
      expect(results[2].data).toBe('result3');
    });

    it('should stop on error when continueOnError is false', async () => {
      const op1 = jest.fn().mockResolvedValue('result1');
      const op2 = jest.fn().mockRejectedValue(new Error('Failed'));
      const op3 = jest.fn().mockResolvedValue('result3');
      
      const results = await executeIndependently([op1, op2, op3], {
        continueOnError: false
      });
      
      expect(results).toHaveLength(2);
      expect(op3).not.toHaveBeenCalled();
    });
  });

  describe('CircuitBreaker', () => {
    it('should allow operations when closed', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2 });
      const operation = jest.fn().mockResolvedValue('success');
      
      const result = await breaker.execute(operation);
      
      expect(result).toBe('success');
      expect(breaker.getState().state).toBe('CLOSED');
    });

    it('should open after threshold failures', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 100 });
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      // First failure
      await expect(breaker.execute(operation)).rejects.toThrow();
      expect(breaker.getState().state).toBe('CLOSED');
      
      // Second failure - should open circuit
      await expect(breaker.execute(operation)).rejects.toThrow();
      expect(breaker.getState().state).toBe('OPEN');
    });

    it('should reject operations when open', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, resetTimeout: 1000 });
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      // Trigger circuit open
      await expect(breaker.execute(operation)).rejects.toThrow();
      
      // Should reject immediately
      await expect(breaker.execute(operation)).rejects.toThrow('Service temporarily unavailable');
    });

    it('should reset on success', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 3 });
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValue('success');
      
      await expect(breaker.execute(operation)).rejects.toThrow();
      expect(breaker.getState().failureCount).toBe(1);
      
      await breaker.execute(operation);
      expect(breaker.getState().failureCount).toBe(0);
    });
  });
});

describe('Service Independence', () => {
  it('should isolate One Chain errors from Arbitrum Sepolia', async () => {
    const oneChainOp = jest.fn().mockRejectedValue(new Error('One Chain failed'));
    const arbitrumOp = jest.fn().mockResolvedValue('Arbitrum success');
    
    const results = await executeIndependently([oneChainOp, arbitrumOp]);
    
    expect(results[0].success).toBe(false);
    expect(results[1].success).toBe(true);
    expect(results[1].data).toBe('Arbitrum success');
  });

  it('should isolate Arbitrum Sepolia errors from One Chain', async () => {
    const arbitrumOp = jest.fn().mockRejectedValue(new Error('Arbitrum failed'));
    const oneChainOp = jest.fn().mockResolvedValue('One Chain success');
    
    const results = await executeIndependently([arbitrumOp, oneChainOp]);
    
    expect(results[0].success).toBe(false);
    expect(results[1].success).toBe(true);
    expect(results[1].data).toBe('One Chain success');
  });
});
