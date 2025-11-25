import { NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';

// One Chain Treasury wallet address
const ONECHAIN_TREASURY_ADDRESS = process.env.ONECHAIN_CASINO_WALLET_ADDRESS;

// One Chain RPC URL
const ONECHAIN_RPC = process.env.NEXT_PUBLIC_ONECHAIN_TESTNET_RPC || 'https://rpc-testnet.onelabs.cc:443';

// Create Sui client
const suiClient = new SuiClient({ url: ONECHAIN_RPC });

// Load treasury keypair from environment
// Note: In production, use secure key management (e.g., AWS KMS, HashiCorp Vault)
let treasuryKeypair = null;
try {
  // Load from Sui keystore format (base64 encoded with flag byte)
  const privateKeyBase64 = process.env.ONECHAIN_TREASURY_PRIVATE_KEY;
  if (privateKeyBase64) {
    const fullKeyBytes = fromBase64(privateKeyBase64);
    // Skip the first byte (flag) and take the next 32 bytes
    const privateKeyBytes = fullKeyBytes.slice(1, 33);
    treasuryKeypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
    console.log('✅ Treasury keypair loaded successfully');
    console.log('Treasury address:', treasuryKeypair.getPublicKey().toSuiAddress());
  }
} catch (error) {
  console.error('❌ Failed to load treasury keypair:', error);
}

export async function POST(request) {
  try {
    const { userAddress, amount, network } = await request.json();

    console.log('📥 Received withdrawal request:', { userAddress, amount, network });

    // Validate input
    if (!userAddress || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    if (!treasuryKeypair || !ONECHAIN_TREASURY_ADDRESS) {
      return NextResponse.json(
        { error: 'Treasury wallet not configured' },
        { status: 500 }
      );
    }

    console.log(`🏦 Processing One Chain withdrawal: ${amount} OCT to ${userAddress}`);
    console.log(`📍 Treasury: ${ONECHAIN_TREASURY_ADDRESS}`);

    // Get OCT coins from treasury (One Chain uses 0x2::oct::OCT)
    let treasuryBalance = BigInt(0);
    let gasCoin = null;
    let paymentCoin = null;
    
    try {
      // Get OCT coins
      const coins = await suiClient.getCoins({
        owner: ONECHAIN_TREASURY_ADDRESS,
        coinType: '0x2::oct::OCT'
      });

      if (!coins.data || coins.data.length === 0) {
        return NextResponse.json(
          { error: 'No OCT coins found in treasury wallet' },
          { status: 400 }
        );
      }

      // Calculate total balance
      treasuryBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
      console.log(`💰 Treasury OCT balance: ${Number(treasuryBalance) / 1e9} OCT`);
      console.log(`📦 Found ${coins.data.length} OCT coin(s)`);

      // Convert amount to MIST (1 OCT = 1,000,000,000 MIST)
      const amountInMist = BigInt(Math.floor(amount * 1e9));
      const estimatedGas = BigInt(10000000); // 0.01 OCT for gas
      const totalNeeded = amountInMist + estimatedGas;

      // Check if treasury has sufficient funds
      if (treasuryBalance < totalNeeded) {
        return NextResponse.json(
          { 
            error: `Insufficient treasury funds. Available: ${Number(treasuryBalance) / 1e9} OCT, Requested: ${amount} OCT (+ gas)` 
          },
          { status: 400 }
        );
      }

      // Find a coin with sufficient balance for payment
      paymentCoin = coins.data.find(coin => BigInt(coin.balance) >= amountInMist);
      if (!paymentCoin) {
        // If no single coin has enough, use the largest one (will need to merge first)
        paymentCoin = coins.data.reduce((max, coin) => 
          BigInt(coin.balance) > BigInt(max.balance) ? coin : max
        );
      }

      // Find a coin for gas (prefer one with sufficient balance, otherwise use any)
      gasCoin = coins.data.find(coin => BigInt(coin.balance) >= estimatedGas) || coins.data[0];

      console.log(`💳 Using payment coin: ${paymentCoin.coinObjectId} (${paymentCoin.balance} MIST)`);
      console.log(`⛽ Using gas coin: ${gasCoin.coinObjectId} (${gasCoin.balance} MIST)`);

    } catch (balanceError) {
      console.error('⚠️ Could not get treasury OCT coins:', balanceError);
      return NextResponse.json(
        { error: 'Failed to get treasury OCT coins: ' + balanceError.message },
        { status: 500 }
      );
    }

    // Convert amount to MIST
    const amountInMist = BigInt(Math.floor(amount * 1e9));
    const estimatedGas = BigInt(10000000); // 0.01 OCT for gas

    // Create Sui transaction
    const tx = new Transaction();
    
    // Set gas payment using OCT coin
    tx.setGasPayment([{
      objectId: gasCoin.coinObjectId,
      version: gasCoin.version,
      digest: gasCoin.digest
    }]);
    
    // Split coin for exact amount from payment coin
    const [coin] = tx.splitCoins(tx.object(paymentCoin.coinObjectId), [amountInMist.toString()]);
    
    // Transfer to user
    tx.transferObjects([coin], userAddress);
    
    // Set gas budget
    tx.setGasBudget(estimatedGas.toString());

    console.log('🔧 Executing withdrawal transaction...');

    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransaction({
      signer: treasuryKeypair,
      transaction: tx,
    });

    console.log(`📤 Transaction executed: ${result.digest}`);
    console.log(`✅ Withdrew ${amount} OCT to ${userAddress}`);

    return NextResponse.json({
      success: true,
      transactionDigest: result.digest,
      amount: amount,
      userAddress: userAddress,
      treasuryAddress: ONECHAIN_TREASURY_ADDRESS,
      status: 'success',
      message: 'Withdrawal successful. Check One Chain explorer for confirmation.',
      explorerUrl: `https://onescan.cc/testnet/tx/${result.digest}`
    });

  } catch (error) {
    console.error('Withdraw API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    const errorMessage = error?.message || 'Unknown error occurred';
    const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Withdrawal failed: ${safeErrorMessage}` },
      { status: 500 }
    );
  }
}

// GET endpoint to check treasury balance
export async function GET() {
  try {
    if (!ONECHAIN_TREASURY_ADDRESS) {
      return NextResponse.json(
        { error: 'Treasury not configured' },
        { status: 500 }
      );
    }

    try {
      // Get OCT coins (One Chain uses 0x2::oct::OCT)
      const coins = await suiClient.getCoins({
        owner: ONECHAIN_TREASURY_ADDRESS,
        coinType: '0x2::oct::OCT'
      });

      const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
      const balanceInOct = Number(totalBalance) / 1e9;

      return NextResponse.json({
        treasuryAddress: ONECHAIN_TREASURY_ADDRESS,
        balance: balanceInOct,
        balanceMist: totalBalance.toString(),
        coinCount: coins.data.length,
        status: 'active',
        network: 'onechain-testnet',
        coinType: '0x2::oct::OCT'
      });
    } catch (balanceError) {
      console.error('Balance check error:', balanceError);
      return NextResponse.json({
        treasuryAddress: ONECHAIN_TREASURY_ADDRESS,
        balance: 0,
        balanceMist: '0',
        status: 'error',
        error: balanceError.message
      });
    }

  } catch (error) {
    console.error('Treasury balance check error:', error);
    return NextResponse.json(
      { error: 'Failed to check treasury balance: ' + error.message },
      { status: 500 }
    );
  }
}