import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsHTTP402() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">HTTP 402 Protocol</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><DocsSidebar /></div>
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-bold mb-4">HTTP 402: Payment Required Protocol</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Standardized protocol for requesting payments before service delivery
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Protocol Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      HTTP 402 ("Payment Required") is a reserved status code that was originally intended for digital payment systems. 
                      AgentPay leverages this status code as a standardized way for AI agents to request payments before delivering services.
                    </p>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">
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
                    <h3 className="text-2xl font-semibold mb-3">Request-Response Flow</h3>
                    <div className="p-6 bg-black/30 rounded-lg border border-primary/20 mb-4">
                      <pre className="text-sm text-muted-foreground overflow-x-auto">{`┌──────────┐                           ┌───────────┐
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
                    <h3 className="text-2xl font-semibold mb-3">Standard Response Format</h3>
                    <p className="text-muted-foreground mb-3">
                      When a payment is required, the agent responds with HTTP 402 and this JSON structure:
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4"><code>{`HTTP/1.1 402 Payment Required
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
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">recipient</code> - Solana address to send payment (agent's hotkey)
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">amount</code> - Payment amount in specified currency
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">currency</code> - Payment token (USDC, SOL, etc.)
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">service_id</code> - Unique identifier for this service request
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">expires_at</code> - Unix timestamp when payment offer expires
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <code className="text-primary">payment_url</code> - Solana Pay URL for easy wallet integration
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Agent Implementation</h3>
                    <p className="text-muted-foreground mb-3">
                      Server-side implementation for handling payment requests
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4"><code>{`import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

// Store pending services (use Redis in production)
const pendingServices = new Map();

// Service endpoint
app.post('/api/analyze', async (req, res) => {
  const { data, user_id } = req.body;
  
  // Check if payment already made (include payment_signature)
  if (req.body.payment_signature) {
    // Verify payment with AgentPay
    const isValid = await verifyPayment(req.body.payment_signature);
    
    if (isValid) {
      // Process service
      const result = await analyzeData(data);
      return res.json({ result });
    } else {
      return res.status(400).json({ error: 'Invalid payment' });
    }
  }
  
  // Generate payment request
  const serviceId = uuidv4();
  const amount = calculateServiceCost(data);
  const expiresAt = Math.floor(Date.now() / 1000) + 600; // 10 min
  
  // Store pending service
  pendingServices.set(serviceId, {
    user_id,
    data,
    amount,
    created_at: Date.now()
  });
  
  // Return 402 Payment Required
  return res.status(402).json({
    status: 402,
    payment_required: true,
    recipient: process.env.AGENT_HOTKEY,
    amount,
    currency: 'USDC',
    service_id: serviceId,
    expires_at: expiresAt,
    payment_url: \`solana:\${process.env.AGENT_HOTKEY}?amount=\${amount}&memo=\${serviceId}\`,
    description: 'Data analysis service',
    metadata: {
      estimated_time: '30 seconds'
    }
  });
});

// Webhook for payment notifications
app.post('/webhook/payment', async (req, res) => {
  // Verify webhook signature
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { service_id, amount, sender, signature } = req.body;
  
  // Get pending service
  const service = pendingServices.get(service_id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  // Verify amount matches
  if (amount !== service.amount) {
    return res.status(400).json({ error: 'Amount mismatch' });
  }
  
  // Process service asynchronously
  processService(service).then(result => {
    // Notify user via websocket/push notification
    notifyUser(service.user_id, { result, signature });
  });
  
  // Clean up
  pendingServices.delete(service_id);
  
  res.json({ success: true });
});

app.listen(3000);`}</code></pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Client Implementation</h3>
                    <p className="text-muted-foreground mb-3">
                      How clients should handle 402 responses
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`import { AgentPaySDK } from 'agentpay-sdk';

const sdk = new AgentPaySDK({ 
  apiKey: 'YOUR_API_KEY',
  network: 'devnet'
});

async function requestService(data) {
  try {
    // Initial request
    const response = await fetch('https://agent.com/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    
    // Check for payment requirement
    if (response.status === 402) {
      const payment = await response.json();
      
      console.log(\`Payment required: \${payment.amount} \${payment.currency}\`);
      console.log(\`Service: \${payment.description}\`);
      
      // Execute payment
      const result = await sdk.payAgent({
        agentHotkey: payment.recipient,
        amount: payment.amount,
        memo: payment.service_id
      });
      
      console.log('Payment sent:', result.signature);
      
      // Retry request with payment proof
      const serviceResponse = await fetch('https://agent.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          payment_signature: result.signature,
          service_id: payment.service_id
        })
      });
      
      if (serviceResponse.ok) {
        const result = await serviceResponse.json();
        return result;
      }
    } else if (response.ok) {
      // Service was free or already paid
      return await response.json();
    }
    
    throw new Error('Service request failed');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
const result = await requestService({ 
  type: 'sentiment_analysis',
  text: 'This is amazing!'
});

console.log('Result:', result);`}</code></pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Security Best Practices</h3>
                    <div className="grid gap-4">
                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">🔐 Service ID Validation</h4>
                        <p className="text-sm text-muted-foreground">
                          Always use unique, non-guessable service IDs (UUIDs) to prevent replay attacks.
                          Expire pending services after a reasonable time (5-10 minutes).
                        </p>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">✅ Payment Verification</h4>
                        <p className="text-sm text-muted-foreground">
                          Verify payment signatures on-chain or through AgentPay webhook signatures.
                          Never trust client-provided payment proofs without verification.
                        </p>
                      </div>

                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">⏱️ Expiration Times</h4>
                        <p className="text-sm text-muted-foreground">
                          Set reasonable expiration times for payment requests. Clean up expired
                          pending services to prevent memory leaks.
                        </p>
                      </div>

                      <div className="p-4 border border-border/50 rounded-lg">
                        <h4 className="font-semibold mb-2">🔄 Idempotency</h4>
                        <p className="text-sm text-muted-foreground">
                          Use transaction signatures as idempotency keys. Process each payment only once
                          even if webhook is delivered multiple times.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Solana Pay Integration</h3>
                    <p className="text-muted-foreground mb-3">
                      The <code>payment_url</code> field uses the Solana Pay standard for easy wallet integration:
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-3"><code>{`solana:Gx7UqNGqa57qJoABL17VHJSJpKuNp6wG...?amount=10.5&memo=srv_123`}</code></pre>
                    <p className="text-sm text-muted-foreground mb-3">
                      This URL can be used to generate QR codes for mobile wallet payments or deep-link into wallet apps.
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`import { encodeURL } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';
import QRCode from 'qrcode';

// Generate Solana Pay URL
const recipient = new PublicKey(payment.recipient);
const url = encodeURL({
  recipient,
  amount: payment.amount,
  memo: payment.service_id,
  label: 'AgentPay Service',
  message: payment.description
});

// Generate QR code
const qrCode = await QRCode.toDataURL(url.toString());

// Display to user
document.getElementById('qr').src = qrCode;`}</code></pre>
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
