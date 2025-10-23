import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsMonitoring() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Light Client Monitoring</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DocsSidebar />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-bold mb-4">Real-time Transaction Monitoring</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  AgentPay runs a light client that monitors the Solana blockchain for agent payments 
                  and delivers instant notifications.
                </p>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">What is a Light Client?</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A light client is a lightweight blockchain node that doesn't store the entire blockchain 
                      but can still verify transactions and account states. Our light client specifically:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Subscribes to account changes for registered agent hotkeys</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Monitors USDC token transfers to agent addresses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Verifies transaction signatures and amounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Delivers webhook notifications within 2-3 seconds</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">How It Works</h3>
                    
                    <div className="p-6 bg-black/30 rounded-lg border border-primary/20 mb-4">
                      <h4 className="font-semibold mb-3 text-primary">Monitoring Flow</h4>
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
{`1. Agent registers with hotkey address & webhook endpoint
   ↓
2. Light client subscribes to hotkey account via WebSocket
   ↓
3. User sends USDC payment to hotkey
   ↓
4. Solana confirms transaction (< 400ms)
   ↓
5. Light client receives account update notification
   ↓
6. Client parses transaction details:
   - Amount
   - Sender address
   - Memo (service_id)
   - Transaction signature
   ↓
7. POST webhook to agent endpoint with payment data
   ↓
8. Agent processes service and delivers to user`}
                      </pre>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Webhook Payload</h3>
                    <p className="text-muted-foreground mb-4">
                      When a payment is detected, your agent endpoint receives:
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4">
                      <code className="text-sm">{`POST https://your-agent.com/webhook/payment

{
  "event": "balance_change",
  "agent_hotkey": "Gx7...",
  "transaction": {
    "signature": "5j2k...",
    "amount": 10.5,
    "currency": "USDC",
    "sender": "Abc...",
    "memo": "service_123",
    "timestamp": 1735500000,
    "slot": 281234567
  },
  "balance": {
    "previous": 100.0,
    "current": 110.5,
    "change": 10.5
  },
  "verified": true,
  "agentpay_signature": "..."
}`}</code>
                    </pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Webhook Security</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">🔐 Signature Verification</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Each webhook includes an HMAC signature for verification
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
                          <code>{`import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hmac === signature;
}`}</code>
                        </pre>
                      </div>
                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">🔄 Retry Logic</h4>
                        <p className="text-sm text-muted-foreground">
                          Failed webhooks are retried with exponential backoff: 2s, 4s, 8s, 16s, 32s
                        </p>
                      </div>
                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">📝 Idempotency</h4>
                        <p className="text-sm text-muted-foreground">
                          Use transaction signature as idempotency key to prevent duplicate processing
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 text-center border border-border/50 rounded-lg">
                        <p className="text-3xl font-bold text-primary">~400ms</p>
                        <p className="text-sm text-muted-foreground mt-1">Solana finality</p>
                      </div>
                      <div className="p-4 text-center border border-border/50 rounded-lg">
                        <p className="text-3xl font-bold text-secondary">2-3s</p>
                        <p className="text-sm text-muted-foreground mt-1">Notification delivery</p>
                      </div>
                      <div className="p-4 text-center border border-border/50 rounded-lg">
                        <p className="text-3xl font-bold text-accent">99.9%</p>
                        <p className="text-sm text-muted-foreground mt-1">Uptime SLA</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Implementation Guide</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Express.js webhook handler
import express from 'express';
import { verifyWebhook } from './utils';

const app = express();
app.use(express.json());

// Store processed transactions to prevent duplicates
const processedTxs = new Set();

app.post('/webhook/payment', async (req, res) => {
  const signature = req.headers['x-agentpay-signature'];
  const payload = req.body;
  
  // 1. Verify signature
  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // 2. Check idempotency
  const txSignature = payload.transaction.signature;
  if (processedTxs.has(txSignature)) {
    return res.status(200).json({ message: 'Already processed' });
  }
  
  // 3. Process payment
  try {
    await processPayment({
      serviceId: payload.transaction.memo,
      amount: payload.transaction.amount,
      sender: payload.transaction.sender
    });
    
    processedTxs.add(txSignature);
    res.json({ success: true });
  } catch (error) {
    console.error('Payment processing failed:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.listen(3000);`}</code>
                    </pre>
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
