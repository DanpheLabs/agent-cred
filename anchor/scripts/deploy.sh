#!/bin/bash

# AgentPay Deployment Script for Devnet
# This script deploys the AgentPay program to Solana Devnet

set -e

echo "🚀 AgentPay Deployment Script"
echo "=============================="
echo ""

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install it first."
    echo "Run: sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
fi

# Check if anchor CLI is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install it first."
    echo "Run: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

# Set cluster to devnet
echo "📡 Setting Solana cluster to devnet..."
solana config set --url devnet

# Check wallet balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Current wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "⚠️  Low balance detected. Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build the program
echo ""
echo "🔨 Building AgentPay program..."
cd "$(dirname "$0")/.."
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/agent_pay-keypair.json)
echo ""
echo "📋 Program ID: $PROGRAM_ID"

# Deploy the program
echo ""
echo "🚀 Deploying to devnet..."
anchor deploy

# Verify deployment
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "====================="
echo "Program ID: $PROGRAM_ID"
echo "Cluster: devnet"
echo "RPC URL: https://api.devnet.solana.com"
echo ""
echo "🔗 View on Solana Explorer:"
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo "📝 Next steps:"
echo "1. Update your frontend with the new program ID"
echo "2. Initialize the registry: anchor run initialize-registry"
echo "3. Test the program: anchor test"
echo ""
