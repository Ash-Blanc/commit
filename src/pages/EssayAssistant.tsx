
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const EssayAssistant = () => {
  const { user } = useAuth();
  const [essayContent, setEssayContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const essayPrompts = [
    "Why do you want to attend this university?",
    "Describe a challenge you've overcome and what you learned from it.",
    "Tell us about a time you showed leadership.",
    "What are your academic and career goals?",
    "Describe your most meaningful extracurricular activity."
  ];

  const analysisResults = {
    overallScore: 85,
    clarity: 90,
    engagement: 80,
    authenticity: 85,
    grammar: 95,
    wordCount: 347,
    suggestions: [
      "Consider adding more specific examples from your experience",
      "The conclusion could be stronger - tie back to your opening",
      "Great use of descriptive language in paragraph 2",
      "Consider varying your sentence structure more"
    ]
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Essay Analysis Complete!",
        description: "Your essay has been analyzed and scored. Check the feedback panel.",
      });
    }, 2000);
  };

  const handleGenerateIdeas = () => {
    const ideas = [
      "Start with a compelling personal anecdote",
      "Focus on your unique perspective on computer science",
      "Mention specific programs or professors at the university",
      "Connect your extracurricular activities to your academic goals"
    ];
    
    toast({
      title: "Ideas Generated!",
      description: `Here are some brainstorming ideas based on your profile.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Essay Assistant</h1>
          <p className="text-muted-foreground">
            Get personalized writing guidance tailored for mid-tier universities. 
            Our AI analyzes your writing style and provides targeted feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Essay Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Choose an Essay Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {essayPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant={selectedPrompt === prompt ? "default" : "outline"}
                      className="text-left h-auto p-3 justify-start"
                      onClick={() => setSelectedPrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Writing Area */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Write Your Essay</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateIdeas}>
                    💡 Generate Ideas
                  </Button>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!essayContent.trim() || isAnalyzing}
                    size="sm"
                  >
                    {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Essay'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedPrompt && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Selected Prompt:</p>
                    <p className="text-blue-800">{selectedPrompt}</p>
                  </div>
                )}
                <Textarea
                  placeholder="Start writing your essay here... Our AI will provide real-time suggestions as you type."
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  className="min-h-[400px] text-base leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>Words: {essayContent.split(' ').filter(word => word).length}</span>
                  <span>Characters: {essayContent.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* AI Score */}
            <Card>
              <CardHeader>
                <CardTitle>AI Essay Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary mb-2">{analysisResults.overallScore}</div>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Clarity</span>
                      <span>{analysisResults.clarity}%</span>
                    </div>
                    <Progress value={analysisResults.clarity} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement</span>
                      <span>{analysisResults.engagement}%</span>
                    </div>
                    <Progress value={analysisResults.engagement} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Authenticity</span>
                      <span>{analysisResults.authenticity}%</span>
                    </div>
                    <Progress value={analysisResults.authenticity} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Grammar</span>
                      <span>{analysisResults.grammar}%</span>
                    </div>
                    <Progress value={analysisResults.grammar} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Match */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Major:</span>
                    <span className="font-medium">{user?.profile?.intendedMajor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <span className="font-medium">{user?.profile?.gpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SAT:</span>
                    <span className="font-medium">{user?.profile?.satScore}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Tailor Essay to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EssayAssistant;
