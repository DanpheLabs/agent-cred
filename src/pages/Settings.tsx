import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, BookOpen, Award, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    academicLevel: 'high_school',
    depthOfUnderstanding: 'intermediate',
    pastGrades: 'B+',
    temperature: 0.7,
    inputTokens: 2048,
    outputTokens: 1024,
    enableExamMode: true,
    studyReminders: true,
    favoriteSubjects: '',
    learningGoals: ''
  });

  const handleSave = () => {
    localStorage.setItem('studentSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Academic Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Academic Profile
              </CardTitle>
              <CardDescription>
                Tell us about your educational background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="academic-level">Academic Level</Label>
                <Select
                  value={settings.academicLevel}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, academicLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="middle_school">Middle School</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="understanding-depth">Depth of Understanding</Label>
                <Select
                  value={settings.depthOfUnderstanding}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, depthOfUnderstanding: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="past-grades">Past Academic Performance</Label>
                <Select
                  value={settings.pastGrades}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, pastGrades: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your average grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+ (90-100%)</SelectItem>
                    <SelectItem value="A">A (85-89%)</SelectItem>
                    <SelectItem value="B+">B+ (80-84%)</SelectItem>
                    <SelectItem value="B">B (75-79%)</SelectItem>
                    <SelectItem value="C+">C+ (70-74%)</SelectItem>
                    <SelectItem value="C">C (65-69%)</SelectItem>
                    <SelectItem value="Below C">Below C (&lt;65%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI Assistant Configuration
              </CardTitle>
              <CardDescription>
                Customize how the AI responds to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Response Creativity (Temperature: {settings.temperature})</Label>
                <Slider
                  value={[settings.temperature]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, temperature: value[0] }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower = More precise, Higher = More creative
                </p>
              </div>

              <div className="space-y-3">
                <Label>Input Token Limit: {settings.inputTokens}</Label>
                <Slider
                  value={[settings.inputTokens]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, inputTokens: value[0] }))}
                  max={4096}
                  min={512}
                  step={256}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Output Token Limit: {settings.outputTokens}</Label>
                <Slider
                  value={[settings.outputTokens]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, outputTokens: value[0] }))}
                  max={2048}
                  min={256}
                  step={128}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Study Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="exam-mode">Enable Exam Mode</Label>
                <Switch
                  id="exam-mode"
                  checked={settings.enableExamMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableExamMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="study-reminders">Study Reminders</Label>
                <Switch
                  id="study-reminders"
                  checked={settings.studyReminders}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, studyReminders: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favorite-subjects">Favorite Subjects</Label>
                <Input
                  id="favorite-subjects"
                  placeholder="Math, Science, History..."
                  value={settings.favoriteSubjects}
                  onChange={(e) => setSettings(prev => ({ ...prev, favoriteSubjects: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>
                What do you want to achieve?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="learning-goals">Describe your goals</Label>
                <Textarea
                  id="learning-goals"
                  placeholder="I want to improve my math skills for calculus next year..."
                  rows={4}
                  value={settings.learningGoals}
                  onChange={(e) => setSettings(prev => ({ ...prev, learningGoals: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;