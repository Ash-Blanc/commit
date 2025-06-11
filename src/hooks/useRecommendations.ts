
import { useState } from 'react';
import { useColleges, College } from './useColleges';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const { getRecommendations } = useColleges();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await getRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    fetchRecommendations,
  };
};
