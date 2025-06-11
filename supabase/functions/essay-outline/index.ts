
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
    const { topic, prompt, userProfile } = await req.json();

    const systemPrompt = `You are a college admissions essay writing assistant. Create a detailed essay outline based on the chosen topic and prompt.

User Profile: ${JSON.stringify(userProfile)}
Essay Prompt: ${prompt}
Chosen Topic: ${topic}

Create a structured outline with:
1. Hook/Opening (attention-grabbing first sentence)
2. Introduction paragraph (thesis/main message)
3. 2-3 Body paragraphs (specific examples, stories, reflection)
4. Conclusion (tie back to opening, future outlook)

Format as JSON with sections: 'hook', 'introduction', 'body_paragraphs' (array), 'conclusion'. Each should have 'title' and 'content' fields.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }]
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates[0].contents[0].parts[0].text;

    // Try to parse as JSON, fallback to structured text
    let outline;
    try {
      outline = JSON.parse(generatedText);
    } catch {
      // Create basic outline structure
      outline = {
        hook: { title: "Hook", content: "Start with a compelling opening that draws the reader in." },
        introduction: { title: "Introduction", content: "Introduce your main theme and thesis." },
        body_paragraphs: [
          { title: "Body Paragraph 1", content: "Provide specific examples and details." },
          { title: "Body Paragraph 2", content: "Continue with more evidence and reflection." }
        ],
        conclusion: { title: "Conclusion", content: "Tie everything together and look forward." }
      };
    }

    return new Response(JSON.stringify({ outline }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in essay-outline function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
