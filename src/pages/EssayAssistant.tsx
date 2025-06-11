
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useEssays, EssayIdea, EssayOutline, EssayFeedback } from '@/hooks/useEssays';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EssayAssistant = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { essays, createEssay, updateEssay, generateIdeas, generateOutline, getFeedback } = useEssays();
  
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [currentEssayId, setCurrentEssayId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<EssayIdea[]>([]);
  const [outline, setOutline] = useState<EssayOutline | null>(null);
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const essayPrompts = [
    "Why do you want to attend this university?",
    "Describe a challenge you've overcome and what you learned from it.",
    "Tell us about a time you showed leadership.",
    "What are your academic and career goals?",
    "Describe your most meaningful extracurricular activity.",
    "How will you contribute to our campus community?",
    "Describe a time when you failed and what you learned from it."
  ];

  const handleGenerateIdeas = async () => {
    if (!selectedPrompt) {
      toast({
        title: "Select a prompt",
        description: "Please select an essay prompt first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedIdeas = await generateIdeas(selectedPrompt, profile);
      setIdeas(generatedIdeas);
      toast({
        title: "Ideas Generated!",
        description: `Generated ${generatedIdeas.length} essay ideas for you.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOutline = async (idea: EssayIdea) => {
    setIsGenerating(true);
    try {
      const generatedOutline = await generateOutline(idea.title, selectedPrompt, profile);
      setOutline(generatedOutline);
      toast({
        title: "Outline Generated!",
        description: "Your essay outline is ready to review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!essayContent.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please write some content first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const essayFeedback = await getFeedback(essayContent);
      setFeedback(essayFeedback);
      toast({
        title: "Analysis Complete!",
        description: "Your essay has been analyzed. Check the feedback panel.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEssay = async () => {
    if (!essayContent.trim() || !selectedPrompt) {
      toast({
        title: "Cannot save",
        description: "Please select a prompt and write some content.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentEssayId) {
        await updateEssay(currentEssayId, {
          content: essayContent,
          prompt: selectedPrompt,
        });
        toast({
          title: "Essay Updated",
          description: "Your essay has been saved successfully.",
        });
      } else {
        const newEssay = await createEssay({
          title: `Essay: ${selectedPrompt.substring(0, 50)}...`,
          content: essayContent,
          prompt: selectedPrompt,
          status: 'draft'
        });
        if (newEssay) {
          setCurrentEssayId(newEssay.id);
          toast({
            title: "Essay Saved",
            description: "Your essay has been created successfully.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save essay. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadEssay = (essay: any) => {
    setCurrentEssayId(essay.id);
    setEssayContent(essay.content || '');
    setSelectedPrompt(essay.prompt || '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Essay Assistant</h1>
          <p className="text-muted-foreground">
            Get personalized writing guidance with AI-powered brainstorming, outlining, and feedback.
          </p>
        </div>

        <Tabs defaultValue="write" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="brainstorm">Brainstorm</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="saved">Saved Essays</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Writing Interface */}
              <div className="lg:col-span-2 space-y-6">
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Write Your Essay</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleSaveEssay}>
                        💾 Save Essay
                      </Button>
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={!essayContent.trim() || isGenerating}
                        size="sm"
                      >
                        {isGenerating ? 'Analyzing...' : '🔍 Analyze Essay'}
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
                      placeholder="Start writing your essay here... Our AI will provide feedback as you develop your ideas."
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

              {/* Feedback Panel */}
              <div className="space-y-6">
                {feedback && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Essay Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-primary mb-2">{feedback.overall_score}</div>
                          <Badge variant="secondary">
                            {feedback.overall_score >= 85 ? 'Excellent' : 
                             feedback.overall_score >= 70 ? 'Good' : 
                             feedback.overall_score >= 55 ? 'Fair' : 'Needs Work'}
                          </Badge>
                        </div>
                        <Progress value={feedback.overall_score} className="mb-4" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {feedback.strengths.map((strength, index) => (
                            <div key={index} className="p-2 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-900">✓ {strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {feedback.suggestions.map((suggestion, index) => (
                            <div key={index} className="p-2 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-900">💡 {suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Major:</span>
                        <span className="font-medium">{profile?.intended_major || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GPA:</span>
                        <span className="font-medium">{profile?.gpa || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SAT:</span>
                        <span className="font-medium">{profile?.sat_score || 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="brainstorm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Essay Ideas Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select a prompt to generate ideas</label>
                    <div className="grid gap-2">
                      {essayPrompts.slice(0, 3).map((prompt, index) => (
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
                  </div>
                  
                  <Button 
                    onClick={handleGenerateIdeas}
                    disabled={!selectedPrompt || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? 'Generating Ideas...' : '💡 Generate Essay Ideas'}
                  </Button>

                  {ideas.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium">Generated Ideas:</h3>
                      {ideas.map((idea, index) => (
                        <Card key={index} className="cursor-pointer hover:bg-accent/50" onClick={() => handleGenerateOutline(idea)}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">{idea.title}</h4>
                            <p className="text-sm text-muted-foreground">{idea.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outline" className="space-y-6">
            {outline ? (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Essay Outline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-green-700 mb-2">{outline.hook.title}</h3>
                    <p className="text-sm">{outline.hook.content}</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-blue-700 mb-2">{outline.introduction.title}</h3>
                    <p className="text-sm">{outline.introduction.content}</p>
                  </div>
                  
                  {outline.body_paragraphs.map((paragraph, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium text-purple-700 mb-2">{paragraph.title}</h3>
                      <p className="text-sm">{paragraph.content}</p>
                    </div>
                  ))}
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-orange-700 mb-2">{outline.conclusion.title}</h3>
                    <p className="text-sm">{outline.conclusion.content}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Generate ideas first to create an outline</p>
                  <Button onClick={() => document.querySelector('[value="brainstorm"]')?.click()}>
                    Go to Brainstorm
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Saved Essays</CardTitle>
              </CardHeader>
              <CardContent>
                {essays.length > 0 ? (
                  <div className="space-y-3">
                    {essays.map((essay) => (
                      <Card key={essay.id} className="cursor-pointer hover:bg-accent/50" onClick={() => loadEssay(essay)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{essay.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {essay.word_count} words • {new Date(essay.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{essay.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No saved essays yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EssayAssistant;
