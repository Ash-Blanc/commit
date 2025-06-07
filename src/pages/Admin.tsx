
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';

const Admin = () => {
  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalApplications: 3456,
    essaysWritten: 5678,
    timeSaved: 12450, // hours
    successRate: 94.2
  });

  const recentUsers = [
    { name: 'Alex Johnson', email: 'alex@example.com', joinDate: '2024-01-15', applications: 3, status: 'Active' },
    { name: 'Sarah Chen', email: 'sarah@example.com', joinDate: '2024-01-14', applications: 2, status: 'Active' },
    { name: 'Marcus Brown', email: 'marcus@example.com', joinDate: '2024-01-13', applications: 1, status: 'Pending' },
    { name: 'Emma Davis', email: 'emma@example.com', joinDate: '2024-01-12', applications: 4, status: 'Active' },
  ];

  const systemHealth = [
    { service: 'API Gateway', status: 'Healthy', uptime: 99.9 },
    { service: 'AI Essay Service', status: 'Healthy', uptime: 99.7 },
    { service: 'Database', status: 'Healthy', uptime: 99.8 },
    { service: 'File Storage', status: 'Warning', uptime: 98.2 },
    { service: 'Email Service', status: 'Healthy', uptime: 99.9 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500';
      case 'Warning': return 'bg-yellow-500';
      case 'Error': return 'bg-red-500';
      case 'Active': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform performance, user activity, and system health.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalApplications.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Applications</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{stats.essaysWritten.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Essays Written</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{stats.timeSaved.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Hours Saved</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.successRate}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user.applications} apps
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{service.service}</span>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Uptime</span>
                          <span>{service.uptime}%</span>
                        </div>
                        <Progress value={service.uptime} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Joined: {user.joinDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {user.applications} applications
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{service.service}</p>
                          <p className="text-sm text-muted-foreground">Uptime: {service.uptime}%</p>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>API Response Time</span>
                        <span>245ms</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Database Performance</span>
                        <span>Good</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Memory Usage</span>
                        <span>62%</span>
                      </div>
                      <Progress value={62} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>CPU Usage</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">89%</div>
                      <div className="text-sm text-muted-foreground">Application Success Rate</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">4.8</div>
                      <div className="text-sm text-muted-foreground">Average Essay Score</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">73%</div>
                      <div className="text-sm text-muted-foreground">User Retention</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">2.3</div>
                      <div className="text-sm text-muted-foreground">Avg Apps per User</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      📊 Analytics charts would be displayed here showing user engagement, 
                      application submission trends, and AI usage patterns.
                    </p>
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

export default Admin;
