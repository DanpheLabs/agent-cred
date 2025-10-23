import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { setWalletContext, clearWalletContext } from '@/lib/supabase';

export const useWalletData = () => {
  const { publicKey, connected } = useWallet();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupWallet = async () => {
      if (connected && publicKey) {
        await setWalletContext(publicKey.toBase58());
        setIsReady(true);
      } else {
        await clearWalletContext();
        setIsReady(false);
      }
    };

    setupWallet();
  }, [connected, publicKey]);

  return { walletAddress: publicKey?.toBase58(), isReady, connected };
};
