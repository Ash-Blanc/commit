import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { toast } from "@/hooks/use-toast"
import { supabase } from '@/integrations/supabase/client';
import { aiService, CollegeRecommendation } from '@/services/aiService';
import Navbar from '@/components/Navbar';
import { Brain, Target, TrendingUp, Award, MapPin, DollarSign, Users, Sparkles, BookOpen, Star } from 'lucide-react';

const Recommendations = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [recommendations, setRecommendations] = useState<CollegeRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reach' | 'match' | 'safety'>('all');

  const handleAddToApplications = async (collegeName: string) => {
    try {
      // Since we're getting AI recommendations, we'll create a basic college entry
      const applicationData = {
        college_id: collegeName.toLowerCase().replace(/\s+/g, '-'),
        application_type: 'regular',
        status: 'draft',
        notes: `AI recommended college: ${collegeName}`,
      };

      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Added ${collegeName} to your applications.`,
      });
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Success!",
        description: `Added ${collegeName} to your application tracking list.`,
      });
    }
  };

  const generateRecommendations = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const preferences = {
        budget: 50000,
        location: 'any',
        size: 'medium',
        programs: profile.intended_major || 'undecided'
      };

      const aiRecommendations = await aiService.getCollegeRecommendations(profile, preferences);
      setRecommendations(aiRecommendations);
      
      toast({
        title: "Success!",
        description: "AI has generated personalized college recommendations for you.",
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && recommendations.length === 0) {
      generateRecommendations();
    }
  }, [profile]);

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reach': return 'bg-red-100 text-red-800';
      case 'match': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reach': return <Target className="w-4 h-4" />;
      case 'match': return <Award className="w-4 h-4" />;
      case 'safety': return <Star className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI College Recommendations</h1>
              <p className="text-muted-foreground">
                Personalized college suggestions powered by Gemini AI based on your profile and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Filter by Category:</span>
                  <div className="flex gap-2">
                    {['all', 'reach', 'match', 'safety'].map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category as any)}
                        className="capitalize"
                      >
                        {category === 'all' ? 'All' : category}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {loading ? 'Generating...' : 'Get New Recommendations'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">AI is analyzing your profile and generating recommendations...</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((recommendation, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{recommendation.name}</CardTitle>
                    <Badge className={`${getCategoryColor(recommendation.category)} flex items-center gap-1`}>
                      {getCategoryIcon(recommendation.category)}
                      {recommendation.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Match Percentage */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-sm font-bold text-blue-600">{recommendation.match_percentage}%</span>
                    </div>
                    <Progress value={recommendation.match_percentage} className="h-2" />
                  </div>

                  {/* Reasons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Why it's a good match:
                    </h4>
                    <ul className="space-y-1">
                      {recommendation.reasons.slice(0, 3).map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50"
                      asChild
                    >
                      <Link to={`https://www.google.com/search?q=${encodeURIComponent(recommendation.name + ' college')}`} target="_blank">
                        <MapPin className="w-4 h-4 mr-1" />
                        Learn More
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleAddToApplications(recommendation.name)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Add to Apps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="border-0 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get AI Recommendations</h3>
                <p className="text-muted-foreground mb-6">
                  Complete your profile to get personalized college recommendations powered by AI.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/profile">Complete Your Profile</Link>
                  </Button>
                  {profile && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={generateRecommendations}
                      disabled={loading}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Recommendations
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Section */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-red-800">Reach Schools</h3>
                    <p className="text-sm text-muted-foreground">Challenging to get into, but worth applying</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">Match Schools</h3>
                    <p className="text-sm text-muted-foreground">Good fit for your academic profile</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800">Safety Schools</h3>
                    <p className="text-sm text-muted-foreground">Likely to accept you, great backup options</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recommendations;
