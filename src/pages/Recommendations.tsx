import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useColleges, College } from '@/hooks/useColleges';
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

const Recommendations = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { getRecommendations } = useColleges();
  const [recommendedColleges, setRecommendedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddToApplications = async (college: College) => {
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

  const memoizedGetRecommendations = useCallback(getRecommendations, [getRecommendations]);

  useEffect(() => {
    const getRecommendations = async () => {
      if (!profile) return;

      setLoading(true);
      try {
        const profileWithDefaults = {
          ...profile,
          budget: profile.budget || 50000,
          interests: profile.interests || [],
          extracurriculars: profile.extracurriculars || [],
          target_major: profile.target_major || profile.intended_major || '',
        };

        const recommendations = await memoizedGetRecommendations(profileWithDefaults);
        setRecommendedColleges(recommendations);
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
    };

    getRecommendations();
  }, [profile, memoizedGetRecommendations]);

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading recommendations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Recommended Colleges</h1>
          <p className="text-muted-foreground">
            Based on your profile, here are some colleges you might be interested in.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recommendedColleges.length > 0 ? (
            recommendedColleges.map((college) => (
              <Card key={college.id}>
                <CardHeader>
                  <CardTitle>{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {college.city}, {college.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Acceptance Rate: {college.acceptance_rate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tuition (In-State): ${college.tuition_in_state}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Button asChild variant="outline">
                      <Link to={college.website_url} target="_blank">
                        Visit Website
                      </Link>
                    </Button>
                    <Button onClick={() => handleAddToApplications(college)}>
                      Add to Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No recommendations found. Please complete your profile to get personalized recommendations.
              </p>
              <Button asChild>
                <Link to="/profile">Complete Your Profile</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
