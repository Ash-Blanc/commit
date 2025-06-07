
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Bot, Clock, Target, Users, CheckCircle, Sparkles, TrendingUp } from "lucide-react";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">Commit</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200" variant="secondary">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered College Applications
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Get Into Your Dream College with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Commit automates your college applications, writes personalized essays, and maximizes your chances of acceptance at mid-tier universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200">
              <Link to="/auth" className="flex items-center">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
              <TrendingUp className="w-4 h-4 mr-1" />
              Proven Results
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Why Choose Commit?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform is specifically designed for students targeting mid-tier universities, 
              providing personalized guidance and automation that gets results.
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">20+</div>
              <p className="text-sm text-muted-foreground">Hours Saved</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Students Helped</p>
            </div>
          </div>
          
          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-800">Save 20+ Hours</CardTitle>
                <CardDescription className="text-emerald-600">
                  Automate form filling and application management with intelligent AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Auto-fill applications
                </div>
                <div className="flex items-center text-sm text-emerald-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Smart deadline tracking
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-teal-50 to-teal-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-teal-800">AI Essay Writing</CardTitle>
                <CardDescription className="text-teal-600">
                  Get personalized essays tailored to each college's requirements and culture
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-teal-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Personalized content
                </div>
                <div className="flex items-center text-sm text-teal-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Real-time feedback
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-cyan-800">Smart Matching</CardTitle>
                <CardDescription className="text-cyan-600">
                  Find colleges that perfectly match your profile, goals, and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-cyan-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Profile analysis
                </div>
                <div className="flex items-center text-sm text-cyan-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success predictions
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-emerald-50 to-teal-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-800">Mid-Tier Focus</CardTitle>
                <CardDescription className="text-emerald-600">
                  Specialized guidance for realistic college targets with proven strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Realistic targeting
                </div>
                <div className="flex items-center text-sm text-emerald-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Expert strategies
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                <h4 className="font-semibold mb-2">Create Your Profile</h4>
                <p className="text-sm text-muted-foreground">Tell us about your academics, interests, and goals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                <h4 className="font-semibold mb-2">AI Finds Matches</h4>
                <p className="text-sm text-muted-foreground">Our AI identifies perfect college matches for you</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                <h4 className="font-semibold mb-2">Apply with Confidence</h4>
                <p className="text-sm text-muted-foreground">Submit polished applications and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Ready to Transform Your College Applications?</CardTitle>
              <CardDescription className="text-emerald-100">
                Join thousands of students who have successfully automated their college application process with Commit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" variant="secondary" asChild className="bg-white text-emerald-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
                <Link to="/auth" className="flex items-center">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-emerald-100 mt-3">No credit card required • Start in 2 minutes</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
