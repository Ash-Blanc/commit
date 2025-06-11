
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
    }

    // Get user profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get all colleges with majors
    const { data: colleges } = await supabase
      .from('colleges')
      .select(`
        *,
        college_majors(major_name)
      `);

    // Rule-based matching algorithm
    const recommendations = colleges?.map(college => {
      let score = 0;
      let reasons = [];

      // GPA matching
      if (profile.gpa) {
        const gpaScore = profile.gpa;
        const acceptanceRate = college.acceptance_rate || 0.5;
        
        if (gpaScore >= 3.7 && acceptanceRate <= 0.3) {
          score += 30;
          reasons.push('Strong GPA match for competitive school');
        } else if (gpaScore >= 3.0 && acceptanceRate <= 0.6) {
          score += 25;
          reasons.push('Good GPA match');
        } else if (gpaScore >= 2.5) {
          score += 15;
          reasons.push('GPA within acceptable range');
        }
      }

      // SAT Score matching
      if (profile.sat_score) {
        if (profile.sat_score >= 1400 && college.acceptance_rate <= 0.3) {
          score += 25;
          reasons.push('Excellent test scores for competitive admission');
        } else if (profile.sat_score >= 1200) {
          score += 20;
          reasons.push('Strong test scores');
        } else if (profile.sat_score >= 1000) {
          score += 15;
          reasons.push('Good test scores');
        }
      }

      // Major matching
      if (profile.intended_major && college.college_majors) {
        const majorMatch = college.college_majors.some((major: any) =>
          major.major_name.toLowerCase().includes(profile.intended_major.toLowerCase()) ||
          profile.intended_major.toLowerCase().includes(major.major_name.toLowerCase())
        );
        if (majorMatch) {
          score += 20;
          reasons.push('Offers your intended major');
        }
      }

      // Budget consideration
      if (profile.budget && college.tuition_out_state) {
        if (college.tuition_out_state <= profile.budget) {
          score += 15;
          reasons.push('Within budget range');
        } else if (college.tuition_out_state <= profile.budget * 1.2) {
          score += 5;
          reasons.push('Slightly above budget but manageable');
        }
      }

      // Location preference (if interests include location preferences)
      if (profile.interests && Array.isArray(profile.interests)) {
        if (profile.interests.includes('urban') && college.city) {
          const urbanCities = ['Miami', 'Orlando', 'Tampa', 'Jacksonville'];
          if (urbanCities.includes(college.city)) {
            score += 10;
            reasons.push('Located in preferred urban area');
          }
        }
      }

      return {
        ...college,
        match_score: Math.min(score, 100),
        match_reasons: reasons,
        majors: college.college_majors?.map((m: any) => m.major_name) || []
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return new Response(JSON.stringify({ recommendations: recommendations || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
