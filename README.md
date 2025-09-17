# ⚔️ Hidden Gladiator Wagers

> *Where ancient combat meets modern cryptography*

A revolutionary decentralized betting platform that brings the thrill of gladiator combat to the blockchain, with cutting-edge privacy technology ensuring your wagers remain hidden until the final blow is struck.

## 🎯 The Arena Awaits

Step into the digital colosseum where:
- **Stealth is Power**: Your bets are encrypted using fully homomorphic encryption
- **Fairness is Guaranteed**: No market manipulation, no insider knowledge
- **Victory is Rewarded**: Smart contracts ensure instant, transparent payouts

## 🛡️ Privacy-First Architecture

Our platform leverages **Fully Homomorphic Encryption (FHE)** to create a truly private betting experience:

```
Your Bet → FHE Encryption → Blockchain → Match Resolution → Decryption → Payout
```

No one, not even the platform operators, can see your wagers until the match concludes.

## 🚀 Quick Start Guide

### Prerequisites
- Modern web browser with Web3 wallet support
- MetaMask, Rainbow, or compatible wallet
- Sepolia testnet ETH for gas fees

### Installation

```bash
# Clone the repository
git clone https://github.com/henriquefreitas1/hidden-gladiator-wagers.git

# Navigate to project directory
cd hidden-gladiator-wagers

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file:

```env
# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=your_rpc_url_here

# Wallet Connect
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Contract Address (after deployment)
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## 🏛️ How the Arena Works

### 1. **Enter the Arena**
Connect your wallet and step into the digital colosseum

### 2. **Study the Gladiators**
Each fighter has unique stats, specialties, and historical performance

### 3. **Place Your Stealth Bet**
Your wager is encrypted and stored on-chain, invisible to all

### 4. **Watch the Battle**
Live gladiator combat streams with real-time action

### 5. **Claim Victory**
Winning bets are automatically revealed and paid out

## 🔧 Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React + TypeScript | Modern, type-safe UI |
| **Styling** | Tailwind CSS + shadcn/ui | Beautiful, responsive design |
| **Blockchain** | Ethereum Sepolia | Testnet deployment |
| **Wallet** | RainbowKit + Wagmi | Multi-wallet support |
| **Encryption** | FHE Implementation | Privacy-preserving bets |
| **Build Tool** | Vite | Fast development & builds |

## 🎮 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run code linting
npm run deploy:contract  # Deploy smart contract
```

## 🏗️ Smart Contract Features

Our `GladiatorArena` contract includes:

- **Encrypted Bet Storage**: FHE-encrypted wager data
- **Match Management**: Create and manage gladiator matches
- **Automatic Payouts**: Smart contract handles all transactions
- **Privacy Preservation**: Bets remain hidden until match completion
- **Anti-Manipulation**: Decentralized, transparent match resolution

## 🌐 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the dashboard
3. Deploy with automatic builds on push

### Smart Contract Deployment

```bash
# Install Hardhat dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to Sepolia testnet
npm run deploy:contract
```

## 🔒 Security & Privacy

- **Zero-Knowledge Betting**: Your choices remain private
- **Decentralized Resolution**: No central authority controls outcomes
- **Transparent Payouts**: All transactions are verifiable on-chain
- **Audited Contracts**: Smart contracts follow security best practices

## 🤝 Contributing

We welcome contributions from the gladiator community!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a demonstration project for educational purposes. Always ensure compliance with local gambling regulations before deploying in production environments.

## 🏆 Join the Arena

Ready to test your gladiator instincts? The arena awaits your arrival.

**May the odds be ever in your favor, but your bets remain forever hidden.**

---

*Built with ❤️ for the Web3 gladiator community*