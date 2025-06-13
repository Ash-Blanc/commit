
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { FileText, Calendar, Clock } from 'lucide-react';

interface ApplicationManagerProps {
  collegeId: string;
  collegeName: string;
  applicationDeadline?: string;
}

const ApplicationManager = ({ collegeId, collegeName, applicationDeadline }: ApplicationManagerProps) => {
  const [loading, setLoading] = useState(false);
  const { createApplication, applications } = useApplications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const existingApplication = applications.find(app => app.college_id === collegeId);

  const handleStartApplication = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start an application.",
        variant: "destructive",
      });
      return;
    }

    if (existingApplication) {
      navigate(`/applications?college=${collegeId}`);
      return;
    }

    setLoading(true);
    try {
      const newApplication = await createApplication({
        college_id: collegeId,
        status: 'draft',
        application_type: 'regular',
        notes: `Application for ${collegeName}`
      });

      if (newApplication) {
        toast({
          title: "Application Started",
          description: `Your application to ${collegeName} has been created.`,
        });
        navigate(`/applications?college=${collegeId}`);
      }
    } catch (error) {
      console.error('Error creating application:', error);
      toast({
        title: "Error",
        description: "Failed to start application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (existingApplication) {
      return existingApplication.status === 'submitted' ? 'View Application' : 'Continue Application';
    }
    return 'Apply Now';
  };

  const getButtonVariant = () => {
    if (existingApplication?.status === 'submitted') return 'outline';
    return 'default';
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleStartApplication}
        disabled={loading}
        variant={getButtonVariant()}
        className="w-full"
      >
        <FileText className="h-4 w-4 mr-2" />
        {loading ? 'Starting...' : getButtonText()}
      </Button>
      
      {applicationDeadline && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          Deadline: {new Date(applicationDeadline).toLocaleDateString()}
        </div>
      )}
      
      {existingApplication && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Status: {existingApplication.status}
        </div>
      )}
    </div>
  );
};

export default ApplicationManager;
