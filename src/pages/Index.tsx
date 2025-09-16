import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';

import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
import MessageList from '@/components/MessageList';
import ExamMode from '@/components/ExamMode';
import Navigation from '@/components/Navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy, Zap, Target, MessageCircle, GraduationCap } from 'lucide-react';

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

  const handleSendMessage = async (content: string, isExamMode?: boolean) => {
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
        const responses = isExamMode ? [
          // Exam mode responses with practice questions
          `**Practice Question: ${content}**

**Question 1:** What is the fundamental theorem of calculus?

**Answer:** The fundamental theorem of calculus establishes the connection between differentiation and integration. It states that:

1. **First Part (FTC1):** If f is continuous on [a,b] and F(x) = ∫[a to x] f(t)dt, then F'(x) = f(x)
2. **Second Part (FTC2):** If f is continuous on [a,b] and F is any antiderivative of f, then ∫[a to b] f(x)dx = F(b) - F(a)

**Explanation:** This theorem shows that differentiation and integration are inverse operations.

---

**Question 2:** Evaluate ∫ 2x dx from 0 to 3

**Answer:** 
- Antiderivative of 2x is x²
- Apply FTC2: [x²]₀³ = 3² - 0² = 9

**Practice Tip:** Always remember to apply the bounds after finding the antiderivative.

Would you like more practice questions on this topic?`,

          `**Practice Questions: ${content}**

**Multiple Choice Question:**
Which of the following best describes photosynthesis?

A) The process by which plants convert carbon dioxide and water into glucose using sunlight
B) The breakdown of glucose to release energy
C) The transport of nutrients in plants  
D) The reproduction process in plants

**Correct Answer:** A

**Explanation:** Photosynthesis is the process where plants use chlorophyll to capture sunlight energy and convert CO₂ and H₂O into glucose (C₆H₁₂O₆) and oxygen. The equation is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Key Points:**
- Occurs in chloroplasts
- Requires chlorophyll
- Produces oxygen as a byproduct
- Essential for life on Earth

**Follow-up Question:** What would happen to the rate of photosynthesis if light intensity decreased?`,

          `**History Practice: ${content}**

**Essay Question:** Analyze the causes of World War I.

**Sample Answer Framework:**

**Main Causes:**
1. **Imperialism** - Competition for colonies and resources
2. **Alliances** - Complex web of mutual defense treaties
3. **Militarism** - Arms race, especially naval between Britain and Germany  
4. **Nationalism** - Ethnic tensions in Balkans, pan-Slavism

**Immediate Trigger:**
- Assassination of Archduke Franz Ferdinand (June 28, 1914)
- Austria-Hungary's ultimatum to Serbia
- Domino effect of alliance obligations

**Critical Analysis:**
The war wasn't caused by a single event but by underlying tensions that made conflict inevitable. The alliance system turned a regional dispute into a world war.

**Practice Writing Prompt:** How did the alliance system contribute to the escalation of WWI? Use specific examples.`
        ] : [
          // Regular chat responses
          "Great question! Let me break this down step by step to help you understand...",
          "I can see you're working on this concept. Here's how I'd approach it...",
          "This is a common area where students need extra practice. Let me explain...",
          "Perfect! You're on the right track. Let me add some additional context...",
          "I notice this might be challenging. Let me provide a simpler explanation first..."
        ];

        const randomResponse = isExamMode ? 
          responses[Math.floor(Math.random() * responses.length)] :
          `${responses[Math.floor(Math.random() * responses.length)]}\n\nBased on your question about "${content}", here are the key points:\n\n1. **Understanding the concept**: This relates to fundamental principles you've learned\n2. **Step-by-step approach**: Break it down into smaller, manageable parts\n3. **Practice application**: Try similar problems to reinforce your learning\n\nWould you like me to provide some practice questions on this topic?`;
        const assistantMessage: Message = {
          role: 'assistant',
          content: randomResponse,
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
        <div className="border-b bg-card border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chakra-blue-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">StudyAI</h1>
                <Badge variant="outline" className="text-xs mt-1">Powered by AI</Badge>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'} p-6`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-6xl space-y-12 animate-fade-in">
              {/* Welcome Section */}
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-chakra-blue-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-chakra-blue-400 bg-clip-text text-transparent">
                  Welcome to StudyAI
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Your intelligent AI tutor designed to help you learn, practice, and excel in your studies. 
                  Get personalized explanations, take practice tests, and master any subject.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="chakra-card p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => setIsExamMode(true)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-chakra-yellow-400 to-orange-500">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Exam Mode</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Take practice tests and get instant feedback with detailed explanations for every answer.
                  </CardDescription>
                </CardContent>
              </div>

              <div className="chakra-card p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-chakra-blue-400 to-chakra-blue-600">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Study Groups</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Join virtual study sessions with other students in your field and collaborate on difficult topics.
                  </CardDescription>
                </CardContent>
              </div>

              <div className="chakra-card p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-chakra-green-400 to-chakra-green-500">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Quick Help</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Get instant answers to homework questions with step-by-step explanations and examples.
                  </CardDescription>
                </CardContent>
              </div>

              <div className="chakra-card p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-chakra-purple-400 to-purple-600">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Study Plan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Create personalized study schedules based on your goals, timeline, and learning preferences.
                  </CardDescription>
                </CardContent>
              </div>
              </div>

              {/* Chat Input */}
              <div className="space-y-6">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <ActionButtons />
              </div>

              {/* Tips */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card to-accent/20 border border-border">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Ask Anything</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    From homework help to complex concepts - I'm here to explain it all with detailed, personalized responses.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card to-accent/20 border border-border">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Practice Tests</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use Exam Mode to test your knowledge with realistic practice questions and instant feedback.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card to-accent/20 border border-border">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Personalized Learning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tailored explanations based on your academic level, learning style, and progress.
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