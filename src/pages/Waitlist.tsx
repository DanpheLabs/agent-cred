import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  use_case: z.string().trim().max(1000, "Use case must be less than 1000 characters").optional(),
});

const Waitlist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    use_case: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const validation = waitlistSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("waitlist").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          use_case: formData.use_case.trim() || null,
        },
      ]);

      if (error) throw error;

      toast.success("Thank you for joining the waitlist!");
      setFormData({ name: "", email: "", use_case: "" });
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4">
              Join the <span className="gradient-text">Waitlist</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Be the first to know when we launch new features and get early access to AgentCred.
            </p>
          </div>

          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-normal">Sign Up</CardTitle>
              <CardDescription>
                Fill out the form below to join our waitlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className={errors.name ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className={errors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="use_case">
                    What do you plan to use it for? <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="use_case"
                    value={formData.use_case}
                    onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                    placeholder="Tell us about your use case..."
                    className={errors.use_case ? "border-destructive" : ""}
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {errors.use_case && (
                    <p className="text-sm text-destructive">{errors.use_case}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="glass p-6 glow-hover">
              <h3 className="text-xl font-normal mb-2">Early Access</h3>
              <p className="text-muted-foreground text-sm">
                Get priority access to new features before anyone else
              </p>
            </div>
            <div className="glass p-6 glow-hover">
              <h3 className="text-xl font-normal mb-2">Exclusive Updates</h3>
              <p className="text-muted-foreground text-sm">
                Receive updates about our progress and launch timeline
              </p>
            </div>
            <div className="glass p-6 glow-hover">
              <h3 className="text-xl font-normal mb-2">Community</h3>
              <p className="text-muted-foreground text-sm">
                Join a community of innovators building the future
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Waitlist;
