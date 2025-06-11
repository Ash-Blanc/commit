
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface Recommendation {
  id: string;
  college_name: string;
  match_percentage: number;
  reasons: string[];
  type: 'safety' | 'target' | 'reach';
}

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();

  const fetchRecommendations = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recommendations', {
        body: { profile }
      });

      if (error) throw error;

      setRecommendations(data?.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile]);

  return {
    recommendations,
    loading,
    fetchRecommendations,
  };
};
