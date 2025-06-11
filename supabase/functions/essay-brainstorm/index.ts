
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
    const { prompt, userProfile } = await req.json();

    const systemPrompt = `You are a college admissions essay writing assistant. Generate creative, authentic essay topic ideas based on the user's background and the given prompt. 

User Profile: ${JSON.stringify(userProfile)}

Provide 5-7 unique essay topic ideas that are:
1. Personal and authentic to the user's background
2. Specific and engaging
3. Show growth, leadership, or unique perspective
4. Avoid cliché topics
5. Each should be 1-2 sentences explaining the angle

Format as a JSON array of objects with 'title' and 'description' fields.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nEssay Prompt: ${prompt}\n\nGenerate essay topic ideas:`
          }]
        }]
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates[0].contents[0].parts[0].text;

    // Try to parse as JSON, fallback to structured text
    let ideas;
    try {
      ideas = JSON.parse(generatedText);
    } catch {
      // If not valid JSON, create structured response from text
      const lines = generatedText.split('\n').filter(line => line.trim());
      ideas = lines.slice(0, 6).map((line, index) => ({
        title: `Idea ${index + 1}`,
        description: line.trim()
      }));
    }

    return new Response(JSON.stringify({ ideas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in essay-brainstorm function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
