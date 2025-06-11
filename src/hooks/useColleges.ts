
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface College {
  id: string;
  name: string;
  location: string | null;
  city: string | null;
  state: string | null;
  tuition_in_state: number | null;
  tuition_out_state: number | null;
  acceptance_rate: number | null;
  enrollment: number | null;
  ranking: string | null;
  website_url: string | null;
  application_deadline: string | null;
  early_deadline: string | null;
  college_majors?: { major_name: string }[];
  majors?: string[];
  match_score?: number;
  match_reasons?: string[];
}

export interface CollegeSearchFilters {
  location?: string;
  state?: string;
  major?: string;
  tuitionMin?: number;
  tuitionMax?: number;
  acceptanceRateMin?: number;
  acceptanceRateMax?: number;
  enrollmentSize?: string;
}

export const useColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select(`
          *,
          college_majors(major_name)
        `)
        .order('name');

      if (collegesError) {
        console.error('Error fetching colleges:', collegesError);
        return;
      }

      const collegesWithMajors = collegesData.map(college => ({
        ...college,
        majors: college.college_majors?.map(m => m.major_name) || []
      }));

      setColleges(collegesWithMajors);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchColleges = async (filters: CollegeSearchFilters): Promise<College[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('college-search', {
        body: filters
      });

      if (error) throw error;

      return data.colleges.map((college: any) => ({
        ...college,
        majors: college.college_majors?.map((m: any) => m.major_name) || []
      }));
    } catch (error) {
      console.error('Error searching colleges:', error);
      return [];
    }
  };

  const getRecommendations = async (): Promise<College[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('recommendations');

      if (error) throw error;

      return data.recommendations || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  };

  return {
    colleges,
    loading,
    refetch: fetchColleges,
    searchColleges,
    getRecommendations,
  };
};
