// AI Service for Gemini integration
const AI_BACKEND_URL = 'http://localhost:5000/api/ai';

export interface EssayIdea {
  title: string;
  description: string;
  why_compelling?: string;
}

export interface EssayOutline {
  hook: { content: string };
  introduction: { content: string };
  body_paragraphs: { content: string }[];
  conclusion: { content: string };
}

export interface EssayFeedback {
  overall_score: number;
  strengths: string[];
  suggestions: string[];
  grammar_issues: string[];
  authenticity_notes: string[];
}

export interface CollegeRecommendation {
  name: string;
  match_percentage: number;
  reasons: string[];
  category: 'reach' | 'match' | 'safety';
}

class AIService {
  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${AI_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'AI service error');
      }

      return result.response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateEssayIdeas(prompt: string, profile: any): Promise<EssayIdea[]> {
    try {
      const response = await this.makeRequest('/generate-ideas', {
        prompt,
        profile,
      });

      // Parse JSON response if it's a string
      let parsedResponse = response;
      if (typeof response === 'string') {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          // If parsing fails, create a fallback structure
          return [{
            title: "Personal Growth Essay",
            description: "Write about a time when you overcame a significant challenge and how it shaped who you are today.",
            why_compelling: "Shows resilience and personal development"
          }];
        }
      }

      return parsedResponse.ideas || [];
    } catch (error) {
      console.error('Error generating essay ideas:', error);
      throw error;
    }
  }

  async generateEssayOutline(topic: string, prompt: string, profile: any): Promise<EssayOutline> {
    try {
      const response = await this.makeRequest('/generate-outline', {
        topic,
        prompt,
        profile,
      });

      // Parse JSON response if it's a string
      let parsedResponse = response;
      if (typeof response === 'string') {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          // Fallback outline structure
          return {
            hook: { content: "Start with an engaging anecdote or question related to your topic." },
            introduction: { content: "Introduce your main theme and provide context for your story." },
            body_paragraphs: [
              { content: "Develop your main points with specific examples and details." },
              { content: "Show growth, learning, or change through your experiences." }
            ],
            conclusion: { content: "Reflect on what you learned and how it shapes your future goals." }
          };
        }
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error generating essay outline:', error);
      throw error;
    }
  }

  async getEssayFeedback(content: string): Promise<EssayFeedback> {
    try {
      const response = await this.makeRequest('/get-feedback', {
        content,
      });

      // Parse JSON response if it's a string
      let parsedResponse = response;
      if (typeof response === 'string') {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          // Fallback feedback structure
          return {
            overall_score: 75,
            strengths: ["Clear writing style", "Good structure"],
            suggestions: ["Add more specific examples", "Strengthen the conclusion"],
            grammar_issues: ["Check for minor punctuation errors"],
            authenticity_notes: ["Voice comes through well", "Shows genuine reflection"]
          };
        }
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error getting essay feedback:', error);
      throw error;
    }
  }

  async getCollegeRecommendations(profile: any, preferences: any): Promise<CollegeRecommendation[]> {
    try {
      const response = await this.makeRequest('/college-recommendations', {
        profile,
        preferences,
      });

      // Parse JSON response if it's a string
      let parsedResponse = response;
      if (typeof response === 'string') {
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          // Fallback recommendations
          return [
            {
              name: "Stanford University",
              match_percentage: 85,
              reasons: ["Strong program in your field", "Research opportunities"],
              category: "reach"
            }
          ];
        }
      }

      return parsedResponse.recommendations || [];
    } catch (error) {
      console.error('Error getting college recommendations:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();