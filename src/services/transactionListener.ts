// src/services/transactionListener.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { getProgram } from '../lib/solana';
import Agent from '../models/Agent';
import Transaction from '../models/Transaction';
import { CronJob } from 'cron';

// Initialize Solana connection
const connection = new Connection('https://api.devnet.solana.com');

// Listen for new transactions on the AgentPay program
export const startTransactionListener = async () => {
  try {
    const program = await getProgram();
    if (!program) {
      console.error('Failed to initialize program');
      return;
    }

    // Listen for program events (this is a simplified version)
    // In a real implementation, you would use:
    // - Webhooks or polling for transaction events
    // - Program logs parsing for transaction confirmations
    console.log('Transaction listener started');

    // Set up cron job for periodic sync
    const syncJob = new CronJob('*/5 * * * *', async () => {
      await syncTransactions();
    });
    
    syncJob.start();
    
  } catch (error) {
    console.error('Error starting transaction listener:', error);
  }
};

// Sync transactions from blockchain to MongoDB
export const syncTransactions = async () => {
  try {
    console.log('Syncing transactions from blockchain to MongoDB...');
    
    // This would be implemented to fetch recent transactions
    // from the program and sync them to MongoDB
    // For now, we'll just log that sync is happening
    
  } catch (error) {
    console.error('Error syncing transactions:', error);
  }
};

// Monitor daily spending limits
export const monitorDailyLimits = async () => {
  try {
    console.log('Monitoring daily spending limits...');
    
    // This would check all agents and reset daily spent amounts
    // when the day changes
    
  } catch (error) {
    console.error('Error monitoring daily limits:', error);
  }
};

// Set up daily limit reset cron job
export const setupDailyLimitReset = () => {
  // Reset daily spent amounts at midnight UTC
  const resetJob = new CronJob('0 0 0 * * *', async () => {
    try {
      console.log('Resetting daily spending limits...');
      // Implementation to reset daily spent amounts
    } catch (error) {
      console.error('Error resetting daily limits:', error);
    }
  });
  
  resetJob.start();
};