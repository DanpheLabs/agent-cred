import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Menu, Settings, CreditCard, BookOpen, History, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (key: string) => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { toast } = useToast();
  const [conversations] = useState([
    { id: 1, title: "Math Help - Calculus Derivatives", timestamp: "2 hours ago", subject: "Mathematics" },
    { id: 2, title: "History Essay - World War II", timestamp: "Yesterday", subject: "History" },
    { id: 3, title: "Chemistry Study Guide - Organic", timestamp: "2 days ago", subject: "Chemistry" },
    { id: 4, title: "Physics Problem Set - Motion", timestamp: "3 days ago", subject: "Physics" },
    { id: 5, title: "Literature Analysis - Shakespeare", timestamp: "1 week ago", subject: "Literature" },
  ]);

  const handleNewChat = () => {
    toast({
      title: "New Study Session Started",
      description: "Ready to help with your studies!",
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-full w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">StudyAI</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-accent lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button 
              onClick={handleNewChat}
              className="w-full"
              variant="default"
            >
              + New Study Session
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span className="text-xs">Exam</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <History className="h-3 w-3" />
                <span className="text-xs">Review</span>
              </Button>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Recent Sessions
              </h3>
            </div>
            
            <div className="space-y-1 px-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-3 rounded-lg cursor-pointer group hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </p>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {conversation.subject}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="border-t border-border p-4 space-y-2">
            <Link to="/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-accent"
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Upgrade Plan</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;