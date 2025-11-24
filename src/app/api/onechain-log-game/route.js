import { NextResponse } from 'next/server';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient } from '@mysten/sui/client';
import { bcs } from '@mysten/sui/bcs';

/**
 * OneChain Game Logging API
 * Signs and executes game logging transactions using treasury wallet
 * This keeps the treasury private key secure on the server
 */

// Initialize Sui client for OneChain
const suiClient = new SuiClient({
  url: process.env.NEXT_PUBLIC_ONECHAIN_RPC_URL || 'https://rpc-testnet.onelabs.cc'
});

/**
 * POST /api/onechain-log-game
 * Log game result to OneChain using treasury wallet
 * 
 * Body: {
 *   packageId: string,
 *   module: string,
 *   function: string,
 *   arguments: any[],
 *   typeArguments: string[]
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { packageId, module, functionName, arguments: args, typeArguments = [] } = body;

    console.log('🎮 ONE CHAIN API: Logging game result...');
    console.log('📦 Package:', packageId);
    console.log('🔧 Function:', `${module}::${functionName}`);

    // Validate required fields
    if (!packageId || !module || !functionName || !args) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: packageId, module, functionName, arguments'
      }, { status: 400 });
    }

    // Get treasury private key from environment
    const treasuryPrivateKey = process.env.ONECHAIN_TREASURY_PRIVATE_KEY;
    if (!treasuryPrivateKey) {
      console.error('❌ ONE CHAIN API: Treasury private key not configured');
      return NextResponse.json({
        success: false,
        error: 'Treasury wallet not configured. Please set ONECHAIN_TREASURY_PRIVATE_KEY in .env'
      }, { status: 500 });
    }

    // Create keypair from private key (base64 encoded)
    // OneChain uses Ed25519 keypairs like Sui
    // Sui keystore format: flag (1 byte) || private_key (32 bytes)
    // We need to skip the first byte (flag) to get the 32-byte private key
    const privateKeyBuffer = Buffer.from(treasuryPrivateKey, 'base64');
    
    console.log('🔑 Private key buffer length:', privateKeyBuffer.length);
    
    // Skip the first byte (flag) if present
    const secretKey = privateKeyBuffer.length === 33 
      ? privateKeyBuffer.slice(1) 
      : privateKeyBuffer;
    
    console.log('🔑 Secret key length:', secretKey.length);
    
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const treasuryAddress = keypair.getPublicKey().toSuiAddress();
    
    console.log('🏦 Treasury address:', treasuryAddress);

    // Get OCT coins for gas
    console.log('💰 Fetching OCT coins for gas...');
    const coins = await suiClient.getCoins({
      owner: treasuryAddress,
      coinType: '0x2::oct::OCT'
    });

    if (!coins.data || coins.data.length === 0) {
      console.error('❌ ONE CHAIN API: No OCT coins found in treasury');
      return NextResponse.json({
        success: false,
        error: 'No OCT coins available in treasury wallet. Please fund the treasury with OCT tokens.',
        treasuryAddress
      }, { status: 500 });
    }

    console.log(`✓ Found ${coins.data.length} OCT coin(s)`);
    console.log(`💰 Total balance: ${coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n)} MIST`);

    // Build transaction
    const tx = new Transaction();
    
    // Set gas payment using OCT coins
    // Use the first coin with sufficient balance
    const gasCoin = coins.data.find(coin => BigInt(coin.balance) >= 10000000n) || coins.data[0];
    tx.setGasPayment([{
      objectId: gasCoin.coinObjectId,
      version: gasCoin.version,
      digest: gasCoin.digest
    }]);
    
    console.log(`⛽ Using gas coin: ${gasCoin.coinObjectId} (${gasCoin.balance} MIST)`);
    
    // Convert arguments to proper format
    const txArguments = args.map((arg, index) => {
      // Last argument is Clock object (0x6)
      if (index === args.length - 1 && arg === '0x6') {
        return tx.object(arg);
      }
      
      // First argument is player address
      if (index === 0 && typeof arg === 'string' && arg.startsWith('0x')) {
        return tx.pure(bcs.Address.serialize(arg).toBytes());
      }
      
      // For vector<u8> (byte arrays)
      if (Array.isArray(arg)) {
        return tx.pure(bcs.vector(bcs.U8).serialize(arg).toBytes());
      }
      
      // For u64 numbers (bet_amount, payout_amount)
      if (typeof arg === 'string' && /^\d+$/.test(arg)) {
        return tx.pure(bcs.U64.serialize(arg).toBytes());
      }
      
      // For other types
      return tx.pure(arg);
    });

    tx.moveCall({
      target: `${packageId}::${module}::${functionName}`,
      arguments: txArguments,
      typeArguments: typeArguments
    });

    // Set gas budget
    tx.setGasBudget(10000000); // 0.01 OCT

    console.log('🔐 ONE CHAIN API: Signing transaction with treasury...');

    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true
      }
    });

    console.log('✅ ONE CHAIN API: Transaction executed:', result.digest);

    // Check if transaction was successful
    if (result.effects?.status?.status !== 'success') {
      console.error('❌ ONE CHAIN API: Transaction failed:', result.effects?.status);
      return NextResponse.json({
        success: false,
        error: 'Transaction execution failed',
        details: result.effects?.status
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transactionDigest: result.digest,
      effects: result.effects,
      events: result.events,
      objectChanges: result.objectChanges
    });

  } catch (error) {
    console.error('❌ ONE CHAIN API: Error logging game:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
