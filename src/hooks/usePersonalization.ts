
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PersonalizationPreferences {
  id?: string;
  academic_preferences: any;
  geographic_preferences: any;
  social_preferences: any;
  financial_preferences: any;
  personal_goals: any;
  created_at?: string;
  updated_at?: string;
}

export const usePersonalization = () => {
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personalization_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (data: Omit<PersonalizationPreferences, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('personalization-save', {
        body: data
      });

      if (error) throw error;

      setPreferences(result.data);
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    fetchPreferences,
    savePreferences,
  };
};
