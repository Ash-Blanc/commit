
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Target, TrendingUp, Bell, FileText, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useNotifications } from '@/hooks/useNotifications';
import Navbar from '@/components/Navbar';
import NotificationCenter from '@/components/NotificationCenter';
import PersonalizationForm from '@/components/PersonalizationForm';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { applications } = useApplications();
  const { sendNotification } = useNotifications();
  const [showPersonalization, setShowPersonalization] = useState(false);

  const completedApplications = applications.filter(app => app.status === 'submitted').length;
  const inProgressApplications = applications.filter(app => app.status === 'draft').length;
  const profileCompleteness = profile ? 85 : 0;

  const upcomingDeadlines = applications
    .filter(app => app.college?.application_deadline)
    .sort((a, b) => new Date(a.college?.application_deadline || '').getTime() - new Date(b.college?.application_deadline || '').getTime())
    .slice(0, 3);

  const handleTestNotification = () => {
    sendNotification(
      'Welcome to College Assistant!',
      'Your personalized college application journey starts here. Complete your profile to get better recommendations.',
      'success',
      true
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.first_name || user?.email}!
              </h1>
              <p className="text-muted-foreground">
                Track your college applications and get AI-powered guidance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Button onClick={handleTestNotification} variant="outline" size="sm">
                Test Notification
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-green-600">{completedApplications}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{inProgressApplications}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile</p>
                  <p className="text-2xl font-bold">{profileCompleteness}%</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>✅ Basic Information</span>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>✅ Academic Records</span>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>⏳ Personalization</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPersonalization(true)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No applications yet</p>
                    <Button>Start Your First Application</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{app.college?.name || 'College Name'}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {app.status}
                          </p>
                        </div>
                        <Badge 
                          variant={app.status === 'submitted' ? 'default' : 'secondary'}
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((app) => (
                      <div key={app.id} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{app.college?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {app.college?.application_deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  📝 Write New Essay
                </Button>
                <Button className="w-full" variant="outline">
                  🎯 Get Recommendations
                </Button>
                <Button className="w-full" variant="outline">
                  📊 View Analytics
                </Button>
                <Button className="w-full" variant="outline">
                  💡 AI Assistant
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Tips & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900">
                      💡 Complete your personalization to get better college matches
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-900">
                      🎯 Add safety schools to improve your chances
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-900">
                      ⏰ Start your essays early for better quality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PersonalizationForm 
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
      />
    </div>
  );
};

export default Dashboard;
