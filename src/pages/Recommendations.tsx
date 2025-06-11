import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useColleges, College } from '@/hooks/useColleges';
import { useApplications, Application } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

const Recommendations = () => {
  const { colleges, loading, searchColleges } = useColleges();
  const { applications, createApplication } = useApplications();
  const { profile } = useProfile();
  const [stateFilter, setStateFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [tuitionMax, setTuitionMax] = useState<number | undefined>(undefined);
  const [acceptanceRateMin, setAcceptanceRateMin] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      setStateFilter(profile.target_major || '');
    }
  }, [profile]);

  const handleSearch = async () => {
    const filters = {
      state: stateFilter,
      major: majorFilter,
      tuitionMax: tuitionMax,
      acceptanceRateMin: acceptanceRateMin,
    };
    await searchColleges(filters);
  };

  const handleCreateApplication = async (collegeId: string) => {
    try {
      const newApplication = await createApplication({
        college_id: collegeId,
        application_type: 'regular',
        status: 'planning',
        notes: '',
      });
      
      if (newApplication) {
        toast({
          title: "Application Created",
          description: "Application has been added to your tracker.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create application.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">College Recommendations</h1>
        <p className="text-muted-foreground mb-8">
          Find colleges that match your profile and preferences.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                placeholder="Enter state"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Input
                type="text"
                id="major"
                placeholder="Enter major"
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tuition">Max Tuition</Label>
              <Input
                type="number"
                id="tuition"
                placeholder="Enter max tuition"
                value={tuitionMax || ''}
                onChange={(e) => setTuitionMax(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Label htmlFor="acceptanceRate">Min Acceptance Rate</Label>
              <Input
                type="number"
                id="acceptanceRate"
                placeholder="Enter min acceptance rate"
                value={acceptanceRateMin || ''}
                onChange={(e) => setAcceptanceRateMin(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="md:col-span-3">
              <Button className="w-full" onClick={handleSearch}>
                Search Colleges
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {colleges.map((college) => (
            <Card key={college.id}>
              <CardHeader>
                <CardTitle>{college.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {college.city}, {college.state}
                </p>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>In-State: ${college.tuition_in_state?.toLocaleString()}</p>
                  <p>Out-of-State: ${college.tuition_out_state?.toLocaleString()}</p>
                  <p>Acceptance Rate: {(college.acceptance_rate * 100).toFixed(1)}%</p>
                  {profile?.budget && (
                    <p className={`font-medium ${college.tuition_out_state > profile.budget ? 'text-red-600' : 'text-green-600'}`}>
                      {college.tuition_out_state > profile.budget ? 'Above' : 'Within'} Budget
                    </p>
                  )}
                </div>

                <Button onClick={() => handleCreateApplication(college.id)}>
                  Add to Tracker
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
