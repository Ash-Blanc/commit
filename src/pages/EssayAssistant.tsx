import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

const EssayAssistant = () => {
  const { essayId } = useParams<{ essayId: string }>();
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
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
	const [isEditorInitialized, setIsEditorInitialized] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

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

  const log = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
      setWordCount(editorRef.current.getContent({ format: 'text' }).split(' ').length);
    }
  };

  const handleEditorChange = (content: string, editor: any) => {
    setContent(content);
    setWordCount(editor.getContent({ format: 'text' }).split(' ').length);
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Essay Assistant</h1>
          <p className="text-muted-foreground">
            Craft your perfect college essay with our AI-powered tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Essay Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Essay Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Essay Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your essay prompt here."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Content</Label>
                  <Editor
                    apiKey="YOUR_API_KEY"
                    onInit={(evt, editor) => {
                      editorRef.current = editor
											setIsEditorInitialized(true)
										}}
                    value={content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span>Word Count: {wordCount}</span>
                  <Button onClick={log}>Log editor content</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Essay Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Essay Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
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
                  <Label htmlFor="application">Application</Label>
                  <Select value={applicationId} onValueChange={setApplicationId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.college_name} - {app.application_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSaveEssay}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : '💾 Save Essay'}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                  className="w-full"
                >
                  {isGeneratingIdeas ? 'Generating Ideas...' : '💡 Generate Ideas'}
                </Button>

                <Button
                  onClick={() => {
                    const element = document.getElementById('feedback-section');
                    if (element) {
                      (element as HTMLElement).click();
                    }
                  }}
                  className="w-full"
                >
                  Get AI Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Section */}
        {showAISection && (
          <section className="mt-8">
            <Card id="ai-section">
              <CardHeader>
                <CardTitle>AI Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {essayIdeas.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Essay Ideas</h2>
                    {essayIdeas.map((idea, index) => (
                      <Card key={index}>
                        <CardContent className="space-y-2">
                          <h3 className="text-lg font-medium">{idea.title}</h3>
                          <p className="text-muted-foreground">{idea.description}</p>
                          <Button onClick={() => handleGenerateOutline(idea.title)}>
                            {isGeneratingOutline ? 'Generating Outline...' : 'Generate Outline'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {essayOutline && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Essay Outline</h2>
                    <Card>
                      <CardContent className="space-y-2">
                        <h3 className="text-lg font-medium">Hook</h3>
                        <p className="text-muted-foreground">{essayOutline.hook.content}</p>
                        <h3 className="text-lg font-medium">Introduction</h3>
                        <p className="text-muted-foreground">{essayOutline.introduction.content}</p>
                        <h3 className="text-lg font-medium">Body Paragraphs</h3>
                        {essayOutline.body_paragraphs.map((paragraph, index) => (
                          <div key={index} className="space-y-1">
                            <h4 className="text-md font-medium">Paragraph {index + 1}</h4>
                            <p className="text-muted-foreground">{paragraph.content}</p>
                          </div>
                        ))}
                        <h3 className="text-lg font-medium">Conclusion</h3>
                        <p className="text-muted-foreground">{essayOutline.conclusion.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Feedback Section */}
        {showFeedbackSection && (
          <section className="mt-8" id="feedback-section">
            <Card>
              <CardHeader>
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {essayFeedback && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Feedback Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium">Overall Score</h3>
                        <p className="text-muted-foreground">
                          {essayFeedback.overall_score} / 100
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Strengths</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {essayFeedback.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Suggestions</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {essayFeedback.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Grammar Issues</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {essayFeedback.grammar_issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Authenticity Notes</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {essayFeedback.authenticity_notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
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
