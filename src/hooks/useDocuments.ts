
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Document {
  id: string;
  name: string;
  type: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  application_id?: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, type: string, applicationId?: string) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      if (applicationId) {
        formData.append('applicationId', applicationId);
      }

      const { data, error } = await supabase.functions.invoke('document-upload', {
        body: formData
      });

      if (error) throw error;

      await fetchDocuments();
      return { data, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!user) return { error: 'No user found' };

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDocuments();
      return { error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error };
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return {
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
  };
};
