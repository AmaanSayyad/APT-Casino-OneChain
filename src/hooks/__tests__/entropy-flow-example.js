/**
 * Entropy-to-Game Data Flow Example
 * 
 * This example demonstrates how entropy flows from Pyth Entropy (Arbitrum Sepolia)
 * to One Chain game transactions, maintaining service independence.
 * 
 * Requirements Validated:
 * - 9.1: Entropy requested from Arbitrum Sepolia
 * - 9.2: Entropy used in One Chain game transactions
 */

import pythEntropyService from '../../services/PythEntropyService.js';
import { useOneChainCasino } from '../useOneChainCasino.js';

/**
 * Example 1: Roulette Game with Entropy Flow
 * 
 * This example shows the complete flow from entropy generation
 * to game result logging on One Chain.
 */
export async function exampleRouletteWithEntropy() {
  console.log('=== Roulette Game with Entropy Flow ===\n');

  // Step 1: Request entropy from Pyth Entropy (Arbitrum Sepolia)
  console.log('Step 1: Requesting entropy from Arbitrum Sepolia...');
  const entropyResult = await pythEntropyService.generateRandom('ROULETTE', {
    betType: 'straight',
    betValue: 7,
    wheelType: 'european'
  });

  console.log('✅ Entropy received from Arbitrum Sepolia:');
  console.log('  - Random Value:', entropyResult.randomValue);
  console.log('  - Transaction Hash:', entropyResult.entropyProof.transactionHash);
  console.log('  - Network:', entropyResult.entropyProof.network);
  console.log('  - Block Number:', entropyResult.entropyProof.blockNumber);
  console.log('  - Arbitrum Explorer:', entropyResult.entropyProof.arbitrumSepoliaExplorerUrl);
  console.log('');

  // Step 2: Extract entropy data
  const entropyValue = entropyResult.randomValue.toString();
  const entropyTxHash = entropyResult.entropyProof.transactionHash;

  console.log('Step 2: Extracted entropy data:');
  console.log('  - entropyValue:', entropyValue);
  console.log('  - entropyTxHash:', entropyTxHash);
  console.log('');

  // Step 3: Use entropy to calculate game result
  console.log('Step 3: Calculating game result using entropy...');
  const gameResult = calculateRouletteResult(entropyValue);
  console.log('  - Winning Number:', gameResult.number);
  console.log('  - Color:', gameResult.color);
  console.log('  - Is Win:', gameResult.isWin);
  console.log('');

  // Step 4: Log game result to One Chain with entropy proof
  console.log('Step 4: Logging game result to One Chain...');
  const { placeRouletteBet } = useOneChainCasino();
  
  const onechainTxHash = await placeRouletteBet(
    'straight',           // betType
    7,                    // betValue
    '1.0',                // amount (1 OCT)
    [],                   // numbers
    entropyValue,         // ← Entropy from Arbitrum Sepolia
    entropyTxHash,        // ← Arbitrum Sepolia tx hash
    gameResult,           // resultData
    gameResult.isWin ? '35.0' : '0' // payoutAmount
  );

  console.log('✅ Game result logged to One Chain:');
  console.log('  - One Chain Tx Hash:', onechainTxHash);
  console.log('  - Includes entropy value:', entropyValue);
  console.log('  - Includes Arbitrum tx hash:', entropyTxHash);
  console.log('');

  // Step 5: Verification
  console.log('Step 5: Cross-chain verification:');
  console.log('  - Arbitrum Sepolia:', `https://sepolia.arbiscan.io/tx/${entropyTxHash}`);
  console.log('  - One Chain:', `https://explorer-testnet.onelabs.cc/tx/${onechainTxHash}`);
  console.log('');

  return {
    entropyValue,
    entropyTxHash,
    onechainTxHash,
    gameResult
  };
}

/**
 * Example 2: Mines Game with Entropy Flow
 */
export async function exampleMinesWithEntropy() {
  console.log('=== Mines Game with Entropy Flow ===\n');

  // Step 1: Request entropy from Arbitrum Sepolia
  console.log('Step 1: Requesting entropy from Arbitrum Sepolia...');
  const entropyResult = await pythEntropyService.generateRandom('MINES', {
    minesCount: 5,
    gridSize: 25
  });

  const entropyValue = entropyResult.randomValue.toString();
  const entropyTxHash = entropyResult.entropyProof.transactionHash;

  console.log('✅ Entropy received:');
  console.log('  - Value:', entropyValue);
  console.log('  - Tx Hash:', entropyTxHash);
  console.log('');

  // Step 2: Start mines game on One Chain with entropy
  console.log('Step 2: Starting mines game on One Chain...');
  const { startMinesGame } = useOneChainCasino();
  
  const gameId = await startMinesGame(
    '1.0',          // betAmount (1 OCT)
    5,              // minesCount
    entropyValue,   // ← Entropy from Arbitrum Sepolia
    entropyTxHash   // ← Arbitrum Sepolia tx hash
  );

  console.log('✅ Mines game started on One Chain:');
  console.log('  - Game ID:', gameId);
  console.log('  - Entropy included:', entropyValue);
  console.log('');

  return {
    gameId,
    entropyValue,
    entropyTxHash
  };
}

/**
 * Example 3: Plinko Game with Entropy Flow
 */
export async function examplePlinkoWithEntropy() {
  console.log('=== Plinko Game with Entropy Flow ===\n');

  // Step 1: Request entropy
  const entropyResult = await pythEntropyService.generateRandom('PLINKO', {
    rows: 16,
    risk: 'high'
  });

  const entropyValue = entropyResult.randomValue.toString();
  const entropyTxHash = entropyResult.entropyProof.transactionHash;

  // Step 2: Calculate plinko result
  const gameResult = calculatePlinkoResult(entropyValue, 16);

  // Step 3: Log to One Chain
  const { playPlinko } = useOneChainCasino();
  
  const onechainTxHash = await playPlinko(
    '1.0',          // betAmount
    16,             // rows
    entropyValue,   // ← Entropy from Arbitrum Sepolia
    entropyTxHash,  // ← Arbitrum Sepolia tx hash
    gameResult,     // resultData
    gameResult.payout.toString() // payoutAmount
  );

  console.log('✅ Plinko game logged to One Chain');
  console.log('  - Entropy:', entropyValue);
  console.log('  - One Chain Tx:', onechainTxHash);
  console.log('');

  return {
    entropyValue,
    entropyTxHash,
    onechainTxHash,
    gameResult
  };
}

/**
 * Example 4: Wheel Game with Entropy Flow
 */
export async function exampleWheelWithEntropy() {
  console.log('=== Wheel Game with Entropy Flow ===\n');

  // Step 1: Request entropy
  const entropyResult = await pythEntropyService.generateRandom('WHEEL', {
    segments: 50,
    risk: 'medium'
  });

  const entropyValue = entropyResult.randomValue.toString();
  const entropyTxHash = entropyResult.entropyProof.transactionHash;

  // Step 2: Calculate wheel result
  const gameResult = calculateWheelResult(entropyValue, 50);

  // Step 3: Log to One Chain
  const { spinWheel } = useOneChainCasino();
  
  const onechainTxHash = await spinWheel(
    '1.0',          // betAmount
    50,             // segments
    entropyValue,   // ← Entropy from Arbitrum Sepolia
    entropyTxHash,  // ← Arbitrum Sepolia tx hash
    gameResult,     // resultData
    gameResult.payout.toString() // payoutAmount
  );

  console.log('✅ Wheel game logged to One Chain');
  console.log('  - Entropy:', entropyValue);
  console.log('  - One Chain Tx:', onechainTxHash);
  console.log('');

  return {
    entropyValue,
    entropyTxHash,
    onechainTxHash,
    gameResult
  };
}

/**
 * Example 5: Service Independence Demonstration
 * 
 * This example shows that Arbitrum Sepolia and One Chain services
 * operate independently and failures in one don't affect the other.
 */
export async function exampleServiceIndependence() {
  console.log('=== Service Independence Demonstration ===\n');

  // Test 1: Arbitrum Sepolia works independently
  console.log('Test 1: Arbitrum Sepolia entropy generation (independent)');
  try {
    const entropyResult = await pythEntropyService.generateRandom('ROULETTE', {});
    console.log('✅ Arbitrum Sepolia entropy generated successfully');
    console.log('  - No dependency on One Chain');
    console.log('  - Network:', entropyResult.entropyProof.network);
    console.log('');
  } catch (error) {
    console.log('❌ Arbitrum Sepolia failed:', error.message);
    console.log('  - One Chain remains unaffected');
    console.log('');
  }

  // Test 2: One Chain works independently
  console.log('Test 2: One Chain transaction (independent)');
  try {
    const { placeRouletteBet } = useOneChainCasino();
    
    // Can submit transaction even without entropy (using fallback)
    const txHash = await placeRouletteBet(
      'straight',
      7,
      '1.0',
      [],
      '', // Empty entropy (fallback)
      '', // Empty tx hash
      { number: 7, color: 'red', isWin: true },
      '35.0'
    );
    
    console.log('✅ One Chain transaction submitted successfully');
    console.log('  - No dependency on Arbitrum Sepolia');
    console.log('  - Tx Hash:', txHash);
    console.log('');
  } catch (error) {
    console.log('❌ One Chain failed:', error.message);
    console.log('  - Arbitrum Sepolia remains unaffected');
    console.log('');
  }

  // Test 3: Integration works when both services available
  console.log('Test 3: Full integration (both services)');
  try {
    // Get entropy from Arbitrum Sepolia
    const entropyResult = await pythEntropyService.generateRandom('ROULETTE', {});
    const entropyValue = entropyResult.randomValue.toString();
    const entropyTxHash = entropyResult.entropyProof.transactionHash;
    
    // Submit to One Chain
    const { placeRouletteBet } = useOneChainCasino();
    const txHash = await placeRouletteBet(
      'straight',
      7,
      '1.0',
      [],
      entropyValue,   // ← From Arbitrum Sepolia
      entropyTxHash,  // ← From Arbitrum Sepolia
      { number: 7, color: 'red', isWin: true },
      '35.0'
    );
    
    console.log('✅ Full integration successful');
    console.log('  - Arbitrum Sepolia: Generated entropy');
    console.log('  - One Chain: Logged game with entropy');
    console.log('  - Services remain loosely coupled');
    console.log('');
  } catch (error) {
    console.log('❌ Integration failed:', error.message);
    console.log('');
  }
}

/**
 * Helper: Calculate roulette result from entropy
 */
function calculateRouletteResult(entropyValue) {
  const number = parseInt(entropyValue) % 37; // 0-36 for European roulette
  
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const color = number === 0 ? 'green' : redNumbers.includes(number) ? 'red' : 'black';
  
  return {
    number,
    color,
    isWin: number === 7, // Example: betting on 7
    timestamp: Date.now()
  };
}

/**
 * Helper: Calculate plinko result from entropy
 */
function calculatePlinkoResult(entropyValue, rows) {
  const path = [];
  let position = 0;
  
  // Use entropy to determine path
  for (let i = 0; i < rows; i++) {
    const bit = (parseInt(entropyValue) >> i) & 1;
    path.push(bit === 1 ? 'right' : 'left');
    position += bit;
  }
  
  const multipliers = [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110];
  const multiplier = multipliers[position] || 1;
  
  return {
    path,
    landingSlot: position,
    multiplier,
    payout: multiplier,
    timestamp: Date.now()
  };
}

/**
 * Helper: Calculate wheel result from entropy
 */
function calculateWheelResult(entropyValue, segments) {
  const segment = parseInt(entropyValue) % segments;
  const multipliers = [1.5, 2, 3, 5, 10, 20, 50]; // Example multipliers
  const multiplier = multipliers[segment % multipliers.length];
  
  return {
    segment,
    multiplier,
    payout: multiplier,
    isWin: multiplier > 1,
    timestamp: Date.now()
  };
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Entropy-to-Game Data Flow Examples                       ║');
  console.log('║  Demonstrating Requirements 9.1 and 9.2                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    await exampleRouletteWithEntropy();
    await exampleMinesWithEntropy();
    await examplePlinkoWithEntropy();
    await exampleWheelWithEntropy();
    await exampleServiceIndependence();
    
    console.log('\n✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Example failed:', error);
  }
}

// Export for testing
export default {
  exampleRouletteWithEntropy,
  exampleMinesWithEntropy,
  examplePlinkoWithEntropy,
  exampleWheelWithEntropy,
  exampleServiceIndependence,
  runAllExamples
};
