
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  high_school: string;
  graduation_year: number;
  gpa: number;
  sat_score: number;
  act_score: number;
  intended_major: string;
  budget?: number;
  interests?: string[];
  extracurriculars?: string[];
  target_major?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    setLoading(true);
    try {
      const profileData = {
        ...updates,
        budget: updates.budget || 50000,
        interests: updates.interests || [],
        extracurriculars: updates.extracurriculars || [],
        target_major: updates.target_major || updates.intended_major || '',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('student_profiles')
        .upsert({
          id: user.id,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
  };
};
