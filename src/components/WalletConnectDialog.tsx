import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: (publicKey: string) => void;
  title?: string;
  description?: string;
}

export const WalletConnectDialog = ({ 
  open, 
  onOpenChange, 
  onConnected,
  title = "Connect Hotkey Wallet",
  description = "Connect the wallet that will be used as the agent's hotkey for operations"
}: WalletConnectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-6">
          <WalletMultiButton className="bg-gradient-to-r from-primary to-purple-400 text-primary-foreground font-normal glow-hover" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
