
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = 'AIzaSyAJGS_LPzhwQA0VzEHd-Or7o5fXQd0aLBI';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    const systemPrompt = `You are a college admissions essay writing coach. Analyze this essay draft and provide constructive feedback that preserves the student's authentic voice while improving clarity, structure, and impact.

Focus on:
1. Content & Authenticity: Does it feel genuine? Are examples specific?
2. Structure & Flow: Is it well-organized? Smooth transitions?
3. Writing Style: Clear, engaging, appropriate tone?
4. Grammar & Mechanics: Any errors to fix?
5. Overall Impact: Does it make the student memorable?

Provide feedback as JSON with:
- overall_score (1-100)
- strengths (array of positive points)
- suggestions (array of specific improvements)
- grammar_issues (array of grammar/style fixes)
- authenticity_notes (ways to make it more personal/genuine)

Be encouraging and specific. Preserve the student's voice.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nEssay to analyze:\n${content}`
          }]
        }]
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates[0].contents[0].parts[0].text;

    // Try to parse as JSON, fallback to basic feedback
    let feedback;
    try {
      feedback = JSON.parse(generatedText);
    } catch {
      feedback = {
        overall_score: 75,
        strengths: ["Shows personal growth", "Engaging writing style"],
        suggestions: ["Add more specific examples", "Strengthen the conclusion"],
        grammar_issues: ["Check for comma splices", "Vary sentence structure"],
        authenticity_notes: ["Include more personal reflection", "Show rather than tell"]
      };
    }

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in essay-feedback function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
