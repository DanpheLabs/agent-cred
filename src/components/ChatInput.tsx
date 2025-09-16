import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, GraduationCap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatInputProps {
  onSend: (message: string, isExamMode?: boolean) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSend, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isExamMode, setIsExamMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message, isExamMode);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleExamMode = () => {
    setIsExamMode(!isExamMode);
  };

  return (
    <div className="relative flex w-full flex-col items-center animate-fade-in">
      {/* Exam Mode Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant={isExamMode ? "default" : "secondary"}
          onClick={toggleExamMode}
          className="flex items-center gap-2 h-8 px-3 rounded-full transition-all duration-200"
        >
          {isExamMode ? (
            <GraduationCap className="h-4 w-4" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">
            {isExamMode ? "Exam Mode" : "Chat Mode"}
          </span>
        </Button>
        {isExamMode && (
          <Badge variant="outline" className="text-xs animate-scale-in">
            Practice Questions & Answers
          </Badge>
        )}
      </div>

      {/* Input Container */}
      <div className="relative w-full">
        <div className="relative flex items-end bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isExamMode 
                ? "Ask for practice questions on any topic..." 
                : "Message StudyAI..."
            }
            className="flex-1 resize-none bg-transparent px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none"
            style={{ maxHeight: "200px", minHeight: "44px" }}
            disabled={isLoading}
          />
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !message.trim()}
            className="absolute right-2 bottom-2 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Character count and tips */}
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="text-xs text-muted-foreground">
            {isExamMode ? (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Exam mode will provide practice questions with detailed explanations
              </span>
            ) : (
              "Press Enter to send, Shift+Enter for new line"
            )}
          </div>
          {message.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {message.length}/2000
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;