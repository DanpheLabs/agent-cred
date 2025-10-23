-- Create agents table
CREATE TABLE public.agents (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  name TEXT NOT NULL,
  hotkey TEXT NOT NULL,
  coldkey TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  daily_limit DECIMAL NOT NULL,
  daily_spent DECIMAL DEFAULT 0,
  last_reset_date TIMESTAMPTZ DEFAULT now(),
  balance DECIMAL DEFAULT 0,
  total_received DECIMAL DEFAULT 0,
  total_sent DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  type TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'completed',
  agent_id TEXT,
  request_id TEXT
);

-- Create payment_requests table
CREATE TABLE public.payment_requests (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  hotkey TEXT NOT NULL,
  coldkey TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Create api_keys table
CREATE TABLE public.api_keys (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  agent_hotkey TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ,
  request_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents (wallet-based auth)
CREATE POLICY "Users can view their own agents"
  ON public.agents FOR SELECT
  USING (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can insert their own agents"
  ON public.agents FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can update their own agents"
  ON public.agents FOR UPDATE
  USING (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can delete their own agents"
  ON public.agents FOR DELETE
  USING (wallet_address = current_setting('app.current_wallet', true));

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.current_wallet', true));

-- RLS Policies for payment_requests
CREATE POLICY "Users can view their own payment requests"
  ON public.payment_requests FOR SELECT
  USING (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can insert their own payment requests"
  ON public.payment_requests FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can update their own payment requests"
  ON public.payment_requests FOR UPDATE
  USING (wallet_address = current_setting('app.current_wallet', true));

-- RLS Policies for api_keys
CREATE POLICY "Users can view their own api keys"
  ON public.api_keys FOR SELECT
  USING (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can insert their own api keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (wallet_address = current_setting('app.current_wallet', true));

CREATE POLICY "Users can update their own api keys"
  ON public.api_keys FOR UPDATE
  USING (wallet_address = current_setting('app.current_wallet', true));

-- Indexes for better query performance
CREATE INDEX idx_agents_wallet ON public.agents(wallet_address);
CREATE INDEX idx_transactions_wallet ON public.transactions(wallet_address);
CREATE INDEX idx_payment_requests_wallet ON public.payment_requests(wallet_address);
CREATE INDEX idx_api_keys_wallet ON public.api_keys(wallet_address);