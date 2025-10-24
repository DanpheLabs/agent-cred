import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { IDL, AGENT_PAY_PROGRAM_ID } from './idl';

// Define program ID

// Create Program instance
export const createAnchorProgram = (
  connection: Connection,
  wallet: WalletContextState
): Program<Idl> | null => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    return null;
  }

  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions!,
    },
    { commitment: 'confirmed' }
  );

  // Set Provider
  AnchorProvider.env().opts.preflightCommitment = 'confirmed';

  return new Program(IDL, provider, AGENT_PAY_PROGRAM_ID);
};