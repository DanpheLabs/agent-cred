// src/models/Transaction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  agentId: string;
  from: string;
  to: string;
  amount: number;
  tokenMint?: string;
  status: 'pending' | 'completed' | 'failed' | 'approved' | 'rejected';
  type: 'payment' | 'deposit' | 'withdrawal';
  description: string;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true },
  agentId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  tokenMint: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'approved', 'rejected'], 
    default: 'pending' 
  },
  type: { 
    type: String, 
    enum: ['payment', 'deposit', 'withdrawal'], 
    required: true 
  },
  description: { type: String, required: true },
  signature: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);