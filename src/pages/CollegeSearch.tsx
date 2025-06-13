
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { collegeSearchService } from '@/services/collegeSearchService';
import { useSavedColleges } from '@/hooks/useSavedColleges';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from "@/hooks/use-toast"
import Navbar from '@/components/Navbar';
import ApplicationManager from '@/components/ApplicationManager';
import { Search, Globe, MapPin, ExternalLink, GraduationCap, Heart, DollarSign, Users, TrendingUp } from 'lucide-react';

interface CollegeResult {
  id: string;
  name: string;
  location: string;
  country: string;
  state: string;
  website: string;
  type: 'university' | 'college';
  tuition_in_state?: number;
  tuition_out_state?: number;
  acceptance_rate?: number;
  enrollment?: number;
  ranking?: string;
  application_deadline?: string;
  early_deadline?: string;
  majors?: string[];
}

const CollegeSearch = () => {
  const [colleges, setColleges] = useState<CollegeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showTopColleges, setShowTopColleges] = useState(true);
  
  const { saveCollege, unsaveCollege, isCollegeSaved } = useSavedColleges();
  const { sendNotification } = useNotifications();

  useEffect(() => {
    loadTopColleges();
  }, []);

  const loadTopColleges = async () => {
    setLoading(true);
    setShowTopColleges(true);
    try {
      console.log('Loading top colleges...');
      const topColleges = await collegeSearchService.getTopColleges();
      console.log('Loaded colleges:', topColleges);
      setColleges(topColleges);
      
      if (topColleges.length === 0) {
        toast({
          title: "No Data",
          description: "No colleges found in database. Please add some colleges first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading top colleges:', error);
      toast({
        title: "Error",
        description: "Failed to load top colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowTopColleges(false);
    
    try {
      console.log('Searching for:', searchTerm);
      const results = await collegeSearchService.searchColleges(searchTerm, selectedCountry);
      console.log('Search results:', results);
      
      setColleges(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No colleges found matching your search criteria.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} colleges matching your criteria.`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountryFilter = async (country: string) => {
    if (!country || country === 'all') {
      loadTopColleges();
      return;
    }
    
    setLoading(true);
    setShowTopColleges(false);
    setSelectedCountry(country);
    
    try {
      const results = await collegeSearchService.getCollegesByCountry(country as 'US' | 'UK' | 'Singapore');
      setColleges(results.slice(0, 50));
      
      toast({
        title: "Filter Applied",
        description: `Showing colleges from ${country === 'US' ? 'United States' : country === 'UK' ? 'United Kingdom' : 'Singapore'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to filter colleges by country.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = () => {
    sendNotification(
      'College Search Update',
      `You searched for "${searchTerm || 'top colleges'}" and found ${colleges.length} results. Don't forget to save your favorites!`,
      'info',
      true
    );
  };

  const handleToggleSave = async (college: CollegeResult) => {
    if (isCollegeSaved(college.id)) {
      await unsaveCollege(college.id);
    } else {
      await saveCollege(college.id);
    }
  };

  const formatTuition = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatAcceptanceRate = (rate?: number) => {
    if (!rate) return 'N/A';
    return `${Math.round(rate * 100)}%`;
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'United States': return '🇺🇸';
      case 'United Kingdom': return '🇬🇧';
      case 'Singapore': return '🇸🇬';
      default: return '🌍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            College Search
          </h1>
          <p className="text-xl text-slate-600">
            Discover and apply to your dream colleges
          </p>
        </div>

        {/* Search Controls */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Search className="h-6 w-6 mr-2 text-blue-600" />
              Find Your Perfect College
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-base font-medium">Search Colleges</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter college name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div>
                <Label htmlFor="country" className="text-base font-medium">Country Filter</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                    <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-end">
                <Button onClick={handleTestNotification} variant="outline" className="w-full">
                  Test Notification
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadTopColleges}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Top Universities
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCountryFilter('US')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                🇺🇸 US Colleges
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCountryFilter('UK')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                🇬🇧 UK Universities
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCountryFilter('Singapore')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                🇸🇬 Singapore Unis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {showTopColleges && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Top Universities</h2>
              <p className="text-slate-500">Explore some of the most prestigious institutions</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <Card key={college.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                            {college.name}
                          </h3>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-2xl">{getCountryFlag(college.country)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleSave(college)}
                              className="p-1 h-8 w-8"
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  isCollegeSaved(college.id) 
                                    ? 'fill-red-500 text-red-500' 
                                    : 'text-slate-400 hover:text-red-500'
                                }`} 
                              />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-slate-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{college.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {college.type === 'university' ? 'University' : 'College'}
                          </Badge>
                          {college.ranking && (
                            <Badge variant="outline" className="text-xs">
                              Rank #{college.ranking}
                            </Badge>
                          )}
                        </div>

                        {/* College Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                          {college.acceptance_rate && (
                            <div className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {formatAcceptanceRate(college.acceptance_rate)} acceptance
                            </div>
                          )}
                          {college.enrollment && (
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {college.enrollment.toLocaleString()} students
                            </div>
                          )}
                          {college.tuition_out_state && (
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatTuition(college.tuition_out_state)}
                            </div>
                          )}
                        </div>

                        {/* Majors */}
                        {college.majors && college.majors.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-slate-700 mb-1">Popular Majors:</p>
                            <div className="flex flex-wrap gap-1">
                              {college.majors.slice(0, 3).map((major, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {major}
                                </Badge>
                              ))}
                              {college.majors.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{college.majors.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <ApplicationManager
                          collegeId={college.id}
                          collegeName={college.name}
                          applicationDeadline={college.application_deadline}
                        />
                        
                        {college.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => window.open(college.website, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Colleges Found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search criteria or browse our top universities.
              </p>
              <Button onClick={loadTopColleges} variant="outline">
                <GraduationCap className="h-4 w-4 mr-2" />
                View Top Universities
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollegeSearch;
