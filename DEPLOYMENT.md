# AgentPay System - Deployment Guide

## Overview
This document provides instructions for deploying and running the AgentPay system, which enables secure AI agent payments on Solana.

## Prerequisites
- Node.js v18+
- Rust and Cargo
- Anchor CLI
- Solana CLI
- Docker (for containerized deployment)

## Environment Setup

1. **Install dependencies:**
```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Install Node dependencies
npm install
```

2. **Configure Solana CLI:**
```bash
# Set up your Solana wallet
solana config set --url devnet

# Generate a new keypair (for testing)
solana-keygen new --outfile ~/.config/solana/id.json
```

## Deployment Steps

### 1. Deploy the Anchor Program

```bash
# Navigate to the anchor directory
cd anchor

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory:
```env
# Solana Configuration
SOLANA_CLUSTER=devnet
SOLANA_WALLET_PATH=~/.config/solana/id.json

# AgentPay Program ID
AGENT_PAY_PROGRAM_ID=2hpe9fZeZvPbuFukKFqaVUq2YfDeLZymZbq7YGGkpxhE

# USDC Mint Address (Devnet)
USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Backend API Configuration
BACKEND_PORT=3000
MONGODB_URI=mongodb://localhost:27017/agentpay
```

### 3. Run the Frontend Application

```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

### 4. Backend Services

For production deployment, you'll need to set up:
- MongoDB for data persistence
- Transaction listener for blockchain sync
- API endpoints for agent management
- Cron jobs for periodic sync

## Program Structure

### On-Chain Program (Anchor)
- `src/instructions/initialize_agent.rs` - Initialize agent accounts
- `src/instructions/update_agent_details.rs` - Update agent information
- `src/instructions/process_transaction.rs` - Process payments through agents
- `src/state/agent_account.rs` - Agent account structure
- `src/state/transaction_record.rs` - Transaction record structure

### Frontend (React)
- Wallet integration with Phantom, Solflare, Backpack
- Agent registration and management UI
- Dashboard with analytics
- Transaction history

### Backend (Node.js/Express)
- MongoDB integration
- Transaction listener service
- API endpoints for agent management
- Payment verification logic

## Security Considerations

1. **Signature Verification**: All on-chain operations require proper signature verification
2. **Daily Spend Limits**: Implemented to prevent unauthorized spending
3. **Coldkey Verification**: Critical operations require coldkey signatures
4. **Rate Limiting**: API endpoints implement rate limiting to prevent abuse

## Testing

Run tests with:
```bash
# Run Anchor tests
anchor test

# Run frontend tests
npm test
```

## Monitoring

The system includes:
- Transaction history tracking
- Daily spending limit monitoring
- Payment approval workflow
- Blockchain sync monitoring

## Troubleshooting

### Common Issues:
1. **Program ID Mismatch**: Ensure the program ID in your frontend matches the deployed program
2. **Wallet Connection**: Verify your wallet is properly connected and has sufficient SOL
3. **MongoDB Connection**: Ensure MongoDB is running and accessible
4. **Transaction Failures**: Check for insufficient funds or invalid signatures

### Debugging:
```bash
# Check program logs
solana logs <PROGRAM_ID>

# Verify account state
solana account <AGENT_ACCOUNT_ADDRESS>
```

## Production Deployment

For production deployment:
1. Deploy to mainnet
2. Set up proper monitoring and alerting
3. Implement backup and recovery procedures
4. Configure SSL/TLS for API endpoints
5. Set up CI/CD pipeline