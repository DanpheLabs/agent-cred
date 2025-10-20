import { Navbar } from "@/components/Navbar";
import { WalletCard } from "@/components/WalletCard";
import { Analytics } from "@/components/Analytics";
import { useWallet } from '@solana/wallet-adapter-react';
import { getWallet, getAgents, getTransactions } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
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
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your AI agent payment system</p>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view your dashboard</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Analytics />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletCard
                  title="Owner Wallet"
                  address={wallet?.ownerAddress || publicKey?.toBase58() || ""}
                  balance={12.4567}
                  variant="owner"
                />
                <WalletCard
                  title="Total Agent Balance"
                  address={`${agents.length} Active Agents`}
                  balance={totalAgentBalance}
                  variant="agent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Total Received</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalReceived.toFixed(2)} USDC</p>
                  <p className="text-sm text-muted-foreground mt-1">All-time payments to agents</p>
                </Card>

                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <ArrowUpDown className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold">Total Sent</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalSent.toFixed(2)} USDC</p>
                  <p className="text-sm text-muted-foreground mt-1">Agent payouts completed</p>
                </Card>

                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Recent Activity</h3>
                  </div>
                  <p className="text-3xl font-bold">{transactions.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total transactions</p>
                </Card>
              </div>

              {recentTransactions.length > 0 && (
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{tx.amount.toFixed(2)} USDC</p>
                          <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
