import { PublicKey } from '@solana/web3.js';
import { Idl, BN } from '@coral-xyz/anchor';

export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

// Account Types
export type Agent = {
  coldkey: PublicKey;
  hotkey: PublicKey;
  daily_limit: BN;
  daily_spent: BN;
  last_reset_timestamp: BN;
  is_active: boolean;
  total_received: BN;
  total_sent: BN;
  bump: number;
};

export type Registry = {
  authority: PublicKey;
  agent_count: BN;
  total_volume: BN;
};

export type PaymentRequest = {
  agent: PublicKey;
  hotkey: PublicKey;
  coldkey: PublicKey;
  recipient: PublicKey;
  amount: BN;
  purpose: string;
  status: PaymentStatus;
  requested_at: BN;
  processed_at: BN | null;
  bump: number;
};

// Instruction Parameters
export type RegisterAgentParams = {
  hotkey: PublicKey;
  dailyLimit: BN;
};

export type AgentPayIDL = {
  version: "0.1.0";
  name: "agent_pay";
  instructions: [
    {
      name: "agentPay";
      docs: ["Agent initiates payment (within daily limit)"];
      discriminator: [191, 210, 112, 56, 82, 215, 140, 233];
      accounts: [
        { name: "agent"; isMut: true; isSigner: false },
        { name: "hotkey"; isMut: false; isSigner: true },
        { name: "recipient"; isMut: false; isSigner: false },
        { name: "coldkeyTokenAccount"; isMut: true; isSigner: false },
        { name: "recipientTokenAccount"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "approvePayment";
      docs: ["Coldkey approves payment request"];
      discriminator: [21, 123, 195, 139, 107, 141, 34, 187];
      accounts: [
        { name: "paymentRequest"; isMut: true; isSigner: false },
        { name: "agent"; isMut: false; isSigner: false },
        { name: "coldkey"; isMut: false; isSigner: true },
        { name: "coldkeyTokenAccount"; isMut: true; isSigner: false },
        { name: "recipientTokenAccount"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: "deactivateAgent";
      docs: ["Deactivate an agent"];
      discriminator: [205, 171, 239, 225, 82, 126, 96, 166];
      accounts: [
        { name: "agent"; isMut: true; isSigner: false },
        { name: "coldkey"; isMut: false; isSigner: true }
      ];
      args: [];
    },
    {
      name: "initializeRegistry";
      docs: ["Initialize the agent registry"];
      discriminator: [189, 181, 20, 17, 174, 57, 249, 59];
      accounts: [
        { 
          name: "registry";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [{ kind: "const"; type: "string"; value: "registry" }];
          };
        },
        { name: "authority"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: "registerAgent";
      docs: ["Register a new agent with hotkey/coldkey pair"];
      discriminator: [135, 157, 66, 195, 2, 113, 175, 30];
      accounts: [
        {
          name: "agent";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              { kind: "const"; type: "string"; value: "agent" },
              { kind: "account"; type: "publicKey"; path: "coldkey" },
              { kind: "arg"; type: "publicKey"; path: "hotkey" }
            ];
          };
        },
        { name: "registry"; isMut: true; isSigner: false },
        { name: "coldkey"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "hotkey"; type: "publicKey" },
        { name: "dailyLimit"; type: "u64" }
      ];
    }
  ];
  accounts: [
    {
      name: "Agent";
      type: {
        kind: "struct";
        fields: [
          { name: "coldkey"; type: "publicKey" },
          { name: "hotkey"; type: "publicKey" },
          { name: "daily_limit"; type: "u64" },
          { name: "daily_spent"; type: "u64" },
          { name: "last_reset_timestamp"; type: "i64" },
          { name: "is_active"; type: "bool" },
          { name: "total_received"; type: "u64" },
          { name: "total_sent"; type: "u64" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "PaymentRequest";
      type: {
        kind: "struct";
        fields: [
          { name: "agent"; type: "publicKey" },
          { name: "hotkey"; type: "publicKey" },
          { name: "coldkey"; type: "publicKey" },
          { name: "recipient"; type: "publicKey" },
          { name: "amount"; type: "u64" },
          { name: "purpose"; type: "string" },
          { name: "status"; type: { defined: "PaymentStatus" } },
          { name: "requested_at"; type: "i64" },
          { name: "processed_at"; type: { option: "i64" } },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "Registry";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "agent_count"; type: "u64" },
          { name: "total_volume"; type: "u64" }
        ];
      };
    }
  ];
  events: [
    {
      name: "AgentDeactivated";
      fields: [
        { name: "hotkey"; type: "publicKey" },
        { name: "timestamp"; type: "i64" }
      ];
    },
    {
      name: "AgentLimitUpdated";
      fields: [
        { name: "hotkey"; type: "publicKey" },
        { name: "new_limit"; type: "u64" },
        { name: "timestamp"; type: "i64" }
      ];
    },
    {
      name: "AgentPaymentMade";
      fields: [
        { name: "agent"; type: "publicKey" },
        { name: "recipient"; type: "publicKey" },
        { name: "amount"; type: "u64" },
        { name: "daily_spent"; type: "u64" },
        { name: "timestamp"; type: "i64" }
      ];
    },
    {
      name: "AgentRegistered";
      fields: [
        { name: "coldkey"; type: "publicKey" },
        { name: "hotkey"; type: "publicKey" },
        { name: "daily_limit"; type: "u64" },
        { name: "timestamp"; type: "i64" }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "UnauthorizedColdkey";
      msg: "Unauthorized: Only the coldkey can perform this action";
    },
    {
      code: 6001;
      name: "UnauthorizedHotkey";
      msg: "Unauthorized: Only the hotkey can perform this action";
    },
    {
      code: 6002;
      name: "AgentInactive";
      msg: "Agent is not active";
    },
    {
      code: 6003;
      name: "DailyLimitExceeded";
      msg: "Daily spending limit exceeded";
    },
    {
      code: 6004;
      name: "RequestNotPending";
      msg: "Payment request is not pending";
    },
    {
      code: 6005;
      name: "PurposeTooLong";
      msg: "Purpose description is too long (max 200 characters)";
    }
  ];
  types: [
    {
      name: "PaymentStatus";
      type: {
        kind: "enum";
        variants: [
          { name: "Pending" },
          { name: "Approved" },
          { name: "Rejected" }
        ];
      };
    }
  ];
} & Idl;