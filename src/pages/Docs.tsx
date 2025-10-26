import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Docs() {
  const quickStartCode = `npm install agentpay-sdk

import { AgentCredSDK } from "agentpay-sdk";

const sdk = new AgentCredSDK({
  apiKey: "YOUR_API_KEY",
  network: "mainnet-beta"
});

// Start accepting payments
await sdk.payAgent({
  agentHotkey: "AGENT_HOTKEY",
  amount: 10.5
});`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-normal mb-8">Developer Documentation</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DocsSidebar />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-normal mb-4">Welcome to AgentCred</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Complete documentation for integrating autonomous agent payments in your application.
                </p>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-normal mb-3">What is AgentCred?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      AgentCred is a payment infrastructure built specifically for AI agents on Solana. 
                      It enables autonomous payments with built-in security through the hotkey/coldkey architecture, 
                      real-time balance monitoring, and gasless transaction support.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-normal mb-3">Key Features</h3>
                    <div className="grid gap-4">
                      <div className="p-4 glass border border-primary/20 rounded-lg">
                        <h4 className="font-normal mb-2">🔐 Dual-Key Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Hotkey for autonomous operations, coldkey for owner control and approvals
                        </p>
                      </div>
                      <div className="p-4 glass border border-secondary/20 rounded-lg">
                        <h4 className="font-normal mb-2">⚡ Gasless Transactions</h4>
                        <p className="text-sm text-muted-foreground">
                          Using HTTP 402 protocol, agents can receive payments without gas fees
                        </p>
                      </div>
                      <div className="p-4 glass border border-accent/20 rounded-lg">
                        <h4 className="font-normal mb-2">📡 Real-time Monitoring</h4>
                        <p className="text-sm text-muted-foreground">
                          Light client monitors on-chain transactions and notifies agents instantly
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-normal mb-3">Quick Start</h3>
                    <SyntaxHighlighter 
                      language="typescript" 
                      style={vscDarkPlus}
                      customStyle={{
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {quickStartCode}
                    </SyntaxHighlighter>
                  </section>

                  <section>
                    <h3 className="text-2xl font-normal mb-3">Core Concepts</h3>
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
