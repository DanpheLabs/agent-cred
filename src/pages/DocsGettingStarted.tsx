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
                    <h3 className="text-2xl font-semibold mb-3">1. Install SDK</h3>
                    <pre className="bg-black/50 p-4 rounded-lg"><code>npm install agentpay-sdk</code></pre>
                  </section>
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">2. Register Agent</h3>
                    <p className="text-muted-foreground mb-3">Create your agent with hotkey and coldkey wallets</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">3. Generate API Key</h3>
                    <p className="text-muted-foreground mb-3">Get your API credentials from the SDK page</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">4. Start Accepting Payments</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`import { AgentPaySDK } from 'agentpay-sdk';
const sdk = new AgentPaySDK({ apiKey: 'YOUR_KEY' });
await sdk.payAgent({ agentHotkey: 'HOTKEY', amount: 10 });`}</code></pre>
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
