
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useColleges, College } from '@/hooks/useColleges';
import { useApplications } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast"
import Navbar from '@/components/Navbar';

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
        title: "Error",
        description: "Failed to add college to applications. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Find Your College</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 max-w-3xl">
            <div>
              <Label htmlFor="state">State</Label>
              <Select onValueChange={(value) => handleFilterChange('state', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                type="text"
                placeholder="e.g., Computer Science"
                value={filters.major as string}
                onChange={(e) => handleFilterChange('major', e.target.value)}
                className="max-w-xs"
              />
            </div>
            <div>
              <Label htmlFor="tuitionMax">Max Tuition</Label>
              <Input
                id="tuitionMax"
                type="number"
                placeholder="e.g., 50000"
                value={filters.tuitionMax as number}
                onChange={(e) => handleFilterChange('tuitionMax', Number(e.target.value))}
                className="max-w-xs"
              />
            </div>
            <Button onClick={handleSearch} className="md:col-span-1 max-w-xs">Search Colleges</Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-8 md:col-span-2 lg:col-span-3 xl:col-span-4">
              Loading colleges...
            </div>
          ) : (
            colleges.map((college) => (
              <Card key={college.id} className="max-w-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{college.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">Location: {college.city}, {college.state}</p>
                  <p className="text-sm">Tuition (In-State): ${college.tuition_in_state}</p>
                  <p className="text-sm">Acceptance Rate: {college.acceptance_rate}%</p>
                  <Button 
                    onClick={() => handleAddToApplications(college)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    Add to Applications
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeSearch;
