import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Program ID
export const AGENT_PAY_PROGRAM_ID = new PublicKey('2hpe9fZeZvPbuFukKFqaVUq2YfDeLZymZbq7YGGkpxhE');

// IDL Definition (matching the deployed contract)
export const IDL: Idl = {
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
      name: "agent",
      discriminator: [102, 165, 155, 87, 245, 109, 63, 218]
    },
    {
      name: "registry",
      discriminator: [128, 99, 167, 190, 229, 190, 177, 151]
    }
  ],
  types: []
};

export type AgentPayProgram = Program<Idl>;

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
