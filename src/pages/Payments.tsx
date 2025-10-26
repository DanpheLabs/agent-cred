import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Agent } from "@/lib/storage";
import { toast } from "sonner";
import { getAgentsFromDB } from "@/lib/database";
import { setWalletContext } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

export default function Payments() {
  const { connected, publicKey } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [showSdkCode, setShowSdkCode] = useState(false);
  const [currentSdkCode, setCurrentSdkCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey && connected) {
      loadData();
    } else {
      setAgents([]);
      setPendingRequests([]);
    }
  }, [publicKey, connected]);

  const loadData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      await setWalletContext(publicKey.toBase58());
      
      // Load agents
      const dbAgents = await getAgentsFromDB(publicKey.toBase58());
      setAgents(dbAgents.filter(a => a.status === 'active'));

      // Load pending payment requests
      const { data: requests, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('wallet_address', publicKey.toBase58())
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (!error && requests) {
        setPendingRequests(requests);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const [selectedAgent, setSelectedAgent] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [agentPayRecipient, setAgentCredRecipient] = useState("");
  const [agentPayAmount, setAgentCredAmount] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("");

  // Generate SDK code based on selected tab
  const generatePayAgentCode = () => {
    const agent = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;
    const code = `// Pay an Agent - User to Agent USDC Payment
import { AgentCredSDK } from 'agentpay-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

// Initialize SDK
const sdk = new AgentCredSDK({ 
  network: 'devnet',
  programId: '54ZZfUHiT4AM3nvnipZzJWDumVdXTmdMQuSb4Yc2TzUg'
});

// Connect wallet
const connection = new Connection('https://api.devnet.solana.com');

// Send payment to agent
const result = await sdk.payAgent({
  coldkey: '${agent?.coldkey || 'AGENT_COLDKEY_ADDRESS'}',
  hotkey: '${agent?.hotkey || 'AGENT_HOTKEY_ADDRESS'}',
  amount: ${payAmount || '10'}, // USDC amount
  memo: 'Payment for AI service'
});

console.log('✅ Payment successful!');
console.log('Signature:', result.signature);
console.log('Explorer:', \`https://explorer.solana.com/tx/\${result.signature}?cluster=devnet\`);`;
    return code;
  };

  const generateAgentCredCode = () => {
    const agent = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;
    const code = `// Agent Instant Payment - Within Daily Limit
import { AgentCredSDK } from 'agentpay-sdk';

const sdk = new AgentCredSDK({ 
  network: 'devnet',
  programId: '54ZZfUHiT4AM3nvnipZzJWDumVdXTmdMQuSb4Yc2TzUg'
});

// Agent sends payment (requires hotkey wallet)
const result = await sdk.agentPay({
  coldkey: '${agent?.coldkey || 'AGENT_COLDKEY_ADDRESS'}',
  recipient: '${agentPayRecipient || 'RECIPIENT_ADDRESS'}',
  amount: ${agentPayAmount || '5'}, // USDC amount
});

// Check daily limit status
const agentData = await sdk.getAgent('${agent?.coldkey || 'AGENT_COLDKEY_ADDRESS'}', '${agent?.hotkey || 'AGENT_HOTKEY_ADDRESS'}');
console.log('Daily spent:', agentData.dailySpent, '/', agentData.dailyLimit);
console.log('Payment signature:', result.signature);`;
    return code;
  };

  const generateRequestPaymentCode = () => {
    const agent = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;
    const code = `// Request Payment Approval - Exceeds Daily Limit
import { AgentCredSDK } from 'agentpay-sdk';

const sdk = new AgentCredSDK({ 
  network: 'devnet',
  programId: '54ZZfUHiT4AM3nvnipZzJWDumVdXTmdMQuSb4Yc2TzUg'
});

// Submit payment request for coldkey approval
const request = await sdk.requestPayment({
  coldkey: '${agent?.coldkey || 'AGENT_COLDKEY_ADDRESS'}',
  recipient: '${requestRecipient || 'RECIPIENT_ADDRESS'}',
  amount: ${requestAmount || '100'}, // Large amount requiring approval
  purpose: '${requestPurpose || 'High-value transaction for service XYZ'}'
});

console.log('Request ID:', request.id);
console.log('Status:', request.status); // 'pending'

// Coldkey owner will receive notification to approve/reject
// After approval, payment executes automatically`;
    return code;
  };

  const handlePayAgent = async () => {
    if (!selectedAgent || !payAmount || !publicKey) {
      toast.error("Please select an agent and enter amount");
      return;
    }
    setCurrentSdkCode(generatePayAgentCode());
    setShowSdkCode(true);

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(payAmount);
    
    try {
      await setWalletContext(publicKey.toBase58());

      // Save transaction to database
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          id: `tx_${Date.now()}`,
          wallet_address: publicKey.toBase58(),
          from_address: publicKey.toBase58(),
          to_address: agent.coldkey,
          type: "user_to_agent",
          amount,
          status: "completed",
          description: `Payment to ${agent.name}`,
          agent_id: agent.id,
        }]);

      if (txError) {
        console.error('Error saving transaction:', txError);
        toast.error("Failed to save transaction");
        return;
      }

      // Update agent balance
      const { error: agentError } = await supabase
        .from('agents')
        .update({
          balance: agent.balance + amount,
          total_received: agent.totalReceived + amount,
        })
        .eq('id', agent.id);

      if (agentError) {
        console.error('Error updating agent:', agentError);
      }

      toast.success(`Paid ${amount} USDC to ${agent.name}`);
      setPayAmount("");
      setSelectedAgent("");
      loadData();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Failed to process payment");
    }
  };

  // Agent → Recipient (Instant if within limit)
  const handleAgentCredment = async () => {
    if (!selectedAgent || !agentPayRecipient || !agentPayAmount || !publicKey) {
      toast.error("Please fill all fields");
      return;
    }
    setCurrentSdkCode(generateAgentCredCode());
    setShowSdkCode(true);

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(agentPayAmount);

    // Check daily limit
    if (agent.dailySpent + amount > agent.dailyLimit) {
      toast.error(`Exceeds daily limit! ${agent.dailySpent}/${agent.dailyLimit} USDC spent today`);
      return;
    }

    try {
      await setWalletContext(publicKey.toBase58());

      // Save transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          id: `tx_${Date.now()}`,
          wallet_address: publicKey.toBase58(),
          from_address: agent.hotkey,
          to_address: agentPayRecipient,
          type: "agent_to_recipient",
          amount,
          status: "completed",
          description: `Agent payment from ${agent.name}`,
          agent_id: agent.id,
        }]);

      if (txError) {
        console.error('Error saving transaction:', txError);
        toast.error("Failed to save transaction");
        return;
      }

      // Update agent
      const { error: agentError } = await supabase
        .from('agents')
        .update({
          daily_spent: agent.dailySpent + amount,
          total_sent: agent.totalSent + amount,
          balance: agent.balance - amount,
        })
        .eq('id', agent.id);

      if (agentError) {
        console.error('Error updating agent:', agentError);
      }

      toast.success(`Sent ${amount} USDC to recipient`);
      setAgentCredRecipient("");
      setAgentCredAmount("");
      loadData();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Failed to process payment");
    }
  };

  // Agent → Request Payment
  const handleRequestPayment = async () => {
    if (!selectedAgent || !requestRecipient || !requestAmount || !requestPurpose || !publicKey) {
      toast.error("Please fill all fields");
      return;
    }
    setCurrentSdkCode(generateRequestPaymentCode());
    setShowSdkCode(true);

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const amount = parseFloat(requestAmount);

    try {
      await setWalletContext(publicKey.toBase58());

      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          id: `req_${Date.now()}`,
          wallet_address: publicKey.toBase58(),
          agent_id: agent.id,
          agent_name: agent.name,
          hotkey: agent.hotkey,
          coldkey: agent.coldkey,
          recipient: requestRecipient,
          amount,
          purpose: requestPurpose,
          status: "pending",
        }]);

      if (error) {
        console.error('Error saving payment request:', error);
        toast.error("Failed to save payment request");
        return;
      }

      toast.success("Payment request submitted for approval");
      setRequestRecipient("");
      setRequestAmount("");
      setRequestPurpose("");
      loadData();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("Failed to submit request");
    }
  };

  // Approve/Reject request
  const handleApproveRequest = async (requestId: string) => {
    if (!publicKey) return;

    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    try {
      await setWalletContext(publicKey.toBase58());

      // Update request status
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({ 
          status: "approved",
          processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (reqError) {
        console.error('Error updating request:', reqError);
        toast.error("Failed to approve request");
        return;
      }

      // Create transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          id: `tx_${Date.now()}`,
          wallet_address: publicKey.toBase58(),
          from_address: request.hotkey,
          to_address: request.recipient,
          type: "agent_to_recipient",
          amount: request.amount,
          status: "completed",
          description: request.purpose,
          agent_id: request.agent_id,
          request_id: requestId,
        }]);

      if (txError) {
        console.error('Error saving transaction:', txError);
      }

      toast.success("Payment request approved");
      loadData();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!publicKey) return;

    try {
      await setWalletContext(publicKey.toBase58());

      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: "rejected",
          processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error rejecting request:', error);
        toast.error("Failed to reject request");
        return;
      }

      toast.info("Payment request rejected");
      loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* <div className="mb-8">
            <h1 className="text-4xl font-normal mb-2">AgentCred Playground</h1>
            <p className="text-muted-foreground">Send payments to agents or manage agent payouts</p>
          </div> */}

          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-normal mb-2">Connect Your Wallet</h3>
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
                <TabsTrigger value="pay-agent">Agent → Your Agent</TabsTrigger>
                <TabsTrigger value="agent-pay">Your Agent → Agent</TabsTrigger>
                <TabsTrigger value="approvals">
                  Approvals {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pay-agent">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-normal mb-4">Pay an Agent</h3>
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
                    <h3 className="text-xl font-normal mb-4">Instant Payment</h3>
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
                          onChange={(e) => setAgentCredRecipient(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={agentPayAmount}
                          onChange={(e) => setAgentCredAmount(e.target.value)}
                        />
                      </div>

                      <Button onClick={handleAgentCredment} className="w-full">
                        Send Payment
                      </Button>
                    </div>
                  </Card>

                  <Card className="glass p-6 rounded-2xl border-border/50">
                    <h3 className="text-xl font-normal mb-4">Request Approval</h3>
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
                  <h3 className="text-xl font-normal mb-4">Pending Approvals</h3>
                  
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
                              <h4 className="font-normal">{request.agentName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-normal">{request.amount} USDC</p>
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
                    <h3 className="text-xl font-normal mb-4">SDK Code Example</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use this code in your application to integrate AgentCred
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
