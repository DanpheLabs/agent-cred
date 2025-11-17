import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWalletData } from "@/hooks/useWalletData";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SDK() {
  const { walletAddress, isReady } = useWalletData();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [keyName, setKeyName] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  useEffect(() => {
    if (isReady && walletAddress) {
      loadData();
    }
  }, [isReady, walletAddress]);

  const loadData = async () => {
    if (!walletAddress) return;

    const { data: agentsData } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: keysData } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    setAgents(agentsData || []);
    setApiKeys(keysData || []);
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'apk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleGenerateKey = async () => {
    if (!selectedAgent || !walletAddress) {
      toast.error("Please select an agent");
      return;
    }

    if (!keyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const newKey = {
      id: `key_${Date.now()}`,
      wallet_address: walletAddress,
      key: generateApiKey(),
      name: keyName,
      agent_id: agent.id,
      agent_name: agent.name,
      agent_hotkey: agent.hotkey,
      created_at: new Date().toISOString(),
      request_count: 0,
      is_active: true,
    };

    const { error } = await supabase.from('api_keys').insert([newKey]);

    if (error) {
      toast.error("Failed to generate API key");
      return;
    }

    toast.success("API key generated successfully");
    setKeyName("");
    setSelectedAgent("");
    loadData();
  };

  const handleRevokeKey = async (keyId: string) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId);

    if (error) {
      toast.error("Failed to revoke key");
      return;
    }

    toast.success("API key revoked");
    loadData();
  };

  const codeExample = `import { AgentCredSDK } from "agentcred-sdk";

const sdk = new AgentCredSDK({
  apiKey: "YOUR_API_KEY",
  network: "mainnet-beta"
});

// Pay an agent
await sdk.payAgent({
  agentHotkey: "AGENT_HOTKEY",
  amount: 10.5,
  memo: "Payment for services"
});

// Request payment from agent
await sdk.requestPayment({
  agentId: "agent_123",
  recipient: "RECIPIENT_ADDRESS",
  amount: 5.0,
  purpose: "Service fee"
});`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* <div className="mb-8">
            <h1 className="text-4xl font-normal mb-2">SDK & API Keys</h1>
            <p className="text-muted-foreground">Manage API keys for agent integration</p>
          </div> */}



          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass p-6  border-border/50">
              <h3 className="text-xl font-normal mb-4">Generate API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name your keys</label>
                  <Input
                    placeholder="Key Name"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="glass border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Agent</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger className="glass border-border/50">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleGenerateKey} 
                  className="w-full bg-gradient-to-r from-primary to-green-400 text-primary-foreground font-normal glow-hover"
                  disabled={!walletAddress}
                >
                  Generate Key
                </Button>
              </div>
            </Card>

            <Card className="glass p-6  border-border/50">
              <h3 className="text-xl font-normal mb-4">Your API Keys</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {apiKeys.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No API keys generated yet</p>
                ) : (
                  apiKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-3 glass border border-border/50 ">
                      <div className="flex-1">
                        <p className="font-normal text-sm">{key.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{key.key.slice(0, 20)}...</p>
                        <p className="text-xs text-muted-foreground">{key.agent_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => {
                          navigator.clipboard.writeText(key.key);
                          toast.success("API key copied");
                        }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleRevokeKey(key.id)}
                          disabled={!key.is_active}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
        
      </main>
      
    </div>
  );
}
