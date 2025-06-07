
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to Commit!",
        description: "You've been added to our waitlist. We'll notify you when you can access the platform.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = async () => {
    await login('demo@example.com', 'password');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Commit</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleDemoLogin}>
              Try Demo
            </Button>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              🎓 Coming Soon - Join the Waitlist
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Commit
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your AI-powered all-in-one for college applications
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Automates forms, provides tailored essay guidance for mid-tier universities, and cuts your 
            application time from <span className="font-semibold text-orange-600">60-80 hours</span> to just{' '}
            <span className="font-semibold text-green-600">2-3 hours</span>. Seamless submissions and support from 
            high school to college!
          </p>

          {/* Time Savings Visual */}
          <div className="mb-12">
            <Card className="max-w-lg mx-auto bg-gradient-to-r from-orange-50 to-green-50 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">60-80 hrs</div>
                    <div className="text-sm text-muted-foreground">Traditional Way</div>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2-3 hrs</div>
                    <div className="text-sm text-muted-foreground">With Commit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Less Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Join the Commit Waitlist</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to transform your college application journey
            </p>
            
            <form onSubmit={handleWaitlistSignup} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Waitlist →'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 text-center border-0 bg-blue-50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold mb-2">AI Essay Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized writing guidance and feedback to craft compelling essays
            </p>
          </Card>
          
          <Card className="p-6 text-center border-0 bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Smart Matching</h3>
            <p className="text-sm text-muted-foreground">
              Find colleges that match your profile and preferences perfectly
            </p>
          </Card>
          
          <Card className="p-6 text-center border-0 bg-purple-50">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Automated Applications</h3>
            <p className="text-sm text-muted-foreground">
              Streamline your application process with intelligent automation
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
