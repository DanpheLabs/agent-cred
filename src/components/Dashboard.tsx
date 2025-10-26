import { useState, useEffect } from "react";
import { WalletCard } from "./WalletCard";
import { TransactionHistory } from "./TransactionHistory";
import { Analytics } from "./Analytics";
import { AgentList } from "./AgentList";
import { RegisterAgentDialog } from "./RegisterAgentDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { getAgents, getWallet, deleteAgent, Agent } from "@/lib/storage";
import { toast } from "sonner";

export const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const wallet = getWallet();
  
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
  
  const totalAgentBalance = agents.reduce((sum, agent) => sum + agent.balance, 0);
  
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-normal mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Manage your AI agent payments</p>
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
              className="bg-gradient-to-r from-primary to-purple-400 text-primary-foreground font-normal glow-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Register Agent
            </Button>
          </div>
        </div>
        
        {!connected ? (
          <div className="glass p-12 rounded-2xl border-border/50 text-center mb-12">
            <h3 className="text-xl font-normal mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">Please connect your Solana wallet to get started</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <WalletCard
                title="Owner Wallet"
                address={wallet?.ownerAddress || publicKey?.toBase58() || ""}
                balance={12.4567}
                variant="owner"
              />
              <WalletCard
                title="Total Agent Balance"
                address={`${agents.length} Active Agents`}
                balance={totalAgentBalance}
                variant="agent"
              />
            </div>
            
            <div className="mb-12">
              <h3 className="text-2xl font-normal mb-6">Your AI Agents</h3>
              <AgentList 
                agents={agents} 
                onDeleteAgent={handleDeleteAgent}
                onSelectAgent={setSelectedAgent}
              />
            </div>
            
            <Analytics />
            
            <div className="mt-12">
              <TransactionHistory />
            </div>
          </>
        )}
        
        <RegisterAgentDialog 
          open={registerDialogOpen}
          onOpenChange={setRegisterDialogOpen}
          onAgentCreated={loadAgents}
        />
      </div>
    </section>
  );
};
