
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { aiService, EssayIdea, EssayOutline, EssayFeedback } from '@/services/aiService';

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

export { EssayIdea, EssayOutline, EssayFeedback };

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
          title: essay.title || 'Untitled Essay',
          prompt: essay.prompt,
          content: essay.content,
          application_id: essay.application_id,
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
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.content) {
        updateData.word_count = updates.content.split(' ').length;
      }

      const { data, error } = await supabase
        .from('essays')
        .update(updateData)
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
      return await aiService.generateEssayIdeas(prompt, userProfile);
    } catch (error) {
      console.error('Error generating ideas:', error);
      return [];
    }
  };

  const generateOutline = async (topic: string, prompt: string, userProfile: any): Promise<EssayOutline | null> => {
    try {
      return await aiService.generateEssayOutline(topic, prompt, userProfile);
    } catch (error) {
      console.error('Error generating outline:', error);
      return null;
    }
  };

  const getFeedback = async (content: string): Promise<EssayFeedback | null> => {
    try {
      return await aiService.getEssayFeedback(content);
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
