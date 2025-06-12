
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';

const Applications = () => {
  const { applications, loading } = useApplications();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    
    try {
      // Simulate file upload (replace with actual upload logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: `${docType} uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDoc(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading applications...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Application Management</h1>
          <p className="text-gray-600">
            Track your college applications, manage requirements, and upload documents.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {applications.filter(app => app.status === 'submitted').length}
                    </div>
                    <div className="text-sm text-gray-600">Submitted</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {applications.filter(app => app.status === 'ready').length}
                    </div>
                    <div className="text-sm text-gray-600">Ready to Submit</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {applications.filter(app => app.status === 'draft').length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{applications.length}</div>
                    <div className="text-sm text-gray-600">Total Applications</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <Card key={app.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-gray-900">
                            {app.college?.name || 'College Name'}
                          </CardTitle>
                          <p className="text-gray-600">
                            Status: {app.status}
                          </p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex space-x-3">
                        <Button variant="outline">
                          📝 Continue Application
                        </Button>
                        <Button variant="outline">
                          👁️ View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start by adding colleges to your application list
                    </p>
                    <Button>➕ Add College Application</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deadlines">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications
                      .filter(app => app.status !== 'submitted')
                      .map((app) => (
                        <div key={app.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{app.college?.name || 'College Name'}</h4>
                            <p className="text-sm text-gray-600">
                              {app.college?.application_deadline || 'No deadline set'}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            View Details
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-600">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Upload Documents</h4>
                    <div className="space-y-4">
                      {[
                        'Official Transcripts',
                        'SAT/ACT Scores',
                        'Letters of Recommendation',
                        'Personal Essays',
                        'Resume/CV',
                        'Portfolio'
                      ].map((docType) => (
                        <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                          <span className="font-medium text-gray-900">{docType}</span>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              id={`upload-${docType}`}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, docType)}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={uploadingDoc === docType}
                              onClick={() => document.getElementById(`upload-${docType}`)?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadingDoc === docType ? 'Uploading...' : 'Upload'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Your uploaded documents will appear here
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                      </p>
                    </div>
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
