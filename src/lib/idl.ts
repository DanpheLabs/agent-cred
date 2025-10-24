import { PublicKey } from '@solana/web3.js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Program ID
export const AGENT_PAY_PROGRAM_ID = new PublicKey('2hpe9fZeZvPbuFukKFqaVUq2YfDeLZymZbq7YGGkpxhE');

// Read the IDL from the target directory
const idlPath = join(__dirname, '../../anchor/target/idl/agent_pay.json');
export const IDL = JSON.parse(readFileSync(idlPath, 'utf8'));