import { Navbar } from "@/components/Navbar";
import { WalletCard } from "@/components/WalletCard";
import { Analytics } from "@/components/Analytics";
import { useWallet } from '@solana/wallet-adapter-react';
import { getWallet, getAgents, getTransactions } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, TrendingUp, Clock, Link2, Database } from "lucide-react";
import { AGENT_PAY_PROGRAM_ID, USDC_MINT, connection } from "@/lib/solana";
import { useSolanaAgent } from "@/hooks/useSolanaAgent";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { registry, formatUSDC } = useSolanaAgent();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  const wallet = getWallet();
  const agents = getAgents();
  const transactions = getTransactions();
  const totalAgentBalance = agents.reduce((sum, agent) => sum + agent.balance, 0);
  const totalReceived = transactions
    .filter(t => t.type === 'user_to_agent')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSent = transactions
    .filter(t => t.type === 'agent_to_recipient' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = transactions.slice(0, 5);

  // Fetch real wallet balance from chain
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setWalletBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };
    fetchBalance();
  }, [publicKey]);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-normal mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your AI agent payment system</p>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-normal mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view your dashboard</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contract Information */}
           
           
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletCard
                  title="Owner Wallet"
                  address={wallet?.ownerAddress || publicKey?.toBase58() || ""}
                  balance={walletBalance}
                  variant="owner"
                />
                <WalletCard
                  title="Total Agent Balance"
                  address={`${agents.length} Active Agents`}
                  balance={totalAgentBalance}
                  variant="agent"
                />
              </div>

              <Analytics />
      <Card className="glass p-6 rounded-2xl border-border/50">
                <h3 className="text-xl font-normal mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Contract Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Network</p>
                    <p className="font-mono text-sm font-normal">Solana Devnet</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">AgentCred Contract</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs truncate">{AGENT_PAY_PROGRAM_ID.toBase58()}</p>
                      <a 
                        href={`https://explorer.solana.com/address/${AGENT_PAY_PROGRAM_ID.toBase58()}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">USDC Token</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs truncate">{USDC_MINT.toBase58()}</p>
                      <a 
                        href={`https://explorer.solana.com/address/${USDC_MINT.toBase58()}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {registry && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Agents On-Chain</p>
                        <p className="text-2xl font-normal">{registry.agentCount.toString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Volume On-Chain</p>
                        <p className="text-2xl font-normal">{formatUSDC(registry.totalVolume)} USDC</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
   
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
