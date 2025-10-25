import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Program ID
export const AGENT_PAY_PROGRAM_ID = new PublicKey('54ZZfUHiT4AM3nvnipZzJWDumVdXTmdMQuSb4Yc2TzUg');

// IDL Definition - simple any type to avoid TypeScript conflicts with Anchor's complex types
export const IDL: any = {
  address: AGENT_PAY_PROGRAM_ID.toBase58(),
  metadata: {
    name: "agent_pay",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "agentPay",
      discriminator: [191, 210, 112, 56, 82, 215, 140, 233],
      accounts: [
        { name: "agent", writable: true },
        { name: "hotkey", signer: true },
        { name: "recipient" },
        { name: "coldkeyTokenAccount", writable: true },
        { name: "recipientTokenAccount", writable: true },
        { name: "tokenProgram" }
      ],
      args: [{ name: "amount", type: "u64" }]
    },
    {
      name: "registerAgent",
      discriminator: [135, 157, 66, 195, 2, 113, 175, 30],
      accounts: [
        { name: "agent", writable: true },
        { name: "registry", writable: true },
        { name: "coldkey", writable: true, signer: true },
        { name: "systemProgram" }
      ],
      args: [
        { name: "hotkey", type: "pubkey" },
        { name: "dailyLimit", type: "u64" }
      ]
    }
  ],
  accounts: [
    {
      name: "Agent",
      discriminator: [102, 165, 155, 87, 245, 109, 63, 218]
    },
    {
      name: "Registry",
      discriminator: [128, 99, 167, 190, 229, 190, 177, 151]
    }
  ],
  types: [
    {
      name: "Agent",
      type: {
        kind: "struct",
        fields: [
          { name: "coldkey", type: "pubkey" },
          { name: "hotkey", type: "pubkey" },
          { name: "dailyLimit", type: "u64" },
          { name: "dailySpent", type: "u64" },
          { name: "lastResetTimestamp", type: "i64" },
          { name: "isActive", type: "bool" },
          { name: "totalReceived", type: "u64" },
          { name: "totalSent", type: "u64" },
          { name: "bump", type: "u8" }
        ]
      }
    },
    {
      name: "Registry",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "pubkey" },
          { name: "agentCount", type: "u64" },
          { name: "totalVolume", type: "u64" }
        ]
      }
    }
  ]
};

export type AgentPayProgram = Program<any>;

// Create Program instance
export const createAnchorProgram = (
  connection: Connection,
  wallet: WalletContextState
): AgentPayProgram | null => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return null;
  }

  // Create AnchorProvider
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions!,
    },
    { commitment: 'confirmed' }
  );

  // Create and return program
  return new Program(IDL, provider);
};
