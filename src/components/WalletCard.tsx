import { Card } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletCardProps {
  title: string;
  address: string;
  balance: number;
  variant?: "owner" | "agent";
}

export const WalletCard = ({ title, address, balance, variant = "owner" }: WalletCardProps) => {
  const isOwner = variant === "owner";
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };
  
  return (
    <Card className="glass p-6 rounded-2xl border-border/50 glow-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono text-foreground">
              {address.slice(0, 4)}...{address.slice(-4)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isOwner ? 'bg-primary' : 'bg-secondary'} animate-pulse-glow`} />
      </div>
      
      <div className="mt-6">
        <p className="text-3xl font-bold gradient-text mb-1">
          {balance.toFixed(4)} SOL
        </p>
        <p className="text-sm text-muted-foreground">
          ≈ ${(balance * 100).toFixed(2)} USD
        </p>
      </div>
    </Card>
  );
};
