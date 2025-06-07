
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface College {
  id: string;
  name: string;
  location: string | null;
  state: string | null;
  tuition_in_state: number | null;
  tuition_out_state: number | null;
  acceptance_rate: number | null;
  enrollment: number | null;
  ranking: string | null;
  website_url: string | null;
  application_deadline: string | null;
  early_deadline: string | null;
  majors?: string[];
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
        .select('*')
        .order('name');

      if (collegesError) {
        console.error('Error fetching colleges:', collegesError);
        return;
      }

      // Fetch majors for each college
      const { data: majorsData, error: majorsError } = await supabase
        .from('college_majors')
        .select('college_id, major_name');

      if (majorsError) {
        console.error('Error fetching majors:', majorsError);
        return;
      }

      // Group majors by college
      const majorsByCollege = majorsData.reduce((acc, major) => {
        if (!acc[major.college_id]) {
          acc[major.college_id] = [];
        }
        acc[major.college_id].push(major.major_name);
        return acc;
      }, {} as Record<string, string[]>);

      // Combine colleges with their majors
      const collegesWithMajors = collegesData.map(college => ({
        ...college,
        majors: majorsByCollege[college.id] || []
      }));

      setColleges(collegesWithMajors);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    colleges,
    loading,
    refetch: fetchColleges,
  };
};
