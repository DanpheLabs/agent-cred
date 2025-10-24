// src/models/PaymentRequest.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentRequest extends Document {
  requestId: string;
  agentId: string;
  agentName: string;
  hotkey: string;
  coldkey: string;
  recipient: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema: Schema = new Schema({
  requestId: { type: String, required: true, unique: true },
  agentId: { type: String, required: true },
  agentName: { type: String, required: true },
  hotkey: { type: String, required: true },
  coldkey: { type: String, required: true },
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPaymentRequest>('PaymentRequest', PaymentRequestSchema);