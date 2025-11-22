/**
 * Basic validation tests for One Chain Testnet Configuration
 * These tests verify the configuration structure and values
 */

const {
  ONECHAIN_TESTNET_CONFIG,
  ONECHAIN_TESTNET_TOKENS,
  ONECHAIN_CASINO_CONFIG,
} = require('../onechainTestnetConfig');

// Simple test runner
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertDefined(value, message) {
  if (value === undefined || value === null) {
    throw new Error(message || 'Value is undefined or null');
  }
}

// Run tests
console.log('\n🧪 Testing One Chain Testnet Configuration\n');

test('ONECHAIN_TESTNET_CONFIG should be defined', () => {
  assertDefined(ONECHAIN_TESTNET_CONFIG, 'ONECHAIN_TESTNET_CONFIG is not defined');
});

test('ONECHAIN_TESTNET_CONFIG should have correct network name', () => {
  assertEqual(ONECHAIN_TESTNET_CONFIG.name, 'One Chain Testnet', 'Network name is incorrect');
});

test('ONECHAIN_TESTNET_CONFIG should have correct network identifier', () => {
  assertEqual(ONECHAIN_TESTNET_CONFIG.network, 'onechain-testnet', 'Network identifier is incorrect');
});

test('ONECHAIN_TESTNET_CONFIG should have testnet flag set to true', () => {
  assertEqual(ONECHAIN_TESTNET_CONFIG.testnet, true, 'Testnet flag should be true');
});

test('ONECHAIN_TESTNET_CONFIG should have native currency with OCT symbol', () => {
  assertEqual(ONECHAIN_TESTNET_CONFIG.nativeCurrency.symbol, 'OCT', 'Currency symbol should be OCT');
});

test('ONECHAIN_TESTNET_CONFIG should have native currency with 18 decimals', () => {
  assertEqual(ONECHAIN_TESTNET_CONFIG.nativeCurrency.decimals, 18, 'Currency decimals should be 18');
});

test('ONECHAIN_TESTNET_CONFIG should have RPC URLs defined', () => {
  assertDefined(ONECHAIN_TESTNET_CONFIG.rpcUrls, 'RPC URLs not defined');
  assertDefined(ONECHAIN_TESTNET_CONFIG.rpcUrls.default, 'Default RPC URL not defined');
  assertDefined(ONECHAIN_TESTNET_CONFIG.rpcUrls.default.http, 'Default HTTP RPC URL not defined');
});

test('ONECHAIN_TESTNET_CONFIG should have block explorer defined', () => {
  assertDefined(ONECHAIN_TESTNET_CONFIG.blockExplorers, 'Block explorers not defined');
  assertDefined(ONECHAIN_TESTNET_CONFIG.blockExplorers.default, 'Default block explorer not defined');
  assertDefined(ONECHAIN_TESTNET_CONFIG.blockExplorers.default.url, 'Block explorer URL not defined');
});

test('ONECHAIN_TESTNET_CONFIG should have faucet URL defined', () => {
  assertDefined(ONECHAIN_TESTNET_CONFIG.faucetUrl, 'Faucet URL not defined');
});

test('ONECHAIN_TESTNET_TOKENS should have OCT token defined', () => {
  assertDefined(ONECHAIN_TESTNET_TOKENS.OCT, 'OCT token not defined');
});

test('OCT token should have correct symbol', () => {
  assertEqual(ONECHAIN_TESTNET_TOKENS.OCT.symbol, 'OCT', 'OCT token symbol is incorrect');
});

test('OCT token should have 18 decimals', () => {
  assertEqual(ONECHAIN_TESTNET_TOKENS.OCT.decimals, 18, 'OCT token decimals should be 18');
});

test('OCT token should be marked as native', () => {
  assertEqual(ONECHAIN_TESTNET_TOKENS.OCT.isNative, true, 'OCT token should be marked as native');
});

test('OCT token should have native address', () => {
  assertEqual(ONECHAIN_TESTNET_TOKENS.OCT.address, 'native', 'OCT token address should be "native"');
});

test('ONECHAIN_CASINO_CONFIG should be defined', () => {
  assertDefined(ONECHAIN_CASINO_CONFIG, 'ONECHAIN_CASINO_CONFIG is not defined');
});

test('ONECHAIN_CASINO_CONFIG should have game configurations', () => {
  assertDefined(ONECHAIN_CASINO_CONFIG.games, 'Game configurations not defined');
  assertDefined(ONECHAIN_CASINO_CONFIG.games.MINES, 'MINES game config not defined');
  assertDefined(ONECHAIN_CASINO_CONFIG.games.ROULETTE, 'ROULETTE game config not defined');
  assertDefined(ONECHAIN_CASINO_CONFIG.games.WHEEL, 'WHEEL game config not defined');
});

console.log('\n✅ All tests passed!\n');
