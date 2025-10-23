-- Create function to set session config for RLS
CREATE OR REPLACE FUNCTION public.set_wallet_context(wallet_addr TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_wallet', wallet_addr, false);
END;
$$;