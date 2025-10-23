import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, Network, Users, Zap, Shield } from "lucide-react";

export default function UseCases() {
  const useCases = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "High-Frequency Trading Bots",
      description: "Enable autonomous trading agents with secure fund delegation. Set daily limits and maintain full control while your bot executes trades at lightning speed.",
      features: [
        "Millisecond-level transaction execution",
        "Automated risk management with spending limits",
        "Real-time transaction monitoring"
      ]
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Agents & Assistants",
      description: "Give your AI agents the ability to make payments autonomously while maintaining strict oversight through the hotkey/coldkey architecture.",
      features: [
        "Autonomous payment capabilities",
        "Built-in approval workflows",
        "Transparent transaction history"
      ]
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Autonomous Systems",
      description: "Build self-operating systems that can handle payments without constant human intervention, perfect for IoT devices and automated services.",
      features: [
        "24/7 unattended operation",
        "Configurable spending guardrails",
        "Emergency override capabilities"
      ]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Key Delegation",
      description: "Safely delegate payment authority to team members or services while retaining ultimate control through your coldkey wallet.",
      features: [
        "Multi-level permission system",
        "Revocable access at any time",
        "Complete audit trail"
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "DAO Treasury Management",
      description: "Empower DAO operations with programmatic treasury access while maintaining decentralized governance and security.",
      features: [
        "Proposal-based fund allocation",
        "Transparent spending records",
        "Community oversight built-in"
      ]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automated Services",
      description: "Enable subscription services, automated payroll, or recurring payments with smart agents that handle routine financial tasks.",
      features: [
        "Scheduled payment execution",
        "Flexible approval thresholds",
        "Integration-ready API"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 gradient-text">Use Cases</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how AgentPay's hotkey/coldkey architecture powers secure, autonomous payment systems across diverse applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="glass p-6 rounded-2xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                    {useCase.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {useCase.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Key Features:</p>
                  <ul className="space-y-1">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 glass p-8 rounded-2xl border-border/50 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              AgentPay provides the infrastructure you need to build secure, autonomous payment systems. 
              Get started with our SDK and bring your use case to life.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/sdk" 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold glow-hover inline-block"
              >
                View SDK
              </a>
              <a 
                href="/docs" 
                className="px-6 py-3 rounded-lg glass border-border/50 hover:border-primary/50 font-semibold inline-block"
              >
                Read Docs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
