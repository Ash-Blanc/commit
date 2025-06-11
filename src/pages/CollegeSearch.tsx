
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { useColleges, College, CollegeSearchFilters } from '@/hooks/useColleges';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { toast } from '@/hooks/use-toast';

const CollegeSearch = () => {
  const { searchColleges } = useColleges();
  const { profile } = useProfile();
  const { createApplication } = useApplications();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CollegeSearchFilters>({
    tuitionMin: 0,
    tuitionMax: 50000
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchColleges({
        ...filters,
        ...(searchTerm && { major: searchTerm })
      });
      setColleges(results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToApplications = async (college: College) => {
    try {
      await createApplication({
        college_id: college.id,
        application_type: 'regular',
        status: 'draft',
        notes: `Application for ${college.name}`
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

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-500';
    if (match >= 80) return 'bg-blue-500';
    if (match >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">College Search & Research</h1>
          <p className="text-muted-foreground">
            Find colleges that match your profile and preferences. Get AI-powered recommendations 
            based on your academic performance and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Colleges</label>
                  <Input
                    placeholder="College name or major"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <Select value={filters.state || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value || undefined }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All States</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tuition Range: ${filters.tuitionMin?.toLocaleString()} - ${filters.tuitionMax?.toLocaleString()}
                  </label>
                  <Slider
                    value={[filters.tuitionMin || 0, filters.tuitionMax || 50000]}
                    onValueChange={([min, max]) => setFilters(prev => ({ ...prev, tuitionMin: min, tuitionMax: max }))}
                    max={50000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Enrollment Size</label>
                  <Select value={filters.enrollmentSize || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, enrollmentSize: value || undefined }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Size</SelectItem>
                      <SelectItem value="small">Small (&lt; 5,000)</SelectItem>
                      <SelectItem value="medium">Medium (5,000 - 15,000)</SelectItem>
                      <SelectItem value="large">Large (&gt; 15,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : '🔍 Search Colleges'}
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            {profile && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <span className="font-medium">{profile.gpa || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SAT:</span>
                    <span className="font-medium">{profile.sat_score || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Major:</span>
                    <span className="font-medium">{profile.intended_major || 'Not set'}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* College Results */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {loading ? 'Searching...' : `Found ${colleges.length} colleges`}
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Searching colleges...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {colleges.map((college) => (
                  <Card key={college.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{college.name}</h3>
                          <p className="text-muted-foreground">{college.location}</p>
                        </div>
                        {college.match_score && (
                          <Badge className={getMatchColor(college.match_score)}>
                            {college.match_score}% Match
                          </Badge>
                        )}
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

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Available Majors</p>
                        <div className="flex flex-wrap gap-2">
                          {college.majors?.slice(0, 5).map((major, index) => (
                            <Badge key={index} variant="secondary">
                              {major}
                            </Badge>
                          ))}
                          {(college.majors?.length || 0) > 5 && (
                            <Badge variant="outline">
                              +{(college.majors?.length || 0) - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {college.match_reasons && college.match_reasons.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Why it's a good match:</p>
                          <ul className="text-sm space-y-1">
                            {college.match_reasons.slice(0, 3).map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button 
                          size="sm"
                          onClick={() => handleAddToApplications(college)}
                        >
                          ➕ Add to Applications
                        </Button>
                        {college.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                              🌐 Visit Website
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {colleges.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No colleges found matching your criteria.</p>
                    <Button onClick={handleSearch} className="mt-4">
                      Try Different Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeSearch;
