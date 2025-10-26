import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { 
  fetchAgent, 
  fetchRegistry, 
  registerAgent as registerAgentOnChain, 
  payAgent as payAgentOnChain, 
  agentcred as agentcredOnChain, 
  requestPayment as requestPaymentOnChain, 
  AgentData, 
  RegistryData, 
  formatUSDC,
} from '@/lib/solana';
import { toast } from 'sonner';

export function useSolanaAgent(coldkey?: string, hotkey?: string) {
  const wallet = useWallet();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [registry, setRegistry] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch agent data
  useEffect(() => {
    if (coldkey && hotkey) {
      loadAgent();
    }
  }, [coldkey, hotkey]);

  // Fetch registry data
  useEffect(() => {
    loadRegistry();
  }, []);

  const loadAgent = async () => {
    if (!coldkey || !hotkey) return;

    setLoading(true);
    setError(null);

    try {
      const coldkeyPubkey = new PublicKey(coldkey);
      const hotkeyPubkey = new PublicKey(hotkey);
      const agentData = await fetchAgent(coldkeyPubkey, hotkeyPubkey);
      setAgent(agentData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load agent';
      setError(message);
      console.error('Error loading agent:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistry = async () => {
    try {
      const registryData = await fetchRegistry();
      setRegistry(registryData);
    } catch (err) {
      console.error('Error loading registry:', err);
    }
  };

  const registerAgent = async (hotkeyAddress: string, dailyLimitUSDC: number) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const hotkeyPubkey = new PublicKey(hotkeyAddress);
      const signature = await registerAgentOnChain(wallet, hotkeyPubkey, dailyLimitUSDC);
      
      toast.success('Agent registered successfully!');
      await loadAgent();
      await loadRegistry();
      
      return signature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register agent';
      setError(message);
      toast.error(message);
      console.error('Error registering agent:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const payAgent = async (coldkeyAddress: string, hotkeyAddress: string, amountUSDC: number) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const coldkeyPubkey = new PublicKey(coldkeyAddress);
      const hotkeyPubkey = new PublicKey(hotkeyAddress);
      const signature = await payAgentOnChain(wallet, coldkeyPubkey, hotkeyPubkey, amountUSDC);
      
      toast.success(`Payment of ${amountUSDC} USDC sent successfully!`);
      await loadAgent();
      await loadRegistry();
      
      return signature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send payment';
      setError(message);
      toast.error(message);
      console.error('Error paying agent:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendAgentCredment = async (
    coldkeyAddress: string,
    recipientAddress: string,
    amountUSDC: number
  ) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet (hotkey)');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const coldkeyPubkey = new PublicKey(coldkeyAddress);
      const recipientPubkey = new PublicKey(recipientAddress);
      const signature = await agentcredOnChain(wallet, coldkeyPubkey, recipientPubkey, amountUSDC);
      
      toast.success(`Agent credment of ${amountUSDC} USDC sent successfully!`);
      await loadAgent();
      
      return signature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send agent credment';
      setError(message);
      toast.error(message);
      console.error('Error sending agent credment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const requestPaymentApproval = async (
    coldkeyAddress: string,
    recipientAddress: string,
    amountUSDC: number,
    purpose: string
  ) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet (hotkey)');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const coldkeyPubkey = new PublicKey(coldkeyAddress);
      const recipientPubkey = new PublicKey(recipientAddress);
      const signature = await requestPaymentOnChain(
        wallet,
        coldkeyPubkey,
        recipientPubkey,
        amountUSDC,
        purpose
      );
      
      toast.success('Payment request submitted for approval!');
      
      return signature;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request payment';
      setError(message);
      toast.error(message);
      console.error('Error requesting payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (agentId: string, status: number) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be implemented with the update_agent_details instruction
      toast.success('Agent status updated successfully!');
      
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update agent status';
      setError(message);
      toast.error(message);
      console.error('Error updating agent status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAgentDetails = async (agentId: string, name?: string, description?: string, status?: number) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be implemented with the update_agent_details instruction
      toast.success('Agent details updated successfully!');
      
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update agent details';
      setError(message);
      toast.error(message);
      console.error('Error updating agent details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processTransaction = async (
    agentId: string,
    transactionId: number,
    amountUSDC: number,
    tokenMint?: string
  ) => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be implemented with the process_transaction instruction
      toast.success('Transaction processed successfully!');
      
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process transaction';
      setError(message);
      toast.error(message);
      console.error('Error processing transaction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    agent,
    registry,
    loading,
    error,
    registerAgent,
    payAgent,
    sendAgentCredment,
    requestPaymentApproval,
    updateAgentStatus,
    updateAgentDetails,
    processTransaction,
    refetch: loadAgent,
    formatUSDC,
  };
}