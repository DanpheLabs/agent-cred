import { NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Home, BookOpen, Code, Zap, Radio, FileText, Box } from "lucide-react";

export const DocsSidebar = () => {
  const navItems = [
    { path: "/docs", label: "Overview", icon: Home },
    { path: "/docs/getting-started", label: "Getting Started", icon: BookOpen },
    { path: "/docs/architecture", label: "Architecture", icon: Box },
    { path: "/docs/sdk", label: "SDK Reference", icon: Code },
    { path: "/docs/gasless", label: "Gasless Transactions", icon: Zap },
    { path: "/docs/http-402", label: "HTTP 402 Protocol", icon: FileText },
    { path: "/docs/monitoring", label: "Light Client", icon: Radio },
  ];

  return (
    <Card className="glass p-4 rounded-2xl border-border/50 sticky top-24 h-fit">
      <h3 className="font-semibold mb-4 px-2">Documentation</h3>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary font-medium"
                    : "hover:bg-muted/50 text-muted-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </Card>
  );
};
