/**
 * Error Handling Utilities
 * Provides centralized error handling with retry logic and user-friendly messages
 */

/**
 * Error types for classification
 */
export const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  CONNECTION: 'CONNECTION_ERROR',
  TRANSACTION: 'TRANSACTION_ERROR',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TIMEOUT: 'TIMEOUT_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  CONTRACT: 'CONTRACT_ERROR',
  RPC: 'RPC_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

/**
 * Custom error class with additional context
 */
export class ServiceError extends Error {
  constructor(message, type = ErrorType.UNKNOWN, severity = ErrorSeverity.MEDIUM, originalError = null, context = {}) {
    super(message);
    this.name = 'ServiceError';
    this.type = type;
    this.severity = severity;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = Date.now();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      originalError: this.originalError?.message
    };
  }
}

/**
 * Retry operation with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {Object} options - Retry options
 * @returns {Promise<any>} Operation result
 */
export async function retryWithBackoff(operation, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!shouldRetry(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
      
      console.log(`⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      
      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, maxRetries, delay, error);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Classify error and return appropriate error type
 * @param {Error} error - Error to classify
 * @returns {string} Error type
 */
export function classifyError(error) {
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('network') || message.includes('fetch') || message.includes('econnrefused')) {
    return ErrorType.NETWORK;
  }
  
  if (message.includes('connection') || message.includes('connect')) {
    return ErrorType.CONNECTION;
  }
  
  if (message.includes('insufficient') || message.includes('balance')) {
    return ErrorType.INSUFFICIENT_FUNDS;
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return ErrorType.TIMEOUT;
  }
  
  if (message.includes('transaction') || message.includes('tx')) {
    return ErrorType.TRANSACTION;
  }
  
  if (message.includes('contract') || message.includes('revert')) {
    return ErrorType.CONTRACT;
  }
  
  if (message.includes('rpc') || message.includes('jsonrpc')) {
    return ErrorType.RPC;
  }
  
  if (message.includes('invalid') || message.includes('validation')) {
    return ErrorType.VALIDATION;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {string} User-friendly message
 */
export function getUserFriendlyMessage(error, context = '') {
  const errorType = error.type || classifyError(error);
  
  const messages = {
    [ErrorType.NETWORK]: 'Network connection issue. Please check your internet connection and try again.',
    [ErrorType.CONNECTION]: 'Unable to connect to the blockchain network. Please try again.',
    [ErrorType.INSUFFICIENT_FUNDS]: 'Insufficient balance. Please add funds to your wallet.',
    [ErrorType.TIMEOUT]: 'Request timed out. The transaction may still be processing. Please check your transaction history.',
    [ErrorType.TRANSACTION]: 'Transaction failed. Please try again.',
    [ErrorType.CONTRACT]: 'Smart contract error. Please try again or contact support.',
    [ErrorType.RPC]: 'Blockchain service temporarily unavailable. Please try again.',
    [ErrorType.VALIDATION]: 'Invalid input. Please check your data and try again.',
    [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  };
  
  const baseMessage = messages[errorType] || messages[ErrorType.UNKNOWN];
  
  return context ? `${context}: ${baseMessage}` : baseMessage;
}

/**
 * Determine if error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} True if error should be retried
 */
export function isRetryableError(error) {
  const errorType = error.type || classifyError(error);
  
  const retryableTypes = [
    ErrorType.NETWORK,
    ErrorType.CONNECTION,
    ErrorType.TIMEOUT,
    ErrorType.RPC
  ];
  
  return retryableTypes.includes(errorType);
}

/**
 * Wrap async operation with error handling
 * @param {Function} operation - Async operation
 * @param {Object} options - Error handling options
 * @returns {Promise<any>} Operation result
 */
export async function withErrorHandling(operation, options = {}) {
  const {
    context = '',
    retry = false,
    retryOptions = {},
    onError = null,
    fallback = null
  } = options;
  
  try {
    if (retry) {
      return await retryWithBackoff(operation, {
        ...retryOptions,
        shouldRetry: isRetryableError
      });
    } else {
      return await operation();
    }
  } catch (error) {
    const errorType = classifyError(error);
    const userMessage = getUserFriendlyMessage(error, context);
    
    const serviceError = new ServiceError(
      userMessage,
      errorType,
      ErrorSeverity.MEDIUM,
      error,
      { context }
    );
    
    console.error(`❌ Error in ${context}:`, serviceError.toJSON());
    
    // Call error callback if provided
    if (onError) {
      onError(serviceError);
    }
    
    // Return fallback value if provided
    if (fallback !== null) {
      console.log(`🔄 Using fallback value for ${context}`);
      return fallback;
    }
    
    throw serviceError;
  }
}

/**
 * Create isolated error handler for service independence
 * Ensures errors in one service don't affect another
 * @param {string} serviceName - Name of the service
 * @returns {Function} Error handler function
 */
export function createIsolatedErrorHandler(serviceName) {
  return (error, context = '') => {
    const errorType = classifyError(error);
    const userMessage = getUserFriendlyMessage(error, context);
    
    const serviceError = new ServiceError(
      userMessage,
      errorType,
      ErrorSeverity.MEDIUM,
      error,
      { service: serviceName, context }
    );
    
    console.error(`❌ [${serviceName}] Error:`, serviceError.toJSON());
    
    // Log but don't propagate to other services
    return serviceError;
  };
}

/**
 * Execute multiple operations independently
 * Ensures failure in one doesn't affect others
 * @param {Array<Function>} operations - Array of async operations
 * @param {Object} options - Execution options
 * @returns {Promise<Array>} Array of results (success or error)
 */
export async function executeIndependently(operations, options = {}) {
  const {
    continueOnError = true,
    timeout = null
  } = options;
  
  const results = [];
  
  for (let i = 0; i < operations.length; i++) {
    try {
      let result;
      
      if (timeout) {
        result = await Promise.race([
          operations[i](),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Operation timeout')), timeout)
          )
        ]);
      } else {
        result = await operations[i]();
      }
      
      results.push({ success: true, data: result, index: i });
    } catch (error) {
      const serviceError = createIsolatedErrorHandler(`Operation ${i}`)(error);
      results.push({ success: false, error: serviceError, index: i });
      
      if (!continueOnError) {
        break;
      }
    }
  }
  
  return results;
}

/**
 * Circuit breaker pattern for service protection
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new ServiceError(
          'Service temporarily unavailable',
          ErrorType.CONNECTION,
          ErrorSeverity.HIGH,
          null,
          { circuitBreakerState: this.state }
        );
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      console.warn(`⚠️ Circuit breaker opened. Will retry after ${this.resetTimeout}ms`);
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt
    };
  }
}

export default {
  ErrorType,
  ErrorSeverity,
  ServiceError,
  retryWithBackoff,
  classifyError,
  getUserFriendlyMessage,
  isRetryableError,
  withErrorHandling,
  createIsolatedErrorHandler,
  executeIndependently,
  CircuitBreaker
};
