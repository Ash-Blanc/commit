
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useEssays } from '@/hooks/useEssays';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  GraduationCap, 
  FileText, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const { essays, loading: essaysLoading } = useEssays();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const statsCards = [
    {
      title: 'Applications Started',
      value: applications?.length || 0,
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total applications'
    },
    {
      title: 'Essays Written',
      value: essays?.length || 0,
      icon: <FileText className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Essays completed'
    },
    {
      title: 'Profile Strength',
      value: profile ? '85%' : '0%',
      icon: <Target className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Overall readiness'
    },
    {
      title: 'Time Saved',
      value: '26 hrs',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'With AI assistance'
    }
  ];

  const quickActions = [
    {
      title: 'Find Colleges',
      description: 'Discover perfect college matches',
      icon: <GraduationCap className="h-8 w-8" />,
      href: '/college-search',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Write Essays',
      description: 'Get AI-powered essay assistance',
      icon: <FileText className="h-8 w-8" />,
      href: '/essay-assistant',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Get Recommendations',
      description: 'Personalized college suggestions',
      icon: <Sparkles className="h-8 w-8" />,
      href: '/recommendations',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Update Profile',
      description: 'Keep your information current',
      icon: <Users className="h-8 w-8" />,
      href: '/profile',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  if (profileLoading || applicationsLoading || essaysLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {greeting}, {profile?.first_name || user?.email?.split('@')[0] || 'Student'}! 👋
                </h1>
                <p className="text-xl opacity-90">
                  Ready to take the next step in your college journey?
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Strong Candidate
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="h-6 w-6 mr-2 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.href}>
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden cursor-pointer">
                        <CardContent className="p-6">
                          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${action.color} text-white mb-4`}>
                            {action.icon}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {action.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-50 border border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Profile updated</p>
                      <p className="text-sm text-muted-foreground">Academic information completed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Essay draft saved</p>
                      <p className="text-sm text-muted-foreground">Personal statement in progress</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Deadline reminder</p>
                      <p className="text-sm text-muted-foreground">MIT application due in 30 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Overview */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Profile Strength</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <Badge variant="secondary" className="text-sm">Strong Candidate</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Academic Profile</span>
                      <span className="font-medium text-green-600">Excellent</span>
                    </div>
                    <Progress value={90} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Extracurriculars</span>
                      <span className="font-medium text-blue-600">Good</span>
                    </div>
                    <Progress value={75} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Essays</span>
                      <span className="font-medium text-orange-600">In Progress</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-200">
                    <div>
                      <p className="font-medium">MIT Early Action</p>
                      <p className="text-sm text-muted-foreground">Nov 1, 2024</p>
                    </div>
                    <Badge variant="destructive">30 days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div>
                      <p className="font-medium">Stanford REA</p>
                      <p className="text-sm text-muted-foreground">Nov 1, 2024</p>
                    </div>
                    <Badge variant="secondary">45 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    📈 Your academic profile is competitive for top-tier universities
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900">
                    🎯 Consider applying to 2-3 more safety schools
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
