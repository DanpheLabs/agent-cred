import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

// AgentPay Program ID on Devnet
export const AGENT_PAY_PROGRAM_ID = new PublicKey('4oaMRmsu2jKBapScs2McmgUjxaeH6eV9LHP2JktLfFXJ');

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

  const [registryPDA] = getRegistryPDA();
  const [agentPDA] = getAgentPDA(wallet.publicKey, hotkey);
  
  const dailyLimitBN = parseUSDC(dailyLimit);

  const instruction = new Transaction();
  
  // Build register_agent instruction
  const keys = [
    { pubkey: agentPDA, isSigner: false, isWritable: true },
    { pubkey: registryPDA, isSigner: false, isWritable: true },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  // Instruction data: [instruction discriminator (8 bytes), hotkey (32 bytes), daily_limit (8 bytes)]
  const data = Buffer.alloc(8 + 32 + 8);
  // Register agent instruction discriminator (computed from "register_agent")
  const discriminator = Buffer.from([0x93, 0x3c, 0x2e, 0x1b, 0x7c, 0x5a, 0x9f, 0x3d]);
  discriminator.copy(data, 0);
  hotkey.toBuffer().copy(data, 8);
  data.writeBigUInt64LE(BigInt(dailyLimitBN.toString()), 40);

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