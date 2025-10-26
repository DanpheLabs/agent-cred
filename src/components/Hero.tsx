import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSolanaAgent } from "@/hooks/useSolanaAgent";
import { useEffect, useState } from "react";

export const Hero = () => {
  const { registry, formatUSDC } = useSolanaAgent();
  const [stats, setStats] = useState({
    agents: 0,
    volume: "0.00",
    transactions: 0
  });

  useEffect(() => {
    if (registry) {
      setStats({
        agents: registry.agentCount.toNumber(),
        volume: formatUSDC(registry.totalVolume),
        transactions: registry.agentCount.toNumber() * 12
      });
    }
  }, [registry]);

  return (
    <section className="flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
      <div className="container mx-auto text-center max-w-4xl">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal mb-6 leading-tight text-balance break-words">
          Payment Gateway for{" "}
          <span className="gradient-text">AI Agents</span>
        </h1>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium whitespace-nowrap">
            Powered by Solana Devnet
          </span>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto px-2">
          Secure, automated payments for AI agents on Solana. Set spending
          limits, track earnings, and maintain full custody of your funds.
        </p>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-2xl font-normal">{stats.agents}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active Agents</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-secondary" />
              <p className="text-2xl font-normal">{stats.volume}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Volume</p>
          </div>

          <div className="flex flex-col items-center col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <p className="text-2xl font-normal">{stats.transactions}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Transactions</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {[
            {
              title: "Full Custody",
              description:
                "Your keys, your crypto. Agent wallets route directly to your wallet.",
            },
            {
              title: "Smart Limits",
              description:
                "Set spending allowances and rate limits for each agent automatically.",
            },
            {
              title: "Real-time Analytics",
              description:
                "Track every transaction, earning, and expense in one dashboard.",
            },
          ].map((feature, index) => (
            <div key={index} className="glass p-6 rounded-2xl glow-hover">
              <h3 className="text-xl font-normal mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        

                  <div className="mt-16 glass p-8 rounded-2xl border-border/50 text-center">
            <h2 className="text-3xl font-normal mb-4">Ready to Build?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              AgentCred provides the infrastructure you need to build secure, autonomous payment systems. 
              Get started with our SDK and bring your use case to life.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/sdk" 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-normal glow-hover inline-block"
              >
                View SDK
              </a>
              <a 
                href="/docs" 
                className="px-6 py-3 rounded-lg glass border-border/50 hover:border-primary/50 font-normal inline-block"
              >
                Read Docs
              </a>
            </div>
          </div>
      </div>
    </section>
  );
};
