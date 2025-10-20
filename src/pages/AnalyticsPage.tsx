import { Navbar } from "@/components/Navbar";
import { Analytics } from "@/components/Analytics";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Card } from "@/components/ui/card";
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaAgent } from "@/hooks/useSolanaAgent";
import { AGENT_PAY_PROGRAM_ID, USDC_MINT } from "@/lib/solana";
import { Network, Wallet, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const { connected } = useWallet();
  const { registry, formatUSDC } = useSolanaAgent();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Transactions</h1>
            <p className="text-muted-foreground">Real-time on-chain transactions and history</p>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view analytics</p>
            </div>
          ) : (
            <>
              {/* Network Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Network className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Network</p>
                      <p className="font-semibold">Solana Devnet</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Wallet className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Program ID</p>
                      <p className="font-mono text-xs break-all">
                        {AGENT_PAY_PROGRAM_ID.toBase58().slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Total Agents</p>
                      <p className="text-2xl font-bold">
                        {registry ? registry.agentCount.toString() : '0'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass p-6 rounded-2xl border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                      <p className="text-2xl font-bold">
                        {registry ? `$${formatUSDC(registry.totalVolume)}` : '$0.00'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mb-12">
                <Analytics />
              </div>
              
              <TransactionHistory />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
