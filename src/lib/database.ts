import { supabase } from '@/integrations/supabase/client';

export interface TransactionRecord {
  wallet_address: string;
  from_address: string;
  to_address: string;
  type: string;
  amount: number;
  status: string;
  transaction_hash?: string;
  description?: string;
  metadata?: any;
}

export interface AgentRecord {
  id: string;
  wallet_address: string;
  name: string;
  endpoint: string;
  hotkey: string;
  coldkey: string;
  daily_limit: number;
  daily_spent: number;
  last_reset_date: string;
  balance: number;
  total_received: number;
  total_sent: number;
  status: string;
  created_at: string;
}

export async function saveTransaction(txData: {
  wallet_address: string;
  type: string;
  amount: number;
  status: string;
  transaction_hash: string;
  metadata?: any;
}) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        id: txData.transaction_hash,
        wallet_address: txData.wallet_address,
        from_address: txData.wallet_address,
        to_address: txData.metadata?.recipient || txData.metadata?.coldkey || txData.wallet_address,
        type: txData.type,
        amount: txData.amount,
        status: txData.status,
        description: JSON.stringify(txData.metadata),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving transaction:', error);
      // Don't throw - allow the transaction to succeed even if DB save fails
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception saving transaction:', err);
    return null;
  }
}

export async function getTransactionsFromDB(walletAddress: string, limit = 100) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching transactions:', err);
    return [];
  }
}

export async function getAgentsFromDB(walletAddress: string) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching agents:', err);
    return [];
  }
}

export async function updateAgentBalance(agentId: string, balance: number) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .update({ balance })
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent balance:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception updating agent balance:', err);
    return null;
  }
}

export async function updateAgentStats(
  agentId: string,
  totalReceived?: number,
  totalSent?: number,
  dailySpent?: number
) {
  try {
    const updates: any = {};
    if (totalReceived !== undefined) updates.total_received = totalReceived;
    if (totalSent !== undefined) updates.total_sent = totalSent;
    if (dailySpent !== undefined) updates.daily_spent = dailySpent;

    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent stats:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception updating agent stats:', err);
    return null;
  }
}
