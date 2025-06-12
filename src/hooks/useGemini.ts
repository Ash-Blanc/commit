
import { useState } from 'react';
import { geminiService } from '@/services/geminiService';
import { useProfile } from './useProfile';

export interface EssayIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface EssayFeedback {
  overall_score: number;
  strengths: string[];
  suggestions: string[];
  grammar_issues: string[];
  authenticity_notes: string[];
}

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  const generateEssayIdeas = async (prompt: string): Promise<EssayIdea[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const ideas = await geminiService.generateEssayIdeas(prompt, profile);
      
      return ideas.map((idea, index) => ({
        id: `idea-${index}`,
        title: idea,
        description: `A compelling essay approach focusing on ${idea.toLowerCase()}`,
        tags: ['personal', 'unique', 'authentic']
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateCollegeRecommendations = async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      return await geminiService.generateCollegeRecommendations(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEssayFeedback = async (content: string): Promise<EssayFeedback | null> => {
    setLoading(true);
    setError(null);
    
    try {
      return await geminiService.provideFeedback(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get feedback');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (prompt: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      return await geminiService.generateContent(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateEssayIdeas,
    generateCollegeRecommendations,
    getEssayFeedback,
    generateContent
  };
};
