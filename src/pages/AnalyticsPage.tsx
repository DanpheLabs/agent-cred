import { Navbar } from "@/components/Navbar";
import { Analytics } from "@/components/Analytics";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useWallet } from '@solana/wallet-adapter-react';

export default function AnalyticsPage() {
  const { connected } = useWallet();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Track your agent performance and transactions</p>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view analytics</p>
            </div>
          ) : (
            <>
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
