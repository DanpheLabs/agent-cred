import { Navbar } from "@/components/Navbar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { Card } from "@/components/ui/card";

export default function DocsGettingStarted() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Getting Started</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><DocsSidebar /></div>
            <div className="lg:col-span-3">
              <Card className="glass p-8 rounded-2xl border-border/50">
                <h2 className="text-3xl font-bold mb-4">Setup AgentPay in 5 Minutes</h2>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Prerequisites</h3>
                    <ul className="space-y-2 text-muted-foreground ml-6 mb-4">
                      <li>• Node.js 16+ and npm/yarn installed</li>
                      <li>• Solana wallet (Phantom, Solflare, etc.)</li>
                      <li>• Basic knowledge of TypeScript/JavaScript</li>
                      <li>• Some devnet SOL for testing (free from faucet)</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">1. Install SDK</h3>
                    <pre className="bg-black/50 p-4 rounded-lg mb-4"><code>npm install agentpay-sdk @solana/web3.js</code></pre>
                    <p className="text-sm text-muted-foreground">
                      Or with yarn: <code>yarn add agentpay-sdk @solana/web3.js</code>
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">2. Create Wallet Keypairs</h3>
                    <p className="text-muted-foreground mb-3">
                      You'll need two Solana wallets: a coldkey (asset owner) and a hotkey (operational wallet)
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-2"><code>{`// Generate new keypairs or use existing wallets
import { Keypair } from '@solana/web3.js';

// Coldkey: Your main secure wallet (keep private!)
const coldkey = Keypair.generate();
console.log('Coldkey:', coldkey.publicKey.toString());

// Hotkey: Operational wallet for your agent
const hotkey = Keypair.generate();
console.log('Hotkey:', hotkey.publicKey.toString());

// Save these securely! You'll need them to register your agent`}</code></pre>
                    <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 text-sm">
                      <p className="text-muted-foreground">
                        💡 <strong>Pro tip:</strong> Use your existing Phantom/Solflare wallet as coldkey for easier management
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">3. Get Devnet SOL & USDC</h3>
                    <p className="text-muted-foreground mb-3">For testing, you'll need devnet tokens:</p>
                    <div className="space-y-2 mb-4">
                      <div className="p-3 border border-border/50 rounded-lg">
                        <p className="font-semibold mb-1">SOL (for transaction fees):</p>
                        <pre className="bg-black/50 p-2 rounded text-xs"><code>solana airdrop 2 YOUR_COLDKEY_ADDRESS --url devnet</code></pre>
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <p className="font-semibold mb-1">USDC (for payments):</p>
                        <p className="text-sm text-muted-foreground">Visit <a href="https://spl-token-faucet.com" target="_blank" className="text-primary hover:underline">SPL Token Faucet</a> to get devnet USDC</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">4. Register Your Agent</h3>
                    <p className="text-muted-foreground mb-3">
                      Register your agent on-chain with coldkey/hotkey pair and set daily spending limit
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-2"><code>{`import { AgentPaySDK } from 'agentpay-sdk';
import { Connection, Keypair } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const sdk = new AgentPaySDK({ 
  connection,
  network: 'devnet'
});

// Register agent (coldkey must sign this)
const signature = await sdk.registerAgent({
  coldkey: coldkeyKeypair,
  hotkey: hotkeyPublicKey,
  dailyLimit: 1000 // 1000 USDC daily spending limit
});

console.log('Agent registered!');
console.log('Transaction:', signature);`}</code></pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">5. Generate API Key</h3>
                    <p className="text-muted-foreground mb-3">
                      Create an API key for your agent in the AgentPay dashboard
                    </p>
                    <ol className="space-y-2 text-muted-foreground ml-6">
                      <li>1. Connect your wallet to the dashboard</li>
                      <li>2. Navigate to "My Agents" and select your agent</li>
                      <li>3. Go to "SDK & API Keys" section</li>
                      <li>4. Enter a name and click "Generate Key"</li>
                      <li>5. Save your API key securely</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">6. Start Accepting Payments</h3>
                    <p className="text-muted-foreground mb-3">
                      Integrate payment acceptance in your agent application
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4"><code>{`import { AgentPaySDK } from 'agentpay-sdk';

const sdk = new AgentPaySDK({ 
  apiKey: 'your_api_key_here',
  network: 'devnet'
});

// Example: Handle incoming payment
app.post('/webhook/payment', async (req, res) => {
  const { transaction, amount, sender } = req.body;
  
  // Verify payment signature
  const isValid = sdk.verifyWebhookSignature(req.body, req.headers);
  
  if (isValid) {
    console.log(\`Received \${amount} USDC from \${sender}\`);
    
    // Deliver your service here
    await deliverService(sender, amount);
    
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});`}</code></pre>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3">7. Make Agent Payments</h3>
                    <p className="text-muted-foreground mb-3">
                      Your agent can send payments to other addresses
                    </p>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`// Instant payment (within daily limit)
const result = await sdk.agentPay({
  hotkey: hotkeyKeypair,
  coldkey: coldkeyPublicKey,
  recipient: recipientAddress,
  amount: 50 // 50 USDC
});

// Request approval (for larger amounts)
const requestId = await sdk.requestPayment({
  hotkey: hotkeyKeypair,
  coldkey: coldkeyPublicKey,
  recipient: recipientAddress,
  amount: 2000, // Exceeds daily limit
  purpose: 'Large data processing payment'
});

console.log('Payment request created:', requestId);`}</code></pre>
                  </section>

                  <section className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-2xl font-semibold mb-3">🎉 You're Ready!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your agent is now set up to accept and send payments on Solana. Next steps:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-6">
                      <li>• Explore the <a href="/docs/sdk" className="text-primary hover:underline">SDK reference</a> for more features</li>
                      <li>• Learn about <a href="/docs/gasless" className="text-primary hover:underline">gasless transactions</a></li>
                      <li>• Set up <a href="/docs/monitoring" className="text-primary hover:underline">real-time monitoring</a></li>
                      <li>• Test in the <a href="/payments" className="text-primary hover:underline">playground</a></li>
                      <li>• Read about <a href="/docs/architecture" className="text-primary hover:underline">system architecture</a></li>
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
