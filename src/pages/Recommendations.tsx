
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { College } from '@/hooks/useColleges';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const { recommendations, loading, fetchRecommendations } = useRecommendations();
  const { profile } = useProfile();
  const { createApplication } = useApplications();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAddToApplications = async (college: College) => {
    try {
      await createApplication({
        college_id: college.id,
        application_type: 'regular',
        status: 'draft',
        notes: `AI Recommended: ${college.name}`
      });
      
      toast({
        title: "Success!",
        description: `Added ${college.name} to your applications.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add college to applications.",
        variant: "destructive",
      });
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Good Match';
    if (score >= 70) return 'Fair Match';
    return 'Consider';
  };

  if (!profile?.gpa && !profile?.sat_score) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile for Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                To get personalized college recommendations, please complete your academic profile first.
              </p>
              <Button asChild>
                <Link to="/profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI College Recommendations</h1>
          <p className="text-muted-foreground">
            Personalized college recommendations based on your academic profile, interests, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">GPA:</span>
                    <span className="font-medium">{profile?.gpa || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SAT:</span>
                    <span className="font-medium">{profile?.sat_score || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Major:</span>
                    <span className="font-medium">{profile?.intended_major || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Budget:</span>
                    <span className="font-medium">
                      {profile?.budget ? `$${profile.budget.toLocaleString()}` : 'Not set'}
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/profile">Update Profile</Link>
                </Button>
                
                <Button 
                  className="w-full" 
                  onClick={fetchRecommendations}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : '🔄 Refresh Recommendations'}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How We Match</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Academic performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Major availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Budget compatibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Personal preferences</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Generating personalized recommendations...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((college, index) => (
                  <Card key={college.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{college.name}</h3>
                            <p className="text-muted-foreground">{college.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(college.match_score || 0)}`}>
                            {college.match_score}% {getMatchLabel(college.match_score || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium">Match Score</span>
                          <Progress value={college.match_score} className="flex-1" />
                          <span className="text-sm text-muted-foreground">{college.match_score}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tuition (Out-of-State)</p>
                          <p className="font-semibold">
                            {college.tuition_out_state ? `$${college.tuition_out_state.toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                          <p className="font-semibold">
                            {college.acceptance_rate ? `${(college.acceptance_rate * 100).toFixed(0)}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Enrollment</p>
                          <p className="font-semibold">
                            {college.enrollment ? college.enrollment.toLocaleString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ranking</p>
                          <p className="font-semibold">{college.ranking || 'N/A'}</p>
                        </div>
                      </div>

                      {college.match_reasons && college.match_reasons.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Why this is recommended for you:</p>
                          <div className="space-y-1">
                            {college.match_reasons.map((reason, reasonIndex) => (
                              <div key={reasonIndex} className="flex items-start space-x-2">
                                <span className="text-green-500 text-sm">✓</span>
                                <span className="text-sm">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Available Majors</p>
                        <div className="flex flex-wrap gap-2">
                          {college.majors?.slice(0, 4).map((major, majorIndex) => (
                            <Badge 
                              key={majorIndex} 
                              variant={major.toLowerCase().includes(profile?.intended_major?.toLowerCase() || '') ? "default" : "secondary"}
                            >
                              {major}
                            </Badge>
                          ))}
                          {(college.majors?.length || 0) > 4 && (
                            <Badge variant="outline">
                              +{(college.majors?.length || 0) - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          onClick={() => handleAddToApplications(college)}
                        >
                          ➕ Add to Applications
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/college-search`}>
                            🔍 View Details
                          </Link>
                        </Button>
                        {college.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                              🌐 Website
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Card>
                  <CardContent className="py-8">
                    <p className="text-muted-foreground mb-4">
                      No recommendations available. Make sure your profile is complete.
                    </p>
                    <Button onClick={fetchRecommendations}>
                      Generate Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
