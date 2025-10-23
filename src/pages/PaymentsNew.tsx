import { Navbar } from "@/components/Navbar";
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Layout } from "lucide-react";

export default function PaymentsNew() {
  const { connected } = useWallet();

  const sdkCode = `import { AgentPaySDK } from "agentpay-sdk";

// Initialize SDK
const sdk = new AgentPaySDK({
  apiKey: "YOUR_API_KEY",
  network: "mainnet-beta" // or "devnet"
});

// Pay an agent directly
async function payAgent() {
  try {
    const result = await sdk.payAgent({
      agentHotkey: "AGENT_HOTKEY_ADDRESS",
      amount: 10.5, // USDC amount
      memo: "Payment for AI service"
    });
    
    console.log("Payment successful:", result.signature);
  } catch (error) {
    console.error("Payment failed:", error);
  }
}

// Request payment with approval flow
async function requestPayment() {
  try {
    const request = await sdk.requestPayment({
      agentHotkey: "AGENT_HOTKEY_ADDRESS",
      recipient: "RECIPIENT_ADDRESS",
      amount: 50.0,
      purpose: "High-value transaction"
    });
    
    console.log("Request submitted:", request.id);
    // Coldkey owner will be notified to approve
  } catch (error) {
    console.error("Request failed:", error);
  }
}

// Listen for balance notifications
sdk.on('balanceChange', (data) => {
  console.log(\`Balance updated: \${data.newBalance} USDC\`);
  // Process the service for the user
});`;

  const uiCode = `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgentPaySDK } from 'agentpay-sdk';

export default function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const sdk = new AgentPaySDK({ 
    apiKey: process.env.AGENTPAY_KEY 
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      await sdk.payAgent({
        agentHotkey: "YOUR_AGENT_HOTKEY",
        amount: parseFloat(amount),
        memo: "User payment"
      });
      alert('Payment successful!');
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">
        Pay AI Agent
      </h2>
      
      <Input
        type="number"
        placeholder="Amount in USDC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <Button 
        onClick={handlePayment} 
        disabled={loading || !amount}
      >
        {loading ? 'Processing...' : 'Send Payment'}
      </Button>
    </div>
  );
}`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">SDK Implementation Guide</h1>
            <p className="text-muted-foreground">Complete SDK code and UI implementation examples</p>
          </div>

          {!connected ? (
            <div className="glass p-12 rounded-2xl border-border/50 text-center">
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Please connect your Solana wallet to view implementation examples</p>
            </div>
          ) : (
            <Tabs defaultValue="sdk" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sdk" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  SDK Implementation
                </TabsTrigger>
                <TabsTrigger value="ui" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  UI Implementation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sdk">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-semibold mb-4">SDK Code Examples</h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto text-sm">
                    <code className="text-foreground">{sdkCode}</code>
                  </pre>
                  
                  <div className="mt-6 space-y-4">
                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <h4 className="font-semibold mb-2">Installation</h4>
                      <pre className="bg-black/50 p-3 rounded text-sm">
                        <code>npm install agentpay-sdk</code>
                      </pre>
                    </div>

                    <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                      <h4 className="font-semibold mb-2">Environment Setup</h4>
                      <pre className="bg-black/50 p-3 rounded text-sm">
                        <code>AGENTPAY_API_KEY=your_api_key_here{'\n'}AGENTPAY_NETWORK=mainnet-beta</code>
                      </pre>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="ui">
                <Card className="glass p-6 rounded-2xl border-border/50">
                  <h3 className="text-xl font-semibold mb-4">React Component Example</h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto text-sm">
                    <code className="text-foreground">{uiCode}</code>
                  </pre>

                  <div className="mt-6 space-y-4">
                    <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Simple and intuitive payment form</li>
                        <li>Loading state management</li>
                        <li>Error handling with user feedback</li>
                        <li>Type-safe with TypeScript</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <h4 className="font-semibold mb-2">Best Practices</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Always validate amounts before submission</li>
                        <li>Use environment variables for API keys</li>
                        <li>Implement proper error handling and user feedback</li>
                        <li>Show loading states during async operations</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
