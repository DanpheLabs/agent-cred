import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsSDK() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">SDK Reference</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><DocsSidebar /></div>
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-bold mb-4">Complete SDK Documentation</h2>
                <p className="text-muted-foreground mb-6">
                  Comprehensive TypeScript SDK for Solana blockchain integration
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Installation</h3>
                    <pre className="bg-black/50 p-4 rounded-lg mb-2"><code>npm install agentpay-sdk @solana/web3.js</code></pre>
                    <p className="text-sm text-muted-foreground">
                      The SDK requires @solana/web3.js as a peer dependency
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Initialization</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`import { AgentPaySDK } from 'agentpay-sdk';
import { Connection } from '@solana/web3.js';

// Option 1: With API key (for production)
const sdk = new AgentPaySDK({
  apiKey: 'your_api_key_here',
  network: 'devnet' // or 'mainnet-beta'
});

// Option 2: With custom connection
const connection = new Connection('https://api.devnet.solana.com');
const sdk = new AgentPaySDK({
  connection,
  network: 'devnet'
});`}</code></pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Agent Management</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">registerAgent()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Register a new agent with hotkey/coldkey pair
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const signature = await sdk.registerAgent({
  coldkey: coldkeyKeypair,        // Keypair
  hotkey: hotkeyPublicKey,        // PublicKey
  dailyLimit: 1000                // USDC amount
});

// Returns: Transaction signature (string)`}</code></pre>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Parameters:</strong>
                          <ul className="ml-4 mt-1 space-y-1">
                            <li>• <code>coldkey</code> - Keypair of the asset owner (must sign)</li>
                            <li>• <code>hotkey</code> - PublicKey of operational wallet</li>
                            <li>• <code>dailyLimit</code> - Maximum daily spending in USDC</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">getAgent()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Fetch agent data from blockchain
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const agent = await sdk.getAgent({
  coldkey: coldkeyPublicKey,
  hotkey: hotkeyPublicKey
});

console.log(agent);
// {
//   coldkey: PublicKey,
//   hotkey: PublicKey,
//   dailyLimit: 1000000000, // in lamports
//   dailySpent: 50000000,
//   isActive: true,
//   totalReceived: 5000000000,
//   totalSent: 1000000000
// }`}</code></pre>
                      </div>

                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">updateAgentLimit()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Update daily spending limit (coldkey only)
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const signature = await sdk.updateAgentLimit({
  coldkey: coldkeyKeypair,
  hotkey: hotkeyPublicKey,
  newLimit: 2000 // New daily limit in USDC
});`}</code></pre>
                      </div>

                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2">deactivateAgent()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Disable agent from making/receiving payments
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const signature = await sdk.deactivateAgent({
  coldkey: coldkeyKeypair,
  hotkey: hotkeyPublicKey
});`}</code></pre>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Payment Methods</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">payAgent()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Send USDC payment from user to agent's coldkey
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const result = await sdk.payAgent({
  user: userKeypair,              // Paying user
  agentHotkey: hotkeyPublicKey,   // Agent to pay
  amount: 50,                     // USDC amount
  memo: 'service_123'             // Optional memo
});

console.log(result);
// {
//   signature: '5j2k...',
//   explorerUrl: 'https://explorer.solana.com/tx/...',
//   amount: 50,
//   recipient: 'Gx7...'
// }`}</code></pre>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">agentPay()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Agent sends payment within daily limit (instant)
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const result = await sdk.agentPay({
  hotkey: hotkeyKeypair,          // Agent's hotkey (must sign)
  coldkey: coldkeyPublicKey,      // Agent's coldkey
  recipient: recipientPublicKey,   // Payment recipient
  amount: 100                      // USDC amount
});

// Throws error if exceeds daily limit`}</code></pre>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">requestPayment()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create payment request for coldkey approval
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const requestId = await sdk.requestPayment({
  hotkey: hotkeyKeypair,
  coldkey: coldkeyPublicKey,
  recipient: recipientPublicKey,
  amount: 2000,                    // Amount exceeding limit
  purpose: 'Large data purchase'   // Reason (max 200 chars)
});

console.log('Request ID:', requestId);`}</code></pre>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">approvePayment()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Coldkey approves pending payment request
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`const signature = await sdk.approvePayment({
  coldkey: coldkeyKeypair,
  requestId: paymentRequestPublicKey
});

// USDC transferred to recipient`}</code></pre>
                      </div>

                      <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                        <h4 className="font-semibold mb-2">rejectPayment()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Coldkey rejects pending payment request
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const signature = await sdk.rejectPayment({
  coldkey: coldkeyKeypair,
  requestId: paymentRequestPublicKey
});`}</code></pre>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Utility Methods</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">verifyWebhookSignature()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Verify webhook payload authenticity
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const isValid = sdk.verifyWebhookSignature(
  req.body,                        // Webhook payload
  req.headers['x-agentpay-signature'], // Signature header
  process.env.WEBHOOK_SECRET       // Your webhook secret
);

if (!isValid) {
  return res.status(401).json({ error: 'Invalid signature' });
}`}</code></pre>
                      </div>

                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">getRegistry()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Fetch global registry statistics
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const registry = await sdk.getRegistry();

console.log(registry);
// {
//   authority: PublicKey,
//   agentCount: 1234,
//   totalVolume: 5000000000000
// }`}</code></pre>
                      </div>

                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">formatUSDC()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Convert lamports to human-readable USDC
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const formatted = sdk.formatUSDC(50000000);
console.log(formatted); // "50.00 USDC"`}</code></pre>
                      </div>

                      <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                        <h4 className="font-semibold mb-2">parseUSDC()</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Convert USDC amount to lamports
                        </p>
                        <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto"><code>{`const lamports = sdk.parseUSDC(50);
console.log(lamports); // 50000000`}</code></pre>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Error Handling</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`try {
  await sdk.agentPay({
    hotkey: hotkeyKeypair,
    coldkey: coldkeyPublicKey,
    recipient: recipientPublicKey,
    amount: 5000 // Exceeds limit
  });
} catch (error) {
  if (error.message.includes('DailyLimitExceeded')) {
    // Request approval instead
    await sdk.requestPayment({...});
  } else if (error.message.includes('AgentInactive')) {
    console.error('Agent is deactivated');
  } else if (error.message.includes('UnauthorizedHotkey')) {
    console.error('Wrong hotkey signer');
  } else {
    console.error('Unknown error:', error);
  }
}`}</code></pre>
                  </section>

                  <section className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-2xl font-semibold mb-3">TypeScript Types</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The SDK is fully typed with TypeScript
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs"><code>{`import type {
  AgentData,
  RegistryData,
  PaymentResult,
  PaymentRequest,
  SDKConfig
} from 'agentpay-sdk';

// All methods have full type inference and autocomplete`}</code></pre>
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
