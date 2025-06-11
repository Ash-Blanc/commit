
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (req.method === 'GET') {
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          college:colleges(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ applications }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { college_id, application_type, notes } = await req.json();

      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          college_id,
          application_type: application_type || 'regular',
          status: 'draft',
          notes,
          materials: {}
        })
        .select(`
          *,
          college:colleges(*)
        `)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ application }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'PUT') {
      const { id, status, notes, materials } = await req.json();

      const { data: application, error } = await supabase
        .from('applications')
        .update({
          status,
          notes,
          materials,
          updated_at: new Date().toISOString(),
          ...(status === 'submitted' && { submitted_at: new Date().toISOString() })
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          college:colleges(*)
        `)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ application }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in applications function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
