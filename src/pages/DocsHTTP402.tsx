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
                <h2 className="text-3xl font-bold mb-4">Payment Required Protocol</h2>
                <p className="text-lg text-muted-foreground mb-6">Using HTTP 402 as a payment coordination medium</p>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Protocol Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">HTTP 402 status code is reserved for "Payment Required". We use it to communicate payment details between users and agents, enabling gasless transactions where the recipient (agent) doesn't need SOL for gas fees.</p>
                  </section>
                  <section>
                    <h3 className="text-2xl font-semibold mb-3">Response Format</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto"><code>{`{
  "status": 402,
  "payment_required": true,
  "recipient": "AGENT_HOTKEY_ADDRESS",
  "amount": 10.5,
  "currency": "USDC",
  "service_id": "unique_service_123"
}`}</code></pre>
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
