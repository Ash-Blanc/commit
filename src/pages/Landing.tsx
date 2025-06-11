import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import Navbar from '@/components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Unlock Your College Potential
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Craft compelling essays, discover your ideal colleges, and manage your applications with ease.
        </p>
        
        <div className="space-y-4">
          <Button size="lg" className="w-full" asChild>
            <Link to="/auth?mode=signup">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/auth?mode=signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
