import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTransactions, getTransactionsByType } from "@/lib/storage";

export const TransactionHistory = () => {
  const transactions = getTransactions();
  const received = getTransactionsByType("user_to_agent");
  const sent = getTransactionsByType("agent_to_recipient");
  
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };
  
  const TransactionRow = ({ tx }: { tx: any }) => {
    const isReceived = tx.type === "user_to_agent";
    
    return (
      <div className="flex items-center justify-between p-4 rounded-xl glass border border-border/30 hover:border-primary/30 transition-all">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isReceived ? 'bg-primary/10' : 'bg-secondary/10'}`}>
            {isReceived ? (
              <ArrowDownRight className="h-5 w-5 text-primary" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-purple-400" />
            )}
          </div>
          <div>
            <p className="font-light">{tx.description}</p>
            <p className="text-sm text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`font-normal ${isReceived ? 'text-primary' : 'text-purple-400'}`}>
              {isReceived ? '+' : '-'}{tx.amount.toFixed(2)} USDC
            </p>
            <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  if (transactions.length === 0) {
    return (
      <Card className="glass p-12 rounded-2xl border-border/50 text-center">
        <h3 className="text-2xl font-normal mb-2">Transaction History</h3>
        <p className="text-muted-foreground">No transactions yet</p>
      </Card>
    );
  }
  
  return (
    <Card className="glass p-6 rounded-2xl border-border/50">
      <h3 className="text-2xl font-normal mb-6">Transaction History</h3>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3">
          {transactions.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </TabsContent>
        
        <TabsContent value="received" className="space-y-3">
          {received.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-3">
          {sent.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
