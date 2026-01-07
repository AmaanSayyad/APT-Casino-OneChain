# OneArcade

A decentralized casino platform built on One Chain Testnet with Pyth Entropy for provably fair gaming and MetaMask Smart Accounts integration.

## Inspiration: 
A few days ago, I was exploring transactions on Etherscan when I saw an advertisement for a popular casino platform (stake.com) offering a 200% bonus on first deposit. I deposited 120 USDT and received 360 USDT in total balance in their custodial wallet.

When I started playing, I discovered I could only bet $1 per game and couldn't increase the amount. After contacting customer support, I learned I had been trapped by hidden "wager limits" tied to the bonus scheme. To withdraw my original deposit, I would need to play $12,300 worth of games!

In a desperate attempt to recover my funds, I played different games all night - roulette, mines, spin wheel... and lost everything.

This frustrating experience inspired OneArcade: a combination of GameFi, AI, and DeFi where users can gamble casino games in a safe, secure, and 100% transparent environment where every bet is verifiably fair by the user itself and no centralized authority manipulates game outcomes.


## 🎯 The Problem

The traditional online gambling industry suffers from several issues:

- **Unfair Game Outcomes**: 99% of platforms manipulate game results, leading to unfair play
- **High Fees**: Exorbitant charges for deposits, withdrawals, and gameplay
- **Restrictive Withdrawal Policies**: Conditions that prevent users from accessing their funds
- **Misleading Bonus Schemes**: Trapping users with unrealistic wagering requirements
- **Lack of True Asset Ownership**: Centralized control over user funds
- **User Adoption Barriers**: Complexity of using wallets creates friction for web2 users
- **No Social Layer**: Lack of live streaming, community chat, and collaborative experiences

## 💡 Our Solution

OneArcade addresses these problems by offering:

- **Provably Fair Gaming**: Powered by Pyth Entropy

![commit_and_reveal](https://github.com/user-attachments/assets/cbb150e8-7d22-4903-9729-8ad00c20f1d5)


- **Multiple Games**: Wheel, Roulette, Plinko, and Mines with verifiable outcomes
- **Flexible Withdrawal**: Unrestricted access to funds
- **Transparent Bonuses**: Clear terms without hidden traps
- **True Asset Ownership**: Decentralized asset management
- **Live Streaming Integration**: Built with Livepeer, enabling real-time game streams and tournaments
- **On-Chain Chat**: Supabase + Socket.IO with wallet-signed messages for verifiable player communication
- **Gasless Gaming Experience**: Treasury-sponsored transactions for seamless web2-like experience

## 🎮 Features


### 1. Provably Fair Gaming
<img width="1536" height="864" alt="355232251-6880e1cb-769c-4272-8b66-686a90abf3be" src="https://github.com/user-attachments/assets/98cefec7-18d6-4ede-92a9-0a237686f2cf" />

- **Pyth Entropy**: Cryptographically secure randomness
- **On-Chain Verification**: All game outcomes verifiable
- **Transparent Mechanics**: Open-source game logic

#### Pyth Entropy Integration Architecture

```mermaid
graph LR
    subgraph Frontend["Frontend"]
        A[Game Component] --> B[Pyth Entropy Request]
    end
    
    subgraph Contract["Smart Contract"]
        C[CasinoEntropyConsumer] --> D[request]
        D --> E[Pyth Entropy Contract]
    end
    
    subgraph Pyth["Pyth Network"]
        F[Pyth Provider] --> G[Generate Entropy]
        G --> H[Entropy Proof]
    end
    
    subgraph Callback["Callback Flow"]
        I[entropyCallback] --> J[Update Game State]
        J --> K[Emit Events]
    end
    
    B --> C
    E --> F
    H --> I
    K --> A
```

### 2. Game Selection

- **Roulette**: European roulette with batch betting
- **Mines**: Strategic mine-sweeping with pattern betting
- **Plinko**: Physics-based ball drop with auto-betting features
- **Wheel**: Classic spinning wheel with multiple risk levels

### 3. Web2 User Experience

- **Gasless Transactions**: Treasury-sponsored transactions eliminate gas fees
- **Seamless Onboarding**: Simplified wallet experience for web2 users
- **Familiar Interface**: Web2-like experience with web3 benefits

- **OCT Token**: Native currency for One Chain Testnet
- **Real-time Gaming**: Instant deposits and withdrawals
- **Advanced Betting**: Batch transactions and automated strategies


## 🏗 System Architecture Overview

### Multi-Network Architecture

```mermaid
graph TB
    subgraph User["User Layer"]
        U[User] --> W[OneWallet]
        W --> SA[Smart Account Detection]
    end
    
    subgraph Frontend["Frontend Application"]
        F[Next.js Casino] --> WC[Wallet Connection]
        WC --> NS[Network Switcher]
        NS --> GM[Game Manager]
    end
    
    subgraph OneChainNet["One Chain Testnet (Chain ID: 10143)"]
        OC[One Chain Testnet] --> OCT[OCT Token]
        OCT --> DEP[Deposit Contract]
        OCT --> WITH[Withdraw Contract]
        DEP --> TB[Treasury Balance]
        WITH --> TB
        
        subgraph SmartAccount["Smart Account Features"]
            BATCH[Batch Transactions]
            SPONSOR[Sponsored TX]
            SESSION[Session Keys]
        end
    end
    
    subgraph ArbitrumNet["Arbitrum Sepolia (Chain ID: 421614)"]
        AS[Arbitrum Sepolia] --> EC[Entropy Consumer]
        EC --> PE[Pyth Entropy Contract]
        PE --> PN[Pyth Network]
        
        subgraph EntropyFlow["Entropy Generation"]
            REQ[Request Entropy]
            GEN[Generate Random]
            PROOF[Cryptographic Proof]
        end
    end
    
    U --> F
    F --> OC
    F --> AS
    GM --> DEP
    GM --> EC
    SA --> BATCH
    REQ --> GEN
    GEN --> PROOF
    PROOF --> GM
```

## 🎯 Games

### 1. **Wheel of Fortune**
- Classic spinning wheel game
- Multiple risk levels
- Batch betting support

### 2. **Roulette**
- European roulette with single zero
- Multiple betting options
- Smart Account batch bets

```mermaid
flowchart LR
    A[Place Bets] --> B[Multiple Bet Types]
    B --> C[Red/Black]
    B --> D[Odd/Even]
    B --> E[Numbers]
    B --> F[Columns/Dozens]
    
    C --> G[Spin Wheel]
    D --> G
    E --> G
    F --> G
    
    G --> H[Pyth Entropy Random 0-36]
    H --> I[Determine Winners]
    I --> J[Calculate Payouts]
    J --> K[Update Balances]
```

### 3. **Plinko**
- Physics-based ball drop game
- Adjustable rows and risk levels
- Auto-betting features

```mermaid
graph TD
    A[Drop Ball] --> B[Physics Engine]
    B --> C[Pyth Entropy]
    C --> D[Peg Collisions]
    D --> E[Ball Path Calculation]
    E --> F[Multiplier Zone]
    F --> G[Payout Calculation]
    
    subgraph Physics["Physics Simulation"]
        H[Matter.js] --> I[Gravity]
        I --> J[Collision Detection]
        J --> K[Bounce Physics]
    end
    
    subgraph Visual["Visual Rendering"]
        L[Three.js] --> M[3D Ball]
        M --> N[Peg Animation]
        N --> O[Trail Effects]
    end
    
    B --> H
    E --> L
```

### 4. **Mines**
- Strategic mine-sweeping game
- Customizable mine count
- Progressive betting strategies

```mermaid
stateDiagram-v2
    [*] --> GridSetup
    GridSetup --> BetPlacement
    BetPlacement --> EntropyRequest
    EntropyRequest --> MineGeneration
    MineGeneration --> GameActive
    
    GameActive --> TileClick
    TileClick --> SafeTile: Safe
    TileClick --> MineTile: Mine Hit
    
    SafeTile --> ContinueGame: Continue
    SafeTile --> CashOut: Cash Out
    
    ContinueGame --> GameActive
    CashOut --> GameEnd
    MineTile --> GameEnd
    
    GameEnd --> [*]
```

## 🛠 Development

### Prerequisites
- Node.js 18+
- MetaMask wallet
- One Chain Testnet OCT tokens

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/apt-casino-onechain

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy to One Chain Testnet
```bash
npm run deploy:onechain
```

### Game Execution Flow (Smart Account Enhanced)

```mermaid
sequenceDiagram
    participant U as User
    participant SA as Smart Account
    participant UI as Game UI
    participant OC as One Chain Testnet
    participant API as API Route
    participant SC as Smart Contract (Arbitrum)
    participant PE as Pyth Entropy
    participant DB as Database
    
    U->>SA: Initiate Game Session
    SA->>UI: Check Account Type
    
    alt Smart Account
        UI->>SA: Enable Batch Features
        SA->>OC: Batch Bet Transactions
        OC->>UI: Confirm Batch
    else EOA Account
        UI->>OC: Single Bet Transaction
        OC->>UI: Confirm Single Bet
    end
    
    UI->>API: POST /api/generate-entropy
    API->>SC: request(userRandomNumber)
    SC->>PE: Request Entropy
    
    Note over PE: Generate Cryptographic Entropy
    
    PE->>SC: entropyCallback()
    SC->>API: Event: EntropyFulfilled
    API->>DB: Store Game Result
    
    alt Smart Account Batch
        API->>SA: Batch Results
        SA->>OC: Process Batch Payouts
        OC->>UI: Batch Payout Complete
    else Single Transaction
        API->>OC: Single Payout
        OC->>UI: Single Payout Complete
    end
    
    UI->>U: Display Outcome(s)
```

### Smart Account Transaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Casino UI
    participant SA as Smart Account
    participant OC as One Chain Testnet
    participant AS as Arbitrum Sepolia
    participant PE as Pyth Entropy
    
    Note over U,PE: Smart Account Batch Gaming Session
    
    U->>UI: Select Multiple Games
    UI->>SA: Prepare Batch Transaction
    
    rect transparent
        Note over SA,OC: Batch Transaction on One Chain
        SA->>OC: Batch Bet Transaction
        OC->>SA: Confirm All Bets
    end
    
    rect transparent
        Note over AS,PE: Entropy Generation on Arbitrum
        UI->>AS: Request Entropy for All Games
        AS->>PE: Generate Multiple Random Numbers
        PE->>AS: Return Entropy Proofs
        AS->>UI: All Game Results
    end
    
    rect transparent
        Note over SA,OC: Batch Payout on One Chain
        UI->>SA: Process Batch Payouts
        SA->>OC: Batch Payout Transaction
        OC->>SA: Confirm All Payouts
    end
    
    SA->>UI: Update All Game States
    UI->>U: Display All Results
    
    Note over U,PE: Single transaction for multiple games!
```

## 🔗 Links

- **Live Demo**: https://apt-casino-onechain.vercel.app
- **Youtube Demo Link**: https://youtu.be/hVWe3uzHcOA
- **Github Link**: https://github.com/AmaanSayyad/APT-Casino-OneChain 
- **PitchDeck Link:** https://www.figma.com/deck/OXOSAPIzG0CJlKFDSepWZ8/APT-Casino-OneChain?node-id=1-1812&p=f&t=PPd57Zulv2qJt1bZ-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1 

## 🔮 Future Roadmap

- **Mainnet Launch**: Deploying on one chain mainnet for real-world use after launch.
- **Additional Games**: Expanding the game selection and build 20+ new games
- **Enhanced DeFi Features**: Staking, farming, yield strategies
- **Developer Platform**: Allowing third-party game development and acting as a game launchpad
- **Advanced Social Features**: Enhanced live streaming and chat capabilities
- **ROI Share Links**: Shareable proof-links for withdrawals that render dynamic cards on social platforms
- **Tournament System**: Competitive gaming with leaderboards and prizes
