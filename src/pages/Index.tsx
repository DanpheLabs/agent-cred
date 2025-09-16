import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';
import ExamMode from '@/components/ExamMode';
import Navigation from '@/components/Navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy, Zap, Target } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);
  const { toast } = useToast();

  // Mock API key check - in real app this would be from settings
  const hasApiKey = true;

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content, timestamp: new Date() } as const
      ];
      
      setMessages(newMessages);

      // Simulate AI response with realistic delay
      setTimeout(() => {
        const responses = [
          "Great question! Let me break this down step by step to help you understand...",
          "I can see you're working on this concept. Here's how I'd approach it...",
          "This is a common area where students need extra practice. Let me explain...",
          "Perfect! You're on the right track. Let me add some additional context...",
          "I notice this might be challenging. Let me provide a simpler explanation first..."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const assistantMessage: Message = {
          role: 'assistant',
          content: `${randomResponse}\n\nBased on your question about "${content}", here are the key points:\n\n1. **Understanding the concept**: This relates to fundamental principles you've learned\n2. **Step-by-step approach**: Break it down into smaller, manageable parts\n3. **Practice application**: Try similar problems to reinforce your learning\n\nWould you like me to provide some practice questions on this topic?`,
          timestamp: new Date()
        };

        setMessages([...newMessages, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (isExamMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">StudyAI - Exam Mode</h1>
              </div>
              <Navigation />
            </div>
          </div>
        </div>
        <ExamMode onExit={() => setIsExamMode(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}} // Mock function
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} flex flex-col`}>
        <div className="border-b bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">StudyAI</h1>
              <Badge variant="outline" className="text-xs">Beta</Badge>
            </div>
            <Navigation />
          </div>
        </div>
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'} p-4`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-4xl space-y-8">
              {/* Welcome Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Welcome to StudyAI
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your personal AI tutor designed to help you learn, practice, and excel in your studies.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsExamMode(true)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-orange-500" />
                      <CardTitle className="text-lg">Exam Mode</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Take practice tests and get instant feedback on your performance.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Study Groups</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Join virtual study sessions with other students in your field.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-lg">Quick Help</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Get instant answers to homework questions and concept explanations.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">Study Plan</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Create personalized study schedules based on your goals and timeline.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Input */}
              <div className="space-y-4">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <ActionButtons />
              </div>

              {/* Tips */}
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Ask Anything</h3>
                  <p className="text-sm text-muted-foreground">
                    From homework help to complex concepts - I'm here to explain it all.
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Practice Tests</h3>
                  <p className="text-sm text-muted-foreground">
                    Use Exam Mode to test your knowledge with realistic practice questions.
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Personalized Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailored explanations based on your academic level and learning style.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <div className="w-full max-w-3xl mx-auto space-y-4">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <div className="text-xs text-center text-muted-foreground">
                  StudyAI can make mistakes. Always verify important information with your textbooks or teachers.
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;