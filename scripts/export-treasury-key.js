/**
 * Export Treasury Private Key for Backend API
 * 
 * This script exports the treasury wallet's private key in base64 format
 * for use in the withdraw API.
 * 
 * SECURITY WARNING:
 * - Never commit private keys to version control
 * - Use environment variables in production
 * - Consider using secure key management (AWS KMS, HashiCorp Vault)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Sui keystore path
const keystorePath = path.join(os.homedir(), '.sui', 'sui_config', 'sui.keystore');

// Treasury wallet address
const TREASURY_ADDRESS = '0xdeac1680f935c0d5265b4e0656a2436361d8adebee0adf3060ef6c06e95c89eb';

try {
  console.log('📂 Reading Sui keystore...');
  console.log('Path:', keystorePath);
  
  // Read keystore
  const keystoreContent = fs.readFileSync(keystorePath, 'utf8');
  const keys = JSON.parse(keystoreContent);
  
  console.log(`\n✅ Found ${keys.length} keys in keystore\n`);
  
  // Import Sui SDK to derive addresses
  const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
  const { fromBase64 } = require('@mysten/sui/utils');
  
  // Find the key that matches our treasury address
  let treasuryKey = null;
  
  for (const keyBase64 of keys) {
    try {
      // Sui keystore format includes a flag byte at the beginning
      // For Ed25519, the format is: [flag_byte (0x00)] + [32-byte private key]
      const fullKeyBytes = fromBase64(keyBase64);
      
      // Skip the first byte (flag) and take the next 32 bytes
      const privateKeyBytes = fullKeyBytes.slice(1, 33);
      
      const keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
      const address = keypair.getPublicKey().toSuiAddress();
      
      console.log(`🔑 Key address: ${address}`);
      
      if (address === TREASURY_ADDRESS) {
        treasuryKey = keyBase64;
        console.log('\n✅ Found treasury key!');
        break;
      }
    } catch (error) {
      console.error('Error processing key:', error.message);
    }
  }
  
  if (!treasuryKey) {
    console.error('\n❌ Treasury key not found in keystore!');
    console.error(`Looking for address: ${TREASURY_ADDRESS}`);
    process.exit(1);
  }
  
  console.log('\n📋 Add this to your .env file:');
  console.log('─'.repeat(80));
  console.log(`ONECHAIN_TREASURY_PRIVATE_KEY=${treasuryKey}`);
  console.log('─'.repeat(80));
  console.log('\n⚠️  SECURITY WARNING:');
  console.log('- Never commit this key to version control');
  console.log('- Keep your .env file secure');
  console.log('- Use secure key management in production\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nMake sure:');
  console.error('1. Sui CLI is installed');
  console.error('2. You have created a wallet with: sui client new-address ed25519');
  console.error('3. The keystore file exists at:', keystorePath);
  process.exit(1);
}
