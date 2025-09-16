import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Menu, Settings, CreditCard, BookOpen, History, Trophy, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (key: string) => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { toast } = useToast();
  const [conversations] = useState([
    { id: 1, title: "Math Help - Calculus Derivatives", timestamp: "2 hours ago", subject: "Mathematics", type: "exam" },
    { id: 2, title: "History Essay - World War II", timestamp: "Yesterday", subject: "History", type: "chat" },
    { id: 3, title: "Chemistry Study Guide - Organic", timestamp: "2 days ago", subject: "Chemistry", type: "exam" },
    { id: 4, title: "Physics Problem Set - Motion", timestamp: "3 days ago", subject: "Physics", type: "chat" },
    { id: 5, title: "Literature Analysis - Shakespeare", timestamp: "1 week ago", subject: "Literature", type: "exam" },
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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-full w-72 transform bg-card border-r border-border shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chakra-blue-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">StudyAI</h2>
                <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
              </div>
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
          <div className="p-6">
            <Button 
              onClick={handleNewChat}
              className="w-full chakra-button-primary shadow-sm"
            >
              + New Study Session
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="px-6 pb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                <Trophy className="h-3 w-3" />
                <span className="text-xs">Exam</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                <History className="h-3 w-3" />
                <span className="text-xs">Review</span>
              </Button>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Recent Sessions
              </p>
            </div>
            
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 rounded-lg cursor-pointer group hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        conversation.type === 'exam' ? 'bg-chakra-yellow-400' : 'bg-chakra-blue-400'
                      }`} />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conversation.type === 'exam' 
                          ? 'bg-chakra-yellow-400/10 text-chakra-yellow-400' 
                          : 'bg-chakra-blue-400/10 text-chakra-blue-400'
                      }`}>
                        {conversation.type === 'exam' ? 'EXAM' : 'CHAT'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium truncate mb-1 group-hover:text-primary transition-colors">
                    {conversation.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {conversation.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="border-t border-border p-6 space-y-2">
            <Link to="/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-accent h-11 rounded-lg"
              >
                <Settings className="h-4 w-4" />
                <span>Settings & Preferences</span>
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-accent h-11 rounded-lg"
              >
                <CreditCard className="h-4 w-4" />
                <span>Upgrade Plan</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;