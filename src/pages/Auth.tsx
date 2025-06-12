
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Brain, GraduationCap, Star, Users, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.firstName,
      signUpData.lastName
    );
    
    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Welcome to your college application journey!",
      });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your College Success Starts Here
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Join thousands of students using AI to craft perfect essays, find ideal colleges, and manage applications effortlessly.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">AI Essay Assistant</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">Smart College Matching</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Application Tracking</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Expert Guidance</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$2M+</div>
              <div className="text-sm text-muted-foreground">Scholarships</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <p className="text-muted-foreground">
                Sign in or create your account to get started
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={signInData.password}
                          onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="First name"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Last name"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min 6 characters)"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
