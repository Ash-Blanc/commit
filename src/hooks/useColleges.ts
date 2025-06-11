
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  tuition_in_state: number;
  tuition_out_state: number;
  acceptance_rate: number;
  enrollment: number;
  ranking: string;
  website_url: string;
  application_deadline: string;
  early_deadline: string;
  created_at: string;
  majors: string[];
}

export const useColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select(`
          *,
          college_majors(major_name)
        `);

      if (error) throw error;

      const collegesWithMajors = data?.map(college => ({
        ...college,
        city: college.location?.split(',')[0]?.trim() || college.state || 'Unknown',
        majors: college.college_majors?.map((major: any) => major.major_name) || []
      })) || [];

      setColleges(collegesWithMajors);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchColleges = async (filters: {
    state?: string;
    major?: string;
    tuitionMax?: number;
    acceptanceRateMin?: number;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('college-search', {
        body: filters
      });

      if (error) throw error;

      const collegesWithMajors = data?.colleges?.map((college: any) => ({
        ...college,
        city: college.location?.split(',')[0]?.trim() || college.state || 'Unknown',
        majors: college.college_majors?.map((major: any) => major.major_name) || []
      })) || [];

      setColleges(collegesWithMajors);
    } catch (error) {
      console.error('Error searching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (profileData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recommendations', {
        body: { profile: profileData }
      });

      if (error) throw error;

      return data?.recommendations || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  return {
    colleges,
    loading,
    fetchColleges,
    searchColleges,
    getRecommendations,
  };
};
