import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AgentList } from "@/components/AgentList";
import { RegisterAgentDialog } from "@/components/RegisterAgentDialog";
import { AgentSettingsDialog } from "@/components/AgentSettingsDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { getAgents, deleteAgent, Agent } from "@/lib/storage";
import { toast } from "sonner";

export default function MyAgents() {
  const { connected } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setSettingsDialogOpen(true);
  };
  
  const loadAgents = () => {
    setAgents(getAgents());
  };
  
  useEffect(() => {
    loadAgents();
  }, []);
  
  const handleDeleteAgent = (agentId: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      deleteAgent(agentId);
      toast.success("Agent deleted successfully");
      loadAgents();
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Agents</h1>
              <p className="text-muted-foreground">Manage your AI agent endpoints and wallets</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={loadAgents}
                className="glass border-border/50 hover:border-primary/50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                onClick={() => setRegisterDialogOpen(true)}
                disabled={!connected}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold glow-hover"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Agent
              </Button>
            </div>
          </div>
          
          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to manage your agents</p>
            </div>
          ) : (
            <AgentList 
              agents={agents} 
              onDeleteAgent={handleDeleteAgent}
              onSelectAgent={handleSelectAgent}
            />
          )}
          
          <RegisterAgentDialog 
            open={registerDialogOpen}
            onOpenChange={setRegisterDialogOpen}
            onAgentCreated={loadAgents}
          />
          
          <AgentSettingsDialog
            agent={selectedAgent}
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            onUpdate={loadAgents}
          />
        </div>
      </main>
    </div>
  );
}
