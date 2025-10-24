import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Program ID
export const AGENT_PAY_PROGRAM_ID = new PublicKey('2hpe9fZeZvPbuFukKFqaVUq2YfDeLZymZbq7YGGkpxhE');

// Import IDL
const IDL_JSON = require('../../anchor/target/idl/agent_pay.json');

export type AgentPayIDL = typeof IDL_JSON;

// IDL Definition
export const IDL: AgentPayIDL = {
  version: "0.1.0",
  name: "agent_pay",
  instructions: [
    {
      name: "agentPay",
      docs: ["Agent initiates payment (within daily limit)"],
      discriminator: [191, 210, 112, 56, 82, 215, 140, 233],
      accounts: [
        { name: "agent", isMut: true, isSigner: false },
        { name: "hotkey", isMut: false, isSigner: true },
        { name: "recipient", isMut: false, isSigner: false },
        { name: "coldkey_token_account", isMut: true, isSigner: false },
        { name: "recipient_token_account", isMut: true, isSigner: false },
        { name: "token_program", isMut: false, isSigner: false }
      ],
      args: [{ name: "amount", type: "u64" }]
    },
    {
      name: "approvePayment",
      docs: ["Coldkey approves payment request"],
      discriminator: [21, 123, 195, 139, 107, 141, 34, 187],
      accounts: [
        { name: "payment_request", isMut: true, isSigner: false },
        { name: "agent", isMut: false, isSigner: false },
        { name: "coldkey", isMut: false, isSigner: true },
        { name: "coldkey_token_account", isMut: true, isSigner: false },
        { name: "recipient_token_account", isMut: true, isSigner: false },
        { name: "token_program", isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: "deactivateAgent",
      docs: ["Deactivate an agent"],
      discriminator: [205, 171, 239, 225, 82, 126, 96, 166],
      accounts: [
        { name: "agent", isMut: true, isSigner: false },
        { name: "coldkey", isMut: false, isSigner: true }
      ],
      args: []
    },
    {
      name: "initializeRegistry",
      docs: ["Initialize the agent registry"],
      discriminator: [189, 181, 20, 17, 174, 57, 249, 59],
      accounts: [
        { 
          name: "registry",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [{ kind: "const", value: [114, 101, 103, 105, 115, 116, 114, 121] }]
          }
        },
        { name: "authority", isMut: true, isSigner: true },
        { name: "system_program", isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: "registerAgent",
      docs: ["Register a new agent with hotkey/coldkey pair"],
      discriminator: [135, 157, 66, 195, 2, 113, 175, 30],
      accounts: [
        {
          name: "agent",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              { kind: "const", value: [97, 103, 101, 110, 116] },
              { kind: "account", path: "coldkey" },
              { kind: "arg", path: "hotkey" }
            ]
          }
        },
        { name: "registry", isMut: true, isSigner: false },
        { name: "coldkey", isMut: true, isSigner: true },
        { name: "system_program", isMut: false, isSigner: false }
      ],
      args: [
        { name: "hotkey", type: "publicKey" },
        { name: "daily_limit", type: "u64" }
      ]
    }
  ],
  accounts: [
    {
      name: "Agent",
      type: {
        kind: "struct",
        fields: [
          { name: "coldkey", type: "publicKey" },
          { name: "hotkey", type: "publicKey" },
          { name: "daily_limit", type: "u64" },
          { name: "daily_spent", type: "u64" },
          { name: "last_reset_timestamp", type: "i64" },
          { name: "is_active", type: "bool" },
          { name: "total_received", type: "u64" },
          { name: "total_sent", type: "u64" },
          { name: "bump", type: "u8" }
        ]
      }
    },
    {
      name: "PaymentRequest",
      type: {
        kind: "struct",
        fields: [
          { name: "agent", type: "publicKey" },
          { name: "hotkey", type: "publicKey" },
          { name: "coldkey", type: "publicKey" },
          { name: "recipient", type: "publicKey" },
          { name: "amount", type: "u64" },
          { name: "purpose", type: "string" },
          { name: "status", type: { defined: "PaymentStatus" } },
          { name: "requested_at", type: "i64" },
          { name: "processed_at", type: { option: "i64" } },
          { name: "bump", type: "u8" }
        ]
      }
    },
    {
      name: "Registry",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "agent_count", type: "u64" },
          { name: "total_volume", type: "u64" }
        ]
      }
    }
  ],
  types: [
    {
      name: "PaymentStatus",
      type: {
        kind: "enum",
        variants: [
          { name: "Pending" },
          { name: "Approved" },
          { name: "Rejected" }
        ]
      }
    }
  ],
  events: [
    {
      name: "AgentDeactivated",
      fields: [
        { name: "hotkey", type: "publicKey" },
        { name: "timestamp", type: "i64" }
      ]
    },
    {
      name: "AgentLimitUpdated",
      fields: [
        { name: "hotkey", type: "publicKey" },
        { name: "new_limit", type: "u64" },
        { name: "timestamp", type: "i64" }
      ]
    },
    {
      name: "AgentPaymentMade",
      fields: [
        { name: "agent", type: "publicKey" },
        { name: "recipient", type: "publicKey" },
        { name: "amount", type: "u64" },
        { name: "daily_spent", type: "u64" },
        { name: "timestamp", type: "i64" }
      ]
    },
    {
      name: "AgentRegistered",
      fields: [
        { name: "coldkey", type: "publicKey" },
        { name: "hotkey", type: "publicKey" },
        { name: "daily_limit", type: "u64" },
        { name: "timestamp", type: "i64" }
      ]
    }
  ],
  errors: [
    {
      code: 6000,
      name: "UnauthorizedColdkey",
      msg: "Unauthorized: Only the coldkey can perform this action"
    },
    {
      code: 6001,
      name: "UnauthorizedHotkey",
      msg: "Unauthorized: Only the hotkey can perform this action"
    },
    {
      code: 6002,
      name: "AgentInactive",
      msg: "Agent is not active"
    },
    {
      code: 6003,
      name: "DailyLimitExceeded",
      msg: "Daily spending limit exceeded"
    },
    {
      code: 6004,
      name: "RequestNotPending",
      msg: "Payment request is not pending"
    },
    {
      code: 6005,
      name: "PurposeTooLong",
      msg: "Purpose description is too long (max 200 characters)"
    }
  ],
  metadata: {
    address: AGENT_PAY_PROGRAM_ID.toBase58()
  }
} as const;

// Program Type
export type AgentPayProgram = Program<typeof IDL>;

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
  return new Program(
    IDL_JSON as AgentPayIDL,
    AGENT_PAY_PROGRAM_ID.toBase58(),
    provider
  ) as AgentPayProgram;
};