
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PersonalizationData {
  major: string;
  gpa: string;
  classSize: string;
  research: string;
  location: string;
  campusSetting: string;
  distance: string;
  extracurriculars: string;
  activities: string[];
  diversity: string;
  budget: string;
  financialAid: string;
  housing: string;
  collegeVibe: string;
  topPriority: string;
}

interface PersonalizationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonalizationForm = ({ isOpen, onClose }: PersonalizationFormProps) => {
  const [formData, setFormData] = useState<PersonalizationData>({
    major: '',
    gpa: '',
    classSize: '',
    research: '',
    location: '',
    campusSetting: '',
    distance: '',
    extracurriculars: '',
    activities: [],
    diversity: '',
    budget: '',
    financialAid: '',
    housing: '',
    collegeVibe: '',
    topPriority: ''
  });

  const handleActivityChange = (activity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activities: checked 
        ? [...prev.activities, activity]
        : prev.activities.filter(a => a !== activity)
    }));
  };

  const handleSubmit = () => {
    console.log('Personalization data:', formData);
    toast({
      title: "Preferences Saved",
      description: "Your college preferences have been updated successfully.",
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            College Personalization
          </SheetTitle>
          <SheetDescription>
            Help us understand your preferences to provide better college recommendations.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Academic Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What major or field of study are you interested in?</Label>
                <Select value={formData.major} onValueChange={(value) => setFormData(prev => ({ ...prev, major: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="undecided">Undecided</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>What's your current GPA?</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  placeholder="e.g., 3.5"
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>How important is small class size to you?</Label>
                <RadioGroup 
                  value={formData.classSize} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, classSize: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-important" id="class-size-1" />
                    <Label htmlFor="class-size-1">Not important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="class-size-2" />
                    <Label htmlFor="class-size-2">Somewhat important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-important" id="class-size-3" />
                    <Label htmlFor="class-size-3">Very important</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Are you interested in undergraduate research or internships?</Label>
                <RadioGroup 
                  value={formData.research} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, research: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="research-1" />
                    <Label htmlFor="research-1">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="research-2" />
                    <Label htmlFor="research-2">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="research-3" />
                    <Label htmlFor="research-3">Maybe</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Geographic Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Where do you want to attend college?</Label>
                <Input
                  placeholder="e.g., California, Southeast, Anywhere"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>What's your preferred campus setting?</Label>
                <RadioGroup 
                  value={formData.campusSetting} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campusSetting: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urban" id="setting-1" />
                    <Label htmlFor="setting-1">Urban</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suburban" id="setting-2" />
                    <Label htmlFor="setting-2">Suburban</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rural" id="setting-3" />
                    <Label htmlFor="setting-3">Rural</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>How far from home are you comfortable going?</Label>
                <RadioGroup 
                  value={formData.distance} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, distance: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under-100" id="distance-1" />
                    <Label htmlFor="distance-1">Under 100 miles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="100-300" id="distance-2" />
                    <Label htmlFor="distance-2">100-300 miles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="300-plus" id="distance-3" />
                    <Label htmlFor="distance-3">300+ miles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-limit" id="distance-4" />
                    <Label htmlFor="distance-4">No limit</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Social and Extracurricular Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social & Extracurricular Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>How important are extracurriculars (sports, clubs, arts)?</Label>
                <RadioGroup 
                  value={formData.extracurriculars} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, extracurriculars: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-important" id="extra-1" />
                    <Label htmlFor="extra-1">Not important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="extra-2" />
                    <Label htmlFor="extra-2">Somewhat important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-important" id="extra-3" />
                    <Label htmlFor="extra-3">Very important</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Which activities are you passionate about?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Music', 'Athletics', 'Debate', 'Theater', 'Volunteering', 'Student Government', 'Academic Clubs', 'Greek Life'].map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={formData.activities.includes(activity)}
                        onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                      />
                      <Label htmlFor={activity} className="text-sm">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>How much do you value campus diversity?</Label>
                <RadioGroup 
                  value={formData.diversity} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, diversity: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-important" id="diversity-1" />
                    <Label htmlFor="diversity-1">Not important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="diversity-2" />
                    <Label htmlFor="diversity-2">Somewhat important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-important" id="diversity-3" />
                    <Label htmlFor="diversity-3">Very important</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Financial Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>What's your annual budget for college (tuition, fees, housing)?</Label>
                <RadioGroup 
                  value={formData.budget} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under-10k" id="budget-1" />
                    <Label htmlFor="budget-1">Under $10K</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10k-30k" id="budget-2" />
                    <Label htmlFor="budget-2">$10K - $30K</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30k-50k" id="budget-3" />
                    <Label htmlFor="budget-3">$30K - $50K</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="over-50k" id="budget-4" />
                    <Label htmlFor="budget-4">Over $50K</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-limit" id="budget-5" />
                    <Label htmlFor="budget-5">No limit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>How important is financial aid or scholarships?</Label>
                <RadioGroup 
                  value={formData.financialAid} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, financialAid: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-important" id="aid-1" />
                    <Label htmlFor="aid-1">Not important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="somewhat" id="aid-2" />
                    <Label htmlFor="aid-2">Somewhat important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-important" id="aid-3" />
                    <Label htmlFor="aid-3">Very important</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Do you plan to live on-campus or off-campus?</Label>
                <RadioGroup 
                  value={formData.housing} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, housing: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on-campus" id="housing-1" />
                    <Label htmlFor="housing-1">On-campus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="off-campus" id="housing-2" />
                    <Label htmlFor="housing-2">Off-campus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-preference" id="housing-3" />
                    <Label htmlFor="housing-3">No preference</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Personal Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>What's your ideal college vibe?</Label>
                <RadioGroup 
                  value={formData.collegeVibe} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, collegeVibe: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic-focused" id="vibe-1" />
                    <Label htmlFor="vibe-1">Academic-focused</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="social" id="vibe-2" />
                    <Label htmlFor="vibe-2">Social</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="career-driven" id="vibe-3" />
                    <Label htmlFor="vibe-3">Career-driven</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="vibe-4" />
                    <Label htmlFor="vibe-4">Balanced</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>What's your top priority in choosing a college?</Label>
                <Select value={formData.topPriority} onValueChange={(value) => setFormData(prev => ({ ...prev, topPriority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your top priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="academics">Academics</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="career-opportunities">Career Opportunities</SelectItem>
                    <SelectItem value="prestige">Prestige</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Save Preferences
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PersonalizationForm;
