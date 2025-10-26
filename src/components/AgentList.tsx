import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/lib/storage";
import { Copy, ExternalLink, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

interface AgentListProps {
  agents: Agent[];
  onDeleteAgent: (agentId: string) => void;
  onSelectAgent: (agent: Agent) => void;
}

export const AgentList = ({ agents, onDeleteAgent, onSelectAgent }: AgentListProps) => {
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  if (agents.length === 0) {
    return (
      <Card className="glass p-12  border-border/50 text-center">
        <p className="text-muted-foreground text-lg">No agents registered yet</p>
        <p className="text-sm text-muted-foreground mt-2">Click "Register Agent" to create your first AI agent</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="glass p-6  border-border/50 glow-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="grid grid-cols-2 gap-2">
              <h3 className="font-normal text-lg mb-1">{agent.name}</h3>
              {/* <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge> */}
            </div>
           <div>
              <p className="text-xl font-normal gradient-text">{agent.balance.toFixed(2)} USDC</p>
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">


            <div>
              <p className="text-xs text-muted-foreground mb-1 ">Hotkey (Operational)</p>
              <div className="flex items-center gap-2">
                <code className="text-xs gradient-text font-mono">
                  {agent.hotkey.slice(0, 6)}...{agent.hotkey.slice(-4)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => copyAddress(agent.hotkey)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Coldkey (Owner)</p>
              <div className="flex items-center gap-2">
                <code className="text-xs gradient-text font-mono">
                  {agent.coldkey.slice(0, 6)}...{agent.coldkey.slice(-4)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => copyAddress(agent.coldkey)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
                      </div>  
          
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Daily Limit</p>
                <p className="text-sm gradient-text font-normal">{agent.dailyLimit} USDC</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent Today</p>
                <p className="text-sm gradient-text font-normal">{agent.dailySpent} USDC</p>
              </div>
            </div>
            
            <div>
              
              <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground mb-0">Endpoint</p>
                
                <code className="underline text-xs font-mono truncate flex-1">
                  {agent.endpoint}
                </code>

                   <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onSelectAgent(agent)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDeleteAgent(agent.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => window.open(agent.endpoint, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
