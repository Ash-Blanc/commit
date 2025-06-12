
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useEssays, Essay, EssayIdea, EssayOutline, EssayFeedback } from '@/hooks/useEssays';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Brain, Lightbulb, FileText, MessageSquare, Save, Sparkles, Target, BookOpen } from 'lucide-react';

const EssayAssistant = () => {
  const { essayId } = useParams<{ essayId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('draft');
  const [wordCount, setWordCount] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [essayIdeas, setEssayIdeas] = useState<EssayIdea[]>([]);
  const [essayOutline, setEssayOutline] = useState<EssayOutline | null>(null);
  const [essayFeedback, setEssayFeedback] = useState<EssayFeedback | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAISection, setShowAISection] = useState(false);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);

  const {
    essays,
    loading,
    fetchEssays,
    createEssay,
    updateEssay,
    generateIdeas,
    generateOutline,
    getFeedback,
  } = useEssays();
  const { applications } = useApplications();
  const { profile } = useProfile();

  useEffect(() => {
    if (essayId) {
      const essay = essays.find((essay) => essay.id === essayId);
      if (essay) {
        setTitle(essay.title);
        setPrompt(essay.prompt || '');
        setContent(essay.content || '');
        setStatus(essay.status);
        setWordCount(essay.word_count);
        setAiFeedback(essay.ai_feedback || '');
        setApplicationId(essay.application_id || '');
      }
    }
  }, [essayId, essays]);

  useEffect(() => {
    fetchEssays();
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
    setWordCount(value.split(' ').filter(word => word.length > 0).length);
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      if (!prompt) {
        toast({
          title: "Error",
          description: "Please enter a prompt to generate ideas.",
          variant: "destructive",
        });
        return;
      }
      if (!profile) {
        toast({
          title: "Error",
          description: "Please complete your profile to generate ideas.",
          variant: "destructive",
        });
        return;
      }
      const ideas = await generateIdeas(prompt, profile);
      setEssayIdeas(ideas);
      setShowAISection(true);
      toast({
        title: "Success!",
        description: "AI has generated creative essay ideas for you.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGenerateOutline = async (topic: string) => {
    setIsGeneratingOutline(true);
    try {
      if (!prompt) {
        toast({
          title: "Error",
          description: "Please enter a prompt to generate an outline.",
          variant: "destructive",
        });
        return;
      }
      if (!profile) {
        toast({
          title: "Error",
          description: "Please complete your profile to generate an outline.",
          variant: "destructive",
        });
        return;
      }
      const outline = await generateOutline(topic, prompt, profile);
      setEssayOutline(outline);
      setShowAISection(true);
      toast({
        title: "Success!",
        description: "AI has created a detailed outline for your essay.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleGetFeedback = async () => {
    setIsGettingFeedback(true);
    try {
      if (!content) {
        toast({
          title: "Error",
          description: "Please enter content to get feedback.",
          variant: "destructive",
        });
        return;
      }
      const feedback = await getFeedback(content);
      setEssayFeedback(feedback);
      setAiFeedback(JSON.stringify(feedback, null, 2));
      setShowFeedbackSection(true);
      toast({
        title: "Success!",
        description: "AI has analyzed your essay and provided detailed feedback.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGettingFeedback(false);
    }
  };

  const handleSaveEssay = async () => {
    setIsSaving(true);
    try {
      if (!title) {
        toast({
          title: "Error",
          description: "Please enter a title to save the essay.",
          variant: "destructive",
        });
        return;
      }
      if (essayId) {
        await updateEssay(essayId, {
          title,
          prompt,
          content,
          status,
          word_count: wordCount,
          ai_feedback: aiFeedback,
          application_id: applicationId,
        });
        toast({
          title: "Success!",
          description: "Essay updated successfully.",
        });
      } else {
        const newEssay = await createEssay({
          title,
          prompt,
          content,
          status,
          word_count: wordCount,
          ai_feedback: aiFeedback,
          application_id: applicationId,
        });
        if (newEssay) {
          toast({
            title: "Success!",
            description: "Essay created successfully.",
          });
          navigate(`/essay/${newEssay.id}`);
        } else {
          toast({
            title: "Error",
            description: "Failed to create essay. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Essay Assistant</h1>
              <p className="text-muted-foreground">
                Craft your perfect college essay with our AI-powered tools powered by Gemini AI.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Essay Editor */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Essay Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">Essay Title</Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter a compelling title for your essay..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="prompt" className="text-base font-medium">Essay Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Paste your college essay prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Essay Content</Label>
                  <Textarea
                    placeholder="Start writing your essay here... Use the AI tools on the right to get ideas, outlines, and feedback!"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="min-h-[500px] resize-none mt-2 text-base leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Word Count: <span className="text-blue-600">{wordCount}</span></span>
                    <Badge variant={wordCount >= 650 ? "default" : "secondary"}>
                      {wordCount >= 650 ? "Good Length" : "Keep Writing"}
                    </Badge>
                  </div>
                  <Button
                    onClick={handleSaveEssay}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Essay'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Tools Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Essay Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Essay Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="application">Link to Application</Label>
                  <Select value={applicationId} onValueChange={setApplicationId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.college_id} - {app.application_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Assistant
                  <Badge variant="secondary" className="ml-auto">Gemini AI</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {isGeneratingIdeas ? 'Generating Ideas...' : 'Generate Essay Ideas'}
                </Button>

                <Button
                  onClick={handleGetFeedback}
                  disabled={isGettingFeedback}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isGettingFeedback ? 'Analyzing...' : 'Get AI Feedback'}
                </Button>

                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> Fill out your profile and add a prompt to get personalized AI suggestions!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Generated Content Section */}
        {showAISection && (
          <section className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI Generated Content
                  <Badge className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600">Powered by Gemini</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {essayIdeas.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Essay Ideas
                    </h2>
                    <div className="grid gap-4">
                      {essayIdeas.map((idea, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="space-y-3 p-6">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-medium text-blue-900">{idea.title}</h3>
                              <Badge variant="outline" className="ml-2">Idea {index + 1}</Badge>
                            </div>
                            <p className="text-muted-foreground">{idea.description}</p>
                            {idea.why_compelling && (
                              <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                                <strong>Why compelling:</strong> {idea.why_compelling}
                              </p>
                            )}
                            <Button 
                              onClick={() => handleGenerateOutline(idea.title)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              {isGeneratingOutline ? 'Generating...' : 'Generate Outline'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {essayOutline && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Essay Outline
                    </h2>
                    <Card className="bg-white">
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-3">
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="text-lg font-medium text-yellow-900 mb-2">🎯 Hook</h3>
                            <p className="text-muted-foreground">{essayOutline.hook.content}</p>
                          </div>
                          
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">📖 Introduction</h3>
                            <p className="text-muted-foreground">{essayOutline.introduction.content}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-lg font-medium text-green-900">📝 Body Paragraphs</h3>
                            {essayOutline.body_paragraphs.map((paragraph, index) => (
                              <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="text-md font-medium text-green-800 mb-2">Paragraph {index + 1}</h4>
                                <p className="text-muted-foreground">{paragraph.content}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h3 className="text-lg font-medium text-purple-900 mb-2">🏁 Conclusion</h3>
                            <p className="text-muted-foreground">{essayOutline.conclusion.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* AI Feedback Section */}
        {showFeedbackSection && essayFeedback && (
          <section className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  AI Feedback & Analysis
                  <Badge className="ml-auto bg-gradient-to-r from-green-600 to-blue-600">Detailed Analysis</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {essayFeedback.overall_score}/100
                      </div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-green-700 mb-2">💪 Strengths</h3>
                      <ul className="text-sm space-y-1">
                        {essayFeedback.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index} className="text-muted-foreground">• {strength}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-blue-700 mb-2">💡 Suggestions</h3>
                      <ul className="text-sm space-y-1">
                        {essayFeedback.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index} className="text-muted-foreground">• {suggestion}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-purple-700 mb-2">✨ Authenticity</h3>
                      <ul className="text-sm space-y-1">
                        {essayFeedback.authenticity_notes.slice(0, 3).map((note, index) => (
                          <li key={index} className="text-muted-foreground">• {note}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {essayFeedback.grammar_issues.length > 0 && (
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-red-700 mb-3">🔍 Grammar & Style Issues</h3>
                      <ul className="space-y-2">
                        {essayFeedback.grammar_issues.map((issue, index) => (
                          <li key={index} className="text-sm text-muted-foreground bg-red-50 p-2 rounded">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default EssayAssistant;
