
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Application {
  id: string;
  college_id: string;
  status: string;
  application_type: string;
  submitted_at: string | null;
  decision_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  college?: {
    name: string;
    location: string;
    application_deadline: string;
  };
}

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    } else {
      setApplications([]);
      setLoading(false);
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          colleges (
            name,
            location,
            application_deadline
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (collegeId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          college_id: collegeId,
          status: 'draft'
        });

      if (error) {
        return { error };
      }

      await fetchApplications();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { error };
      }

      await fetchApplications();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    applications,
    loading,
    createApplication,
    updateApplication,
    refetch: fetchApplications,
  };
};
