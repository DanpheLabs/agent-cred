# Agent Pay - Solana Smart Contracts

Anchor-based smart contracts for the Agent Payment System with Hotkey/Coldkey architecture.

## Overview

This program implements a secure payment system where:
- **Coldkey**: Asset owner with full control
- **Hotkey**: Operational wallet with limited spending power
- **Registry**: On-chain mapping of agent relationships
- **USDC**: Stablecoin payment integration via SPL tokens

## Features

### Agent Management
- Register agents with hotkey/coldkey pairs
- Set daily spending limits for hotkeys
- Update limits or deactivate agents (coldkey only)

### Payment Flows
1. **Agent → Agent**: Direct USDC payment to agent's coldkey
2. **Agent → Recipient** (Auto): Hotkey can send within daily limit
3. **Agent → Recipient** (Approval): Hotkey requests, coldkey approves

### Security
- Daily spending limits with automatic reset
- Coldkey authorization for critical operations
- Active/inactive agent status
- PDA-based account derivation

## Program Instructions

### `initialize_registry`
Initialize the global agent registry (one-time setup)

### `register_agent`
Register a new agent with hotkey/coldkey mapping
- **Signer**: Coldkey
- **Params**: `hotkey: Pubkey`, `daily_limit: u64`

### `update_agent_limit`
Update daily spending limit for an agent
- **Signer**: Coldkey
- **Params**: `new_limit: u64`

### `deactivate_agent`
Disable an agent from making/receiving payments
- **Signer**: Coldkey

### `pay_agent`
User sends USDC payment to an agent
- **Signer**: User
- **Params**: `amount: u64`
- **Flow**: User USDC → Coldkey USDC

### `agent_pay`
Agent sends payment within daily limit
- **Signer**: Hotkey
- **Params**: `amount: u64`
- **Flow**: Coldkey USDC → Recipient USDC

### `request_payment`
Agent requests payment approval from coldkey
- **Signer**: Hotkey
- **Params**: `amount: u64`, `purpose: String`

### `approve_payment`
Coldkey approves a payment request
- **Signer**: Coldkey

### `reject_payment`
Coldkey rejects a payment request
- **Signer**: Coldkey

## Account Structures

### Registry
```rust
{
  authority: Pubkey,      // Program authority
  agent_count: u64,       // Total registered agents
  total_volume: u64,      // Total USDC processed
}
```

### Agent
```rust
{
  coldkey: Pubkey,               // Owner wallet
  hotkey: Pubkey,                // Operational wallet
  daily_limit: u64,              // Max daily spend (in USDC lamports)
  daily_spent: u64,              // Current day spending
  last_reset_timestamp: i64,     // Last daily reset time
  is_active: bool,               // Agent status
  total_received: u64,           // Lifetime received
  total_sent: u64,               // Lifetime sent
  bump: u8,                      // PDA bump seed
}
```

### PaymentRequest
```rust
{
  agent: Pubkey,           // Agent account
  hotkey: Pubkey,          // Requesting hotkey
  coldkey: Pubkey,         // Approving coldkey
  recipient: Pubkey,       // Payment recipient
  amount: u64,             // USDC amount
  purpose: String,         // Payment description
  status: PaymentStatus,   // Pending/Approved/Rejected
  requested_at: i64,       // Request timestamp
  processed_at: Option<i64>, // Approval/rejection time
  bump: u8,                // PDA bump
}
```

## Events

- `AgentRegistered`: New agent created
- `AgentLimitUpdated`: Daily limit changed
- `AgentDeactivated`: Agent disabled
- `PaymentMade`: User paid agent
- `AgentPaymentMade`: Agent sent payment
- `PaymentRequested`: Payment approval requested
- `PaymentApproved`: Request approved
- `PaymentRejected`: Request rejected

## Setup

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Build
```bash
anchor build
```

### Test
```bash
anchor test
```

### Deploy to Devnet
```bash
solana config set --url devnet
anchor deploy
```

## USDC Integration

This program uses SPL Token accounts for USDC transfers.

### Devnet USDC Mint
```
Mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

### Token Account Setup
Each participant needs a USDC token account:
```bash
spl-token create-account EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

## Security Considerations

1. **Daily Limits**: Reset automatically after 24 hours
2. **Authorization**: Coldkey required for critical operations
3. **Active Status**: Inactive agents cannot transact
4. **PDA Derivation**: Prevents unauthorized account access
5. **CPI Security**: Uses signer seeds for agent-initiated transfers

## Program ID
```
AgentPay11111111111111111111111111111111111
```

## License
MIT
