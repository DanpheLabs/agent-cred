# AgentCred - AI Agent Credment Infrastructure on Solana

A complete payment system for AI agents on Solana blockchain with hotkey/coldkey architecture, gasless transactions, and real-time monitoring.

**Live Demo**: agent-cred.vercel.app

## 🚀 Features

- **🔐 Hotkey/Coldkey Security** - Separate operational and asset-owner wallets
- **💰 Daily Spending Limits** - Automatic reset and approval workflows
- **⚡ Gasless Transactions** - Recipients don't need SOL for gas fees
- **📡 Real-time Monitoring** - Light client with instant webhook notifications
- **🔌 HTTP 402 Protocol** - Standardized payment request protocol
- **📊 Analytics Dashboard** - Track payments, agents, and performance
- **🛠️ TypeScript SDK** - Full-featured client library
- **🧪 Comprehensive Tests** - Complete test coverage for smart contracts


### Prerequisites

- Node.js 16+ and npm
- Rust & Solana CLI ([Install](https://docs.solana.com/cli/install-solana-cli-tools))
- Anchor Framework ([Install](https://www.anchor-lang.com/docs/installation))
- Phantom or Solflare wallet

## 📚 Documentation

Access comprehensive docs in the app at `/docs`:

### Available Guides

- **Getting Started** - Complete setup guide with prerequisites
- **Architecture** - System design, security model, payment flows
- **SDK Reference** - Full API documentation with TypeScript examples
- **Gasless Transactions** - How HTTP 402 protocol works
- **HTTP 402 Protocol** - Standardized payment requests
- **Light Client Monitoring** - Real-time transaction tracking via WebSocket

### Key Concepts

#### Hotkey/Coldkey Architecture

```
Coldkey (Asset Owner)           Hotkey (Operational)
├── Holds USDC balance          ├── Makes daily payments
├── Receives all payments       ├── Limited spending power
├── Approves large transfers    ├── Automated operations
├── Updates settings            ├── Cannot modify limits
└── Can deactivate agent        └── Resets every 24 hours
```

#### Payment Flows

1. **User → Agent**: Direct USDC to agent's coldkey
2. **Agent → Recipient (Auto)**: Hotkey spends within daily limit
3. **Agent → Recipient (Approval)**: Hotkey requests, coldkey approves

## 🎮 Playground

The `/payments` page provides an interactive playground:

- **Side-by-Side View**: UI form + SDK code examples
- **Real-time Updates**: See code changes as you interact
- **Copy-Paste Ready**: All SDK examples are production-ready
- **Three Payment Flows**: Test all transaction types
- **Approval System**: Simulate coldkey approval workflow

## 🔑 SDK Usage

### Installation

```bash
npm install agentcred-sdk @solana/web3.js
```

### Initialize SDK

```typescript
import { AgentCredSDK } from 'agentcred-sdk';
import { Connection, Keypair } from '@solana/web3.js';

@@ -209,11 +81,7 @@ const sdk = new AgentCredSDK({
  connection,
  network: 'devnet' 
});
```

### Register Agent

```typescript
// Coldkey registers agent with hotkey and daily limit
const signature = await sdk.registerAgent({
  coldkey: coldkeyKeypair,        // Your secure wallet
@@ -222,11 +90,7 @@ const signature = await sdk.registerAgent({
});

console.log('Agent registered:', signature);
```

### Accept Payment

```typescript
// User pays agent directly
const result = await sdk.payAgent({
  user: userKeypair,
@@ -237,11 +101,7 @@ const result = await sdk.payAgent({

console.log('Payment received:', result.signature);
console.log('Explorer:', result.explorerUrl);
```

### Agent Send Payment (Instant)

```typescript
// Agent spends within daily limit (no approval needed)
const result = await sdk.agentcred({
  hotkey: hotkeyKeypair,          // Agent's operational key
@@ -251,11 +111,7 @@ const result = await sdk.agentcred({
});

// Automatically checks daily limit and rejects if exceeded
```

### Request Payment Approval

```typescript
// For amounts exceeding daily limit
const requestId = await sdk.requestPayment({
  hotkey: hotkeyKeypair,
@@ -266,11 +122,7 @@ const requestId = await sdk.requestPayment({
});

// Coldkey receives notification and can approve/reject
```

### Webhook Integration

```typescript
// Handle payment notifications
app.post('/webhook/payment', async (req, res) => {
  const { transaction, amount, sender } = req.body;
@@ -290,134 +142,80 @@ app.post('/webhook/payment', async (req, res) => {
    res.status(401).json({ error: 'Invalid signature' });
  }
});
```

## 🏗️ Architecture

### Core Components

1. **Coldkey** - Secure wallet holding USDC, receives all payments
2. **Hotkey** - Operational wallet with daily spending limit
3. **Registry** - On-chain Solana program managing relationships
4. **Light Client** - WebSocket monitoring for instant notifications
5. **Dashboard** - React app for agent management

### Security Model

- **Daily Limits**: Automatic 24-hour spending caps with reset
- **PDA Derivation**: Deterministic account addressing prevents spoofing
- **Coldkey Auth**: Critical operations require coldkey signature
- **Active Status**: Inactive agents cannot transact
- **Event Logs**: All operations emitted as Solana events

### Performance Metrics

| Metric | Value |
|--------|-------|
| Transaction Finality | ~400ms |
| Webhook Delivery | 2-3 seconds |
| Transaction Cost | <$0.001 |
| Throughput | 65,000+ TPS |
| Uptime SLA | 99.9% |


## 🛣️ Roadmap

- [x] Core payment infrastructure
- [x] Hotkey/coldkey architecture
- [x] Daily spending limits
- [x] Payment approval workflow
- [x] Comprehensive documentation
- [x] Interactive playground
- [ ] Mainnet deployment
- [ ] Multi-token support (SOL, other SPL tokens)
- [ ] Recurring subscriptions
- [ ] Payment splitting
- [ ] Mobile SDK (React Native)
- [ ] Governance token

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Add tests for new features
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing`)
6. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- **Documentation**: [AgentCred Docs](https://agentcred.dev/docs)
- **SDK Package**: [NPM Registry](https://npmjs.com/package/agentcred-sdk)
- **Solana Explorer**: [View Transactions](https://explorer.solana.com)
- **Anchor Docs**: [anchor-lang.com](https://anchor-lang.com)

## 💬 Support & Community

- **Discord**: Join our community (coming soon)
- **Twitter**: [@agentcred](https://twitter.com/agentcred) (coming soon)
- **Issues**: [GitHub Issues](https://github.com/agentcred/issues)
- **Email**: support@agentcred.dev

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [Solana](https://solana.com) - High-performance blockchain
- [Anchor](https://anchor-lang.com) - Solana development framework
- [React](https://react.dev) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Lovable](https://lovable.dev) - Development platform

---

**Made with ❤️ for the AI Agent ecosystem**