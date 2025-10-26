import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsArchitecture() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* <h1 className="text-4xl font-normal mb-8">Architecture</h1> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DocsSidebar />
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-xl font-normal mb-4">System Architecture</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  AgentCred is built on a secure hotkey/coldkey architecture on Solana
                </p>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-normal mb-3">Core Components</h3>
                    
                    <div className="grid gap-4 mb-6">
                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-normal mb-2 text-primary">🔑 Coldkey Wallet</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          The primary asset owner wallet with full control over funds
                        </p>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Holds the actual USDC balance</li>
                          <li>• Receives all incoming payments</li>
                          <li>• Approves high-value transactions</li>
                          <li>• Can update daily spending limits</li>
                          <li>• Can deactivate agent at any time</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-normal mb-2 text-purple-400">🔥 Hotkey Wallet</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          The operational wallet with limited spending power
                        </p>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Used by AI agent for day-to-day operations</li>
                          <li>• Can spend within daily limit automatically</li>
                          <li>• Must request approval for larger amounts</li>
                          <li>• Cannot modify agent settings</li>
                          <li>• Limit resets every 24 hours</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-normal mb-2 text-accent">📋 On-Chain Registry</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Solana program managing agent relationships
                        </p>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Maps hotkeys to coldkeys</li>
                          <li>• Enforces daily spending limits</li>
                          <li>• Tracks agent statistics</li>
                          <li>• Manages payment approvals</li>
                          <li>• Emits events for monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-normal mb-3">Payment Flows</h3>
                    
                    <div className="space-y-4">
                      <div className="p-6 bg-black/30 rounded-lg border border-primary/20">
                        <h4 className="font-normal mb-3 text-primary">Flow 1: User → Agent</h4>
                        <pre className="text-sm text-muted-foreground overflow-x-auto">
{`┌─────────┐         USDC          ┌──────────┐
│  User   │ ───────────────────▶   │ Coldkey  │
└─────────┘                         └──────────┘
                                         │
                                         │ Notification
                                         ▼
                                    ┌──────────┐
                                    │  Agent   │
                                    └──────────┘

• Direct USDC transfer to agent's coldkey
• No approval needed
• Agent receives webhook notification
• Instant service delivery`}
                        </pre>
                      </div>

                      <div className="p-6 bg-black/30 rounded-lg border border-secondary/20">
                        <h4 className="font-normal mb-3 text-purple-400">Flow 2: Agent → Recipient (Auto)</h4>
                        <pre className="text-sm text-muted-foreground overflow-x-auto">
{`┌─────────┐         Request        ┌──────────┐
│ Hotkey  │ ───────────────────▶   │ Coldkey  │
└─────────┘                         └──────────┘
                                         │
                                         │ USDC (if within limit)
                                         ▼
                                    ┌──────────┐
                                    │Recipient │
                                    └──────────┘

• Hotkey initiates payment
• Smart contract checks daily limit
• If within limit: instant transfer
• If exceeded: requires approval (Flow 3)`}
                        </pre>
                      </div>

                      <div className="p-6 bg-black/30 rounded-lg border border-accent/20">
                        <h4 className="font-normal mb-3 text-accent">Flow 3: Agent → Recipient (Approval)</h4>
                        <pre className="text-sm text-muted-foreground overflow-x-auto">
{`┌─────────┐      Create Request     ┌──────────────┐
│ Hotkey  │ ────────────────────▶   │ On-Chain PDA │
└─────────┘                          └──────────────┘
                                           │
                                           │ Notification
                                           ▼
                                      ┌──────────┐
                                      │ Coldkey  │
                                      └──────────┘
                                           │
                                           │ Approve/Reject
                                           ▼
                                      ┌──────────┐
                                      │Recipient │
                                      └──────────┘

• Hotkey creates payment request on-chain
• Coldkey receives notification
• Coldkey approves or rejects
• If approved: USDC transferred`}
                        </pre>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-normal mb-3">Security Model</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-normal mb-2">🔒 Multi-Layer Protection</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Daily spending limits prevent runaway agents</li>
                          <li>• Approval workflow for large transactions</li>
                          <li>• Coldkey can deactivate agent instantly</li>
                          <li>• All operations logged on-chain</li>
                          <li>• PDA-based account derivation prevents spoofing</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-normal mb-2">⚡ Performance</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• ~400ms transaction finality on Solana</li>
                          <li>• 2-3 second webhook notification delivery</li>
                          <li>• No gas fees for payment recipients</li>
                          <li>• Sub-cent transaction costs</li>
                          <li>• Scales to millions of transactions per day</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-normal mb-2">📊 Observability</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Real-time transaction monitoring via light client</li>
                          <li>• On-chain event logs for all operations</li>
                          <li>• Dashboard analytics for agent performance</li>
                          <li>• Transaction history and audit trails</li>
                          <li>• Webhook delivery status tracking</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-normal mb-3">Technology Stack</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-normal mb-3">Blockchain Layer</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• <strong>Solana</strong> - High-performance blockchain</li>
                          <li>• <strong>Anchor</strong> - Solana program framework</li>
                          <li>• <strong>SPL Token</strong> - USDC standard</li>
                          <li>• <strong>Rust</strong> - Smart contract language</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-normal mb-3">Application Layer</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• <strong>TypeScript SDK</strong> - Client integration</li>
                          <li>• <strong>React</strong> - Dashboard interface</li>
                          <li>• <strong>WebSocket</strong> - Real-time monitoring</li>
                          <li>• <strong>Webhooks</strong> - Event notifications</li>
                        </ul>
                      </div>
                    </div>
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
