
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  profile?: {
    gpa: number;
    satScore?: number;
    actScore?: number;
    extracurriculars: string[];
    intendedMajor: string;
    collegePreferences: string[];
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Mock logged in user for demo
    return {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'student',
      profile: {
        gpa: 3.8,
        satScore: 1450,
        extracurriculars: ['Debate Team', 'Volunteer Work', 'Soccer'],
        intendedMajor: 'Computer Science',
        collegePreferences: ['Technology-focused', 'Urban setting', 'Research opportunities']
      }
    };
  });

  const login = async (email: string, password: string) => {
    // Mock login - in real app this would call your auth API
    console.log('Login attempt:', email);
    setUser({
      id: '1',
      name: 'Alex Johnson',
      email,
      role: 'student',
      profile: {
        gpa: 3.8,
        satScore: 1450,
        extracurriculars: ['Debate Team', 'Volunteer Work', 'Soccer'],
        intendedMajor: 'Computer Science',
        collegePreferences: ['Technology-focused', 'Urban setting', 'Research opportunities']
      }
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
