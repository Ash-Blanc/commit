
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

interface RecommendedCollege {
  id: string;
  name: string;
  location: string;
  state: string;
  acceptance_rate: number;
  tuition_in_state: number;
  tuition_out_state: number;
  website_url: string;
  match_score: number;
  match_reasons: string[];
}

const Recommendations = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [recommendedColleges, setRecommendedColleges] = useState<RecommendedCollege[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddToApplications = async (college: RecommendedCollege) => {
    try {
      const applicationData = {
        college_id: college.id,
        application_type: 'regular',
        status: 'draft',
        notes: '',
      };

      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Added ${college.name} to your applications.`,
      });
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Error",
        description: "Failed to add college to applications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchRecommendations = useCallback(async () => {
    if (!profile || !user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase.functions.invoke('recommendations', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { profile }
      });

      if (error) throw error;

      setRecommendedColleges(data?.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Recommended Colleges</h1>
          <p className="text-gray-600">
            Based on your profile, here are colleges that match your academic profile and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recommendedColleges.length > 0 ? (
            recommendedColleges.map((college) => (
              <Card key={college.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-900">{college.name}</CardTitle>
                      <p className="text-gray-600">
                        {college.location || `${college.state}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary mb-1">
                        {college.match_score}% Match
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Acceptance Rate:</span>
                        <span className="text-gray-600 ml-2">
                          {college.acceptance_rate ? `${(college.acceptance_rate * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Tuition (In-State):</span>
                        <span className="text-gray-600 ml-2">
                          {college.tuition_in_state ? `$${college.tuition_in_state.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {college.match_reasons && college.match_reasons.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Why this is a good match:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {college.match_reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      {college.website_url && (
                        <Button asChild variant="outline">
                          <Link to={college.website_url} target="_blank">
                            Visit Website
                          </Link>
                        </Button>
                      )}
                      <Button onClick={() => handleAddToApplications(college)}>
                        Add to Applications
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">No Recommendations Found</h3>
                  <p className="text-gray-600 mb-6">
                    We need more information about your academic profile to provide personalized recommendations.
                  </p>
                  <Button asChild>
                    <Link to="/profile">Complete Your Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
