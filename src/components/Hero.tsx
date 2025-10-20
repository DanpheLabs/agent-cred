import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="h-full flex items-center justify-center px-6">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Powered by Solana</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Payment Gateway for{" "}
          <span className="gradient-text">AI Agents</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Secure, automated payments for AI agents on Solana. Set spending limits, 
          track earnings, and maintain full custody of your funds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg glow-hover group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="glass border-border/50 hover:border-primary/50 font-semibold text-lg"
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Full Custody",
              description: "Your keys, your crypto. Agent wallets route directly to your wallet."
            },
            {
              title: "Smart Limits",
              description: "Set spending allowances and rate limits for each agent automatically."
            },
            {
              title: "Real-time Analytics",
              description: "Track every transaction, earning, and expense in one dashboard."
            }
          ].map((feature, index) => (
            <div key={index} className="glass p-6 rounded-2xl glow-hover">
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
