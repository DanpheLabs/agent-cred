-- Fix the function to have a proper search_path
DROP FUNCTION IF EXISTS public.set_wallet_context(TEXT);

CREATE OR REPLACE FUNCTION public.set_wallet_context(wallet_addr TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.current_wallet', wallet_addr, false);
END;
$$;