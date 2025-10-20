import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { getApiKeys, saveApiKey, revokeApiKey, getAgents, generateApiKey } from "@/lib/storage";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SDK() {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [keyName, setKeyName] = useState("");
  const agents = getAgents();
  const apiKeys = getApiKeys();

  const handleGenerateKey = () => {
    if (!selectedAgent) {
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
      id: Date.now().toString(),
      key: generateApiKey(),
      name: keyName,
      agentId: agent.id,
      agentName: agent.name,
      agentHotkey: agent.hotkey,
      createdAt: new Date().toISOString(),
      requestCount: 0,
      isActive: true,
    };

    saveApiKey(newKey);
    toast.success("API key generated successfully");
    setKeyName("");
    setSelectedAgent("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">SDK & API Keys</h1>
            <p className="text-muted-foreground">Manage API keys for agent integration</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass p-6 rounded-2xl border-border/50">
              <h3 className="text-xl font-semibold mb-4">Generate API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Key Name</label>
                  <Input
                    placeholder="Production Key"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Agent</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGenerateKey} className="w-full">Generate Key</Button>
              </div>
            </Card>

            <Card className="glass p-6 rounded-2xl border-border/50">
              <h3 className="text-xl font-semibold mb-4">Your API Keys</h3>
              <div className="space-y-3">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{key.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{key.key.slice(0, 20)}...</p>
                      <p className="text-xs text-muted-foreground">{key.agentName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => {
                        navigator.clipboard.writeText(key.key);
                        toast.success("API key copied");
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        revokeApiKey(key.id);
                        toast.success("API key revoked");
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
