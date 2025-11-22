/**
 * Verification script for Pyth Entropy configuration
 * This script verifies that the Pyth Entropy integration is correctly configured for Arbitrum Sepolia
 */

import PYTH_ENTROPY_CONFIG from '../pythEntropy.js';
import { ARBITRUM_TREASURY_CONFIG } from '../arbitrumTreasury.js';

console.log('='.repeat(80));
console.log('PYTH ENTROPY CONFIGURATION VERIFICATION');
console.log('='.repeat(80));

// Verify primary network configuration
console.log('\n📋 PRIMARY NETWORK CONFIGURATION:');
console.log(`  Network Name: ${PYTH_ENTROPY_CONFIG.NETWORK.name}`);
console.log(`  Chain ID: ${PYTH_ENTROPY_CONFIG.NETWORK.chainId}`);
console.log(`  RPC URL: ${PYTH_ENTROPY_CONFIG.NETWORK.rpcUrl}`);
console.log(`  Entropy Contract: ${PYTH_ENTROPY_CONFIG.NETWORK.entropyContract}`);
console.log(`  Entropy Provider: ${PYTH_ENTROPY_CONFIG.NETWORK.entropyProvider}`);
console.log(`  Explorer URL: ${PYTH_ENTROPY_CONFIG.NETWORK.explorerUrl}`);
console.log(`  Currency: ${PYTH_ENTROPY_CONFIG.NETWORK.currency}`);

// Verify it's Arbitrum Sepolia
console.log('\n✅ VERIFICATION CHECKS:');
const checks = [
  {
    name: 'Network is Arbitrum Sepolia',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.name === 'Arbitrum Sepolia',
    expected: 'Arbitrum Sepolia',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.name
  },
  {
    name: 'Chain ID is 421614',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.chainId === 421614,
    expected: '421614',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.chainId.toString()
  },
  {
    name: 'RPC URL contains arbitrum',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.rpcUrl.includes('arbitrum'),
    expected: 'URL containing "arbitrum"',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.rpcUrl
  },
  {
    name: 'Explorer URL is Arbiscan',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.explorerUrl.includes('arbiscan'),
    expected: 'URL containing "arbiscan"',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.explorerUrl
  },
  {
    name: 'Currency is ETH (not MON)',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.currency === 'ETH',
    expected: 'ETH',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.currency
  },
  {
    name: 'Default network is arbitrum-sepolia',
    pass: PYTH_ENTROPY_CONFIG.DEFAULT_NETWORK === 'arbitrum-sepolia',
    expected: 'arbitrum-sepolia',
    actual: PYTH_ENTROPY_CONFIG.DEFAULT_NETWORK
  },
  {
    name: 'Entropy explorer URL uses arbitrum-sepolia chain',
    pass: PYTH_ENTROPY_CONFIG.NETWORK.entropyExplorerUrl.includes('arbitrum-sepolia'),
    expected: 'URL containing "arbitrum-sepolia"',
    actual: PYTH_ENTROPY_CONFIG.NETWORK.entropyExplorerUrl
  },
  {
    name: 'No Monad references in supported networks',
    pass: !PYTH_ENTROPY_CONFIG.getSupportedNetworks().includes('monad-testnet'),
    expected: 'No "monad-testnet" in supported networks',
    actual: PYTH_ENTROPY_CONFIG.getSupportedNetworks().join(', ')
  }
];

let allPassed = true;
checks.forEach(check => {
  const status = check.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status}: ${check.name}`);
  if (!check.pass) {
    console.log(`    Expected: ${check.expected}`);
    console.log(`    Actual: ${check.actual}`);
    allPassed = false;
  }
});

// Verify Arbitrum Treasury Configuration
console.log('\n📋 ARBITRUM TREASURY CONFIGURATION:');
console.log(`  Treasury Address: ${ARBITRUM_TREASURY_CONFIG.ADDRESS}`);
console.log(`  Network: ${ARBITRUM_TREASURY_CONFIG.NETWORK.CHAIN_NAME}`);
console.log(`  Chain ID: ${ARBITRUM_TREASURY_CONFIG.NETWORK.CHAIN_ID}`);
console.log(`  RPC URL: ${ARBITRUM_TREASURY_CONFIG.NETWORK.RPC_URL}`);
console.log(`  Entropy Contract: ${ARBITRUM_TREASURY_CONFIG.ENTROPY.CONTRACT}`);

// Verify helper functions
console.log('\n📋 HELPER FUNCTIONS:');
console.log(`  isNetworkSupported('arbitrum-sepolia'): ${PYTH_ENTROPY_CONFIG.isNetworkSupported('arbitrum-sepolia')}`);
console.log(`  isNetworkSupported(421614): ${PYTH_ENTROPY_CONFIG.isNetworkSupported(421614)}`);
console.log(`  isArbitrumSepolia(): ${PYTH_ENTROPY_CONFIG.isArbitrumSepolia()}`);
console.log(`  getEntropyContract(): ${PYTH_ENTROPY_CONFIG.getEntropyContract()}`);
console.log(`  getEntropyProvider(): ${PYTH_ENTROPY_CONFIG.getEntropyProvider()}`);

// Final result
console.log('\n' + '='.repeat(80));
if (allPassed) {
  console.log('✅ ALL VERIFICATION CHECKS PASSED');
  console.log('Pyth Entropy is correctly configured for Arbitrum Sepolia');
} else {
  console.log('❌ SOME VERIFICATION CHECKS FAILED');
  console.log('Please review the configuration');
}
console.log('='.repeat(80));

// Export for testing
export { checks, allPassed };
