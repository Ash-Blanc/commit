
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAJGS_LPzhwQA0VzEHd-Or7o5fXQd0aLBI';
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateEssayIdeas(prompt: string, userProfile?: any): Promise<string[]> {
    try {
      const enhancedPrompt = `
        Based on this college essay prompt: "${prompt}"
        ${userProfile ? `And this student profile: ${JSON.stringify(userProfile)}` : ''}
        
        Generate 6 unique, compelling, and authentic essay ideas that would make this student stand out. 
        Each idea should be:
        - Specific and personal
        - Authentic to the student's background
        - Memorable and engaging
        - Different from typical clichéd topics
        
        Return the response as a JSON array of strings, each being a complete essay topic idea.
      `;

      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      try {
        const ideas = JSON.parse(text);
        return Array.isArray(ideas) ? ideas : [text];
      } catch {
        // If not valid JSON, split by lines and clean up
        const lines = text.split('\n').filter(line => line.trim());
        return lines.slice(0, 6).map(line => line.replace(/^\d+\.\s*/, '').trim());
      }
    } catch (error) {
      console.error('Error generating essay ideas:', error);
      return [
        'Write about a moment when you challenged a belief or idea',
        'Describe a place or environment where you feel perfectly content',
        'Share an experience that taught you something unexpected about yourself'
      ];
    }
  }

  async improveEssayContent(content: string, feedback?: string): Promise<string> {
    try {
      const prompt = `
        Please improve this college essay draft while maintaining the author's authentic voice:
        
        "${content}"
        
        ${feedback ? `Consider this feedback: ${feedback}` : ''}
        
        Improvements should focus on:
        - Clarity and flow
        - Stronger opening and closing
        - More vivid details and examples
        - Better structure and transitions
        - Keeping the authentic voice
        
        Return the improved essay content directly without additional formatting.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error improving essay:', error);
      return content;
    }
  }

  async provideDetailedFeedback(content: string): Promise<any> {
    try {
      const prompt = `
        Analyze this college essay and provide constructive feedback:
        
        "${content}"
        
        Provide feedback in JSON format with:
        {
          "overall_score": (number 1-100),
          "strengths": ["specific strength 1", "specific strength 2", ...],
          "suggestions": ["specific improvement 1", "specific improvement 2", ...],
          "grammar_issues": ["grammar issue 1", "grammar issue 2", ...],
          "authenticity_notes": ["authenticity note 1", "authenticity note 2", ...]
        }
        
        Focus on being constructive and specific while preserving the student's voice.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch {
        return {
          overall_score: 75,
          strengths: ["Shows personal growth", "Engaging writing style"],
          suggestions: ["Add more specific examples", "Strengthen the conclusion"],
          grammar_issues: ["Check sentence variety", "Review comma usage"],
          authenticity_notes: ["Voice feels genuine", "Personal examples are effective"]
        };
      }
    } catch (error) {
      console.error('Error providing feedback:', error);
      return {
        overall_score: 70,
        strengths: ["Good structure"],
        suggestions: ["Add more details"],
        grammar_issues: [],
        authenticity_notes: ["Keep developing your unique voice"]
      };
    }
  }

  async generateEssayOutline(topic: string, prompt: string): Promise<any> {
    try {
      const outlinePrompt = `
        Create a detailed essay outline for this topic: "${topic}"
        Based on this prompt: "${prompt}"
        
        Structure the outline as JSON with:
        {
          "hook": {"title": "Opening Hook", "content": "description of hook strategy"},
          "introduction": {"title": "Introduction", "content": "thesis and main message"},
          "body_paragraphs": [
            {"title": "Body Paragraph 1", "content": "main point and supporting details"},
            {"title": "Body Paragraph 2", "content": "main point and supporting details"}
          ],
          "conclusion": {"title": "Conclusion", "content": "how to tie everything together"}
        }
        
        Make it specific and actionable for the writer.
      `;

      const result = await this.model.generateContent(outlinePrompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch {
        return {
          hook: { title: "Opening Hook", content: "Start with a compelling scene or moment" },
          introduction: { title: "Introduction", content: "Introduce your main theme" },
          body_paragraphs: [
            { title: "Body Paragraph 1", content: "Provide specific examples and details" },
            { title: "Body Paragraph 2", content: "Show growth and reflection" }
          ],
          conclusion: { title: "Conclusion", content: "Connect to your future goals" }
        };
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      return null;
    }
  }
}

export const geminiAI = new GeminiAIService();
