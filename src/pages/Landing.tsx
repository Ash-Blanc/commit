import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>
              <span className="text-xl font-bold">COMMIT</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-accent/20">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            ⚡ Used by 5,000+ students • 97% less than traditional consulting
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            College Apps in 
            <span className="text-primary"> 2 Hours</span>, 
            Not 60
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            The only comprehensive college application automation platform that combines time-saving form filling 
            with strategic AI essay guidance. <span className="text-primary font-semibold">Smart students choose COMMIT.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="md" className="text-lg px-8 py-6 h-auto" asChild>
              <Link to="/auth">
                Start Automating Now
                <span className="ml-2">→</span>
              </Link>
            </Button>
            <Button variant="outline" size="md" className="text-lg px-8 py-6 h-auto">
              Watch 2-Min Demo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Successful Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">60+</div>
              <div className="text-muted-foreground">Hours Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">97%</div>
              <div className="text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2</div>
              <div className="text-muted-foreground">Hours to Complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">Automated Form Filling</h3>
              <p className="text-muted-foreground">
                Automatically fill out college application forms with your profile data, saving hours of manual entry.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">AI Essay Assistant</h3>
              <p className="text-muted-foreground">
                Get AI-powered suggestions and feedback to craft compelling essays that highlight your strengths.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">Smart Application Tracking</h3>
              <p className="text-muted-foreground">
                Track your application progress with real-time updates and automated submission reminders.
              </p>
            </div>
             {/* Feature 4 */}
             <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">College Search</h3>
              <p className="text-muted-foreground">
               Find the right college for you.
              </p>
            </div>
             {/* Feature 5 */}
             <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-muted-foreground">
                Keep your profile updated for better AI recommendations.
              </p>
            </div>
             {/* Feature 6 */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-2">Progress</h3>
              <p className="text-muted-foreground">
                Track your application progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <div className="text-2xl font-bold mb-4">$9/month</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Automated Form Filling</li>
                <li>Limited AI Essay Feedback</li>
                <li>Basic Application Tracking</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            {/* Pro Plan */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <div className="text-2xl font-bold mb-4">$29/month</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Everything in Basic</li>
                <li>Unlimited AI Essay Feedback</li>
                <li>Advanced Application Tracking</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            {/* Premium Plan */}
            <div className="p-6 rounded-lg shadow-md bg-card">
              <h3 className="text-xl font-semibold mb-4">Premium</h3>
              <div className="text-2xl font-bold mb-4">$49/month</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Everything in Pro</li>
                <li>Priority Support</li>
                <li>Dedicated AI Consultant</li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Watch a Demo</h2>
          <div className="relative aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/your-demo-video-id"
              title="YouTube video"
              allowFullScreen
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">C</span>
                </div>
                <span className="font-bold">COMMIT</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The comprehensive college application automation platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 COMMIT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
