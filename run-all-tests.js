/**
 * Comprehensive Test Runner
 * Runs all available tests in the project
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [
  // Configuration tests
  'src/config/__tests__/onechainTestnetConfig.test.js',
  
  // Verification scripts
  'src/config/__tests__/pythEntropy.verification.js',
  'src/config/__tests__/task12-env-verification.js',
  'src/services/__tests__/task10-verification.js',
  'src/hooks/__tests__/entropy-flow-example.js',
  'src/hooks/__tests__/gameLogging-integration-example.js',
  'src/services/__tests__/errorHandling-demo.js',
  'src/components/__tests__/task14-explorer-links-demo.js',
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log('\n🧪 Running All Tests\n');
console.log('='.repeat(80));

async function runTest(testFile) {
  return new Promise((resolve) => {
    console.log(`\n📝 Running: ${testFile}`);
    console.log('-'.repeat(80));
    
    const child = spawn('node', [testFile], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      totalTests++;
      if (code === 0) {
        passedTests++;
        console.log(`✅ PASSED: ${testFile}`);
        resolve(true);
      } else {
        failedTests++;
        console.log(`❌ FAILED: ${testFile} (exit code: ${code})`);
        resolve(false);
      }
    });

    child.on('error', (error) => {
      totalTests++;
      failedTests++;
      console.log(`❌ ERROR: ${testFile} - ${error.message}`);
      resolve(false);
    });
  });
}

async function runAllTests() {
  for (const testFile of testFiles) {
    await runTest(testFile);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Test Summary:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed.\n`);
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
