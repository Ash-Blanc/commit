import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  Phone, 
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Send,
  Clock
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { geminiAI } from '@/services/geminiAIService';
import { toast } from '@/hooks/use-toast';

interface Communication {
  id: string;
  type: 'email' | 'phone' | 'interview' | 'visit';
  college_id: string;
  college_name: string;
  contact_person: string;
  contact_email: string;
  subject: string;
  content: string;
  date: string;
  status: 'sent' | 'received' | 'scheduled' | 'completed';
  follow_up_needed: boolean;
  follow_up_date?: string;
  ai_suggestions?: string[];
}

interface InterviewSchedule {
  id: string;
  college_id: string;
  college_name: string;
  interviewer_name: string;
  interviewer_email: string;
  date: string;
  time: string;
  type: 'alumni' | 'admissions' | 'virtual' | 'campus';
  location: string;
  preparation_notes: string;
  feedback_notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface LoginCredential {
  id: string;
  college_name: string;
  portal_url: string;
  username: string;
  password: string;
  notes: string;
  last_accessed: string;
}

const CommunicationHub = () => {
  const { applications } = useApplications();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [credentials, setCredentials] = useState<LoginCredential[]>([]);
  const [newCommunication, setNewCommunication] = useState<Partial<Communication>>({});
  const [newInterview, setNewInterview] = useState<Partial<InterviewSchedule>>({});
  const [newCredential, setNewCredential] = useState<Partial<LoginCredential>>({});
  const [aiDraftMode, setAiDraftMode] = useState(false);
  const [draftContext, setDraftContext] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadSampleData();
  }, [applications]);

  const loadSampleData = () => {
    // Load sample communications
    const sampleComms: Communication[] = applications.slice(0, 3).map((app, index) => ({
      id: `comm-${index}`,
      type: 'email' as const,
      college_id: app.college_id || '',
      college_name: app.college?.name || 'Unknown College',
      contact_person: 'Admissions Office',
      contact_email: 'admissions@college.edu',
      subject: 'Application Status Inquiry',
      content: 'I wanted to follow up on my application status...',
      date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
      status: index === 0 ? 'sent' : 'received',
      follow_up_needed: index === 1,
      follow_up_date: index === 1 ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] : undefined,
      ai_suggestions: [
        'Consider mentioning specific programs of interest',
        'Include your application ID for faster processing',
        'Express continued enthusiasm for the institution'
      ]
    }));

    setCommunications(sampleComms);

    // Load sample interviews
    const sampleInterviews: InterviewSchedule[] = applications.slice(0, 2).map((app, index) => ({
      id: `interview-${index}`,
      college_id: app.college_id || '',
      college_name: app.college?.name || 'Unknown College',
      interviewer_name: `Alumni Interviewer ${index + 1}`,
      interviewer_email: `interviewer${index + 1}@alumni.edu`,
      date: new Date(Date.now() + (index + 1) * 7 * 86400000).toISOString().split('T')[0],
      time: '14:00',
      type: 'alumni' as const,
      location: 'Virtual - Zoom',
      preparation_notes: '',
      feedback_notes: '',
      status: 'scheduled' as const
    }));

    setInterviews(sampleInterviews);

    // Load sample credentials
    const sampleCredentials: LoginCredential[] = applications.slice(0, 3).map((app, index) => ({
      id: `cred-${index}`,
      college_name: app.college?.name || 'Unknown College',
      portal_url: 'https://portal.college.edu',
      username: 'student@email.com',
      password: '••••••••',
      notes: 'Application portal access',
      last_accessed: new Date(Date.now() - index * 86400000).toISOString().split('T')[0]
    }));

    setCredentials(sampleCredentials);
  };

  const generateEmailDraft = async () => {
    if (!draftContext.trim()) {
      toast({
        title: "Context Required",
        description: "Please provide context for the email draft",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const draft = await geminiAI.generateContent(`
        Generate a professional college admissions email based on this context: "${draftContext}"
        
        The email should be:
        - Professional and respectful
        - Concise but informative
        - Appropriate for college admissions communication
        - Include a clear subject line
        
        Format as:
        Subject: [subject line]
        
        [email body]
      `);

      const lines = draft.split('\n');
      const subjectLine = lines.find(line => line.startsWith('Subject:'))?.replace('Subject:', '').trim() || 'Follow-up on Application';
      const emailBody = lines.filter(line => !line.startsWith('Subject:') && line.trim()).join('\n');

      setNewCommunication({
        ...newCommunication,
        subject: subjectLine,
        content: emailBody,
        type: 'email',
        date: new Date().toISOString().split('T')[0],
        status: 'sent'
      });

      toast({
        title: "Email Draft Generated",
        description: "AI has created a professional email draft for you",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate email draft",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateInterviewPrep = async (interviewId: string) => {
    setGenerating(true);
    try {
      const interview = interviews.find(i => i.id === interviewId);
      if (!interview) return;

      const prepGuide = await geminiAI.generateContent(`
        Generate interview preparation guidance for a college admissions interview at ${interview.college_name}.
        
        Include:
        1. Common questions to prepare for
        2. Questions to ask the interviewer
        3. Key points to emphasize about yourself
        4. Tips for virtual/in-person interview format
        
        Keep it concise and actionable.
      `);

      setInterviews(prev => 
        prev.map(i => 
          i.id === interviewId 
            ? { ...i, preparation_notes: prepGuide }
            : i
        )
      );

      toast({
        title: "Interview Prep Generated",
        description: "AI has created personalized interview preparation guidance",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate interview preparation",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const addCommunication = () => {
    if (!newCommunication.college_name || !newCommunication.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in college name and subject",
        variant: "destructive",
      });
      return;
    }

    const communication: Communication = {
      id: `comm-${Date.now()}`,
      type: newCommunication.type || 'email',
      college_id: newCommunication.college_id || '',
      college_name: newCommunication.college_name || '',
      contact_person: newCommunication.contact_person || 'Admissions Office',
      contact_email: newCommunication.contact_email || '',
      subject: newCommunication.subject || '',
      content: newCommunication.content || '',
      date: newCommunication.date || new Date().toISOString().split('T')[0],
      status: newCommunication.status || 'sent',
      follow_up_needed: false,
      ai_suggestions: []
    };

    setCommunications(prev => [communication, ...prev]);
    setNewCommunication({});
    setAiDraftMode(false);
    setDraftContext('');

    toast({
      title: "Communication Added",
      description: "Communication record has been saved",
    });
  };

  const addInterview = () => {
    if (!newInterview.college_name || !newInterview.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in college name and date",
        variant: "destructive",
      });
      return;
    }

    const interview: InterviewSchedule = {
      id: `interview-${Date.now()}`,
      college_id: newInterview.college_id || '',
      college_name: newInterview.college_name || '',
      interviewer_name: newInterview.interviewer_name || '',
      interviewer_email: newInterview.interviewer_email || '',
      date: newInterview.date || '',
      time: newInterview.time || '14:00',
      type: newInterview.type || 'alumni',
      location: newInterview.location || '',
      preparation_notes: '',
      feedback_notes: '',
      status: 'scheduled'
    };

    setInterviews(prev => [interview, ...prev]);
    setNewInterview({});

    toast({
      title: "Interview Scheduled",
      description: "Interview has been added to your schedule",
    });
  };

  const addCredential = () => {
    if (!newCredential.college_name || !newCredential.portal_url) {
      toast({
        title: "Missing Information",
        description: "Please fill in college name and portal URL",
        variant: "destructive",
      });
      return;
    }

    const credential: LoginCredential = {
      id: `cred-${Date.now()}`,
      college_name: newCredential.college_name || '',
      portal_url: newCredential.portal_url || '',
      username: newCredential.username || '',
      password: newCredential.password || '',
      notes: newCredential.notes || '',
      last_accessed: new Date().toISOString().split('T')[0]
    };

    setCredentials(prev => [credential, ...prev]);
    setNewCredential({});

    toast({
      title: "Credentials Saved",
      description: "Portal credentials have been securely stored",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-500';
      case 'received': return 'bg-green-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'interview': return <User className="h-4 w-4" />;
      case 'visit': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="communications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="credentials">Portal Access</TabsTrigger>
            </TabsList>

            <TabsContent value="communications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Add New Communication
                    <Button
                      variant="outline"
                      onClick={() => setAiDraftMode(!aiDraftMode)}
                    >
                      {aiDraftMode ? 'Manual Entry' : 'AI Draft'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiDraftMode && (
                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">AI Email Draft Assistant</h4>
                      <Textarea
                        placeholder="Describe what you want to communicate (e.g., 'Ask about application status', 'Thank for interview', 'Request information about financial aid')"
                        value={draftContext}
                        onChange={(e) => setDraftContext(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        onClick={generateEmailDraft}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? 'Generating Draft...' : 'Generate Email Draft'}
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">College</label>
                      <select
                        value={newCommunication.college_name || ''}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, college_name: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="">Select College</option>
                        {applications.map(app => (
                          <option key={app.id} value={app.college?.name || ''}>
                            {app.college?.name || 'Unknown College'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={newCommunication.type || 'email'}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="interview">Interview</option>
                        <option value="visit">Campus Visit</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Contact Person"
                      value={newCommunication.contact_person || ''}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, contact_person: e.target.value }))}
                    />
                    <Input
                      placeholder="Contact Email"
                      value={newCommunication.contact_email || ''}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, contact_email: e.target.value }))}
                    />
                  </div>

                  <Input
                    placeholder="Subject"
                    value={newCommunication.subject || ''}
                    onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                  />

                  <Textarea
                    placeholder="Content"
                    value={newCommunication.content || ''}
                    onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[120px]"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={newCommunication.date || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <select
                      value={newCommunication.status || 'sent'}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, status: e.target.value as any }))}
                      className="p-2 border rounded-md"
                    >
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <Button onClick={addCommunication} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Communication
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {communications.map((comm) => (
                  <Card key={comm.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getStatusColor(comm.status)}`}>
                            {getTypeIcon(comm.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{comm.college_name}</h4>
                            <p className="text-sm text-muted-foreground">{comm.contact_person}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(comm.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium">{comm.subject}</h5>
                        <p className="text-sm text-gray-600">{comm.content}</p>
                        
                        {comm.ai_suggestions && comm.ai_suggestions.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <h6 className="text-sm font-medium text-blue-800 mb-2">AI Suggestions:</h6>
                            <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                              {comm.ai_suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {comm.follow_up_needed && (
                          <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                              Follow-up needed by {comm.follow_up_date ? new Date(comm.follow_up_date).toLocaleDateString() : 'TBD'}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule New Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">College</label>
                      <select
                        value={newInterview.college_name || ''}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, college_name: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="">Select College</option>
                        {applications.map(app => (
                          <option key={app.id} value={app.college?.name || ''}>
                            {app.college?.name || 'Unknown College'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Interview Type</label>
                      <select
                        value={newInterview.type || 'alumni'}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="alumni">Alumni Interview</option>
                        <option value="admissions">Admissions Interview</option>
                        <option value="virtual">Virtual Interview</option>
                        <option value="campus">Campus Interview</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Interviewer Name"
                      value={newInterview.interviewer_name || ''}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer_name: e.target.value }))}
                    />
                    <Input
                      placeholder="Interviewer Email"
                      value={newInterview.interviewer_email || ''}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer_email: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="date"
                      value={newInterview.date || ''}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Input
                      type="time"
                      value={newInterview.time || '14:00'}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, time: e.target.value }))}
                    />
                    <Input
                      placeholder="Location/Platform"
                      value={newInterview.location || ''}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <Button onClick={addInterview} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {interviews.map((interview) => (
                  <Card key={interview.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{interview.college_name}</h4>
                          <p className="text-sm text-muted-foreground">{interview.interviewer_name}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(interview.date).toLocaleDateString()} at {interview.time}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> {interview.type}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {interview.location}
                          </div>
                        </div>

                        {interview.preparation_notes && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <h6 className="text-sm font-medium text-green-800 mb-2">Preparation Notes:</h6>
                            <p className="text-sm text-green-700 whitespace-pre-wrap">{interview.preparation_notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateInterviewPrep(interview.id)}
                            disabled={generating}
                          >
                            {generating ? 'Generating...' : 'AI Prep Guide'}
                          </Button>
                          {interview.interviewer_email && (
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Email Interviewer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Portal Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="College Name"
                      value={newCredential.college_name || ''}
                      onChange={(e) => setNewCredential(prev => ({ ...prev, college_name: e.target.value }))}
                    />
                    <Input
                      placeholder="Portal URL"
                      value={newCredential.portal_url || ''}
                      onChange={(e) => setNewCredential(prev => ({ ...prev, portal_url: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Username"
                      value={newCredential.username || ''}
                      onChange={(e) => setNewCredential(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newCredential.password || ''}
                      onChange={(e) => setNewCredential(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <Textarea
                    placeholder="Notes"
                    value={newCredential.notes || ''}
                    onChange={(e) => setNewCredential(prev => ({ ...prev, notes: e.target.value }))}
                  />

                  <Button onClick={addCredential} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Save Credentials
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {credentials.map((cred) => (
                  <Card key={cred.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{cred.college_name}</h4>
                          <p className="text-sm text-muted-foreground">{cred.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(cred.portal_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open Portal
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">URL:</span> {cred.portal_url}
                        </div>
                        <div>
                          <span className="font-medium">Last Accessed:</span> {new Date(cred.last_accessed).toLocaleDateString()}
                        </div>
                        {cred.notes && (
                          <div>
                            <span className="font-medium">Notes:</span> {cred.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationHub;