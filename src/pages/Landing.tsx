
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { GraduationCap, BookOpen, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Smart College Matching",
      description: "AI-powered recommendations based on your profile, preferences, and academic achievements."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Essay Assistant",
      description: "Get personalized essay ideas, outlines, and feedback to craft compelling applications."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Application Tracking",
      description: "Organize and track all your college applications in one centralized dashboard."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI to improve your application strategy and chances of admission."
    }
  ];

  const benefits = [
    "Personalized college recommendations",
    "AI-powered essay assistance",
    "Application deadline tracking",
    "Profile strength analysis",
    "Academic goal planning",
    "24/7 AI guidance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                Your College Journey
                <br />
                <span className="text-4xl lg:text-6xl">Starts Here</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover your perfect college match, craft compelling essays, and manage applications with our AI-powered platform designed for ambitious students.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-2 hover:bg-primary/5" asChild>
                <Link to="/auth?mode=signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and guidance you need for a successful college application journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 hover:scale-105">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Students Choose Commit
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who have successfully navigated their college applications with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-primary/5 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-lg font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-8 text-white">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto">
              Start your college journey today with personalized AI guidance and expert insights.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
              <Link to="/auth?mode=signup">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-primary">Commit</h3>
            <p className="text-muted-foreground">Your trusted partner in college admissions success.</p>
            <div className="text-sm text-muted-foreground">
              © 2024 Commit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
