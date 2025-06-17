import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Target, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ApplicationTimeline from '@/components/ApplicationTimeline';
import DocumentAnalyzer from '@/components/DocumentAnalyzer';
import ApplicationDashboard from '@/components/ApplicationDashboard';
import CommunicationHub from '@/components/CommunicationHub';
import DecisionTracker from '@/components/DecisionTracker';
import { useApplications } from '@/hooks/useApplications';
import { useDocuments } from '@/hooks/useDocuments';

const ApplicationManagement = () => {
  const { applications } = useApplications();
  const { documents } = useDocuments();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabStats = () => {
    const totalApplications = applications.length;
    const submittedApplications = applications.filter(app => app.status === 'submitted').length;
    const totalDocuments = documents.length;
    const upcomingDeadlines = applications.filter(app => {
      if (!app.college?.application_deadline) return false;
      const deadline = new Date(app.college.application_deadline);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return deadline >= today && deadline <= thirtyDaysFromNow;
    }).length;

    return {
      totalApplications,
      submittedApplications,
      totalDocuments,
      upcomingDeadlines
    };
  };

  const stats = getTabStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Application Management System
          </h1>
          <p className="text-xl text-slate-600">
            Comprehensive AI-powered college application management and tracking
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-3xl font-bold text-green-600">{stats.submittedApplications}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalDocuments}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.upcomingDeadlines}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Target className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="communication" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  Communication
                </TabsTrigger>
                <TabsTrigger 
                  value="decisions" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4" />
                  Decisions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Application Progress Dashboard</h2>
                  <p className="text-muted-foreground">
                    Monitor your application progress, completion status, and AI-powered insights
                  </p>
                </div>
                <ApplicationDashboard />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Timeline Management</h2>
                  <p className="text-muted-foreground">
                    Track deadlines, set reminders, and manage your application timeline
                  </p>
                </div>
                <ApplicationTimeline />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Document Organization & AI Analysis</h2>
                  <p className="text-muted-foreground">
                    Upload, organize, and get AI-powered analysis of your application documents
                  </p>
                </div>
                <DocumentAnalyzer />
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Communication Hub</h2>
                  <p className="text-muted-foreground">
                    Manage correspondence, schedule interviews, and track portal credentials
                  </p>
                </div>
                <CommunicationHub />
              </TabsContent>

              <TabsContent value="decisions" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Decision & Financial Aid Tracking</h2>
                  <p className="text-muted-foreground">
                    Track decisions, compare financial aid packages, and make informed choices
                  </p>
                </div>
                <DecisionTracker />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Weekly AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Priority Actions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Complete Stanford essay by this Friday</li>
                  <li>• Request recommendation from Ms. Johnson</li>
                  <li>• Submit FAFSA for early deadline schools</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Application Strengths</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Strong academic profile (GPA: 3.8+)</li>
                  <li>• Diverse extracurricular activities</li>
                  <li>• Well-balanced school list</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">Improvement Areas</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Strengthen essay narrative flow</li>
                  <li>• Add more safety schools</li>
                  <li>• Schedule alumni interviews</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ApplicationManagement;