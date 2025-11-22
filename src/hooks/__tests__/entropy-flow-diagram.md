# Entropy-to-Game Data Flow Diagram

## Complete System Architecture

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                         CASINO APPLICATION                                ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │                    Game Component Layer                         │    ║
║  │  (Roulette, Mines, Plinko, Wheel Components)                   │    ║
║  └──────────────┬──────────────────────────────┬───────────────────┘    ║
║                 │                               │                        ║
║                 │ 1. Request Entropy            │ 3. Log Game Result    ║
║                 │                               │    with Entropy       ║
║                 ▼                               ▼                        ║
║  ┌──────────────────────────┐    ┌──────────────────────────────┐      ║
║  │   usePythEntropy Hook    │    │  useOneChainCasino Hook      │      ║
║  │  (Arbitrum Sepolia)      │    │  (One Chain Testnet)         │      ║
║  └──────────┬───────────────┘    └──────────┬───────────────────┘      ║
║             │                                │                           ║
╚═════════════╪════════════════════════════════╪═══════════════════════════╝
              │                                │
              │ 2. Entropy Response            │ 4. Transaction with
              │    { randomValue,              │    Entropy Proof
              │      entropyTxHash }           │
              │                                │
┌─────────────▼────────────────┐  ┌───────────▼──────────────────┐
│  Arbitrum Sepolia Network    │  │  One Chain Testnet Network   │
│  ┌────────────────────────┐  │  │  ┌────────────────────────┐  │
│  │  Pyth Entropy Service  │  │  │  │  Game Logger Contract  │  │
│  │  - Generate Random     │  │  │  │  - Log Game Result     │  │
│  │  - Return Proof        │  │  │  │  - Store Entropy Ref   │  │
│  └────────────────────────┘  │  │  └────────────────────────┘  │
│                               │  │                               │
│  Transaction Hash:            │  │  Transaction Hash:            │
│  0xarbitrum123...             │  │  0xonechain456...             │
│                               │  │                               │
│  Explorer:                    │  │  Explorer:                    │
│  sepolia.arbiscan.io          │  │  explorer-testnet.onelabs.cc  │
└───────────────────────────────┘  └───────────────────────────────┘
```

## Detailed Data Flow Sequence

```
┌──────────────┐
│ Game Starts  │
└──────┬───────┘
       │
       │ Step 1: Request Entropy
       ▼
┌─────────────────────────────────────────────────────────────┐
│ PythEntropyService.generateRandom('ROULETTE', config)       │
│                                                              │
│ POST /api/generate-entropy                                  │
│ {                                                            │
│   gameType: 'ROULETTE',                                     │
│   gameConfig: { betType: 'straight', betValue: 7 }         │
│ }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 2: Entropy Generated on Arbitrum Sepolia
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Arbitrum Sepolia Transaction                                │
│                                                              │
│ Transaction Hash: 0xabc123def456...                         │
│ Block Number: 12345678                                      │
│ Random Value: 789012345                                     │
│ Request ID: 0xrequest123...                                 │
│ Sequence Number: 1001                                       │
│                                                              │
│ ✅ Verifiable on: sepolia.arbiscan.io/tx/0xabc123...        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 3: Return Entropy to Game
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Entropy Result Object                                       │
│                                                              │
│ {                                                            │
│   randomValue: 789012345,                                   │
│   entropyProof: {                                           │
│     transactionHash: '0xabc123def456...',  ← Arbitrum      │
│     network: 'arbitrum-sepolia',                           │
│     blockNumber: 12345678,                                  │
│     requestId: '0xrequest123...',                          │
│     sequenceNumber: '1001',                                │
│     arbitrumSepoliaExplorerUrl: 'https://...'              │
│   }                                                          │
│ }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 4: Game Component Processes Result
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Game Logic (Client-Side)                                    │
│                                                              │
│ const entropyValue = result.randomValue.toString()          │
│ const entropyTxHash = result.entropyProof.transactionHash   │
│                                                              │
│ // Calculate game result using entropy                      │
│ const gameResult = calculateRouletteResult(entropyValue)    │
│ // Result: { number: 7, color: 'red', isWin: true }        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 5: Log Result to One Chain
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ useOneChainCasino.placeRouletteBet()                        │
│                                                              │
│ placeRouletteBet(                                           │
│   'straight',                                               │
│   7,                                                         │
│   '1.0',                    // 1 OCT bet                    │
│   [],                                                        │
│   '789012345',              // ← entropyValue               │
│   '0xabc123def456...',      // ← entropyTxHash (Arbitrum)  │
│   { number: 7, color: 'red', isWin: true },                │
│   '35.0'                    // 35 OCT payout                │
│ )                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 6: Create Game Data Object
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Game Data Object                                            │
│                                                              │
│ {                                                            │
│   gameType: 'ROULETTE',                                     │
│   playerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',│
│   betAmount: '1000000000000000000',  // 1 OCT in wei       │
│   payoutAmount: '35000000000000000000', // 35 OCT in wei   │
│   gameConfig: {                                             │
│     betType: 'straight',                                    │
│     betValue: 7,                                            │
│     wheelType: 'european'                                   │
│   },                                                         │
│   resultData: {                                             │
│     number: 7,                                              │
│     color: 'red',                                           │
│     isWin: true,                                            │
│     timestamp: 1700000000000                                │
│   },                                                         │
│   entropyValue: '789012345',        ← From Arbitrum        │
│   entropyTxHash: '0xabc123def456...', ← Arbitrum Tx Hash   │
│   timestamp: 1700000000000                                  │
│ }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 7: Submit to One Chain
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ OneChainClientService.logGameResult(gameData)               │
│                                                              │
│ // Extract entropy from gameData                            │
│ const { entropyValue, entropyTxHash } = gameData            │
│                                                              │
│ // Build Move call transaction                              │
│ const txData = {                                            │
│   packageObjectId: '0xgamelogger...',                      │
│   module: 'game_logger',                                    │
│   function: 'log_roulette_game',                           │
│   arguments: [                                              │
│     playerAddress,                                          │
│     betAmount,                                              │
│     payoutAmount,                                           │
│     gameConfig (as bytes),                                  │
│     resultData (as bytes),                                  │
│     entropyValue (as bytes),      ← Included               │
│     entropyTxHash (as bytes),     ← Included               │
│     clockObject                                             │
│   ]                                                          │
│ }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 8: One Chain Transaction
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ One Chain Testnet Transaction                               │
│                                                              │
│ Transaction Hash: 0xonechain789ghi...                       │
│ Block Number: 98765432                                      │
│ Status: Success                                             │
│                                                              │
│ Transaction Data:                                           │
│ - Game Type: ROULETTE                                       │
│ - Player: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb        │
│ - Bet: 1 OCT                                                │
│ - Payout: 35 OCT                                            │
│ - Result: Number 7, Red, Win                                │
│ - Entropy Value: 789012345          ← From Arbitrum        │
│ - Entropy Tx Hash: 0xabc123def456... ← Arbitrum Reference  │
│                                                              │
│ ✅ Verifiable on: explorer-testnet.onelabs.cc/tx/0xonechain...│
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Step 9: Confirmation
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Game Complete                                               │
│                                                              │
│ ✅ Entropy Generated: Arbitrum Sepolia                      │
│    TX: 0xabc123def456...                                    │
│    Explorer: sepolia.arbiscan.io                            │
│                                                              │
│ ✅ Game Logged: One Chain Testnet                           │
│    TX: 0xonechain789ghi...                                  │
│    Explorer: explorer-testnet.onelabs.cc                    │
│                                                              │
│ ✅ Cross-Chain Verification: Possible                       │
│    - Check Arbitrum for entropy generation                  │
│    - Check One Chain for game result                        │
│    - Verify entropy values match                            │
└─────────────────────────────────────────────────────────────┘
```

## Service Independence

```
┌─────────────────────────────────────────────────────────────┐
│                  Service Independence                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│  Pyth Entropy Service    │         │  One Chain Client        │
│  (Arbitrum Sepolia)      │         │  Service                 │
│                          │         │  (One Chain Testnet)     │
│  ✅ No One Chain deps    │         │  ✅ No Pyth Entropy deps │
│  ✅ Works independently  │         │  ✅ Works independently  │
│  ✅ Returns plain data   │         │  ✅ Accepts plain data   │
└────────────┬─────────────┘         └─────────────┬────────────┘
             │                                     │
             │         Loose Coupling              │
             │         via Parameters              │
             │                                     │
             └──────────────┬──────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │  useOneChainCasino Hook  │
              │  (Integration Layer)     │
              │                          │
              │  - Receives entropy      │
              │  - Passes to One Chain   │
              │  - No direct coupling    │
              └──────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│              Error Isolation & Independence                  │
└─────────────────────────────────────────────────────────────┘

Scenario 1: Arbitrum Sepolia Fails
┌──────────────────────────┐
│ Pyth Entropy Service     │
│ ❌ Network Error         │
└────────────┬─────────────┘
             │
             │ Fallback: Use client-side random
             │ One Chain: Unaffected ✅
             ▼
┌──────────────────────────┐
│ One Chain Service        │
│ ✅ Still operational     │
│ Accepts empty entropy    │
└──────────────────────────┘

Scenario 2: One Chain Fails
┌──────────────────────────┐
│ Pyth Entropy Service     │
│ ✅ Still operational     │
│ Generates entropy        │
└────────────┬─────────────┘
             │
             │ Entropy generated successfully
             │ Arbitrum Sepolia: Unaffected ✅
             ▼
┌──────────────────────────┐
│ One Chain Service        │
│ ❌ Network Error         │
│ Retry with backoff       │
└──────────────────────────┘

Scenario 3: Both Services Operational
┌──────────────────────────┐
│ Pyth Entropy Service     │
│ ✅ Generates entropy     │
└────────────┬─────────────┘
             │
             │ Full integration
             ▼
┌──────────────────────────┐
│ One Chain Service        │
│ ✅ Logs with entropy     │
└──────────────────────────┘
```

## Verification Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Cross-Chain Verification                        │
└─────────────────────────────────────────────────────────────┘

User wants to verify game fairness:

Step 1: Check Arbitrum Sepolia
┌──────────────────────────────────────────┐
│ https://sepolia.arbiscan.io/tx/0xabc123  │
│                                          │
│ ✅ Entropy Transaction                   │
│ - Random Value: 789012345                │
│ - Block: 12345678                        │
│ - Timestamp: 2024-11-22 10:30:00        │
│ - Contract: Pyth Entropy                 │
└──────────────────────────────────────────┘

Step 2: Check One Chain
┌──────────────────────────────────────────┐
│ https://explorer-testnet.onelabs.cc/tx/  │
│ 0xonechain789                            │
│                                          │
│ ✅ Game Result Transaction               │
│ - Entropy Value: 789012345 ← Match!     │
│ - Entropy Tx: 0xabc123... ← Reference   │
│ - Game Result: Number 7, Win            │
│ - Payout: 35 OCT                         │
└──────────────────────────────────────────┘

Step 3: Verify Match
┌──────────────────────────────────────────┐
│ Verification Result                      │
│                                          │
│ ✅ Entropy values match                  │
│ ✅ Timestamps consistent                 │
│ ✅ Game result verifiable                │
│ ✅ Provably fair                         │
└──────────────────────────────────────────┘
```

## Summary

This entropy-to-game data flow ensures:

1. ✅ **Entropy Generation**: Exclusively on Arbitrum Sepolia via Pyth Entropy
2. ✅ **Data Flow**: Entropy → Game Logic → One Chain Transaction
3. ✅ **Service Independence**: Services can operate independently
4. ✅ **Verification**: Both transaction hashes preserved for cross-chain verification
5. ✅ **Error Isolation**: Failures in one service don't affect the other
6. ✅ **Loose Coupling**: Integration via parameters, no direct dependencies

The implementation satisfies Requirements 9.1 and 9.2 completely.
