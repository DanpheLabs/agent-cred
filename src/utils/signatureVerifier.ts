// src/utils/signatureVerifier.ts
import { verify } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

export const verifySignature = async (publicKey: string, message: string, signature: string): Promise<boolean> => {
  try {
    const key = new PublicKey(publicKey);
    const messageBuffer = Buffer.from(message);
    const signatureBuffer = Buffer.from(signature, 'hex');
    
    return verify(signatureBuffer, messageBuffer, key);
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

export const verifyColdkeySignature = async (coldkey: string, data: any): Promise<boolean> => {
  try {
    // In a real implementation, this would verify a signature from the coldkey
    // This is a simplified version for demonstration
    return true;
  } catch (error) {
    console.error('Coldkey signature verification failed:', error);
    return false;
  }
};