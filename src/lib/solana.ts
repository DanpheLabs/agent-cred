import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { createAnchorProgram } from './anchor-program';

export const AGENT_PAY_PROGRAM_ID = new PublicKey('2hpe9fZeZvPbuFukKFqaVUq2YfDeLZymZbq7YGGkpxhE');
// AgentPay IDL
const IDL: Idl = {
  version: "0.1.0",
  name: "agent_pay",
  instructions: [
    {
      name: "registerAgent",
      accounts: [
        {
          name: "agent",
          isMut: true,
          isSigner: false
        },
        {
          name: "registry",
          isMut: true,
          isSigner: false
        },
        {
          name: "coldkey",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "hotkey",
          type: {
            defined: "PublicKey"
          }
        },
        {
          name: "dailyLimit",
          type: "u64"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "agent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "coldkey",
            type: "publicKey"
          },
          {
            name: "hotkey",
            type: "publicKey"
          },
          {
            name: "dailyLimit",
            type: "u64"
          },
          {
            name: "dailySpent",
            type: "u64"
          },
          {
            name: "lastResetTimestamp",
            type: "i64"
          },
          {
            name: "isActive",
            type: "bool"
          },
          {
            name: "totalReceived",
            type: "u64"
          },
          {
            name: "totalSent",
            type: "u64"
          },
          {
            name: "bump",
            type: "u8"
          }
        ]
      }
    }
  ],
  metadata: {
    address: AGENT_PAY_PROGRAM_ID.toBase58()
  }
};

// AgentPay Program ID on Devnet

// USDC Mint on Devnet
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Connection to Solana Devnet
export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Derive Registry PDA
export function getRegistryPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('registry')],
    AGENT_PAY_PROGRAM_ID
  );
}

// Derive Agent PDA
export function getAgentPDA(coldkey: PublicKey, hotkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('agent'), coldkey.toBuffer(), hotkey.toBuffer()],
    AGENT_PAY_PROGRAM_ID
  );
}

// Derive Payment Request PDA
export function getPaymentRequestPDA(
  agentPDA: PublicKey,
  hotkey: PublicKey,
  timestamp: number
): [PublicKey, number] {
  const timestampBuffer = Buffer.alloc(8);
  timestampBuffer.writeBigInt64LE(BigInt(timestamp));
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('payment_request'),
      agentPDA.toBuffer(),
      hotkey.toBuffer(),
      timestampBuffer,
    ],
    AGENT_PAY_PROGRAM_ID
  );
}

export interface AgentData {
  coldkey: PublicKey;
  hotkey: PublicKey;
  dailyLimit: BN;
  dailySpent: BN;
  lastResetTimestamp: BN;
  isActive: boolean;
  totalReceived: BN;
  totalSent: BN;
  bump: number;
}

export interface RegistryData {
  authority: PublicKey;
  agentCount: BN;
  totalVolume: BN;
}

export interface PaymentRequestData {
  agent: PublicKey;
  hotkey: PublicKey;
  coldkey: PublicKey;
  recipient: PublicKey;
  amount: BN;
  purpose: string;
  status: { pending?: {} } | { approved?: {} } | { rejected?: {} };
  requestedAt: BN;
  processedAt: BN | null;
  bump: number;
}

// Fetch Agent Data (simplified - reads account data directly)
export async function fetchAgent(coldkey: PublicKey, hotkey: PublicKey): Promise<AgentData | null> {
  try {
    const [agentPDA] = getAgentPDA(coldkey, hotkey);
    const accountInfo = await connection.getAccountInfo(agentPDA);
    
    if (!accountInfo) {
      return null;
    }

    // Parse account data (simplified - in production, use Anchor's IDL)
    // This is a basic deserialization - adjust based on actual account structure
    const data = accountInfo.data;
    
    // Skip discriminator (8 bytes) and parse fields
    let offset = 8;
    
    const coldkeyBytes = data.slice(offset, offset + 32);
    offset += 32;
    const hotkeyBytes = data.slice(offset, offset + 32);
    offset += 32;
    const dailyLimit = new BN(data.slice(offset, offset + 8), 'le');
    offset += 8;
    const dailySpent = new BN(data.slice(offset, offset + 8), 'le');
    offset += 8;
    const lastResetTimestamp = new BN(data.slice(offset, offset + 8), 'le');
    offset += 8;
    const isActive = data[offset] === 1;
    offset += 1;
    const totalReceived = new BN(data.slice(offset, offset + 8), 'le');
    offset += 8;
    const totalSent = new BN(data.slice(offset, offset + 8), 'le');
    offset += 8;
    const bump = data[offset];

    return {
      coldkey: new PublicKey(coldkeyBytes),
      hotkey: new PublicKey(hotkeyBytes),
      dailyLimit,
      dailySpent,
      lastResetTimestamp,
      isActive,
      totalReceived,
      totalSent,
      bump,
    };
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
}

// Fetch Registry Data
export async function fetchRegistry(): Promise<RegistryData | null> {
  try {
    const [registryPDA] = getRegistryPDA();
    const accountInfo = await connection.getAccountInfo(registryPDA);
    
    if (!accountInfo) {
      return null;
    }

    // Parse registry data (simplified)
    // In production, use the Program to decode properly
    return {
      authority: new PublicKey(accountInfo.data.slice(8, 40)),
      agentCount: new BN(accountInfo.data.slice(40, 48), 'le'),
      totalVolume: new BN(accountInfo.data.slice(48, 56), 'le'),
    };
  } catch (error) {
    console.error('Error fetching registry:', error);
    return null;
  }
}

// Register Agent
export async function registerAgent(
  wallet: WalletContextState,
  hotkey: PublicKey,
  dailyLimit: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  // Create Anchor provider
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions!,
    },
    { commitment: 'confirmed' }
  );

  // Create program interface
  const program = new Program(IDL as Idl, AGENT_PAY_PROGRAM_ID, provider);

  // Get PDA addresses
  const [registryPDA] = getRegistryPDA();
  const [agentPDA] = getAgentPDA(wallet.publicKey, hotkey);
  
  const dailyLimitBN = parseUSDC(dailyLimit);

  try {
    // Use Anchor to send the register_agent instruction
    const tx = await program.methods
      .registerAgent(hotkey, dailyLimitBN)
      .accounts({
        agent: agentPDA,
        registry: registryPDA,
        coldkey: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Wait for confirmation
    await connection.confirmTransaction(tx);
    return tx;
  } catch (error: any) {
    console.error('Error registering agent:', error);
    // Enhance error logging
    if (error.logs) {
      console.error('Program logs:', error.logs);
    }
    throw error;
  }
}

// Pay Agent
export async function payAgent(
  wallet: WalletContextState,
  coldkey: PublicKey,
  hotkey: PublicKey,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const [registryPDA] = getRegistryPDA();
  const [agentPDA] = getAgentPDA(coldkey, hotkey);
  
  const amountBN = parseUSDC(amount);

  const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
  const coldkeyTokenAccount = await getAssociatedTokenAddress(USDC_MINT, coldkey);

  const instruction = new Transaction();
  
  // Build pay_agent instruction
  const keys = [
    { pubkey: agentPDA, isSigner: false, isWritable: true },
    { pubkey: registryPDA, isSigner: false, isWritable: true },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: coldkeyTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  // Instruction data: [discriminator (8 bytes), amount (8 bytes)]
  const data = Buffer.alloc(16);
  const discriminator = Buffer.from([0x7d, 0x7e, 0x3f, 0x5a, 0x9c, 0x2d, 0x1e, 0x4b]);
  discriminator.copy(data, 0);
  data.writeBigUInt64LE(BigInt(amountBN.toString()), 8);

  instruction.add({
    keys,
    programId: AGENT_PAY_PROGRAM_ID,
    data,
  });

  instruction.feePayer = wallet.publicKey;
  instruction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await wallet.signTransaction(instruction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature);

  return signature;
}

// Agent Send Payment
export async function agentPay(
  wallet: WalletContextState,
  coldkey: PublicKey,
  recipient: PublicKey,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const [agentPDA] = getAgentPDA(coldkey, wallet.publicKey);
  
  const amountBN = parseUSDC(amount);

  const coldkeyTokenAccount = await getAssociatedTokenAddress(USDC_MINT, coldkey);
  const recipientTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipient);

  const instruction = new Transaction();
  
  // Build agent_pay instruction
  const keys = [
    { pubkey: agentPDA, isSigner: false, isWritable: true },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    { pubkey: recipient, isSigner: false, isWritable: false },
    { pubkey: coldkeyTokenAccount, isSigner: false, isWritable: true },
    { pubkey: recipientTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  // Instruction data: [discriminator (8 bytes), amount (8 bytes)]
  const data = Buffer.alloc(16);
  const discriminator = Buffer.from([0x4f, 0x8e, 0x2d, 0x3c, 0x1a, 0x6b, 0x9f, 0x7e]);
  discriminator.copy(data, 0);
  data.writeBigUInt64LE(BigInt(amountBN.toString()), 8);

  instruction.add({
    keys,
    programId: AGENT_PAY_PROGRAM_ID,
    data,
  });

  instruction.feePayer = wallet.publicKey;
  instruction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await wallet.signTransaction(instruction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature);

  return signature;
}

// Request Payment
export async function requestPayment(
  wallet: WalletContextState,
  coldkey: PublicKey,
  recipient: PublicKey,
  amount: number,
  purpose: string
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const [agentPDA] = getAgentPDA(coldkey, wallet.publicKey);
  const timestamp = Math.floor(Date.now() / 1000);
  const [paymentRequestPDA] = getPaymentRequestPDA(agentPDA, wallet.publicKey, timestamp);
  
  const amountBN = parseUSDC(amount);

  const instruction = new Transaction();
  
  // Build request_payment instruction
  const keys = [
    { pubkey: paymentRequestPDA, isSigner: false, isWritable: true },
    { pubkey: agentPDA, isSigner: false, isWritable: false },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
    { pubkey: recipient, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  // Instruction data: [discriminator (8 bytes), amount (8 bytes), purpose (string)]
  const purposeBuffer = Buffer.from(purpose);
  const data = Buffer.alloc(16 + 4 + purposeBuffer.length);
  const discriminator = Buffer.from([0x9a, 0x5c, 0x7f, 0x2e, 0x4d, 0x8b, 0x3e, 0x1c]);
  discriminator.copy(data, 0);
  data.writeBigUInt64LE(BigInt(amountBN.toString()), 8);
  data.writeUInt32LE(purposeBuffer.length, 16);
  purposeBuffer.copy(data, 20);

  instruction.add({
    keys,
    programId: AGENT_PAY_PROGRAM_ID,
    data,
  });

  instruction.feePayer = wallet.publicKey;
  instruction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await wallet.signTransaction(instruction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature);

  return signature;
}

// Format USDC amount
export function formatUSDC(lamports: number | BN): string {
  const amount = typeof lamports === 'number' ? lamports : lamports.toNumber();
  return (amount / 1_000_000).toFixed(2);
}

// Parse USDC amount to lamports
export function parseUSDC(amount: number): BN {
  return new BN(amount * 1_000_000);
}