// Local storage utilities for AgentPay simulation

export interface Agent {
  id: string;
  name: string;
  hotkey: string;          // Operational wallet
  coldkey: string;         // Owner wallet
  balance: number;
  dailyLimit: number;      // USDC daily spending limit
  dailySpent: number;      // Current day spending
  lastResetDate: string;   // Last daily reset
  endpoint: string;
  status: "active" | "inactive";
  totalReceived: number;
  totalSent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "user_to_agent" | "agent_to_recipient" | "payment_request";
  from: string;
  to: string;
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "rejected";
  agentId?: string;
  requestId?: string;
}

export interface PaymentRequest {
  id: string;
  agentId: string;
  agentName: string;
  hotkey: string;
  coldkey: string;
  recipient: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string;
}

export interface WalletData {
  ownerAddress: string;
  connectedAt: string;
  balance: number;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  agentId: string;
  agentName: string;
  agentHotkey: string;
  createdAt: string;
  lastUsed?: string;
  requestCount: number;
  isActive: boolean;
}

const STORAGE_KEYS = {
  AGENTS: 'agentpay_agents',
  TRANSACTIONS: 'agentpay_transactions',
  WALLET: 'agentpay_wallet',
  PAYMENT_REQUESTS: 'agentpay_payment_requests',
  API_KEYS: 'agentpay_api_keys',
};

// Agent operations
export const getAgents = (): Agent[] => {
  const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
  return data ? JSON.parse(data) : [];
};

export const saveAgent = (agent: Agent): void => {
  const agents = getAgents();
  const existingIndex = agents.findIndex(a => a.id === agent.id);
  
  if (existingIndex >= 0) {
    agents[existingIndex] = agent;
  } else {
    agents.push(agent);
  }
  
  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
};

export const deleteAgent = (agentId: string): void => {
  const agents = getAgents().filter(a => a.id !== agentId);
  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
};

export const getAgentById = (agentId: string): Agent | undefined => {
  return getAgents().find(a => a.id === agentId);
};

// Transaction operations
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getTransactionsByAgent = (agentId: string): Transaction[] => {
  return getTransactions().filter(t => t.agentId === agentId);
};

export const getTransactionsByType = (type: Transaction['type']): Transaction[] => {
  return getTransactions().filter(t => t.type === type);
};

// Payment Requests
export const getPaymentRequests = (): PaymentRequest[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const savePaymentRequest = (request: PaymentRequest) => {
  const requests = getPaymentRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(requests));
};

export const updatePaymentRequest = (requestId: string, status: "approved" | "rejected") => {
  const requests = getPaymentRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index].status = status;
    requests[index].processedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(requests));
  }
};

export const getPendingRequests = (): PaymentRequest[] => {
  return getPaymentRequests().filter(r => r.status === 'pending');
};

// API Keys
export const getApiKeys = (): ApiKey[] => {
  const data = localStorage.getItem(STORAGE_KEYS.API_KEYS);
  return data ? JSON.parse(data) : [];
};

export const saveApiKey = (apiKey: ApiKey) => {
  const keys = getApiKeys();
  keys.push(apiKey);
  localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
};

export const revokeApiKey = (keyId: string) => {
  const keys = getApiKeys();
  const index = keys.findIndex(k => k.id === keyId);
  if (index !== -1) {
    keys[index].isActive = false;
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  }
};

export const getApiKeysByAgent = (agentId: string): ApiKey[] => {
  return getApiKeys().filter(k => k.agentId === agentId);
};

// Wallet operations
export const saveWallet = (walletData: WalletData): void => {
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(walletData));
};

export const getWallet = (): WalletData | null => {
  const data = localStorage.getItem(STORAGE_KEYS.WALLET);
  return data ? JSON.parse(data) : null;
};

export const clearWallet = (): void => {
  localStorage.removeItem(STORAGE_KEYS.WALLET);
};

// Analytics helpers
export const getAnalytics = () => {
  const transactions = getTransactions();
  const agents = getAgents();
  const requests = getPaymentRequests();

  const totalReceived = transactions
    .filter(t => t.type === 'user_to_agent')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSent = transactions
    .filter(t => t.type === 'agent_to_recipient' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return {
    totalReceived,
    totalSent,
    activeAgents,
    totalAgents: agents.length,
    pendingRequests,
    recentTransactions,
  };
};

// Generate mock Solana address
export const generateMockAddress = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let address = '';
  for (let i = 0; i < 44; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

// Generate API Key
export const generateApiKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'apk_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

// Reset daily spending (call this on agent load)
export const resetDailySpendingIfNeeded = (agent: Agent): Agent => {
  const now = new Date();
  const lastReset = new Date(agent.lastResetDate);
  const daysDiff = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 1) {
    return {
      ...agent,
      dailySpent: 0,
      lastResetDate: now.toISOString(),
    };
  }
  return agent;
};
