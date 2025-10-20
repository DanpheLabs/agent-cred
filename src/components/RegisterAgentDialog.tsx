import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAgent, generateMockAddress } from "@/lib/storage";
import { toast } from "sonner";
import { Agent } from "@/lib/storage";

interface RegisterAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated: () => void;
}

export const RegisterAgentDialog = ({ open, onOpenChange, onAgentCreated }: RegisterAgentDialogProps) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !endpoint || !dailyLimit) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name,
      endpoint,
      hotkey: generateMockAddress(),
      coldkey: generateMockAddress(),
      dailyLimit: parseFloat(dailyLimit),
      dailySpent: 0,
      lastResetDate: new Date().toISOString(),
      balance: 0,
      totalReceived: 0,
      totalSent: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    saveAgent(newAgent);
    toast.success("Agent registered successfully!");
    
    setName("");
    setEndpoint("");
    setDailyLimit("");
    onOpenChange(false);
    onAgentCreated();
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
            >
              Register Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
