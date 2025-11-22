# Task 1 Verification: Set up One Chain testnet configuration

## Task Requirements
- [x] Create `src/config/onechainTestnetConfig.js` with One Chain testnet network parameters
- [x] Define OCT token configuration with 18 decimals and "OCT" symbol
- [x] Include RPC URL, chain ID, explorer URL, and faucet URL
- [x] Export configuration for use throughout the application

## Requirements Coverage

### Requirement 1.1
✅ WHEN the casino application starts THEN the system SHALL connect to One Chain testnet RPC endpoint
- Configuration includes `rpcUrls.default.http` with One Chain testnet RPC endpoint
- Default: `https://rpc-testnet.onelabs.cc:443`

### Requirement 1.3
✅ WHEN the application initializes THEN the system SHALL use One Chain testnet configuration instead of Monad testnet configuration
- Created separate `ONECHAIN_TESTNET_CONFIG` object
- Network identifier: `onechain-testnet`
- Name: `One Chain Testnet`

### Requirement 1.4
✅ WHEN network information is displayed THEN the system SHALL show One Chain testnet details (chain ID, explorer URL, RPC URL)
- Chain ID: Configurable via `NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID`
- Explorer URL: `https://explorer-testnet.onelabs.cc`
- RPC URL: `https://rpc-testnet.onelabs.cc:443`

### Requirement 5.1
✅ WHEN the application loads configuration THEN the system SHALL read One Chain testnet RPC URL from configuration
- RPC URL defined in `rpcUrls.default.http` and `rpcUrls.public.http`
- Environment variable: `NEXT_PUBLIC_ONECHAIN_TESTNET_RPC`

### Requirement 5.2
✅ WHEN the application loads configuration THEN the system SHALL read One Chain testnet chain ID from configuration
- Chain ID defined in `chainId` field
- Environment variable: `NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID`

### Requirement 5.3
✅ WHEN the application loads configuration THEN the system SHALL read One Chain testnet explorer URL from configuration
- Explorer URL defined in `blockExplorers.default.url`
- Environment variable: `NEXT_PUBLIC_ONECHAIN_TESTNET_EXPLORER`

### Requirement 5.4
✅ WHEN the application loads configuration THEN the system SHALL define OCT token configuration with correct decimals and symbol
- OCT token defined in `ONECHAIN_TESTNET_TOKENS.OCT`
- Decimals: 18 (configurable via `NEXT_PUBLIC_OCT_DECIMALS`)
- Symbol: "OCT" (configurable via `NEXT_PUBLIC_OCT_SYMBOL`)
- Native token: `isNative: true`, `address: 'native'`

### Requirement 5.5
✅ WHERE One Chain configuration exists THEN the system SHALL include faucet URL for requesting test OCT tokens
- Faucet URL defined in `faucetUrl` field
- Environment variable: `NEXT_PUBLIC_ONECHAIN_FAUCET_URL`
- Default: `https://faucet-testnet.onelabs.cc`

## Configuration Structure

### Main Configuration Object: `ONECHAIN_TESTNET_CONFIG`
```javascript
{
  chainId: number,
  name: 'One Chain Testnet',
  network: 'onechain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'One Chain Token',
    symbol: 'OCT'
  },
  rpcUrls: { default, public },
  blockExplorers: { default },
  testnet: true,
  faucetUrl: string
}
```

### Token Configuration: `ONECHAIN_TESTNET_TOKENS`
```javascript
{
  OCT: {
    symbol: 'OCT',
    name: 'One Chain Token',
    decimals: 18,
    address: 'native',
    isNative: true,
    icon: '⛓️',
    faucet: string
  }
}
```

### Casino Configuration: `ONECHAIN_CASINO_CONFIG`
```javascript
{
  minDeposit: '0.001',
  maxDeposit: '100',
  minWithdraw: '0.001',
  maxWithdraw: '100',
  games: {
    MINES: { minBet, maxBet, minMines, maxMines, defaultMines, gridSize },
    ROULETTE: { minBet, maxBet, houseEdge },
    PLINKO: { minBet, maxBet, rows, defaultRows },
    WHEEL: { minBet, maxBet, segments }
  }
}
```

## Environment Variables Added

Added to `.env` file:
```bash
# One Chain Testnet Configuration
NEXT_PUBLIC_ONECHAIN_TESTNET_RPC=https://rpc-testnet.onelabs.cc:443
NEXT_PUBLIC_ONECHAIN_TESTNET_CHAIN_ID=0
NEXT_PUBLIC_ONECHAIN_TESTNET_EXPLORER=https://explorer-testnet.onelabs.cc
NEXT_PUBLIC_ONECHAIN_FAUCET_URL=https://faucet-testnet.onelabs.cc

# One Chain Token Configuration
NEXT_PUBLIC_OCT_DECIMALS=18
NEXT_PUBLIC_OCT_SYMBOL=OCT
```

## Exports

The configuration file exports:
- `ONECHAIN_TESTNET_CONFIG` (default export)
- `ONECHAIN_TESTNET_TOKENS`
- `ONECHAIN_CASINO_CONFIG`
- `switchToOneChainTestnet()` - Helper function for wallet network switching

## Test Results

All validation tests passed:
- ✅ Configuration structure is correct
- ✅ Network name and identifier are correct
- ✅ Native currency is OCT with 18 decimals
- ✅ RPC URLs are defined
- ✅ Block explorer is defined
- ✅ Faucet URL is defined
- ✅ Token configuration is correct
- ✅ Casino game configurations are defined

## Status: ✅ COMPLETE

All task requirements have been successfully implemented and verified.
