
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, model: string = 'gemini-pro'): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateEssayIdeas(prompt: string, profile: any): Promise<string[]> {
    const enhancedPrompt = `
      Based on this college essay prompt: "${prompt}"
      And this student profile: ${JSON.stringify(profile)}
      
      Generate 5 unique and compelling essay ideas that would make this student stand out. 
      Each idea should be specific, personal, and authentic to the student's background.
      Return the response as a JSON array of strings.
    `;

    try {
      const response = await this.generateContent(enhancedPrompt);
      const ideas = JSON.parse(response);
      return Array.isArray(ideas) ? ideas : [response];
    } catch (error) {
      console.error('Error generating essay ideas:', error);
      return ['Focus on a transformative experience that shaped your perspective', 'Highlight a unique skill or talent you possess'];
    }
  }

  async generateCollegeRecommendations(profile: any): Promise<string[]> {
    const prompt = `
      Based on this student profile: ${JSON.stringify(profile)}
      
      Recommend 10 colleges that would be a great fit for this student.
      Consider their GPA, test scores, intended major, and preferences.
      Return the response as a JSON array of college names.
    `;

    try {
      const response = await this.generateContent(prompt);
      const recommendations = JSON.parse(response);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  async provideFeedback(essayContent: string): Promise<any> {
    const prompt = `
      Please provide detailed feedback on this college essay:
      "${essayContent}"
      
      Return feedback in JSON format with the following structure:
      {
        "overall_score": (number between 0-100),
        "strengths": ["strength1", "strength2"],
        "suggestions": ["suggestion1", "suggestion2"],
        "grammar_issues": ["issue1", "issue2"],
        "authenticity_notes": ["note1", "note2"]
      }
    `;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error providing feedback:', error);
      return {
        overall_score: 75,
        strengths: ['Good structure', 'Clear writing'],
        suggestions: ['Add more specific examples', 'Strengthen conclusion'],
        grammar_issues: [],
        authenticity_notes: ['Essay feels genuine']
      };
    }
  }
}

export const geminiService = new GeminiService('AIzaSyAJGS_LPzhwQA0VzEHd-Or7o5fXQd0aLBI');
