import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

// AgentPay Program ID on Devnet
export const AGENT_PAY_PROGRAM_ID = new PublicKey('AgentPay11111111111111111111111111111111111');

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

// Note: The following methods require the Anchor program to be fully deployed
// For now, they will throw errors indicating setup is needed

// Register Agent
export async function registerAgent(
  wallet: WalletContextState,
  hotkey: PublicKey,
  dailyLimit: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  // TODO: Implement with deployed program
  throw new Error('Program not yet deployed. Please deploy the Anchor program first using: npm run anchor:deploy');
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

  // TODO: Implement with deployed program
  throw new Error('Program not yet deployed. Please deploy the Anchor program first using: npm run anchor:deploy');
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

  // TODO: Implement with deployed program
  throw new Error('Program not yet deployed. Please deploy the Anchor program first using: npm run anchor:deploy');
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

  // TODO: Implement with deployed program
  throw new Error('Program not yet deployed. Please deploy the Anchor program first using: npm run anchor:deploy');
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
