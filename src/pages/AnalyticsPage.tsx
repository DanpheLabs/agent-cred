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
            <h1 className="text-4xl font-normal mb-2">Transactions</h1>
            <p className="text-muted-foreground">Real-time on-chain transactions and history</p>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-normal mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view analytics</p>
            </div>
          ) : (
            <>
 
              
              <TransactionHistory />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
