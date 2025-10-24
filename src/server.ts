// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectToDatabase } from './database';
import { agentRoutes } from './routes/agents';
import { transactionRoutes } from './routes/transactions';
import { paymentRoutes } from './routes/payments';
import { walletRoutes } from './routes/wallets';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { verifySignature } from './utils/signatureVerifier';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;