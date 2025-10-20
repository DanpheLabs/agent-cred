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
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Core Methods</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">payAgent()</h4>
                        <p className="text-sm text-muted-foreground mb-2">Send USDC payment to an agent</p>
                        <pre className="bg-black/50 p-3 rounded text-xs"><code>{`await sdk.payAgent({ agentHotkey, amount, memo })`}</code></pre>
                      </div>
                      <div className="p-4 border border-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">requestPayment()</h4>
                        <p className="text-sm text-muted-foreground mb-2">Request payment approval from coldkey</p>
                        <pre className="bg-black/50 p-3 rounded text-xs"><code>{`await sdk.requestPayment({ agentHotkey, recipient, amount, purpose })`}</code></pre>
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
