import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Agent, saveAgent } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface AgentSettingsDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const AgentSettingsDialog = ({ agent, open, onOpenChange, onUpdate }: AgentSettingsDialogProps) => {
  const [endpoint, setEndpoint] = useState(agent?.endpoint || "");
  const [dailyLimit, setDailyLimit] = useState(agent?.dailyLimit.toString() || "");

  const handleSave = () => {
    if (!agent) return;
    
    const updatedAgent: Agent = {
      ...agent,
      endpoint,
      dailyLimit: parseFloat(dailyLimit) || agent.dailyLimit,
    };

    saveAgent(updatedAgent);
    toast.success("Agent settings updated");
    onUpdate();
    onOpenChange(false);
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agent Settings - {agent.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Agent Endpoint</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://your-agent.com/webhook"
            />
            <p className="text-xs text-muted-foreground">
              URL where our system sends notifications about on-chain balance changes for this agent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyLimit">Daily Spending Limit (USDC)</Label>
            <Input
              id="dailyLimit"
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              Maximum amount this agent can spend per day without approval
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
