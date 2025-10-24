import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { supabase } from "@/integrations/supabase/client";
import { useSolanaAgent } from "@/hooks/useSolanaAgent";
import { PublicKey } from "@solana/web3.js";

interface RegisterAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated: () => void;
}

export const RegisterAgentDialog = ({ open, onOpenChange, onAgentCreated }: RegisterAgentDialogProps) => {
  const { publicKey: walletPublicKey } = useWallet();
  const { registerAgent, loading: registerLoading } = useSolanaAgent();
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [hotkeyMethod, setHotkeyMethod] = useState<"wallet" | "paste">("wallet");
  const [pastedHotkey, setPastedHotkey] = useState("");
  const [hotkeyWallet, setHotkeyWallet] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !endpoint || !dailyLimit || !walletPublicKey) {
      toast.error("Please fill in all fields and connect your wallet");
      return;
    }

    let hotkey = "";
    if (hotkeyMethod === "wallet") {
      if (!hotkeyWallet) {
        toast.error("Please connect the hotkey wallet");
        return;
      }
      hotkey = hotkeyWallet;
    } else {
      if (!pastedHotkey) {
        toast.error("Please paste the agent's public key");
        return;
      }
      hotkey = pastedHotkey;
    }

    setIsRegistering(true);
    try {
      // First register on-chain
      const signature = await registerAgent(hotkey, parseFloat(dailyLimit));
      if (!signature) {
        toast.error("Failed to register agent on-chain");
        return;
      }

      // Then save in database
      const newAgent = {
        id: `agent_${Date.now()}`,
        wallet_address: walletPublicKey.toBase58(),
        name,
        endpoint,
        hotkey,
        coldkey: walletPublicKey.toBase58(),
        daily_limit: parseFloat(dailyLimit),
        daily_spent: 0,
        last_reset_date: new Date().toISOString(),
        balance: 0,
        total_received: 0,
        total_sent: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        tx_signature: signature,
      };

      // Set wallet context for RLS
      await supabase.rpc('set_wallet_context', {
        wallet_addr: walletPublicKey.toBase58()
      });

      const { error } = await supabase
        .from('agents')
        .insert([newAgent]);

      if (error) {
        console.error('Error saving agent:', error);
        toast.error("Agent registered on-chain but failed to save in database");
        return;
      }

      toast.success("Agent registered successfully!");
      
      setName("");
      setEndpoint("");
      setDailyLimit("");
      setPastedHotkey("");
      setHotkeyWallet(null);
      onOpenChange(false);
      onAgentCreated();
    } catch (error) {
      console.error('Error registering agent:', error);
      toast.error("Failed to register agent");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Register AI Agent</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new AI agent with hotkey/coldkey architecture for secure USDC payments
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="My AI Assistant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass border-border/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://api.example.com/agent"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="glass border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Agent Hotkey</Label>
            <Tabs value={hotkeyMethod} onValueChange={(v) => setHotkeyMethod(v as "wallet" | "paste")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wallet">Connect Wallet</TabsTrigger>
                <TabsTrigger value="paste">Paste Public Key</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Connect the wallet that will act as the agent's hotkey
                </p>
                <div className="flex items-center gap-3">
                  <WalletMultiButton 
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold glow-hover"
                    style={{ height: '40px' }}
                  />
                </div>
                {walletPublicKey && (
                  <div className="glass p-3 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Connected Hotkey:</p>
                    <p className="font-mono text-xs break-all">{walletPublicKey.toBase58()}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="paste" className="space-y-3">
                <Input
                  placeholder="Paste agent public key address..."
                  value={pastedHotkey}
                  onChange={(e) => setPastedHotkey(e.target.value)}
                  className="glass border-border/50 font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the Solana public key for your agent's hotkey wallet
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dailyLimit">Daily Spending Limit (USDC)</Label>
            <Input
              id="dailyLimit"
              type="number"
              step="0.01"
              placeholder="100.00"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="glass border-border/50"
            />
            <p className="text-xs text-muted-foreground">
              Maximum amount the agent can spend per day without approval
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold glow-hover"
              disabled={isRegistering || registerLoading}
            >
              {isRegistering ? "Registering..." : "Register Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
