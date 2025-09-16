import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Crown, Zap, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = (plan: string) => {
    toast({
      title: "Subscription Started!",
      description: `Welcome to StudyAI ${plan} plan! Your account has been upgraded.`,
    });
  };

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started with AI-powered learning",
      features: [
        "10 AI conversations per day",
        "Basic study assistance", 
        "Standard response speed",
        "Community support"
      ],
      icon: BookOpen,
      popular: false
    },
    {
      name: "Student",
      price: { monthly: 9.99, annual: 99.99 },
      description: "Essential tools for serious students",
      features: [
        "Unlimited AI conversations",
        "Exam mode with practice tests",
        "Personalized study plans",
        "Priority response speed",
        "Advanced explanations",
        "Study progress tracking",
        "Email support"
      ],
      icon: Zap,
      popular: true
    },
    {
      name: "Premium",
      price: { monthly: 19.99, annual: 199.99 },
      description: "Advanced features for academic excellence",
      features: [
        "Everything in Student plan",
        "AI tutoring sessions",
        "Custom learning paths",
        "Research paper assistance",
        "Multiple subject expertise",
        "Group study features",
        "Priority support",
        "Advanced analytics"
      ],
      icon: Crown,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <h1 className="text-2xl font-semibold">Pricing</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your Learning Journey
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock your academic potential with AI-powered personalized learning
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={!isAnnual ? "font-medium" : "text-muted-foreground"}>
              Monthly
            </span>
            <Button
              variant="outline"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-12 rounded-full p-0"
            >
              <div className={`absolute w-5 h-5 rounded-full bg-primary transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </Button>
            <span className={isAnnual ? "font-medium" : "text-muted-foreground"}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            const period = isAnnual ? 'year' : 'month';
            
            return (
              <Card key={plan.name} className={`relative ${
                plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground">
                        /{period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-8">
            What's Included
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Smart Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Adaptive AI that learns your style and adjusts explanations to match your understanding level.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Exam Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Practice tests with instant feedback and detailed explanations to help you ace your exams.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Personalized Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Custom learning journeys tailored to your goals, pace, and academic requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a student discount?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Student plan is already designed with students in mind! We also offer additional discounts for verified students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What subjects are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We support all major academic subjects including Math, Science, History, Literature, Languages, and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;