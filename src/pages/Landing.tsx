
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Bot, Clock, Target, Users, CheckCircle, Sparkles, TrendingUp, Zap, Brain, FileText, Chrome, BarChart3, RefreshCw, Star } from "lucide-react";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">Commit</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
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
          <Badge className="mb-4 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-indigo-200" variant="secondary">
            <Star className="w-4 h-4 mr-1" />
            Used by 5,000+ Students • 10,000+ Successful Applications
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Smart Students Choose COMMIT
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            The only comprehensive college application automation platform that combines time-saving form filling with strategic AI essay guidance.
          </p>
          <p className="text-lg font-semibold text-indigo-700 mb-8">
            Priced at 97% less than traditional consulting • Results in 2 hours, not 60
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transform hover:scale-105 transition-all duration-200">
              <Link to="/auth" className="flex items-center">
                Get Results in 2 Hours <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              Watch Demo
            </Button>
          </div>
          
          {/* Urgency Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-red-700 font-medium">
              ⚡ Application deadlines approaching • Join students getting accepted today
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <p className="text-indigo-100">Successful Applications</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <p className="text-indigo-100">Students Accepted</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">60+</div>
              <p className="text-indigo-100">Hours Saved Per Student</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">97%</div>
              <p className="text-indigo-100">Less Than Traditional Consulting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-indigo-200">
              <Brain className="w-4 h-4 mr-1" />
              Based on 10,000+ Successful Applications
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">
              Proven Essay Frameworks That Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We know what works. You've got this. Let's get it done. Used by top counselors with strategic AI guidance 
              that keeps students in control of their authentic voice and story.
            </p>
          </div>
          
          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-indigo-800">Common App Auto-Fill</CardTitle>
                <CardDescription className="text-indigo-600">
                  Chrome-based browser automation for Profile, Common App, and Academics/Activities sections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-indigo-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Student JSON profile system
                </div>
                <div className="flex items-center text-sm text-indigo-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Puppeteer automation
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-violet-50 to-violet-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-violet-800">Dual-Layer AI Essays</CardTitle>
                <CardDescription className="text-violet-600">
                  Intent interpretation + strategic enhancement with proven frameworks from 10,000+ applications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-violet-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  AI scoring system
                </div>
                <div className="flex items-center text-sm text-violet-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Before/after comparison
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-purple-800">Pre-Analyzed Prompts</CardTitle>
                <CardDescription className="text-purple-600">
                  Supplemental prompts for 10 target colleges with strategic guidance from top counselors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-purple-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  College-specific strategies
                </div>
                <div className="flex items-center text-sm text-purple-600 mt-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Expert analysis
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dual Processing Messages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Zap className="w-6 h-6 text-green-600 mr-2" />
                  <CardTitle className="text-green-800">For Motivated Students</CardTitle>
                </div>
                <CardDescription className="text-green-700">
                  "Based on 10,000+ successful applications, proven essay frameworks that work. 
                  Save 60+ hours while improving results."
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Users className="w-6 h-6 text-blue-600 mr-2" />
                  <CardTitle className="text-blue-800">For Overwhelmed Students</CardTitle>
                </div>
                <CardDescription className="text-blue-700">
                  "Used by top counselors, join 5,000+ students who got accepted. 
                  Application deadlines approaching."
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Technical Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <Chrome className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Browser Automation</h4>
              <p className="text-sm text-muted-foreground">Chrome-based Puppeteer integration</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <BarChart3 className="w-8 h-8 text-violet-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">AI Scoring System</h4>
              <p className="text-sm text-muted-foreground">Advanced essay evaluation metrics</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <RefreshCw className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Before/After Analysis</h4>
              <p className="text-sm text-muted-foreground">Compare essay improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-indigo-50/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Get Results in 3 Simple Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="font-semibold mb-2 text-lg">Create JSON Profile</h4>
              <p className="text-muted-foreground">Input your academic data into our structured system for automated form filling</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="font-semibold mb-2 text-lg">AI Essay Enhancement</h4>
              <p className="text-muted-foreground">Our dual-layer AI analyzes and enhances your essays using proven frameworks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h4 className="font-semibold mb-2 text-lg">Automated Submission</h4>
              <p className="text-muted-foreground">Browser automation handles Common App forms while you stay in control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Clock className="w-4 h-4 mr-1" />
                  Limited Time • Deadlines Approaching
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-4">We Know What Works. You've Got This.</CardTitle>
              <CardDescription className="text-indigo-100 text-lg">
                Join 5,000+ students who chose COMMIT and got accepted. 
                Start with proven frameworks from 10,000+ successful applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">✓ 2 Hours</div>
                  <div className="text-indigo-100">Not 60 hours</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">✓ 97% Less</div>
                  <div className="text-indigo-100">Than consultants</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">✓ Your Voice</div>
                  <div className="text-indigo-100">Authentic story</div>
                </div>
              </div>
              <Button size="lg" variant="secondary" asChild className="bg-white text-indigo-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
                <Link to="/auth" className="flex items-center">
                  Get Started Now - Results in 2 Hours <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-indigo-100 mt-4">No credit card required • Used by top counselors • 5,000+ students accepted</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
