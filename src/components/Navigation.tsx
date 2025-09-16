import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, CreditCard, LogOut, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPlan?: string;
}

const Navigation = ({ currentPlan = "Student" }: NavigationProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* Current Plan Badge */}
      <Badge variant={currentPlan === "Premium" ? "default" : "secondary"} className="flex items-center gap-1">
        {currentPlan === "Premium" && <Crown className="h-3 w-3" />}
        {currentPlan} Plan
      </Badge>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">sarah.j@email.com</p>
          </div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/pricing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pricing & Billing
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
            <LogOut className="h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navigation;