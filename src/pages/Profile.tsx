
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { User, GraduationCap, BookOpen, Target, TrendingUp, Award, Lightbulb, Plus, X, Save } from 'lucide-react';

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
  useEffect(() => {
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
  }, [profile, user]);

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

    const result = await updateProfile(updates);
    
    if (result?.error) {
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

  const calculateProfileStrength = () => {
    let score = 0;
    if (profileData.first_name && profileData.last_name) score += 10;
    if (profileData.gpa > 0) score += 20;
    if (profileData.sat_score > 0 || profileData.act_score > 0) score += 20;
    if (profileData.intended_major) score += 15;
    if (profileData.high_school) score += 10;
    if (profileData.graduation_year) score += 10;
    if (profileData.extracurriculars.length > 0) score += 15;
    return score;
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-green-600" };
    if (score >= 70) return { label: "Strong", color: "text-blue-600" };
    if (score >= 50) return { label: "Good", color: "text-yellow-600" };
    return { label: "Needs Work", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  const profileStrength = calculateProfileStrength();
  const strengthInfo = getStrengthLabel(profileStrength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Student Profile</h1>
              <p className="text-muted-foreground">
                Keep your profile updated to get better AI recommendations and personalized guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={isEditing ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" : ""}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    'Edit Profile'
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-base font-medium">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-base font-medium">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="h-11 max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gpa" className="text-base font-medium">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      max="4.0"
                      min="0"
                      placeholder="4.0"
                      value={profileData.gpa || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sat" className="text-base font-medium">SAT Score</Label>
                    <Input
                      id="sat"
                      type="number"
                      min="400"
                      max="1600"
                      placeholder="1500"
                      value={profileData.sat_score || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, sat_score: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="act" className="text-base font-medium">ACT Score</Label>
                    <Input
                      id="act"
                      type="number"
                      min="1"
                      max="36"
                      placeholder="32"
                      value={profileData.act_score || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, act_score: parseInt(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-base font-medium">Intended Major</Label>
                    <Select
                      value={profileData.intended_major}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, intended_major: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your intended major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English Literature">English Literature</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Political Science">Political Science</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Pre-Med">Pre-Med</SelectItem>
                        <SelectItem value="Pre-Law">Pre-Law</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Undecided">Undecided</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="graduation_year" className="text-base font-medium">Graduation Year</Label>
                    <Select
                      value={profileData.graduation_year?.toString() || ''}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, graduation_year: parseInt(value) }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select graduation year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="high_school" className="text-base font-medium">High School</Label>
                  <Input
                    id="high_school"
                    placeholder="Enter your high school name"
                    value={profileData.high_school}
                    onChange={(e) => setProfileData(prev => ({ ...prev, high_school: e.target.value }))}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Extracurricular Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Extracurricular Activities
                </CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={addExtracurricular}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.extracurriculars.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Input
                        value={activity}
                        onChange={(e) => updateExtracurricular(index, e.target.value)}
                        placeholder="Enter extracurricular activity (e.g., Debate Team, Volunteer Work)"
                        disabled={!isEditing}
                        className="flex-1 h-11"
                      />
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExtracurricular(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {profileData.extracurriculars.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                      <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-muted-foreground mb-2">No extracurricular activities added yet</p>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={addExtracurricular}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Activity
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* College Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  College Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.collegePreferences.map((pref, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                        {pref}
                        {isEditing && (
                          <button
                            onClick={() => {
                              setProfileData(prev => ({
                                ...prev,
                                collegePreferences: prev.collegePreferences.filter((_, i) => i !== index)
                              }));
                            }}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Urban setting', 'Rural setting', 'Research opportunities', 'Technology-focused', 
                        'Liberal arts', 'Large campus', 'Small campus', 'Diverse student body', 'Strong athletics',
                        'Study abroad programs', 'Internship opportunities', 'Strong alumni network'].map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          className="justify-start text-sm h-auto py-2 hover:bg-blue-50"
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

          {/* Profile Summary Sidebar */}
          <div className="space-y-6">
            {/* Profile Strength */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{profileStrength}%</div>
                  <Badge variant="secondary" className={`text-sm px-3 py-1 ${strengthInfo.color}`}>
                    {strengthInfo.label}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Academic Profile:</span>
                      <span className="font-medium text-green-600">
                        {profileData.gpa > 3.5 ? "Excellent" : profileData.gpa > 3.0 ? "Good" : "Improving"}
                      </span>
                    </div>
                    <Progress value={Math.min(100, (profileData.gpa / 4.0) * 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Test Scores:</span>
                      <span className="font-medium text-blue-600">
                        {(profileData.sat_score > 1400 || profileData.act_score > 30) ? "Strong" : 
                         (profileData.sat_score > 1200 || profileData.act_score > 25) ? "Good" : "Improving"}
                      </span>
                    </div>
                    <Progress value={Math.min(100, Math.max((profileData.sat_score / 1600) * 100, (profileData.act_score / 36) * 100))} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Profile Completeness:</span>
                      <span className="font-medium">{profileStrength}%</span>
                    </div>
                    <Progress value={profileStrength} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.gpa === 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-900">
                      📚 Add your GPA to get personalized college recommendations
                    </p>
                  </div>
                )}
                {(profileData.sat_score === 0 && profileData.act_score === 0) && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      🎯 Add your SAT or ACT score to improve your profile strength
                    </p>
                  </div>
                )}
                {profileData.extracurriculars.length === 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-900">
                      🏆 Add extracurricular activities to stand out to colleges
                    </p>
                  </div>
                )}
                {profileStrength >= 80 && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-900">
                      ✨ Your profile looks great! Consider applying to reach schools
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
