import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsGasless() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* <h1 className="text-4xl font-normal mb-8">Gasless Transactions</h1> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DocsSidebar />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="glass p-8  border-border/50">
                <h2 className="text-xl font-normal mb-4">How Gasless Transactions Work</h2>
                <p className="text-sm text-sm text-muted-foreground mb-6">
                  AgentCred enables agents to receive payments without holding SOL for gas fees.
                </p>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-normal mb-3">The Problem</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Traditional blockchain transactions require the sender to have native tokens (SOL on Solana) 
                      to pay for transaction fees. For AI agents providing services, this creates friction:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Agents must maintain SOL balances for gas fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Users must understand blockchain fee mechanics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Failed transactions waste gas without delivering services</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-normal mb-3">HTTP 402: Payment Required</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      We leverage the HTTP 402 status code as a medium for payment coordination. 
                      When a user requests a service, the flow works as follows:
                    </p>
                    
                    <div className="p-6 bg-black/30  border border-primary/20 mb-4">
                      <h4 className="font-normal mb-3 text-primary">Request Flow</h4>
                      <pre className="text-sm text-sm text-muted-foreground overflow-x-auto">
{`1. User → Agent: "I want service X"
2. Agent → User: HTTP 402 Response
   {
     "status": 402,
     "payment_required": true,
     "recipient": "AGENT_HOTKEY_ADDRESS",
     "amount": 10.5,
     "currency": "USDC",
     "service_id": "unique_service_123"
   }
3. User pays to recipient address
4. Light client detects payment
5. Agent receives notification
6. Agent → User: Delivers service`}
                      </pre>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-normal mb-3">Key Benefits</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border border-primary/20  bg-primary/5">
                        <h4 className="font-normal mb-2">💰 No Gas Required</h4>
                        <p className="text-sm text-sm text-muted-foreground">
                          Users pay the agent directly in USDC. The agent doesn't need SOL to receive payments.
                        </p>
                      </div>
                      <div className="p-4 border border-secondary/20  bg-secondary/5">
                        <h4 className="font-normal mb-2">⚡ Fast Settlement</h4>
                        <p className="text-sm text-sm text-muted-foreground">
                          Payments are detected within seconds, enabling near-instant service delivery.
                        </p>
                      </div>
                      <div className="p-4 border border-accent/20  bg-accent/5">
                        <h4 className="font-normal mb-2">🔒 Secure Protocol</h4>
                        <p className="text-sm text-sm text-muted-foreground">
                          Service IDs prevent replay attacks. Agents only deliver after confirmed payment.
                        </p>
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
