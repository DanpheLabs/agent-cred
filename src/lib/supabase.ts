import { supabase } from "@/integrations/supabase/client";

// Set wallet context for RLS policies
export const setWalletContext = async (walletAddress: string) => {
  try {
    const { error } = await supabase.rpc('set_wallet_context', {
      wallet_addr: walletAddress
    });
    if (error) console.error('Error setting wallet context:', error);
  } catch (error) {
    console.error('Error setting wallet context:', error);
  }
};

// Clear wallet context
export const clearWalletContext = async () => {
  try {
    const { error } = await supabase.rpc('set_wallet_context', {
      wallet_addr: ''
    });
    if (error) console.error('Error clearing wallet context:', error);
  } catch (error) {
    console.error('Error clearing wallet context:', error);
  }
};
