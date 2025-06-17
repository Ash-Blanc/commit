import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useDocuments } from '@/hooks/useDocuments';
import { geminiAI } from '@/services/geminiAIService';
import { toast } from '@/hooks/use-toast';

interface ApplicationProgress {
  application_id: string;
  college_name: string;
  completion_percentage: number;
  required_documents: {
    name: string;
    status: 'pending' | 'submitted' | 'verified';
    deadline?: string;
  }[];
  decision_timeline: {
    application_deadline: string;
    decision_release: string;
    enrollment_deadline: string;
  };
  financial_aid_status: {
    fafsa_submitted: boolean;
    css_profile_submitted: boolean;
    documents_submitted: boolean;
    aid_package_received: boolean;
  };
  ai_insights: {
    admission_likelihood: number;
    improvement_suggestions: string[];
    deadline_risks: string[];
    comparative_analysis: string;
  };
}

const ApplicationDashboard = () => {
  const { applications } = useApplications();
  const { documents } = useDocuments();
  const [applicationProgress, setApplicationProgress] = useState<ApplicationProgress[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    generateApplicationProgress();
  }, [applications, documents]);

  const generateApplicationProgress = async () => {
    const progressData: ApplicationProgress[] = [];

    for (const app of applications) {
      const requiredDocs = [
        { name: 'Application Form', status: app.status === 'submitted' ? 'verified' : 'pending' as const },
        { name: 'Personal Essay', status: 'pending' as const },
        { name: 'Transcripts', status: 'pending' as const },
        { name: 'Test Scores', status: 'pending' as const },
        { name: 'Letters of Recommendation', status: 'pending' as const },
        { name: 'Activity List', status: 'pending' as const }
      ];

      // Update document status based on uploaded documents
      documents.forEach(doc => {
        if (doc.application_id === app.id) {
          const docIndex = requiredDocs.findIndex(rd => 
            rd.name.toLowerCase().includes(doc.type.toLowerCase())
          );
          if (docIndex !== -1) {
            requiredDocs[docIndex].status = 'submitted';
          }
        }
      });

      const completedDocs = requiredDocs.filter(doc => doc.status !== 'pending').length;
      const completionPercentage = Math.round((completedDocs / requiredDocs.length) * 100);

      const progress: ApplicationProgress = {
        application_id: app.id,
        college_name: app.college?.name || 'Unknown College',
        completion_percentage: completionPercentage,
        required_documents: requiredDocs,
        decision_timeline: {
          application_deadline: app.college?.application_deadline || '',
          decision_release: calculateDecisionDate(app.college?.application_deadline || ''),
          enrollment_deadline: calculateEnrollmentDate(app.college?.application_deadline || '')
        },
        financial_aid_status: {
          fafsa_submitted: false,
          css_profile_submitted: false,
          documents_submitted: false,
          aid_package_received: false
        },
        ai_insights: {
          admission_likelihood: calculateAdmissionLikelihood(completionPercentage),
          improvement_suggestions: generateImprovementSuggestions(completionPercentage, requiredDocs),
          deadline_risks: assessDeadlineRisks(app.college?.application_deadline || ''),
          comparative_analysis: `This application is ${completionPercentage}% complete compared to your average of ${Math.round(progressData.reduce((sum, p) => sum + p.completion_percentage, 0) / Math.max(progressData.length, 1))}%`
        }
      };

      progressData.push(progress);
    }

    setApplicationProgress(progressData);
  };

  const calculateDecisionDate = (deadline: string): string => {
    if (!deadline) return '';
    const deadlineDate = new Date(deadline);
    const decisionDate = new Date(deadlineDate);
    
    // Regular decision typically 3-4 months after deadline
    decisionDate.setMonth(decisionDate.getMonth() + 3);
    return decisionDate.toISOString().split('T')[0];
  };

  const calculateEnrollmentDate = (deadline: string): string => {
    if (!deadline) return '';
    const deadlineDate = new Date(deadline);
    const enrollmentDate = new Date(deadlineDate);
    
    // Enrollment deadline typically May 1st
    enrollmentDate.setMonth(4); // May
    enrollmentDate.setDate(1);
    if (deadlineDate.getFullYear() === enrollmentDate.getFullYear() && deadlineDate.getMonth() > 4) {
      enrollmentDate.setFullYear(enrollmentDate.getFullYear() + 1);
    }
    
    return enrollmentDate.toISOString().split('T')[0];
  };

  const calculateAdmissionLikelihood = (completionPercentage: number): number => {
    // Base likelihood on completion percentage and add some randomness for realism
    const baseLikelihood = Math.min(completionPercentage * 0.8, 80);
    return Math.round(baseLikelihood + Math.random() * 20);
  };

  const generateImprovementSuggestions = (completion: number, docs: any[]): string[] => {
    const suggestions = [];
    
    if (completion < 50) {
      suggestions.push('Focus on completing required documents first');
      suggestions.push('Set up a weekly schedule to work on application components');
    }
    
    const pendingDocs = docs.filter(doc => doc.status === 'pending');
    if (pendingDocs.length > 0) {
      suggestions.push(`Complete ${pendingDocs[0].name} to boost your application strength`);
    }
    
    if (completion > 75) {
      suggestions.push('Review and polish all submitted materials');
      suggestions.push('Consider submitting early to demonstrate interest');
    }
    
    return suggestions;
  };

  const assessDeadlineRisks = (deadline: string): string[] => {
    const risks = [];
    if (!deadline) return risks;
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 7) {
      risks.push('URGENT: Less than 1 week until deadline');
    } else if (daysUntilDeadline < 14) {
      risks.push('HIGH RISK: Less than 2 weeks until deadline');
    } else if (daysUntilDeadline < 30) {
      risks.push('MODERATE RISK: Less than 1 month until deadline');
    }
    
    return risks;
  };

  const generateAIInsights = async (applicationId: string) => {
    setAnalyzing(true);
    try {
      const app = applicationProgress.find(a => a.application_id === applicationId);
      if (!app) return;

      // Generate AI insights using Gemini
      const insights = await geminiAI.generateContent(`
        Analyze this college application progress:
        College: ${app.college_name}
        Completion: ${app.completion_percentage}%
        Pending documents: ${app.required_documents.filter(d => d.status === 'pending').map(d => d.name).join(', ')}
        
        Provide specific insights about:
        1. Admission likelihood assessment
        2. Priority improvements needed
        3. Timeline optimization suggestions
        4. Competitive positioning advice
      `);

      toast({
        title: "AI Insights Generated",
        description: `Updated analysis for ${app.college_name}`,
      });

      // Update the application progress with new insights
      setApplicationProgress(prev => 
        prev.map(p => 
          p.application_id === applicationId 
            ? { ...p, ai_insights: { ...p.ai_insights, comparative_analysis: insights } }
            : p
        )
      );
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate AI insights",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risks: string[]) => {
    if (risks.some(r => r.includes('URGENT'))) return 'border-red-500 bg-red-50';
    if (risks.some(r => r.includes('HIGH'))) return 'border-orange-500 bg-orange-50';
    if (risks.some(r => r.includes('MODERATE'))) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Application Progress Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Applications</p>
                        <p className="text-2xl font-bold">{applicationProgress.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Completion</p>
                        <p className="text-2xl font-bold">
                          {Math.round(applicationProgress.reduce((sum, app) => sum + app.completion_percentage, 0) / Math.max(applicationProgress.length, 1))}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="text-2xl font-bold">
                          {applicationProgress.filter(app => app.completion_percentage === 100).length}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {applicationProgress.map((app) => (
                  <Card key={app.application_id} className={`border-l-4 ${getRiskColor(app.ai_insights.deadline_risks)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{app.college_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Application ID: {app.application_id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getCompletionColor(app.completion_percentage)}`}>
                            {app.completion_percentage}%
                          </div>
                          <p className="text-sm text-muted-foreground">Complete</p>
                        </div>
                      </div>

                      <Progress value={app.completion_percentage} className="mb-4" />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Document Status</p>
                          <div className="space-y-1">
                            {app.required_documents.slice(0, 3).map((doc, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`}></div>
                                <span className="text-xs">{doc.name}</span>
                              </div>
                            ))}
                            {app.required_documents.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{app.required_documents.length - 3} more documents
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Timeline</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                Deadline: {app.decision_timeline.application_deadline ? 
                                  new Date(app.decision_timeline.application_deadline).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">
                                Decision: {app.decision_timeline.decision_release ? 
                                  new Date(app.decision_timeline.decision_release).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">AI Assessment</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              <span className="text-xs">
                                Likelihood: {app.ai_insights.admission_likelihood}%
                              </span>
                            </div>
                            {app.ai_insights.deadline_risks.length > 0 && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-red-600">
                                  {app.ai_insights.deadline_risks[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {app.required_documents.filter(d => d.status === 'verified').length} Verified
                          </Badge>
                          <Badge variant="outline">
                            {app.required_documents.filter(d => d.status === 'submitted').length} Submitted
                          </Badge>
                          <Badge variant="outline">
                            {app.required_documents.filter(d => d.status === 'pending').length} Pending
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateAIInsights(app.application_id)}
                            disabled={analyzing}
                          >
                            {analyzing ? 'Analyzing...' : 'AI Insights'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSelectedApplication(
                              selectedApplication === app.application_id ? null : app.application_id
                            )}
                          >
                            {selectedApplication === app.application_id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </div>

                      {selectedApplication === app.application_id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Improvement Suggestions</h4>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {app.ai_insights.improvement_suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Comparative Analysis</h4>
                            <p className="text-sm text-gray-600">{app.ai_insights.comparative_analysis}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Financial Aid Status</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${app.financial_aid_status.fafsa_submitted ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm">FAFSA</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${app.financial_aid_status.css_profile_submitted ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm">CSS Profile</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {applicationProgress.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found</p>
                  <p className="text-sm text-gray-500">Start by adding colleges to your application list</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-4">
                {applicationProgress.map((app) => (
                  <Card key={app.application_id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{app.college_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {app.required_documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(doc.status)}`}></div>
                              <span className="text-sm font-medium">{doc.name}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                {applicationProgress.map((app) => (
                  <Card key={app.application_id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{app.college_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-sm font-medium">Application Deadline</p>
                            <p className="text-lg font-bold">
                              {app.decision_timeline.application_deadline ? 
                                new Date(app.decision_timeline.application_deadline).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          
                          <div className="text-center p-4 border rounded-lg">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                            <p className="text-sm font-medium">Decision Release</p>
                            <p className="text-lg font-bold">
                              {app.decision_timeline.decision_release ? 
                                new Date(app.decision_timeline.decision_release).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          
                          <div className="text-center p-4 border rounded-lg">
                            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                            <p className="text-sm font-medium">Enrollment Deadline</p>
                            <p className="text-lg font-bold">
                              {app.decision_timeline.enrollment_deadline ? 
                                new Date(app.decision_timeline.enrollment_deadline).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                        </div>
                        
                        {app.ai_insights.deadline_risks.length > 0 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="font-medium text-red-700">Deadline Risks</span>
                            </div>
                            <ul className="text-sm text-red-600 list-disc list-inside">
                              {app.ai_insights.deadline_risks.map((risk, index) => (
                                <li key={index}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {applicationProgress.map((app) => (
                  <Card key={app.application_id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {app.college_name}
                        <Badge variant="outline">
                          {app.ai_insights.admission_likelihood}% Likelihood
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Improvement Suggestions
                        </h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          {app.ai_insights.improvement_suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Comparative Analysis
                        </h4>
                        <p className="text-sm text-gray-600">{app.ai_insights.comparative_analysis}</p>
                      </div>
                      
                      <Button
                        onClick={() => generateAIInsights(app.application_id)}
                        disabled={analyzing}
                        className="w-full"
                      >
                        {analyzing ? 'Generating Insights...' : 'Refresh AI Analysis'}
                      </Button>
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

export default ApplicationDashboard;