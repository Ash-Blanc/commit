import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const {
    isActive: isOnboardingActive,
    currentStep,
    steps,
    hasSeenOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    restartOnboarding
  } = useOnboarding();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'submitted': return 'Auto-Submitted';
      case 'in_progress': return 'Ready to Submit';
      case 'draft': return 'In Progress';
      default: return status;
    }
  };

  const submittedApps = applications.filter(app => app.status === 'submitted').length;
  const inProgressApps = applications.filter(app => app.status === 'in_progress').length;
  const totalTimesSaved = applications.length * 8; // Estimate 8 hours saved per application

  if (profileLoading || applicationsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome section with onboarding target */}
        <div className="mb-8" data-onboarding="welcome">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Welcome back, {profile?.first_name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                You've saved <span className="font-semibold text-green-600">{totalTimesSaved} hours</span> with Commit's automation. 
                <span className="font-semibold"> {applications.length}</span> applications in progress, <span className="font-semibold">{submittedApps}</span> auto-submitted!
              </p>
            </div>
            {hasSeenOnboarding && (
              <Button
                variant="outline"
                size="sm"
                onClick={restartOnboarding}
                className="flex items-center space-x-2 shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Tour</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Overview with onboarding target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-onboarding="stats">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold text-green-600">{totalTimesSaved} hours</p>
                  <p className="text-xs text-muted-foreground">vs traditional methods</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">⏰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-xs text-muted-foreground">{submittedApps} auto-submitted</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Strength</p>
                  <p className="text-2xl font-bold">{profile?.gpa ? Math.round(profile.gpa * 25) : 75}</p>
                  <p className="text-xs text-muted-foreground">GPA: {profile?.gpa || 'Not set'}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SAT Score</p>
                  <p className="text-2xl font-bold">{profile?.sat_score || 'Not set'}</p>
                  <p className="text-xs text-muted-foreground">Target: 1400+</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Application Tracker with onboarding target */}
          <Card data-onboarding="applications" className="xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Smart Application Tracker</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/college-search">Add College</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Automated form filling and submission tracking</p>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((app, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-base">{app.college?.name || 'Unknown College'}</h4>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusDisplay(app.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Status: {app.status}</span>
                        <span>Due: {app.college?.application_deadline || 'TBD'}</span>
                      </div>
                      <Progress value={app.status === 'submitted' ? 100 : app.status === 'in_progress' ? 75 : 25} className="mb-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">8 hours saved</span>
                        <span>Created: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No applications yet</p>
                    <Button asChild>
                      <Link to="/college-search">Start Your First Application</Link>
                    </Button>
                  </div>
                )}
              </div>
              {applications.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/applications">View All Applications</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Summary with onboarding target */}
          <Card data-onboarding="profile" className="xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Your Profile</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High School:</span>
                      <span className="font-medium">{profile?.high_school || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPA:</span>
                      <span className="font-medium">{profile?.gpa || 'Not set'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SAT Score:</span>
                      <span className="font-medium">{profile?.sat_score || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intended Major:</span>
                      <span className="font-medium">{profile?.intended_major || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Graduation Year:</span>
                      <span className="font-medium">{profile?.graduation_year || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions with onboarding target */}
        <div className="mt-8" data-onboarding="actions">
          <h2 className="text-xl lg:text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/college-search">
                <span className="text-3xl mb-2">🔍</span>
                <span className="text-sm font-medium">Find Colleges</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/essay-assistant">
                <span className="text-3xl mb-2">✍️</span>
                <span className="text-sm font-medium">Write Essays</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/profile">
                <span className="text-3xl mb-2">⚙️</span>
                <span className="text-sm font-medium">Update Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/applications">
                <span className="text-3xl mb-2">📋</span>
                <span className="text-sm font-medium">Applications</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/college-search">
                <span className="text-3xl mb-2">🎯</span>
                <span className="text-sm font-medium">College Match</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 lg:h-24 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors" asChild>
              <Link to="/essay-assistant">
                <span className="text-3xl mb-2">📈</span>
                <span className="text-sm font-medium">Progress</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Onboarding Tooltip */}
      {isOnboardingActive && (
        <OnboardingTooltip
          step={steps[currentStep]}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipOnboarding}
          isVisible={isOnboardingActive}
        />
      )}
    </div>
  );
};

export default Dashboard;
