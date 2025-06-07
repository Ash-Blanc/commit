
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';

const CollegeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [tuitionRange, setTuitionRange] = useState([0, 50000]);
  const [enrollmentSize, setEnrollmentSize] = useState('');

  const colleges = [
    {
      name: 'University of Florida',
      location: 'Gainesville, FL',
      tuition: '$6,380',
      acceptanceRate: '31%',
      enrollment: '52,000',
      ranking: '#5 Public',
      majors: ['Engineering', 'Business', 'Medicine', 'Computer Science'],
      match: 95,
      distance: '15 miles'
    },
    {
      name: 'Florida State University',
      location: 'Tallahassee, FL',
      tuition: '$5,656',
      acceptanceRate: '36%',
      enrollment: '41,000',
      ranking: '#18 Public',
      majors: ['Psychology', 'Criminal Justice', 'Film School', 'Business'],
      match: 88,
      distance: '180 miles'
    },
    {
      name: 'University of Central Florida',
      location: 'Orlando, FL',
      tuition: '$6,368',
      acceptanceRate: '44%',
      enrollment: '70,000',
      ranking: '#160 National',
      majors: ['Engineering', 'Business', 'Health Sciences', 'Education'],
      match: 82,
      distance: '120 miles'
    },
    {
      name: 'Florida Institute of Technology',
      location: 'Melbourne, FL',
      tuition: '$43,470',
      acceptanceRate: '65%',
      enrollment: '6,000',
      ranking: '#178 National',
      majors: ['Engineering', 'Computer Science', 'Aviation', 'Ocean Engineering'],
      match: 90,
      distance: '200 miles'
    }
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-500';
    if (match >= 80) return 'bg-blue-500';
    if (match >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
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
                    placeholder="College name or keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fl">Florida</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tuition Range: ${tuitionRange[0].toLocaleString()} - ${tuitionRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={tuitionRange}
                    onValueChange={setTuitionRange}
                    max={50000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Enrollment Size</label>
                  <Select value={enrollmentSize} onValueChange={setEnrollmentSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt; 5,000)</SelectItem>
                      <SelectItem value="medium">Medium (5,000 - 15,000)</SelectItem>
                      <SelectItem value="large">Large (&gt; 15,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  🎯 Get AI Recommendations
                </Button>
              </CardContent>
            </Card>

            {/* Profile Match Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>GPA:</span>
                  <span className="font-medium">3.8</span>
                </div>
                <div className="flex justify-between">
                  <span>SAT:</span>
                  <span className="font-medium">1450</span>
                </div>
                <div className="flex justify-between">
                  <span>Major:</span>
                  <span className="font-medium">Computer Science</span>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground">
                    Matches are based on your academic profile and preferences
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* College Results */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Found {colleges.length} colleges matching your criteria
              </h2>
              <Select defaultValue="match">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Sort by Match</SelectItem>
                  <SelectItem value="tuition">Sort by Tuition</SelectItem>
                  <SelectItem value="acceptance">Sort by Acceptance Rate</SelectItem>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {colleges.map((college, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{college.name}</h3>
                        <p className="text-muted-foreground">{college.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getMatchColor(college.match)} mb-2`}>
                          {college.match}% Match
                        </Badge>
                        <p className="text-sm text-muted-foreground">{college.distance} away</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tuition</p>
                        <p className="font-semibold">{college.tuition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                        <p className="font-semibold">{college.acceptanceRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enrollment</p>
                        <p className="font-semibold">{college.enrollment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ranking</p>
                        <p className="font-semibold">{college.ranking}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Popular Majors</p>
                      <div className="flex flex-wrap gap-2">
                        {college.majors.map((major, majorIndex) => (
                          <Badge key={majorIndex} variant="secondary">
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        💾 Save to List
                      </Button>
                      <Button variant="outline" size="sm">
                        📊 Compare
                      </Button>
                      <Button size="sm">
                        ➕ Add to Applications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeSearch;
