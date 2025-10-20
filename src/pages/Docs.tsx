import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function Docs() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Developer Documentation</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DocsSidebar />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-bold mb-4">Welcome to AgentPay</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Complete documentation for integrating autonomous agent payments in your application.
                </p>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">What is AgentPay?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      AgentPay is a payment infrastructure built specifically for AI agents on Solana. 
                      It enables autonomous payments with built-in security through the hotkey/coldkey architecture, 
                      real-time balance monitoring, and gasless transaction support.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Key Features</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">🔐 Dual-Key Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Hotkey for autonomous operations, coldkey for owner control and approvals
                        </p>
                      </div>
                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">⚡ Gasless Transactions</h4>
                        <p className="text-sm text-muted-foreground">
                          Using HTTP 402 protocol, agents can receive payments without gas fees
                        </p>
                      </div>
                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">📡 Real-time Monitoring</h4>
                        <p className="text-sm text-muted-foreground">
                          Light client monitors on-chain transactions and notifies agents instantly
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Quick Start</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`npm install agentpay-sdk

import { AgentPaySDK } from "agentpay-sdk";

const sdk = new AgentPaySDK({
  apiKey: "YOUR_API_KEY",
  network: "mainnet-beta"
});

// Start accepting payments
await sdk.payAgent({
  agentHotkey: "AGENT_HOTKEY",
  amount: 10.5
});`}</code>
                    </pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Core Concepts</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Hotkey:</strong> The operational wallet used by the AI agent for day-to-day transactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Coldkey:</strong> The owner's wallet that holds final authority and can approve high-value transactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Daily Limit:</strong> Maximum amount the agent can spend autonomously without coldkey approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Endpoint:</strong> Webhook URL where balance change notifications are sent</span>
                      </li>
                    </ul>
                  </section>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
