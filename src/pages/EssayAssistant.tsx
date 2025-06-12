
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useEssays } from '@/hooks/useEssays';
import { useGemini, EssayIdea, EssayFeedback } from '@/hooks/useGemini';
import { useApplications } from '@/hooks/useApplications';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Sparkles, 
  FileText, 
  Save, 
  Lightbulb, 
  MessageSquare, 
  Target,
  Clock,
  BookOpen,
  CheckCircle
} from 'lucide-react';

const EssayAssistant = () => {
  const { essayId } = useParams<{ essayId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('draft');
  const [wordCount, setWordCount] = useState(0);
  const [applicationId, setApplicationId] = useState('');
  const [essayIdeas, setEssayIdeas] = useState<EssayIdea[]>([]);
  const [essayFeedback, setEssayFeedback] = useState<EssayFeedback | null>(null);
  const [showAISection, setShowAISection] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'ideas' | 'feedback'>('write');

  const {
    essays,
    loading: essayLoading,
    fetchEssays,
    createEssay,
    updateEssay,
  } = useEssays();
  
  const { applications } = useApplications();
  
  const {
    loading: geminiLoading,
    error: geminiError,
    generateEssayIdeas,
    getEssayFeedback
  } = useGemini();

  useEffect(() => {
    if (essayId) {
      const essay = essays.find((essay) => essay.id === essayId);
      if (essay) {
        setTitle(essay.title);
        setPrompt(essay.prompt || '');
        setContent(essay.content || '');
        setStatus(essay.status);
        setWordCount(essay.word_count);
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
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const ideas = await generateEssayIdeas(prompt);
      setEssayIdeas(ideas);
      setShowAISection(true);
      setActiveTab('ideas');
      
      toast({
        title: "Ideas Generated!",
        description: `Generated ${ideas.length} unique essay ideas for you.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetFeedback = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write some content to get feedback.",
        variant: "destructive",
      });
      return;
    }

    try {
      const feedback = await getEssayFeedback(content);
      setEssayFeedback(feedback);
      setActiveTab('feedback');
      
      toast({
        title: "Feedback Ready!",
        description: "AI analysis of your essay is complete.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEssay = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title to save the essay.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (essayId) {
        await updateEssay(essayId, {
          title,
          prompt,
          content,
          status,
          word_count: wordCount,
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
          application_id: applicationId,
        });
        if (newEssay) {
          toast({
            title: "Success!",
            description: "Essay created successfully.",
          });
          navigate(`/essay-assistant/${newEssay.id}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'in_progress': return 60;
      default: return 20;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Essay Assistant
          </h1>
          <p className="text-xl text-muted-foreground">
            Craft compelling essays with AI-powered guidance and feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="xl:col-span-3 space-y-6">
            {/* Essay Tabs */}
            <div className="flex space-x-2 bg-white/80 p-2 rounded-2xl backdrop-blur-sm border">
              <button
                onClick={() => setActiveTab('write')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'write' 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Write
              </button>
              <button
                onClick={() => setActiveTab('ideas')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'ideas' 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Ideas ({essayIdeas.length})
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'feedback' 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </button>
            </div>

            {/* Essay Editor */}
            {activeTab === 'write' && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FileText className="h-6 w-6 mr-2 text-primary" />
                    Essay Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-base font-medium">Essay Title</Label>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Enter essay title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 h-12 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-base font-medium">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">Essay Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Paste your essay prompt here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-2 min-h-[100px] text-base"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-base font-medium">Essay Content</Label>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="px-3 py-1">
                          {wordCount} words
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                          <span className="text-sm text-muted-foreground capitalize">{status}</span>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Start writing your essay here..."
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="min-h-[500px] text-base leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleGenerateIdeas}
                        disabled={geminiLoading || !prompt}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        {geminiLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Generate Ideas
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleGetFeedback}
                        disabled={geminiLoading || !content}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        {geminiLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Get AI Feedback
                          </>
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleSaveEssay}
                      disabled={essayLoading}
                      className="px-6 py-3"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {essayLoading ? 'Saving...' : 'Save Essay'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Essay Ideas */}
            {activeTab === 'ideas' && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Lightbulb className="h-6 w-6 mr-2 text-primary" />
                    AI-Generated Essay Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {essayIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {essayIdeas.map((idea, index) => (
                        <Card key={idea.id} className="border border-primary/20 hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <h3 className="text-lg font-semibold text-primary">{idea.title}</h3>
                              <p className="text-muted-foreground">{idea.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {idea.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-3"
                                onClick={() => {
                                  setTitle(idea.title);
                                  setActiveTab('write');
                                }}
                              >
                                Use This Idea
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Ideas Generated Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Enter a prompt and click "Generate Ideas" to get AI-powered essay suggestions.
                      </p>
                      <Button onClick={() => setActiveTab('write')}>
                        Go to Editor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Essay Feedback */}
            {activeTab === 'feedback' && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                    AI Feedback & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {essayFeedback ? (
                    <div className="space-y-6">
                      {/* Overall Score */}
                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {essayFeedback.overall_score}/100
                        </div>
                        <p className="text-muted-foreground">Overall Essay Score</p>
                        <Progress value={essayFeedback.overall_score} className="mt-4 max-w-md mx-auto" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <Card className="border-green-200 bg-green-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {essayFeedback.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-green-800">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <Card className="border-blue-200 bg-blue-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-700 flex items-center">
                              <Target className="h-5 w-5 mr-2" />
                              Suggestions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {essayFeedback.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-blue-800">{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Grammar Issues */}
                      {essayFeedback.grammar_issues.length > 0 && (
                        <Card className="border-orange-200 bg-orange-50/50">
                          <CardHeader>
                            <CardTitle className="text-lg text-orange-700">Grammar & Style</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {essayFeedback.grammar_issues.map((issue, index) => (
                                <li key={index} className="text-sm text-orange-800">• {issue}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Authenticity Notes */}
                      <Card className="border-purple-200 bg-purple-50/50">
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-700">Authenticity & Voice</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {essayFeedback.authenticity_notes.map((note, index) => (
                              <li key={index} className="text-sm text-purple-800">• {note}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Feedback Available</h3>
                      <p className="text-muted-foreground mb-6">
                        Write some content and click "Get AI Feedback" to receive detailed analysis.
                      </p>
                      <Button onClick={() => setActiveTab('write')}>
                        Go to Editor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Progress Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Essay Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{getStatusProgress(status)}%</span>
                  </div>
                  <Progress value={getStatusProgress(status)} />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Word count:</span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ideas generated:</span>
                    <span className="font-medium">{essayIdeas.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleGenerateIdeas}
                  disabled={geminiLoading || !prompt}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Ideas
                </Button>
                <Button
                  onClick={handleGetFeedback}
                  disabled={geminiLoading || !content}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Feedback
                </Button>
                <Button
                  onClick={handleSaveEssay}
                  disabled={essayLoading}
                  className="w-full justify-start"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Essay
                </Button>
              </CardContent>
            </Card>

            {/* Application Link */}
            {applications.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Link to Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={applicationId} onValueChange={setApplicationId}>
                    <SelectTrigger>
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
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-white/70 rounded-lg">
                  <p className="font-medium text-blue-700 mb-1">Show, Don't Tell</p>
                  <p className="text-muted-foreground">Use specific examples and anecdotes to illustrate your points.</p>
                </div>
                <div className="p-3 bg-white/70 rounded-lg">
                  <p className="font-medium text-green-700 mb-1">Be Authentic</p>
                  <p className="text-muted-foreground">Write in your own voice and share genuine experiences.</p>
                </div>
                <div className="p-3 bg-white/70 rounded-lg">
                  <p className="font-medium text-purple-700 mb-1">Start Strong</p>
                  <p className="text-muted-foreground">Hook the reader with a compelling opening sentence.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EssayAssistant;
