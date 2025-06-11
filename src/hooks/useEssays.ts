
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Essay {
  id: string;
  user_id: string;
  application_id?: string;
  title: string;
  prompt?: string;
  content?: string;
  ai_feedback?: string;
  status: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface EssayIdea {
  title: string;
  description: string;
}

export interface EssayOutline {
  hook: { title: string; content: string };
  introduction: { title: string; content: string };
  body_paragraphs: { title: string; content: string }[];
  conclusion: { title: string; content: string };
}

export interface EssayFeedback {
  overall_score: number;
  strengths: string[];
  suggestions: string[];
  grammar_issues: string[];
  authenticity_notes: string[];
}

export const useEssays = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEssays = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('essays')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setEssays(data || []);
    } catch (error) {
      console.error('Error fetching essays:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEssay = async (essay: Partial<Essay>): Promise<Essay | null> => {
    try {
      const { data, error } = await supabase
        .from('essays')
        .insert({
          ...essay,
          word_count: essay.content ? essay.content.split(' ').length : 0
        })
        .select()
        .single();

      if (error) throw error;
      await fetchEssays();
      return data;
    } catch (error) {
      console.error('Error creating essay:', error);
      return null;
    }
  };

  const updateEssay = async (id: string, updates: Partial<Essay>): Promise<Essay | null> => {
    try {
      const { data, error } = await supabase
        .from('essays')
        .update({
          ...updates,
          word_count: updates.content ? updates.content.split(' ').length : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchEssays();
      return data;
    } catch (error) {
      console.error('Error updating essay:', error);
      return null;
    }
  };

  const generateIdeas = async (prompt: string, userProfile: any): Promise<EssayIdea[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('essay-brainstorm', {
        body: { prompt, userProfile }
      });

      if (error) throw error;
      return data.ideas || [];
    } catch (error) {
      console.error('Error generating ideas:', error);
      return [];
    }
  };

  const generateOutline = async (topic: string, prompt: string, userProfile: any): Promise<EssayOutline | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('essay-outline', {
        body: { topic, prompt, userProfile }
      });

      if (error) throw error;
      return data.outline;
    } catch (error) {
      console.error('Error generating outline:', error);
      return null;
    }
  };

  const getFeedback = async (content: string): Promise<EssayFeedback | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('essay-feedback', {
        body: { content }
      });

      if (error) throw error;
      return data.feedback;
    } catch (error) {
      console.error('Error getting feedback:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchEssays();
  }, []);

  return {
    essays,
    loading,
    fetchEssays,
    createEssay,
    updateEssay,
    generateIdeas,
    generateOutline,
    getFeedback,
  };
};
