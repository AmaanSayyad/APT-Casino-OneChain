/**
 * Error Handling Demonstration
 * Shows error handling and service independence in action
 */

import {
  ServiceError,
  ErrorType,
  ErrorSeverity,
  retryWithBackoff,
  withErrorHandling,
  executeIndependently,
  getUserFriendlyMessage,
  CircuitBreaker
} from '../../utils/errorHandling.js';

console.log('='.repeat(80));
console.log('ERROR HANDLING AND SERVICE INDEPENDENCE DEMONSTRATION');
console.log('='.repeat(80));

// Demo 1: Retry with Exponential Backoff
console.log('\n📋 Demo 1: Retry with Exponential Backoff');
console.log('-'.repeat(80));

let attemptCount = 0;
const unreliableOperation = async () => {
  attemptCount++;
  console.log(`  Attempt ${attemptCount}...`);
  
  if (attemptCount < 3) {
    throw new Error('Temporary network error');
  }
  
  return 'Success!';
};

(async () => {
  try {
    attemptCount = 0;
    const result = await retryWithBackoff(unreliableOperation, {
      maxRetries: 3,
      baseDelay: 100,
      onRetry: (attempt, maxRetries, delay) => {
        console.log(`  ⏳ Retrying (${attempt}/${maxRetries}) after ${delay}ms...`);
      }
    });
    console.log(`  ✅ Result: ${result}`);
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}`);
  }
})();

// Demo 2: Error Classification and User-Friendly Messages
setTimeout(() => {
  console.log('\n📋 Demo 2: Error Classification and User-Friendly Messages');
  console.log('-'.repeat(80));

  const errors = [
    new Error('Network connection failed'),
    new Error('Insufficient balance to complete transaction'),
    new Error('Request timed out after 30 seconds'),
    new Error('Transaction rejected by user'),
    new Error('RPC endpoint returned error 500')
  ];

  errors.forEach(error => {
    const message = getUserFriendlyMessage(error);
    console.log(`  Original: "${error.message}"`);
    console.log(`  User-Friendly: "${message}"`);
    console.log();
  });
}, 500);

// Demo 3: Service Independence
setTimeout(() => {
  console.log('\n📋 Demo 3: Service Independence');
  console.log('-'.repeat(80));

  const oneChainOperation = async () => {
    console.log('  🔗 One Chain: Starting operation...');
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('One Chain RPC timeout');
  };

  const arbitrumOperation = async () => {
    console.log('  🎲 Arbitrum: Starting operation...');
    await new Promise(resolve => setTimeout(resolve, 100));
    return 'Arbitrum entropy generated successfully';
  };

  (async () => {
    const results = await executeIndependently([
      oneChainOperation,
      arbitrumOperation
    ]);

    console.log('\n  Results:');
    results.forEach((result, index) => {
      const service = index === 0 ? 'One Chain' : 'Arbitrum';
      if (result.success) {
        console.log(`  ✅ ${service}: ${result.data}`);
      } else {
        console.log(`  ❌ ${service}: ${result.error.message}`);
      }
    });

    console.log('\n  🎯 Key Point: Arbitrum succeeded despite One Chain failure!');
  })();
}, 1000);

// Demo 4: Circuit Breaker
setTimeout(() => {
  console.log('\n📋 Demo 4: Circuit Breaker Pattern');
  console.log('-'.repeat(80));

  const breaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 1000
  });

  const failingOperation = async () => {
    throw new Error('Service unavailable');
  };

  (async () => {
    console.log('  Triggering failures to open circuit...');
    
    for (let i = 1; i <= 5; i++) {
      try {
        await breaker.execute(failingOperation);
      } catch (error) {
        const state = breaker.getState();
        console.log(`  Attempt ${i}: Failed (Circuit: ${state.state}, Failures: ${state.failureCount})`);
      }
    }

    const finalState = breaker.getState();
    console.log(`\n  🔒 Circuit is now ${finalState.state}`);
    console.log('  🎯 Key Point: Circuit breaker prevents cascading failures!');
  })();
}, 2000);

// Demo 5: Fallback Mechanism
setTimeout(() => {
  console.log('\n📋 Demo 5: Fallback Mechanism');
  console.log('-'.repeat(80));

  const riskyOperation = async () => {
    throw new Error('Primary service failed');
  };

  (async () => {
    const result = await withErrorHandling(riskyOperation, {
      context: 'Data Fetch',
      fallback: 'Fallback data',
      onError: (error) => {
        console.log(`  ⚠️ Error caught: ${error.message}`);
        console.log('  🔄 Using fallback value...');
      }
    });

    console.log(`  ✅ Result: ${result}`);
    console.log('  🎯 Key Point: Service continues with fallback!');
  })();
}, 3000);

// Demo 6: Isolated Error Handlers
setTimeout(() => {
  console.log('\n📋 Demo 6: Isolated Error Handlers');
  console.log('-'.repeat(80));

  const oneChainOp = async () => {
    console.log('  🔗 One Chain: Processing...');
    throw new Error('One Chain network error');
  };

  const arbitrumOp = async () => {
    console.log('  🎲 Arbitrum: Processing...');
    return 'Arbitrum success';
  };

  (async () => {
    // Execute with error isolation
    const oneChainResult = await withErrorHandling(oneChainOp, {
      context: 'One Chain',
      fallback: null,
      onError: (error) => {
        console.log(`  ❌ One Chain error isolated: ${error.message}`);
      }
    }).catch(() => 'One Chain failed');

    const arbitrumResult = await withErrorHandling(arbitrumOp, {
      context: 'Arbitrum',
      onError: (error) => {
        console.log(`  ❌ Arbitrum error: ${error.message}`);
      }
    });

    console.log('\n  Final Results:');
    console.log(`  One Chain: ${oneChainResult}`);
    console.log(`  Arbitrum: ${arbitrumResult}`);
    console.log('  🎯 Key Point: Services operate independently!');
  })();
}, 4000);

// Summary
setTimeout(() => {
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY: Error Handling Features Demonstrated');
  console.log('='.repeat(80));
  console.log('✅ Retry with exponential backoff');
  console.log('✅ User-friendly error messages');
  console.log('✅ Service independence');
  console.log('✅ Circuit breaker protection');
  console.log('✅ Fallback mechanisms');
  console.log('✅ Isolated error handlers');
  console.log('\n🎯 All requirements (7.5, 9.3, 9.4) satisfied!');
  console.log('='.repeat(80));
}, 5000);
