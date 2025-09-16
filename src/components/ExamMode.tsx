import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

interface ExamModeProps {
  onExit: () => void;
}

const ExamMode = ({ onExit }: ExamModeProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock exam questions
  const examQuestions: Question[] = [
    {
      id: 1,
      question: "What is the derivative of f(x) = 3x² + 2x - 1?",
      options: ["6x + 2", "6x - 2", "3x + 2", "6x² + 2x"],
      correctAnswer: 0,
      explanation: "Using the power rule: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0. Therefore, f'(x) = 6x + 2.",
      difficulty: 'medium',
      subject: 'Calculus'
    },
    {
      id: 2,
      question: "Which of the following is NOT a principle of evolution?",
      options: ["Natural Selection", "Genetic Drift", "Gene Flow", "Spontaneous Generation"],
      correctAnswer: 3,
      explanation: "Spontaneous generation is a disproven theory that life can arise from non-living matter. The other options are all valid mechanisms of evolution.",
      difficulty: 'easy',
      subject: 'Biology'
    },
    {
      id: 3,
      question: "What was the primary cause of World War I?",
      options: ["Assassination of Archduke Franz Ferdinand", "German invasion of Belgium", "Rise of nationalism", "Complex system of alliances"],
      correctAnswer: 3,
      explanation: "While the assassination was the immediate trigger, the complex system of alliances in Europe was the primary underlying cause that turned a regional conflict into a world war.",
      difficulty: 'hard',
      subject: 'History'
    },
    {
      id: 4,
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 4", "x = 6", "x = 8", "x = 9"],
      correctAnswer: 0,
      explanation: "Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.",
      difficulty: 'easy',
      subject: 'Algebra'
    },
    {
      id: 5,
      question: "What is the atomic number of Carbon?",
      options: ["4", "6", "8", "12"],
      correctAnswer: 1,
      explanation: "The atomic number represents the number of protons in an atom's nucleus. Carbon has 6 protons, so its atomic number is 6.",
      difficulty: 'easy',
      subject: 'Chemistry'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
    
    const correctAnswers = examQuestions.filter((q, index) => 
      selectedAnswers[index] === q.correctAnswer
    ).length;
    
    const percentage = Math.round((correctAnswers / examQuestions.length) * 100);
    
    toast({
      title: "Exam Submitted!",
      description: `You scored ${percentage}% (${correctAnswers}/${examQuestions.length})`,
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeLeft(1800);
    setIsSubmitted(false);
    setShowResults(false);
  };

  const correctAnswers = examQuestions.filter((q, index) => 
    selectedAnswers[index] === q.correctAnswer
  ).length;
  
  const percentage = examQuestions.length > 0 ? Math.round((correctAnswers / examQuestions.length) * 100) : 0;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Exam Results</h2>
          <div className="flex gap-2">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
            <Button onClick={onExit}>Exit Exam Mode</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{percentage}%</div>
              <p className="text-muted-foreground">
                {correctAnswers} out of {examQuestions.length} questions correct
              </p>
              <Progress value={percentage} className="w-full max-w-md mx-auto" />
              
              <div className="flex justify-center">
                <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                  {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {examQuestions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={`border-l-4 ${
                isCorrect ? 'border-l-green-500' : 'border-l-red-500'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Question {index + 1}
                    <Badge variant="outline" className="ml-2">
                      {question.difficulty}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{question.subject}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={`p-3 rounded border ${
                        optionIndex === question.correctAnswer 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                          : optionIndex === userAnswer && !isCorrect
                          ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                          : 'bg-muted/50'
                      }`}>
                        <div className="flex items-center gap-2">
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Practice Exam</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
          <Button onClick={onExit} variant="outline">Exit</Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {examQuestions.length}
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / examQuestions.length) * 100} />
        </CardContent>
      </Card>

      {/* Current Question */}
      {examQuestions[currentQuestion] && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Question {currentQuestion + 1}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {examQuestions[currentQuestion].subject}
                </Badge>
                <Badge variant={
                  examQuestions[currentQuestion].difficulty === 'easy' ? 'secondary' :
                  examQuestions[currentQuestion].difficulty === 'medium' ? 'default' : 'destructive'
                }>
                  {examQuestions[currentQuestion].difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium">
              {examQuestions[currentQuestion].question}
            </p>

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
              disabled={isSubmitted}
            >
              {examQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {examQuestions.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              variant={currentQuestion === index ? "default" : "outline"}
              size="sm"
              className={`w-8 h-8 p-0 ${
                selectedAnswers[index] !== undefined ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {currentQuestion === examQuestions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={isSubmitted}>
            Submit Exam
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === examQuestions.length - 1}
          >
            Next
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">
                {Object.keys(selectedAnswers).length}
              </p>
              <p className="text-sm text-muted-foreground">Answered</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {examQuestions.length - Object.keys(selectedAnswers).length}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
              <p className="text-sm text-muted-foreground">Time Left</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamMode;