
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CollegeSearchRequest {
  location?: string;
  state?: string;
  major?: string;
  tuitionMin?: number;
  tuitionMax?: number;
  acceptanceRateMin?: number;
  acceptanceRateMax?: number;
  enrollmentSize?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const searchParams: CollegeSearchRequest = await req.json();

    let query = supabase
      .from('colleges')
      .select(`
        *,
        college_majors(major_name)
      `);

    // Apply filters
    if (searchParams.state) {
      query = query.eq('state', searchParams.state);
    }

    if (searchParams.tuitionMin || searchParams.tuitionMax) {
      if (searchParams.tuitionMin) {
        query = query.gte('tuition_out_state', searchParams.tuitionMin);
      }
      if (searchParams.tuitionMax) {
        query = query.lte('tuition_out_state', searchParams.tuitionMax);
      }
    }

    if (searchParams.acceptanceRateMin) {
      query = query.gte('acceptance_rate', searchParams.acceptanceRateMin / 100);
    }
    if (searchParams.acceptanceRateMax) {
      query = query.lte('acceptance_rate', searchParams.acceptanceRateMax / 100);
    }

    const { data: colleges, error } = await query;

    if (error) {
      throw error;
    }

    // Filter by major if specified
    let filteredColleges = colleges;
    if (searchParams.major) {
      filteredColleges = colleges?.filter(college => 
        college.college_majors?.some((major: any) => 
          major.major_name.toLowerCase().includes(searchParams.major!.toLowerCase())
        )
      );
    }

    // Filter by enrollment size
    if (searchParams.enrollmentSize) {
      filteredColleges = filteredColleges?.filter(college => {
        const enrollment = college.enrollment || 0;
        switch (searchParams.enrollmentSize) {
          case 'small':
            return enrollment < 5000;
          case 'medium':
            return enrollment >= 5000 && enrollment <= 15000;
          case 'large':
            return enrollment > 15000;
          default:
            return true;
        }
      });
    }

    return new Response(JSON.stringify({ colleges: filteredColleges || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in college-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
