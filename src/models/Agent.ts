// src/models/Agent.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent extends Document {
  agentId: string;
  name: string;
  hotkey: string;
  coldkey: string;
  status: 'active' | 'inactive';
  dailyLimit: number;
  dailySpent: number;
  lastResetDate: Date;
  endpoint: string;
  serviceAPI: string;
  paymentAPI: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema: Schema = new Schema({
  agentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hotkey: { type: String, required: true },
  coldkey: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  dailyLimit: { type: Number, required: true },
  dailySpent: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now },
  endpoint: { type: String, required: true },
  serviceAPI: { type: String, required: true },
  paymentAPI: { type: String, required: true },
  balance: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  totalSent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAgent>('Agent', AgentSchema);