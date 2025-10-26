import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AgentList } from "@/components/AgentList";
import { RegisterAgentDialog } from "@/components/RegisterAgentDialog";
import { AgentSettingsDialog } from "@/components/AgentSettingsDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, RefreshCw, Network, Wallet } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Agent } from "@/lib/storage";
import { useSolanaAgent } from "@/hooks/useSolanaAgent";
import { AGENT_PAY_PROGRAM_ID, USDC_MINT } from "@/lib/solana";
import { toast } from "sonner";
import { getAgentsFromDB } from "@/lib/database";
import { setWalletContext } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

export default function MyAgents() {
  const { connected, publicKey } = useWallet();
  const { registry } = useSolanaAgent();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setSettingsDialogOpen(true);
  };
  
  const loadAgents = async () => {
    if (!publicKey) {
      setAgents([]);
      return;
    }

    setLoading(true);
    try {
      await setWalletContext(publicKey.toBase58());
      const dbAgents = await getAgentsFromDB(publicKey.toBase58());
      setAgents(dbAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAgents();
  }, [publicKey]);
  
  const { updateAgentStatus } = useSolanaAgent();

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      // Delete from database
      await setWalletContext(publicKey.toBase58());
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        console.error('Error deleting agent:', error);
        toast.error("Failed to delete agent");
        return;
      }

      toast.success("Agent deleted successfully");
      loadAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error("Failed to delete agent");
    }
  };
  
  return (
    <div className="">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* Contract Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass p-6  border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2  bg-primary/10">
                  <Network className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Network</p>
                  <p className="font-mono text-sm font-normal">Solana Devnet</p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6  border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2  bg-secondary/10">
                  <Wallet className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">AgentCred Contract</p>
                  <p className="font-mono text-xs break-all">{AGENT_PAY_PROGRAM_ID.toBase58().slice(0, 8)}...{AGENT_PAY_PROGRAM_ID.toBase58().slice(-8)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Volume: {registry?.totalVolume ? (Number(registry.totalVolume) / 1e6).toFixed(2) : 0} USDC</p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6  border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2  bg-accent/10">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">USDC Token</p>
                  <p className="font-mono text-xs break-all">{USDC_MINT.toBase58().slice(0, 8)}...{USDC_MINT.toBase58().slice(-8)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agents Registered: {registry?.agentCount?.toString() || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-normal mb-2">My Agents</h1>
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
                className="bg-gradient-to-r from-primary to-green-400 text-primary-foreground font-normal glow-hover"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Agent
              </Button>
            </div>
          </div>
          
          {!connected ? (
            <div className="glass p-12  border-border/50 text-center">
              <h3 className="text-xl font-normal mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to manage your agents</p>
            </div>
          ) : loading ? (
            <div className="glass p-12  border-border/50 text-center">
              <p className="text-muted-foreground">Loading agents...</p>
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
