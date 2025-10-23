# AgentPay Deployment Guide

This guide will help you deploy the AgentPay smart contract to Solana Devnet and connect it with the frontend application.

## Prerequisites

- Solana CLI installed and configured
- Anchor Framework v0.29.0+ installed
- Node.js v18+ and npm/yarn
- A Solana wallet with devnet SOL (use `solana airdrop`)

## Step 1: Configure Solana CLI

```bash
# Set to devnet
solana config set --url https://api.devnet.solana.com

# Create or use existing wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Get devnet SOL
solana airdrop 2
```

## Step 2: Build the Anchor Program

```bash
# Navigate to anchor directory
cd anchor

# Build the program
anchor build

# Get the program ID
solana address -k target/deploy/agent_pay-keypair.json
```

## Step 3: Update Program ID

Copy the program ID from step 2 and update it in:

1. `anchor/Anchor.toml`:
```toml
[programs.devnet]
agent_pay = "YOUR_PROGRAM_ID_HERE"
```

2. `anchor/programs/agent-pay/src/lib.rs`:
```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

3. `src/lib/solana.ts`:
```typescript
export const AGENT_PAY_PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE');
```

## Step 4: Rebuild After ID Update

```bash
# Rebuild with the correct program ID
anchor build
```

## Step 5: Deploy to Devnet

```bash
# Deploy the program
anchor deploy

# Verify deployment
solana program show YOUR_PROGRAM_ID
```

## Step 6: Initialize the Registry

```bash
# Run the initialization script
npm run anchor:initialize

# Or manually with ts-node
ts-node scripts/initialize-registry.ts
```

## Step 7: Test the Deployment

```bash
# Run tests against devnet
anchor test --skip-local-validator
```

## Step 8: Start the Frontend

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Step 9: Connect Your Wallet

1. Open the application in your browser (usually http://localhost:8080)
2. Click "Connect Wallet" in the top right
3. Select your Solana wallet (Phantom, Solflare, etc.)
4. Approve the connection

## Step 10: Register Your First Agent

1. Go to "My Agents" page
2. Click "Register Agent"
3. Fill in:
   - Agent Name
   - Hotkey Address (another Solana wallet address)
   - Daily Limit (in USDC)
4. Sign the transaction

## Verification

After deployment, verify everything is working:

```bash
# Check program is deployed
solana program show YOUR_PROGRAM_ID

# Check registry is initialized
anchor account registry YOUR_REGISTRY_PDA

# Check frontend is connected
# Visit http://localhost:8080 and connect your wallet
```

## Troubleshooting

### Program Not Deployed
- Ensure you have enough SOL: `solana balance`
- Check your keypair path in `anchor/Anchor.toml`

### Transaction Failed
- Verify you're connected to devnet
- Check you have USDC devnet tokens
- Ensure wallet is connected properly

### Frontend Not Connecting
- Check console for errors
- Verify AGENT_PAY_PROGRAM_ID matches deployed program
- Ensure wallet adapter is configured for devnet

## Next Steps

- **Production Deployment**: Deploy to mainnet-beta
- **USDC Setup**: Use mainnet USDC address
- **Security Audit**: Get program audited before mainnet
- **Monitoring**: Set up transaction monitoring
- **Documentation**: Share SDK with developers

## Resources

- [Solana Cookbook](https://solanacookbook.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [AgentPay Documentation](./README.md)

## Support

For issues or questions:
- Check GitHub Issues
- Join our Discord
- Read the documentation at /docs
