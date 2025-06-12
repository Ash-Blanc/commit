
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Target, 
  Upload,
  Plus,
  Eye,
  Send,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';

const Applications = () => {
  const [applications] = useState([
    {
      id: 1,
      college: 'University of Florida',
      deadline: '2024-01-15',
      status: 'Auto-Submitted',
      progress: 100,
      priority: 'Match',
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: true, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: true, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 12,
      submissionDate: '2024-01-10',
      applicationFee: 30,
      estimatedCost: 45000
    },
    {
      id: 2,
      college: 'Florida State University',
      deadline: '2024-01-20',
      status: 'Ready to Submit',
      progress: 95,
      priority: 'Match',
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: true, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: false, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 8,
      submissionDate: null,
      applicationFee: 30,
      estimatedCost: 42000
    },
    {
      id: 3,
      college: 'University of Central Florida',
      deadline: '2024-02-01',
      status: 'In Progress',
      progress: 75,
      priority: 'Safety',
      requirements: [
        { name: 'Application Form', completed: true, automated: true },
        { name: 'Personal Essay', completed: false, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: false, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 6,
      submissionDate: null,
      applicationFee: 30,
      estimatedCost: 38000
    },
    {
      id: 4,
      college: 'Stanford University',
      deadline: '2024-01-05',
      status: 'Draft',
      progress: 45,
      priority: 'Reach',
      requirements: [
        { name: 'Application Form', completed: false, automated: true },
        { name: 'Personal Essay', completed: false, automated: false },
        { name: 'Transcripts', completed: true, automated: true },
        { name: 'Letters of Recommendation', completed: false, automated: false },
        { name: 'SAT Scores', completed: true, automated: true }
      ],
      timesSaved: 3,
      submissionDate: null,
      applicationFee: 90,
      estimatedCost: 75000
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Auto-Submitted': return 'bg-green-500 text-white';
      case 'Ready to Submit': return 'bg-blue-500 text-white';
      case 'In Progress': return 'bg-yellow-500 text-white';
      case 'Draft': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Reach': return 'bg-red-100 text-red-800';
      case 'Match': return 'bg-green-100 text-green-800';
      case 'Safety': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getDeadlineUrgency = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'normal';
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return getDaysUntilDeadline(app.deadline) <= 7 && app.status !== 'Auto-Submitted';
    if (filter === 'ready') return app.status === 'Ready to Submit';
    if (filter === 'completed') return app.status === 'Auto-Submitted';
    return app.priority.toLowerCase() === filter;
  });

  const totalApplicationFees = applications.reduce((sum, app) => sum + app.applicationFee, 0);
  const totalEstimatedCosts = applications.reduce((sum, app) => sum + app.estimatedCost, 0);
  const averageCost = totalEstimatedCosts / applications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Application Management</h1>
              <p className="text-muted-foreground">
                Track your college applications, manage requirements, and automate submissions with AI assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Filter Applications:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'ready', label: 'Ready' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'reach', label: 'Reach' },
                    { value: 'match', label: 'Match' },
                    { value: 'safety', label: 'Safety' }
                  ].map((filterOption) => (
                    <Button
                      key={filterOption.value}
                      variant={filter === filterOption.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(filterOption.value)}
                      className="text-xs"
                    >
                      {filterOption.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <Link to="/college-search">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {applications.filter(app => app.status === 'Auto-Submitted').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Submitted</div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {applications.filter(app => app.status === 'Ready to Submit').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Ready</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {applications.filter(app => getDaysUntilDeadline(app.deadline) <= 7 && app.status !== 'Auto-Submitted').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Urgent</div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {applications.reduce((sum, app) => sum + app.timesSaved, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Hours Saved</div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.map((app) => {
                const urgency = getDeadlineUrgency(app.deadline);
                const daysLeft = getDaysUntilDeadline(app.deadline);
                
                return (
                  <Card key={app.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{app.college}</CardTitle>
                            <Badge className={getPriorityColor(app.priority)}>
                              {app.priority}
                            </Badge>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {app.deadline}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className={urgency === 'urgent' ? 'text-red-600 font-medium' : urgency === 'soon' ? 'text-yellow-600' : ''}>
                                {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span className="text-green-600">{app.timesSaved} hours saved</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">Application Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {completedRequirements(app.requirements)}/{app.requirements.length} completed
                          </span>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Requirements Checklist
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {app.requirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <Checkbox checked={req.completed} disabled />
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm ${req.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                  {req.name}
                                </span>
                                {req.automated && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    AI-Filled
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Application Fee:</span>
                            <span className="font-medium ml-2">${app.applicationFee}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Est. Annual Cost:</span>
                            <span className="font-medium ml-2">${app.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {app.status === 'Ready to Submit' && (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Send className="w-4 h-4 mr-2" />
                            Auto-Submit Application
                          </Button>
                        )}
                        {app.status === 'In Progress' && (
                          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Continue Application
                          </Button>
                        )}
                        {app.status === 'Draft' && (
                          <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Start Application
                          </Button>
                        )}
                        {app.status === 'Auto-Submitted' && (
                          <Button variant="outline" disabled>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Submitted {app.submissionDate}
                          </Button>
                        )}
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/essay-assistant`}>
                            <FileText className="w-4 h-4 mr-2" />
                            Write Essay
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredApplications.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-6">
                    {filter === 'all' ? 'Start your college application journey today!' : 'No applications match the current filter.'}
                  </p>
                  <Button asChild>
                    <Link to="/college-search">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Application
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="deadlines">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications
                    .filter(app => app.status !== 'Auto-Submitted')
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .map((app) => {
                      const daysLeft = getDaysUntilDeadline(app.deadline);
                      const urgency = getDeadlineUrgency(app.deadline);
                      
                      return (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${urgency === 'urgent' ? 'bg-red-500' : urgency === 'soon' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            <div>
                              <h4 className="font-medium">{app.college}</h4>
                              <p className="text-sm text-muted-foreground">{app.deadline}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={urgency === 'urgent' ? "destructive" : urgency === 'soon' ? "default" : "secondary"}>
                              {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">{app.progress}% complete</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Document Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Required Documents</h4>
                    <div className="space-y-3">
                      {['Official Transcripts', 'SAT/ACT Scores', 'Letters of Recommendation', 'Personal Essays', 'Financial Aid Forms'].map((doc, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{doc}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Uploaded</Badge>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Upload New Documents</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium mb-2">Drop files here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                    </div>
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">${totalApplicationFees}</div>
                      <div className="text-sm text-muted-foreground">Total Application Fees</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${Math.round(averageCost).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Average Annual Cost</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Cost Breakdown by School</h4>
                    {applications.map(app => (
                      <div key={app.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{app.college}</span>
                        <span className="text-green-600">${app.estimatedCost.toLocaleString()}/year</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    Application Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {['Reach', 'Match', 'Safety'].map(type => {
                      const count = applications.filter(app => app.priority === type).length;
                      const percentage = (count / applications.length) * 100;
                      
                      return (
                        <div key={type} className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold mb-1">{count}</div>
                          <div className="text-sm text-muted-foreground mb-2">{type} Schools</div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">AI Recommendations</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          💡 Consider adding 1-2 more safety schools to balance your list
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-900">
                          ✅ Good balance of reach and match schools
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-900">
                          ⏰ Focus on completing Stanford application first (earliest deadline)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Applications;
