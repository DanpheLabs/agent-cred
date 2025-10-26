import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from "react";
import { saveWallet, clearWallet } from "@/lib/storage";
import { toast } from "sonner";
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const { publicKey, connected } = useWallet();
  const location = useLocation();
  
  useEffect(() => {
    if (connected && publicKey) {
      saveWallet({
        ownerAddress: publicKey.toBase58(),
        connectedAt: new Date().toISOString(),
        balance: 0,
      });
      toast.success("Wallet connected successfully!");
    } else {
      clearWallet();
    }
  }, [connected, publicKey]);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/agentcred.png" alt="AgentCred Logo" className="w-9 h-9" />
          <span className="text-2xl p-2 font-light text-white">Agent<span className='font-bold pl-1'>Cred</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/agents" 
            className={`text-sm font-medium transition-colors ${isActive('/agents') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Agents
          </Link>
          {/* <Link 
            to="/analytics" 
            className={`text-sm font-medium transition-colors ${isActive('/analytics') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Transactions
          </Link> */}
          <Link 
            to="/payments" 
            className={`text-sm font-medium transition-colors ${isActive('/payments') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Playground
          </Link>
          {/* <Link 
            to="/use-cases" 
            className={`text-sm font-medium transition-colors ${isActive('/use-cases') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Use Cases
          </Link> */}
          <Link 
            to="/sdk" 
            className={`text-sm font-medium transition-colors ${isActive('/sdk') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            API
          </Link>
          <Link 
            to="/docs" 
            className={`text-sm font-medium transition-colors ${isActive('/docs') ? 'text-white font-normal' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Docs
          </Link>
        </div>

        <WalletMultiButton className="" />
      </div>
    </nav>
  );
};
