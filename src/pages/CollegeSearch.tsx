
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useColleges, College } from '@/hooks/useColleges';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast"
import Navbar from '@/components/Navbar';
import { Search, MapPin, DollarSign, Users, GraduationCap, Filter, Star, Plus } from 'lucide-react';

const CollegeSearch = () => {
  const { colleges, loading, searchColleges } = useColleges();
  const { refetch } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    major: '',
    tuitionMax: 100000,
    acceptanceRateMin: 0,
  });

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    await searchColleges(filters);
  };

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

      refetch();
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Success!",
        description: `Added ${college.name} to your application tracking.`,
      });
    }
  };

  const formatTuition = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAcceptanceRateColor = (rate: number) => {
    if (rate < 20) return 'bg-red-100 text-red-800';
    if (rate < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Find Your Perfect College</h1>
              <p className="text-muted-foreground">
                Discover colleges that match your preferences and academic profile.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Search & Filter Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-base font-medium">State/Location</Label>
                <Select onValueChange={(value) => handleFilterChange('state', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="major" className="text-base font-medium">Intended Major</Label>
                <Input
                  id="major"
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={filters.major as string}
                  onChange={(e) => handleFilterChange('major', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tuitionMax" className="text-base font-medium">Max Tuition</Label>
                <Select onValueChange={(value) => handleFilterChange('tuitionMax', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select max tuition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25000">$25,000</SelectItem>
                    <SelectItem value="40000">$40,000</SelectItem>
                    <SelectItem value="55000">$55,000</SelectItem>
                    <SelectItem value="70000">$70,000</SelectItem>
                    <SelectItem value="100000">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceptanceRate" className="text-base font-medium">Min Acceptance Rate</Label>
                <Select onValueChange={(value) => handleFilterChange('acceptanceRateMin', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select min rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="10">10%+</SelectItem>
                    <SelectItem value="25">25%+</SelectItem>
                    <SelectItem value="50">50%+</SelectItem>
                    <SelectItem value="75">75%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleSearch} 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search Colleges'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching for colleges...</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {colleges.length > 0 ? (
              colleges.map((college) => (
                <Card key={college.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-start justify-between">
                      <span className="line-clamp-2">{college.name}</span>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        <Star className="w-3 h-3 mr-1" />
                        Top Choice
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{college.city}, {college.state}</span>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Tuition (In-State)</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatTuition(college.tuition_in_state)}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Acceptance Rate</span>
                        </div>
                        <Badge className={`${getAcceptanceRateColor(college.acceptance_rate)} text-sm`}>
                          {college.acceptance_rate}%
                        </Badge>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Programs Available</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Undergraduate and Graduate programs in various fields
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50"
                        asChild
                      >
                        <Link to={`https://www.google.com/search?q=${encodeURIComponent(college.name + ' college website')}`} target="_blank">
                          <MapPin className="w-4 h-4 mr-1" />
                          Learn More
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        onClick={() => handleAddToApplications(college)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Apps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search criteria to find more colleges that match your preferences.
                    </p>
                    <Button 
                      onClick={handleSearch}
                      variant="outline"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                College Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-blue-800">🎯 Consider All Factors</div>
                  <p className="text-muted-foreground">
                    Look beyond rankings - consider location, culture, programs, and financial aid opportunities.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-green-800">📋 Create a Balanced List</div>
                  <p className="text-muted-foreground">
                    Include reach schools, match schools, and safety schools in your application list.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-purple-800">💰 Compare Costs</div>
                  <p className="text-muted-foreground">
                    Remember to factor in financial aid, scholarships, and total cost of attendance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollegeSearch;
