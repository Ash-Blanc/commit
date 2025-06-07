
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const Applications = () => {
  const [applications] = useState([
    {
      id: 1,
      college: 'University of Florida',
      deadline: '2024-01-15',
      status: 'Auto-Submitted',
      progress: 100,
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: true, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: true, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 12,
      submissionDate: '2024-01-10'
    },
    {
      id: 2,
      college: 'Florida State University',
      deadline: '2024-01-20',
      status: 'Ready to Submit',
      progress: 95,
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: true, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: false, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 8,
      submissionDate: null
    },
    {
      id: 3,
      college: 'University of Central Florida',
      deadline: '2024-02-01',
      status: 'In Progress',
      progress: 75,
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: false, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: false, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 6,
      submissionDate: null
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Auto-Submitted': return 'bg-green-500';
      case 'Ready to Submit': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedRequirements = (requirements: any[]) => {
    return requirements.filter(req => req.completed).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Application Management</h1>
          <p className="text-muted-foreground">
            Track your college applications, manage requirements, and automate submissions. 
            Our AI handles form filling and document organization.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                    <div className="text-sm text-muted-foreground">Auto-Submitted</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">1</div>
                    <div className="text-sm text-muted-foreground">Ready to Submit</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">1</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">26</div>
                    <div className="text-sm text-muted-foreground">Hours Saved</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{app.college}</CardTitle>
                        <p className="text-muted-foreground">
                          Deadline: {app.deadline} ({getDaysUntilDeadline(app.deadline)} days)
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                        <p className="text-sm text-green-600 mt-1">{app.timesSaved} hours saved</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {completedRequirements(app.requirements)}/{app.requirements.length} completed
                        </span>
                      </div>
                      <Progress value={app.progress} />
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium">Requirements Checklist</h4>
                      {app.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox checked={req.completed} disabled />
                          <div className="flex-1">
                            <span className={req.completed ? 'line-through text-muted-foreground' : ''}>
                              {req.name}
                            </span>
                            {req.automated && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Auto-filled
                              </Badge>
                            )}
                          </div>
                          {!req.completed && (
                            <Button variant="outline" size="sm">
                              Complete
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      {app.status === 'Ready to Submit' && (
                        <Button className="bg-green-600 hover:bg-green-700">
                          🚀 Auto-Submit Application
                        </Button>
                      )}
                      {app.status === 'In Progress' && (
                        <Button variant="outline">
                          📝 Continue Application
                        </Button>
                      )}
                      {app.status === 'Auto-Submitted' && (
                        <Button variant="outline" disabled>
                          ✅ Submitted on {app.submissionDate}
                        </Button>
                      )}
                      <Button variant="outline">
                        👁️ View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Add More Colleges</h3>
                <p className="text-muted-foreground mb-4">
                  Expand your options by adding more colleges to your application list
                </p>
                <Button>➕ Add College Application</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications
                    .filter(app => app.status !== 'Auto-Submitted')
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{app.college}</h4>
                          <p className="text-sm text-muted-foreground">{app.deadline}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getDaysUntilDeadline(app.deadline) <= 7 ? "destructive" : "secondary"}>
                            {getDaysUntilDeadline(app.deadline)} days left
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Required Documents</h4>
                    <div className="space-y-2">
                      {['Official Transcripts', 'SAT/ACT Scores', 'Letters of Recommendation', 'Personal Essays'].map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <span>{doc}</span>
                          <Badge variant="secondary">Uploaded</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Upload New Documents</h4>
                    <Button variant="outline" className="w-full">
                      📎 Upload Documents
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Applications;
