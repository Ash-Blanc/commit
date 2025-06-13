
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SavedCollege {
  id: string;
  college_id: string;
  user_id: string;
  created_at: string;
  college?: {
    id: string;
    name: string;
    location: string;
    state: string;
  };
}

export const useSavedColleges = () => {
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSavedColleges = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_colleges')
        .select(`
          *,
          colleges(id, name, location, state)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedColleges(data || []);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCollege = async (collegeId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save colleges.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_colleges')
        .insert({
          user_id: user.id,
          college_id: collegeId
        });

      if (error) throw error;

      toast({
        title: "College Saved",
        description: "College has been added to your favorites.",
      });

      await fetchSavedColleges();
    } catch (error) {
      console.error('Error saving college:', error);
      toast({
        title: "Error",
        description: "Failed to save college. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unsaveCollege = async (collegeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_colleges')
        .delete()
        .eq('user_id', user.id)
        .eq('college_id', collegeId);

      if (error) throw error;

      toast({
        title: "College Removed",
        description: "College has been removed from your favorites.",
      });

      await fetchSavedColleges();
    } catch (error) {
      console.error('Error removing saved college:', error);
      toast({
        title: "Error",
        description: "Failed to remove college. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isCollegeSaved = (collegeId: string) => {
    return savedColleges.some(saved => saved.college_id === collegeId);
  };

  useEffect(() => {
    fetchSavedColleges();
  }, [user]);

  return {
    savedColleges,
    loading,
    saveCollege,
    unsaveCollege,
    isCollegeSaved,
    fetchSavedColleges,
  };
};
