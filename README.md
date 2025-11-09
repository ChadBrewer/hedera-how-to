# AI Agent Reputation & Task Ledger - Hedera Testnet Guide

A comprehensive DApp that tracks AI agent performance and earns automatic revenue through Hedera's HIP-991 monetization.

## 🚀 Features

- **Reputation Tracking**: Monitor AI agent performance with blockchain-verified reputation scores
- **Task Ledger**: Immutable record of completed tasks with timestamps and status
- **Automatic Revenue**: Earn 0.01 HBAR per message via HIP-991 monetization
- **Decentralized**: Built on Hedera Hashgraph for enterprise-grade performance
- **Real-time**: Instant consensus and verifiable timestamps

## 📁 Project Structure

```
├── ai-agent-reputation.js      # Main DApp implementation
├── test-external-submit.js     # External submission test script
├── package.json                # Project dependencies
├── .env.example                # Environment template
├── index.html                  # Complete testing guide
└── README.md                   # This file
```

## 🛠️ Quick Start

### 1. Get Hedera Testnet Account
- Visit [Hedera Portal](https://portal.hedera.com)
- Create account and get 10,000 free testnet HBAR
- Copy your Account ID and Private Key

### 2. Setup Project
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# OPERATOR_ID=0.0.12345678
# OPERATOR_KEY=your_private_key_here
```

### 3. Run DApp
```bash
# Start the application
node ai-agent-reputation.js

# Test external submissions
node test-external-submit.js YOUR_TOPIC_ID
```

### 4. Verify on HashScan
- Check your topic: `https://hashscan.io/testnet/topic/YOUR_TOPIC_ID`
- Monitor your account: `https://hashscan.io/testnet/account/YOUR_ACCOUNT_ID`

## 💰 Revenue Model

Every message submitted to your topic automatically sends **0.01 HBAR** to your account:

- **Internal submissions**: You pay the fee (goes to yourself)
- **External submissions**: Others pay the fee (revenue for you)
- **No setup required**: HIP-991 handles everything automatically

## 📊 API Integration

Monitor your ledger via Mirror Node API:
```bash
# Get all messages
curl "https://testnet.mirrornode.hedera.com/api/v1/topics/YOUR_TOPIC_ID/messages"

# Real-time streaming available for dashboards
```

## 🔧 Configuration

### Environment Variables (.env)
```env
OPERATOR_ID=0.0.YOUR_TESTNET_ACCOUNT_ID
OPERATOR_KEY=your_private_key_here
SECOND_ACCOUNT_ID=0.0.SECOND_ACCOUNT_ID (optional)
SECOND_ACCOUNT_KEY=second_private_key_here (optional)
```

### Main DApp Options
```javascript
const ledger = new AIAgentReputationLedger();

// Create monetized topic
await ledger.createMonetizedTopic();

// Log AI agent tasks
await ledger.logTask('agent_001', 'Completed analysis', 'completed');

// Submit reputation ratings
await ledger.submitReputationRating('agent_001', 4.5, 'user_123');

// Get current scores
const score = ledger.getReputationScore('agent_001');
const tasks = ledger.getTaskLedger();
```

## 🌐 Mainnet Deployment

When ready for production:

1. **Fund mainnet account** (buy HBAR from exchange)
2. **Change client**:
   ```javascript
   // From:
   this.client = Client.forTestnet();
   // To:
   this.client = Client.forNameNet();
   ```
3. **Update environment variables** with mainnet credentials
4. **Deploy same code** - revenue model works identically

## 📈 Next Steps

- **Frontend Development**: Build web interface for users
- **AI Integration**: Connect real AI services (OpenAI, Anthropic, etc.)
- **Analytics Dashboard**: Real-time monitoring and reporting
- **Smart Contracts**: Add programmable logic and automation
- **Multi-chain**: Expand to other networks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use for any purpose.

## 🆘 Support

- **Hedera Documentation**: [docs.hedera.com](https://docs.hedera.com)
- **Community Discord**: [hedera.com/discord](https://hedera.com/discord)
- **HashScan Explorer**: [hashscan.io](https://hashscan.io)

## 🔗 Useful Links

- [Hedera Portal](https://portal.hedera.com) - Create testnet accounts
- [HIP-991 Specification](https://hips.hedera.com/hip/hip-991) - Topic-based custom fees
- [Hedera SDK Docs](https://github.com/hashgraph/hedera-sdk-js) - JavaScript SDK
- [Mirror Node API](https://docs.hedera.com/hedera/sdks-and-apis/rest-api) - REST API documentation

---

Built with ❤️ for the Hedera ecosystem