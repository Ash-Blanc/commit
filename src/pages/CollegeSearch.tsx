import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useColleges, College } from '@/hooks/useColleges';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

const CollegeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [tuitionMax, setTuitionMax] = useState<number | undefined>(undefined);
  const [acceptanceRateMin, setAcceptanceRateMin] = useState<number | undefined>(undefined);
  const { colleges, loading, searchColleges } = useColleges();
  const { createApplication } = useApplications();
  const { profile } = useProfile();

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const handleSearch = async () => {
    await searchColleges({
      state: selectedState,
      major: selectedMajor,
      tuitionMax: tuitionMax,
      acceptanceRateMin: acceptanceRateMin,
    });
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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">College Search</h1>
          <p className="text-muted-foreground">
            Find the perfect college for you. Filter by state, major, tuition, and acceptance rate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Max Tuition"
            value={tuitionMax === undefined ? '' : tuitionMax.toString()}
            onChange={(e) => setTuitionMax(e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Min Acceptance Rate (%)"
            value={acceptanceRateMin === undefined ? '' : acceptanceRateMin.toString()}
            onChange={(e) => setAcceptanceRateMin(e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <Button onClick={handleSearch} className="mb-8">Search Colleges</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges
            .filter((college) => college.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((college) => (
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
      </main>
    </div>
  );
};

export default CollegeSearch;
