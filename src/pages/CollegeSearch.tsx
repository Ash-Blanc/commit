
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { collegeSearchService } from '@/services/collegeSearchService';
import { toast } from "@/hooks/use-toast"
import Navbar from '@/components/Navbar';
import { Search, Globe, MapPin, ExternalLink, GraduationCap } from 'lucide-react';

interface CollegeResult {
  id: string;
  name: string;
  location: string;
  country: string;
  state: string;
  website: string;
  type: 'university' | 'college';
}

const CollegeSearch = () => {
  const [colleges, setColleges] = useState<CollegeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showTopColleges, setShowTopColleges] = useState(true);

  useEffect(() => {
    loadTopColleges();
  }, []);

  const loadTopColleges = async () => {
    setLoading(true);
    try {
      const topColleges = await collegeSearchService.getTopColleges();
      setColleges(topColleges);
    } catch (error) {
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
      const countryMap: Record<string, string> = {
        'US': 'United States',
        'UK': 'United Kingdom',
        'Singapore': 'Singapore'
      };

      const results = await collegeSearchService.searchColleges(
        searchTerm,
        selectedCountry ? countryMap[selectedCountry] : undefined
      );
      
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
    if (!country) return;
    
    setLoading(true);
    setShowTopColleges(false);
    setSelectedCountry(country);
    
    try {
      const results = await collegeSearchService.getCollegesByCountry(country as 'US' | 'UK' | 'Singapore');
      setColleges(results.slice(0, 50)); // Limit results
      
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
            Discover universities from the US, UK, and Singapore
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="">All Countries</SelectItem>
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
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Top Universities Worldwide</h2>
              <p className="text-slate-500">Explore some of the world's most prestigious institutions</p>
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
                          <span className="text-2xl ml-2">{getCountryFlag(college.country)}</span>
                        </div>
                        
                        <div className="flex items-center text-slate-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{college.location}</span>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {college.type === 'university' ? 'University' : 'College'}
                        </Badge>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex space-x-2">
                          {college.website && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() => window.open(college.website, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit Website
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="flex-1"
                          >
                            Learn More
                          </Button>
                        </div>
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
