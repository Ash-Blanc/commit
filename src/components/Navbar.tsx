
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedColleges } from '@/hooks/useSavedColleges';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings, Search, BookOpen, Target, FileText, GraduationCap, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from '@/components/NotificationCenter';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { savedColleges } = useSavedColleges();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">Commit</span>
            </Link>
            
            {user && (
              <Menubar className="border-0 bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-medium hover:text-primary">
                    Explore
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link to="/college-search" className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        College Search
                      </Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link to="/recommendations" className="flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Recommendations
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem asChild>
                      <Link to="/applications" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        My Applications
                      </Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-medium hover:text-primary">
                    Study Tools
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link to="/essay-assistant" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Essay Assistant
                      </Link>
                    </MenubarItem>
                    <MenubarItem disabled>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      SAT Prep
                      <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
                    </MenubarItem>
                    <MenubarItem disabled>
                      <Target className="mr-2 h-4 w-4" />
                      Interview Prep
                      <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger className="text-sm font-medium hover:text-primary">
                    Progress
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link to="/applications" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Application Status
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Learning Path
                      <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Heart className="h-4 w-4" />
                      {savedColleges.length > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                          {savedColleges.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel>Saved Colleges ({savedColleges.length})</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {savedColleges.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No saved colleges yet
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {savedColleges.map((saved) => (
                          <DropdownMenuItem key={saved.id} asChild>
                            <Link 
                              to={`/college-search`} 
                              className="flex flex-col items-start p-3 hover:bg-muted"
                            >
                              <span className="font-medium">{saved.college?.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {saved.college?.location}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/college-search" className="w-full text-center">
                        View All Colleges
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <NotificationCenter />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Student
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
