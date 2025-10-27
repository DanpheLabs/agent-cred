import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsHTTP402() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-8 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* <h1 className="text-4xl font-normal mb-8">HTTP 402 Protocol</h1> */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><DocsSidebar /></div>
            <div className="lg:col-span-3">
              <Card className="glass p-8  border-border/50">
                <h2 className="text-xl font-normal mb-4">HTTP 402: Payment Required Protocol</h2>
                <p className="text-sm text-sm text-muted-foreground mb-6">
                  Standardized protocol for requesting payments before service delivery
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-normal mb-3">Protocol Overview</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      HTTP 402 ("Payment Required") is a reserved status code that was originally intended for digital payment systems. 
                      AgentCred leverages this status code as a standardized way for AI agents to request payments before delivering services.
                    </p>
                    <div className="p-4 bg-primary/10  border border-primary/20">
                      <p className="text-sm text-sm text-muted-foreground">
                        <strong>Why HTTP 402?</strong><br/>
                        • Industry-standard protocol for payment requests<br/>
                        • Human and machine-readable format<br/>
                        • Works with any HTTP client library<br/>
                        • No custom headers or authentication needed<br/>
                        • Enables gasless transactions for recipients
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-normal mb-3">Request-Response Flow</h3>
                    <div className="p-6 bg-black/30  border border-primary/20 mb-4">
                      <pre className="text-sm text-sm text-muted-foreground overflow-x-auto">{`┌──────────┐                           ┌───────────┐
│  Client  │                           │   Agent   │
└────┬─────┘                           └─────┬─────┘
     │                                       │
     │  POST /api/service                    │
     │  { "request": "analyze_data" }        │
     │──────────────────────────────────────>│
     │                                       │
     │  402 Payment Required                 │
     │  { payment_required: true, ... }      │
     │<──────────────────────────────────────│
     │                                       │
     │  [Client sends USDC to agent]         │
     │──────────────────────────────────────>│
     │                                       │
     │  [Agent receives webhook]             │
     │                                       │
     │  POST /api/service                    │
     │  { "payment_signature": "5j2k..." }   │
     │──────────────────────────────────────>│
     │                                       │
     │  200 OK                               │
     │  { "result": "..." }                  │
     │<──────────────────────────────────────│
     │                                       │`}</pre>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-normal mb-3">Standard Response Format</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      When a payment is required, the agent responds with HTTP 402 and this JSON structure:
                    </p>
                    <pre className="text-sm bg-black/50 p-4  overflow-x-auto mb-4"><code>{`HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "status": 402,
  "payment_required": true,
  "recipient": "Gx7UqNGqa57qJoABL17VHJSJpKuNp6wG....",
  "amount": 10.5,
  "currency": "USDC",
  "service_id": "srv_1234567890abcdef",
  "expires_at": 1735500600,
  "payment_url": "solana:Gx7Uq...?amount=10.5&memo=srv_123",
  "description": "Data analysis service",
  "metadata": {
    "estimated_time": "30 seconds",
    "result_format": "json"
  }
}`}</code></pre>
                    
                    <div className="grid gap-3 text-sm">
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">recipient</code> - Solana address to send payment (agent's hotkey)
                      </div>
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">amount</code> - Payment amount in specified currency
                      </div>
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">currency</code> - Payment token (USDC, SOL, etc.)
                      </div>
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">service_id</code> - Unique identifier for this service request
                      </div>
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">expires_at</code> - Unix timestamp when payment offer expires
                      </div>
                      <div className="p-3 border border-border/50 ">
                        <code className="text-primary">payment_url</code> - Solana Pay URL for easy wallet integration
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
