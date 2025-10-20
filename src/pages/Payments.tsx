import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { getAgents, saveTransaction, savePaymentRequest, getPendingRequests, updatePaymentRequest, generateMockAddress } from "@/lib/storage";
import { toast } from "sonner";

export default function Payments() {
  const { connected, publicKey } = useWallet();
  const agents = getAgents().filter(a => a.status === 'active');
  const [showSdkCode, setShowSdkCode] = useState(false);
  const [currentSdkCode, setCurrentSdkCode] = useState("");
  const pendingRequests = getPendingRequests();

  const [selectedAgent, setSelectedAgent] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [agentPayRecipient, setAgentPayRecipient] = useState("");
  const [agentPayAmount, setAgentPayAmount] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("");

  // User → Agent Payment
  const generatePayAgentCode = () => {
    const code = `// Pay an Agent - User to Agent USDC Payment
import { AgentPaySDK } from 'agentpay-sdk';

const sdk = new AgentPaySDK({ 
  apiKey: 'YOUR_API_KEY',
  network: 'devnet' 
});

// Send payment to agent
const result = await sdk.payAgent({
  agentHotkey: '${selectedAgent ? agents.find(a => a.id === selectedAgent)?.hotkey : 'AGENT_HOTKEY'}',
  amount: ${payAmount || '0'},
  memo: 'Payment for service'
});

console.log('Transaction:', result.signature);
console.log('Explorer:', result.explorerUrl);`;
    setCurrentSdkCode(code);
    setShowSdkCode(true);
  };

  const handlePayAgent = () => {
    if (!selectedAgent || !payAmount) {
      toast.error("Please select an agent and enter amount");
      return;
    }
    generatePayAgentCode();

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(payAmount);
    const transaction = {
      id: Date.now().toString(),
      type: "user_to_agent" as const,
      from: publicKey?.toBase58() || "User",
      to: agent.coldkey,
      amount,
      description: `Payment to ${agent.name}`,
      timestamp: new Date().toISOString(),
      status: "completed" as const,
      agentId: agent.id,
    };

    saveTransaction(transaction);
    
    // Update agent balance
    agent.totalReceived += amount;
    agent.balance += amount;
    
    toast.success(`Paid ${amount} USDC to ${agent.name}`);
    setPayAmount("");
    setSelectedAgent("");
  };

  // Agent → Recipient (Instant if within limit)
  const handleAgentPayment = () => {
    if (!selectedAgent || !agentPayRecipient || !agentPayAmount) {
      toast.error("Please fill all fields");
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(agentPayAmount);

    // Check daily limit
    if (agent.dailySpent + amount > agent.dailyLimit) {
      toast.error(`Exceeds daily limit! ${agent.dailySpent}/${agent.dailyLimit} USDC spent today`);
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      type: "agent_to_recipient" as const,
      from: agent.hotkey,
      to: agentPayRecipient,
      amount,
      description: `Agent payment from ${agent.name}`,
      timestamp: new Date().toISOString(),
      status: "completed" as const,
      agentId: agent.id,
    };

    saveTransaction(transaction);

    // Update agent
    agent.dailySpent += amount;
    agent.totalSent += amount;
    agent.balance -= amount;

    toast.success(`Sent ${amount} USDC to recipient`);
    setAgentPayRecipient("");
    setAgentPayAmount("");
  };

  // Agent → Request Payment
  const handleRequestPayment = () => {
    if (!selectedAgent || !requestRecipient || !requestAmount || !requestPurpose) {
      toast.error("Please fill all fields");
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(requestAmount);
    const request = {
      id: Date.now().toString(),
      agentId: agent.id,
      agentName: agent.name,
      hotkey: agent.hotkey,
      coldkey: agent.coldkey,
      recipient: requestRecipient,
      amount,
      purpose: requestPurpose,
      status: "pending" as const,
      requestedAt: new Date().toISOString(),
    };

    savePaymentRequest(request);

    toast.success("Payment request submitted for approval");
    setRequestRecipient("");
    setRequestAmount("");
    setRequestPurpose("");
  };

  // Approve/Reject request
  const handleApproveRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    updatePaymentRequest(requestId, "approved");

    const transaction = {
      id: Date.now().toString(),
      type: "agent_to_recipient" as const,
      from: request.hotkey,
      to: request.recipient,
      amount: request.amount,
      description: request.purpose,
      timestamp: new Date().toISOString(),
      status: "completed" as const,
      agentId: request.agentId,
      requestId,
    };

    saveTransaction(transaction);

    toast.success("Payment request approved");
  };

  const handleRejectRequest = (requestId: string) => {
    updatePaymentRequest(requestId, "rejected");
    toast.info("Payment request rejected");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AgentPay Playground</h1>
            <p className="text-muted-foreground">Send payments to agents or manage agent payouts</p>
          </div>

          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to make payments</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSdkCode(!showSdkCode)}
                >
                  {showSdkCode ? "Hide" : "Show"} SDK Code
                </Button>
              </div>

              <div className={`grid gap-6 ${showSdkCode ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
                <div>
                  <Tabs defaultValue="pay-agent" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pay-agent">Another Agent → Your Agent</TabsTrigger>
                <TabsTrigger value="agent-pay">Your Agent → Another Agent</TabsTrigger>
                <TabsTrigger value="approvals">
                  Approvals {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pay-agent">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-semibold mb-4">Pay an Agent</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Send USDC directly to an agent's coldkey wallet
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Agent</label>
                      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name} ({agent.hotkey.slice(0, 8)}...)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                      />
                    </div>

                    <Button onClick={handlePayAgent} className="w-full">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Send Payment
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="agent-pay">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass p-6 rounded-2xl border-border/50">
                    <h3 className="text-xl font-semibold mb-4">Instant Payment</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Send within daily limit (no approval needed)
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Agent</label>
                        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(agent => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} ({agent.dailySpent}/{agent.dailyLimit} USDC)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Recipient Address</label>
                        <Input
                          placeholder="Solana address"
                          value={agentPayRecipient}
                          onChange={(e) => setAgentPayRecipient(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={agentPayAmount}
                          onChange={(e) => setAgentPayAmount(e.target.value)}
                        />
                      </div>

                      <Button onClick={handleAgentPayment} className="w-full">
                        Send Payment
                      </Button>
                    </div>
                  </Card>

                  <Card className="glass p-6 rounded-2xl border-border/50">
                    <h3 className="text-xl font-semibold mb-4">Request Approval</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Submit payment for coldkey approval
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Agent</label>
                        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an agent" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(agent => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Recipient Address</label>
                        <Input
                          placeholder="Solana address"
                          value={requestRecipient}
                          onChange={(e) => setRequestRecipient(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={requestAmount}
                          onChange={(e) => setRequestAmount(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Purpose</label>
                        <Textarea
                          placeholder="Reason for this payment"
                          value={requestPurpose}
                          onChange={(e) => setRequestPurpose(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button onClick={handleRequestPayment} className="w-full" variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        Submit Request
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="approvals">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
                  
                  {pendingRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No pending payment requests
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map(request => (
                        <div key={request.id} className="border border-border/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{request.agentName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{request.amount} USDC</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">To: </span>
                              <code className="text-xs">{request.recipient.slice(0, 16)}...</code>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Purpose: </span>
                              {request.purpose}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleApproveRequest(request.id)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleRejectRequest(request.id)}
                              variant="destructive"
                              className="flex-1"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
                </div>

                {showSdkCode && (
                  <Card className="glass p-6 rounded-2xl border-border/50 h-fit sticky top-24">
                    <h3 className="text-xl font-semibold mb-4">SDK Code Example</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use this code in your application to integrate AgentPay
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{currentSdkCode || "// Select an action to see SDK code example"}</code>
                    </pre>
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        💡 Install SDK: <code className="text-primary">npm install agentpay-sdk</code>
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
