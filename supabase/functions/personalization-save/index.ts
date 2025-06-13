
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface PersonalizationData {
  academicPreferences: any;
  geographicPreferences: any;
  socialPreferences: any;
  financialPreferences: any;
  personalGoals: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const personalizationData: PersonalizationData = await req.json();

    const { data, error } = await supabase
      .from('personalization_preferences')
      .upsert({
        user_id: user.id,
        academic_preferences: personalizationData.academicPreferences,
        geographic_preferences: personalizationData.geographicPreferences,
        social_preferences: personalizationData.socialPreferences,
        financial_preferences: personalizationData.financialPreferences,
        personal_goals: personalizationData.personalGoals,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving personalization data:', error);
      throw error;
    }

    console.log('Personalization data saved successfully');

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error in personalization-save function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
