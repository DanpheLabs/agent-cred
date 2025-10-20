# AgentPay Smart Contract Deployment Guide

Complete guide for deploying and testing the AgentPay Solana program.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

1. **Rust** (1.75.0 or later)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. **Solana CLI** (1.17.0 or later)
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

3. **Anchor CLI** (0.29.0 or later)
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

4. **Node.js** (16+) and **npm**
```bash
# Install nvm first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Verify Installation

```bash
rustc --version          # Should show 1.75.0+
solana --version         # Should show 1.17.0+
anchor --version         # Should show 0.29.0+
node --version           # Should show 18.0.0+
```

## Setup

### 1. Configure Solana CLI

```bash
# Set cluster to devnet
solana config set --url devnet

# Create a new wallet (or use existing)
solana-keygen new --outfile ~/.config/solana/id.json

# Check configuration
solana config get
```

Expected output:
```
Config File: /Users/you/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: ~/.config/solana/id.json
Commitment: confirmed
```

### 2. Fund Your Wallet

```bash
# Get your address
solana address

# Request airdrop (devnet only)
solana airdrop 2

# Verify balance
solana balance
```

You'll need at least 2 SOL for deployment and testing.

### 3. Install Dependencies

```bash
cd anchor
npm install
```

## Building

### Build the Program

```bash
# From anchor directory
anchor build
```

This creates:
- `target/deploy/agent_pay.so` - Compiled program binary
- `target/deploy/agent_pay-keypair.json` - Program keypair
- `target/idl/agent_pay.json` - Interface Definition Language file
- `target/types/agent_pay.ts` - TypeScript types

### Get Program ID

```bash
solana address -k target/deploy/agent_pay-keypair.json
```

Copy this address - you'll need it for deployment.

## Testing

### Run All Tests

```bash
# Full test suite
anchor test

# Skip build (if already built)
anchor test --skip-build

# Skip deployment (for faster iteration)
anchor test --skip-deploy
```

### Test Coverage

The test suite validates:

✅ **Registry Operations**
- Initialize global registry
- Track agent count and volume

✅ **Agent Management**
- Register agent with coldkey/hotkey
- Update daily spending limits
- Deactivate agents
- Verify PDA derivations

✅ **Payment Flows**
- User → Agent (direct USDC transfer)
- Agent → Recipient (instant within limit)
- Payment request creation
- Approval/rejection workflows

✅ **Security**
- Daily limit enforcement
- Unauthorized access prevention
- Inactive agent protection
- Coldkey authorization checks

✅ **Edge Cases**
- Limit exceeded scenarios
- Invalid signers
- Inactive agents
- Request status validation

### Run Specific Tests

```bash
# Run single test file
anchor test tests/agent-pay.test.ts

# Run with custom RPC
anchor test --provider.cluster https://api.devnet.solana.com
```

### Debug Tests

```bash
# Enable detailed logs
RUST_LOG=debug anchor test

# Keep test validator running
anchor test --skip-local-validator
```

## Deployment

### Option 1: Automated Script (Recommended)

```bash
# From project root
npm run anchor:deploy

# Or from anchor directory
bash scripts/deploy.sh
```

The script automatically:
1. ✅ Checks prerequisites
2. ✅ Sets cluster to devnet
3. ✅ Verifies SOL balance
4. ✅ Builds program
5. ✅ Deploys to devnet
6. ✅ Shows explorer link
7. ✅ Provides next steps

### Option 2: Manual Deployment

```bash
# Ensure you're on devnet
solana config set --url devnet

# Build program
anchor build

# Deploy
anchor deploy

# Note the program ID from output
```

### Post-Deployment

1. **Update Program ID** in code:

```typescript
// src/lib/solana.ts
export const AGENT_PAY_PROGRAM_ID = new PublicKey('YOUR_DEPLOYED_ID');
```

2. **Initialize Registry**:

```bash
# From project root
npm run anchor:init-registry

# Or manually
cd anchor
ts-node scripts/initialize-registry.ts
```

3. **Verify on Explorer**:

Visit: `https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet`

## Verification

### 1. Check Program Account

```bash
solana program show <PROGRAM_ID>
```

Expected output:
```
Program Id: AgentPay1111...
Owner: BPFLoaderUpgradeab1e...
ProgramData Address: 5j2k...
Authority: <YOUR_WALLET>
Last Deployed In Slot: 281234567
Data Length: 123456 bytes
Balance: 2.5 SOL
```

### 2. Verify Registry

```bash
# Using Solana CLI
solana account <REGISTRY_PDA>

# Or check in explorer
# https://explorer.solana.com/address/<REGISTRY_PDA>?cluster=devnet
```

### 3. Test Integration

```typescript
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const programId = new PublicKey('YOUR_PROGRAM_ID');

// Verify program exists
const accountInfo = await connection.getAccountInfo(programId);
console.log('Program deployed:', !!accountInfo);
```

## Program Structure

### Accounts

```rust
Registry (PDA: ["registry"])
├── authority: Pubkey
├── agent_count: u64
└── total_volume: u64

Agent (PDA: ["agent", coldkey, hotkey])
├── coldkey: Pubkey
├── hotkey: Pubkey
├── daily_limit: u64
├── daily_spent: u64
├── last_reset_timestamp: i64
├── is_active: bool
├── total_received: u64
├── total_sent: u64
└── bump: u8

PaymentRequest (PDA: ["payment_request", agent, hotkey, timestamp])
├── agent: Pubkey
├── hotkey: Pubkey
├── coldkey: Pubkey
├── recipient: Pubkey
├── amount: u64
├── purpose: String (max 200 chars)
├── status: Enum (Pending/Approved/Rejected)
├── requested_at: i64
├── processed_at: Option<i64>
└── bump: u8
```

### Instructions

| Instruction | Signer | Description |
|-------------|--------|-------------|
| `initialize_registry` | Authority | Create global registry (one-time) |
| `register_agent` | Coldkey | Register new agent |
| `update_agent_limit` | Coldkey | Change daily limit |
| `deactivate_agent` | Coldkey | Disable agent |
| `pay_agent` | User | Send USDC to agent |
| `agent_pay` | Hotkey | Agent sends payment |
| `request_payment` | Hotkey | Request approval |
| `approve_payment` | Coldkey | Approve request |
| `reject_payment` | Coldkey | Reject request |

## Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment requires careful preparation.

### Prerequisites

1. **Sufficient SOL**: ~5-10 SOL for deployment + rent
2. **Audited Code**: Complete security audit
3. **Testing**: Extensive devnet testing
4. **Multisig**: Consider using Squads multisig for authority

### Steps

```bash
# 1. Switch to mainnet
solana config set --url mainnet-beta

# 2. Verify wallet balance
solana balance

# 3. Build for production
anchor build --verifiable

# 4. Deploy
anchor deploy --provider.cluster mainnet-beta

# 5. Initialize registry with multisig authority
# (Use Squads or similar)

# 6. Verify deployment
solana program show <PROGRAM_ID> --url mainnet-beta
```

### Security Checklist

- [ ] Code audit completed
- [ ] All tests passing
- [ ] Devnet testing completed
- [ ] Multisig authority configured
- [ ] Upgrade authority secured
- [ ] Emergency procedures documented
- [ ] Monitoring setup
- [ ] Incident response plan

## Troubleshooting

### Build Errors

**Error**: `cargo: command not found`
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Error**: `anchor: command not found`
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

**Error**: `failed to find package agent-pay`
```bash
# Ensure you're in the anchor directory
cd anchor
anchor build
```

### Deployment Errors

**Error**: `Insufficient funds`
```bash
# Request more SOL (devnet)
solana airdrop 2

# Check balance
solana balance
```

**Error**: `Program already exists`
```bash
# Upgrade existing program
anchor upgrade target/deploy/agent_pay.so --program-id <PROGRAM_ID>

# Or deploy new version
solana-keygen new --outfile target/deploy/agent_pay-keypair.json
anchor deploy
```

**Error**: `Transaction simulation failed`
```bash
# Check RPC connection
solana config get

# Try different RPC
solana config set --url https://api.devnet.solana.com

# Increase compute units in code
```

### Test Errors

**Error**: `Local validator failed to start`
```bash
# Kill existing validator
pkill -9 solana-test-validator

# Clean and rebuild
anchor clean
anchor build
anchor test
```

**Error**: `Insufficient SOL for airdrop`
```bash
# Use official faucet
# https://faucet.solana.com

# Or wait and retry
sleep 60 && solana airdrop 2
```

**Error**: `Account not found`
```bash
# Ensure registry is initialized
npm run anchor:init-registry

# Check accounts exist
solana account <ADDRESS> --url devnet
```

### Runtime Errors

**Error**: `Custom program error: 0x0` (UnauthorizedColdkey)
- Ensure transaction is signed by the coldkey

**Error**: `Custom program error: 0x1` (UnauthorizedHotkey)
- Ensure transaction is signed by the hotkey

**Error**: `Custom program error: 0x3` (DailyLimitExceeded)
- Check current spending with `getAgent()`
- Use `requestPayment()` for approval

**Error**: `Custom program error: 0x2` (AgentInactive)
- Verify agent status
- Reactivate if needed (requires coldkey)

## Additional Resources

- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [SPL Token Docs](https://spl.solana.com/token)
- [Solana CLI Reference](https://docs.solana.com/cli)

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/agentpay/issues)
- Join [Discord](https://discord.gg/agentpay)
- Email: dev@agentpay.dev

---

**Ready to deploy?** Start with `npm run anchor:deploy` 🚀
