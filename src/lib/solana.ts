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

// Initialize AgentPay Program
export async function getProgram(wallet: WalletContextState) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'confirmed' }
  );

  // Load IDL (you'll need to import the actual IDL)
  const idl = await Program.fetchIdl(AGENT_PAY_PROGRAM_ID, provider);
  
  if (!idl) {
    throw new Error('IDL not found');
  }

  return new Program(idl as Idl, AGENT_PAY_PROGRAM_ID, provider);
}

// Fetch Agent Data
export async function fetchAgent(coldkey: PublicKey, hotkey: PublicKey): Promise<AgentData | null> {
  try {
    const program = await getProgram({ publicKey: coldkey } as any);
    const [agentPDA] = getAgentPDA(coldkey, hotkey);
    const agent = await program.account.agent.fetch(agentPDA);
    return agent as AgentData;
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

  const program = await getProgram(wallet);
  const [registryPDA] = getRegistryPDA();
  const [agentPDA] = getAgentPDA(wallet.publicKey, hotkey);

  const tx = await program.methods
    .registerAgent(hotkey, new BN(dailyLimit * 1_000_000))
    .accounts({
      agent: agentPDA,
      registry: registryPDA,
      coldkey: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
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

  const program = await getProgram(wallet);
  const [agentPDA] = getAgentPDA(coldkey, hotkey);
  const [registryPDA] = getRegistryPDA();

  const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
  const coldkeyTokenAccount = await getAssociatedTokenAddress(USDC_MINT, coldkey);

  const tx = await program.methods
    .payAgent(new BN(amount * 1_000_000))
    .accounts({
      agent: agentPDA,
      registry: registryPDA,
      user: wallet.publicKey,
      userTokenAccount,
      coldkeyTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  return tx;
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

  const program = await getProgram(wallet);
  const [agentPDA] = getAgentPDA(coldkey, wallet.publicKey);

  const coldkeyTokenAccount = await getAssociatedTokenAddress(USDC_MINT, coldkey);
  const recipientTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipient);

  const tx = await program.methods
    .agentPay(new BN(amount * 1_000_000))
    .accounts({
      agent: agentPDA,
      hotkey: wallet.publicKey,
      recipient,
      coldkeyTokenAccount,
      recipientTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  return tx;
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

  const program = await getProgram(wallet);
  const [agentPDA] = getAgentPDA(coldkey, wallet.publicKey);
  const timestamp = Math.floor(Date.now() / 1000);
  const [paymentRequestPDA] = getPaymentRequestPDA(agentPDA, wallet.publicKey, timestamp);

  const tx = await program.methods
    .requestPayment(new BN(amount * 1_000_000), purpose)
    .accounts({
      paymentRequest: paymentRequestPDA,
      agent: agentPDA,
      hotkey: wallet.publicKey,
      recipient,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
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
