
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for demo
  const applications = [
    { name: 'University of Florida', status: 'Auto-Submitted', progress: 100, deadline: '2024-01-15', timesSaved: 12 },
    { name: 'Florida State University', status: 'Ready to Submit', progress: 95, deadline: '2024-01-20', timesSaved: 8 },
    { name: 'University of Central Florida', status: 'In Progress', progress: 75, deadline: '2024-02-01', timesSaved: 6 },
  ];

  const essays = [
    { title: 'Why UF? Essay', status: 'AI Optimized', score: 92, lastEdited: '1 day ago' },
    { title: 'Personal Statement', status: 'Needs Review', score: 78, lastEdited: '3 days ago' },
    { title: 'Leadership Experience', status: 'Complete', score: 95, lastEdited: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Auto-Submitted': return 'bg-green-500';
      case 'Ready to Submit': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'AI Optimized': return 'bg-green-500';
      case 'Complete': return 'bg-green-500';
      case 'Needs Review': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const totalTimesSaved = applications.reduce((sum, app) => sum + app.timesSaved, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">
            You've saved <span className="font-semibold text-green-600">{totalTimesSaved} hours</span> with Commit's automation. 
            <span className="font-semibold"> 3</span> applications ready, <span className="font-semibold">2</span> auto-submitted!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">2 auto-submitted</p>
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
                  <p className="text-sm font-medium text-muted-foreground">AI Essay Score</p>
                  <p className="text-2xl font-bold">88</p>
                  <p className="text-xs text-muted-foreground">+13 from last week</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Next Deadline</p>
                  <p className="text-2xl font-bold">Nov 30</p>
                  <p className="text-xs text-muted-foreground">Auto-submit ready</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600">🎯</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Tracker */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Smart Application Tracker</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/applications">Add College</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Automated form filling and submission tracking</p>
              <div className="space-y-4">
                {applications.map((app, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{app.name}</h4>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{app.progress}% complete</span>
                      <span>Due: {app.deadline}</span>
                    </div>
                    <Progress value={app.progress} className="mb-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600">{app.timesSaved} hours saved</span>
                      <span>Due {app.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Essay Assistant */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Essay Assistant</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/essay-assistant">Write Essay</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Mid-tier university focused guidance</p>
              <div className="space-y-4">
                {essays.map((essay, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{essay.title}</h4>
                      <Badge className={getStatusColor(essay.status)}>
                        {essay.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last edited: {essay.lastEdited}</span>
                      <span className="font-medium">
                        AI Score: <span className="text-primary">{essay.score}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center" asChild>
              <Link to="/college-search">
                <span className="text-2xl mb-1">🔍</span>
                <span>Find Colleges</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center" asChild>
              <Link to="/essay-assistant">
                <span className="text-2xl mb-1">✍️</span>
                <span>Write Essays</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center" asChild>
              <Link to="/profile">
                <span className="text-2xl mb-1">⚙️</span>
                <span>Update Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
