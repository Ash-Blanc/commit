
import { supabase } from '@/integrations/supabase/client';

interface CollegeSearchResult {
  id: string;
  name: string;
  location: string;
  country: string;
  state: string;
  website: string;
  type: 'university' | 'college';
  tuition_in_state?: number;
  tuition_out_state?: number;
  acceptance_rate?: number;
  enrollment?: number;
  ranking?: string;
  application_deadline?: string;
  early_deadline?: string;
  majors?: string[];
}

export class CollegeSearchService {
  async searchColleges(query: string, country?: string): Promise<CollegeSearchResult[]> {
    try {
      console.log('Searching for colleges:', query);
      
      let searchQuery = supabase
        .from('colleges')
        .select(`
          *,
          college_majors(major_name)
        `);

      if (query.trim()) {
        searchQuery = searchQuery.ilike('name', `%${query}%`);
      }

      if (country && country !== 'all') {
        searchQuery = searchQuery.eq('state', country);
      }

      const { data, error } = await searchQuery.limit(50);

      if (error) {
        console.error('Error searching colleges:', error);
        throw error;
      }

      console.log('Found colleges:', data?.length || 0);

      return (data || []).map(college => ({
        id: college.id,
        name: college.name,
        location: college.location || `${college.state}`,
        country: 'United States',
        state: college.state || '',
        website: college.website_url || '',
        type: college.name.toLowerCase().includes('college') ? 'college' : 'university',
        tuition_in_state: college.tuition_in_state,
        tuition_out_state: college.tuition_out_state,
        acceptance_rate: college.acceptance_rate,
        enrollment: college.enrollment,
        ranking: college.ranking,
        application_deadline: college.application_deadline,
        early_deadline: college.early_deadline,
        majors: college.college_majors?.map((major: any) => major.major_name) || []
      }));
    } catch (error) {
      console.error('Error in searchColleges:', error);
      return [];
    }
  }

  async getCollegesByCountry(country: 'US' | 'UK' | 'Singapore'): Promise<CollegeSearchResult[]> {
    const stateMap = {
      'US': ['California', 'New York', 'Texas', 'Florida', 'Massachusetts'],
      'UK': ['England', 'Scotland', 'Wales'],
      'Singapore': ['Singapore']
    };

    try {
      let query = supabase
        .from('colleges')
        .select(`
          *,
          college_majors(major_name)
        `);

      if (country === 'US') {
        query = query.in('state', stateMap.US);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      return (data || []).map(college => ({
        id: college.id,
        name: college.name,
        location: college.location || college.state || '',
        country: country === 'US' ? 'United States' : country === 'UK' ? 'United Kingdom' : 'Singapore',
        state: college.state || '',
        website: college.website_url || '',
        type: college.name.toLowerCase().includes('college') ? 'college' : 'university',
        tuition_in_state: college.tuition_in_state,
        tuition_out_state: college.tuition_out_state,
        acceptance_rate: college.acceptance_rate,
        enrollment: college.enrollment,
        ranking: college.ranking,
        application_deadline: college.application_deadline,
        early_deadline: college.early_deadline,
        majors: college.college_majors?.map((major: any) => major.major_name) || []
      }));
    } catch (error) {
      console.error('Error fetching colleges by country:', error);
      return [];
    }
  }

  async getTopColleges(): Promise<CollegeSearchResult[]> {
    try {
      console.log('Fetching top colleges...');
      
      const { data, error } = await supabase
        .from('colleges')
        .select(`
          *,
          college_majors(major_name)
        `)
        .not('ranking', 'is', null)
        .order('ranking', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Error fetching top colleges:', error);
        throw error;
      }

      console.log('Found top colleges:', data?.length || 0);

      return (data || []).map(college => ({
        id: college.id,
        name: college.name,
        location: college.location || college.state || '',
        country: 'United States',
        state: college.state || '',
        website: college.website_url || '',
        type: college.name.toLowerCase().includes('college') ? 'college' : 'university',
        tuition_in_state: college.tuition_in_state,
        tuition_out_state: college.tuition_out_state,
        acceptance_rate: college.acceptance_rate,
        enrollment: college.enrollment,
        ranking: college.ranking,
        application_deadline: college.application_deadline,
        early_deadline: college.early_deadline,
        majors: college.college_majors?.map((major: any) => major.major_name) || []
      }));
    } catch (error) {
      console.error('Error in getTopColleges:', error);
      return [];
    }
  }
}

export const collegeSearchService = new CollegeSearchService();
