
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gpa: 0,
    sat_score: 0,
    act_score: 0,
    intended_major: '',
    high_school: '',
    graduation_year: null as number | null,
    extracurriculars: [] as string[],
    collegePreferences: [] as string[]
  });

  // Update local state when profile loads
  useState(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || user?.email || '',
        gpa: profile.gpa || 0,
        sat_score: profile.sat_score || 0,
        act_score: profile.act_score || 0,
        intended_major: profile.intended_major || '',
        high_school: profile.high_school || '',
        graduation_year: profile.graduation_year,
        extracurriculars: [],
        collegePreferences: []
      });
    }
  });

  const handleSave = async () => {
    const updates = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      gpa: profileData.gpa,
      sat_score: profileData.sat_score,
      act_score: profileData.act_score,
      intended_major: profileData.intended_major,
      high_school: profileData.high_school,
      graduation_year: profileData.graduation_year
    };

    const { error } = await updateProfile(updates);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  const addExtracurricular = () => {
    setProfileData(prev => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, '']
    }));
  };

  const updateExtracurricular = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      extracurriculars: prev.extracurriculars.map((item, i) => i === index ? value : item)
    }));
  };

  const removeExtracurricular = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Profile</h1>
          <p className="text-muted-foreground">
            Keep your profile updated to get better AI recommendations and personalized guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      max="4.0"
                      value={profileData.gpa}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sat">SAT Score</Label>
                    <Input
                      id="sat"
                      type="number"
                      value={profileData.sat_score}
                      onChange={(e) => setProfileData(prev => ({ ...prev, sat_score: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="act">ACT Score</Label>
                    <Input
                      id="act"
                      type="number"
                      value={profileData.act_score}
                      onChange={(e) => setProfileData(prev => ({ ...prev, act_score: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="major">Intended Major</Label>
                  <Select
                    value={profileData.intended_major}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, intended_major: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your intended major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="high_school">High School</Label>
                  <Input
                    id="high_school"
                    value={profileData.high_school}
                    onChange={(e) => setProfileData(prev => ({ ...prev, high_school: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="graduation_year">Graduation Year</Label>
                  <Input
                    id="graduation_year"
                    type="number"
                    value={profileData.graduation_year || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, graduation_year: parseInt(e.target.value) || null }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Extracurricular Activities</CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={addExtracurricular}>
                    Add Activity
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData.extracurriculars.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={activity}
                        onChange={(e) => updateExtracurricular(index, e.target.value)}
                        placeholder="Enter extracurricular activity"
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExtracurricular(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {profileData.extracurriculars.length === 0 && (
                    <p className="text-muted-foreground">No extracurricular activities added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>College Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.collegePreferences.map((pref, index) => (
                      <Badge key={index} variant="secondary">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Urban setting', 'Rural setting', 'Research opportunities', 'Technology-focused', 
                        'Liberal arts', 'Large campus', 'Small campus', 'Diverse student body'].map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            const isSelected = profileData.collegePreferences.includes(option);
                            setProfileData(prev => ({
                              ...prev,
                              collegePreferences: isSelected 
                                ? prev.collegePreferences.filter(p => p !== option)
                                : [...prev.collegePreferences, option]
                            }));
                          }}
                        >
                          {profileData.collegePreferences.includes(option) ? '✓ ' : '+ '}
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <Badge variant="secondary">Strong Candidate</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Academic Profile:</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extracurriculars:</span>
                    <span className="font-medium text-blue-600">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profile Completeness:</span>
                    <span className="font-medium">90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    📈 Your GPA puts you in a competitive position for mid-tier universities
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900">
                    🎯 Consider applying to 2-3 more safety schools
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    ✍️ Focus on personalizing your essays for each college
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Applications Started:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Essays Written:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Saved:</span>
                  <span className="font-medium text-green-600">26 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile Views:</span>
                  <span className="font-medium">12</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
