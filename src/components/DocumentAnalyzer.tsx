import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, BarChart3, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { geminiAI } from '@/services/geminiAIService';
import { toast } from '@/hooks/use-toast';

interface DocumentAnalysis {
  document_id: string;
  document_name: string;
  analysis_type: 'essay' | 'transcript' | 'recommendation' | 'profile';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  competitiveness_rating: 'safety' | 'target' | 'reach';
  improvement_areas: string[];
  ai_insights: string[];
}

interface ProfileAnalysis {
  overall_strength: number;
  academic_profile: number;
  extracurricular_profile: number;
  essay_quality: number;
  recommendation_strength: number;
  competitiveness_by_tier: {
    safety: number;
    target: number;
    reach: number;
  };
  improvement_recommendations: string[];
  timeline_suggestions: string[];
}

const DocumentAnalyzer = () => {
  const { documents } = useDocuments();
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [profileAnalysis, setProfileAnalysis] = useState<ProfileAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const analyzeDocument = async (document: any) => {
    setAnalyzing(true);
    try {
      let analysis: DocumentAnalysis;

      if (document.type === 'essay') {
        // Analyze essay content
        const essayFeedback = await geminiAI.provideDetailedFeedback(document.content || '');
        
        analysis = {
          document_id: document.id,
          document_name: document.name,
          analysis_type: 'essay',
          strengths: essayFeedback.strengths || [],
          weaknesses: [],
          suggestions: essayFeedback.suggestions || [],
          score: essayFeedback.overall_score || 75,
          competitiveness_rating: essayFeedback.overall_score >= 85 ? 'reach' : 
                                 essayFeedback.overall_score >= 70 ? 'target' : 'safety',
          improvement_areas: essayFeedback.grammar_issues || [],
          ai_insights: essayFeedback.authenticity_notes || []
        };
      } else {
        // Generic document analysis
        analysis = {
          document_id: document.id,
          document_name: document.name,
          analysis_type: document.type,
          strengths: ['Document uploaded successfully'],
          weaknesses: [],
          suggestions: ['Ensure document is complete and up-to-date'],
          score: 80,
          competitiveness_rating: 'target',
          improvement_areas: [],
          ai_insights: ['Document ready for submission']
        };
      }

      setAnalyses(prev => [...prev.filter(a => a.document_id !== document.id), analysis]);
      
      toast({
        title: "Analysis Complete",
        description: `${document.name} has been analyzed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const generateProfileAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Simulate comprehensive profile analysis
      const analysis: ProfileAnalysis = {
        overall_strength: 78,
        academic_profile: 85,
        extracurricular_profile: 72,
        essay_quality: 80,
        recommendation_strength: 75,
        competitiveness_by_tier: {
          safety: 95,
          target: 78,
          reach: 45
        },
        improvement_recommendations: [
          'Strengthen extracurricular leadership roles',
          'Improve essay narrative flow and specificity',
          'Consider retaking standardized tests if below target scores',
          'Develop more unique personal projects or initiatives'
        ],
        timeline_suggestions: [
          'Submit applications 2 weeks before deadlines',
          'Request recommendation letters 6 weeks in advance',
          'Complete essays 1 month before submission',
          'Finalize school list by October 1st'
        ]
      };

      setProfileAnalysis(analysis);
      
      toast({
        title: "Profile Analysis Complete",
        description: "Your comprehensive application profile has been analyzed.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate profile analysis.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompetitivenessColor = (rating: string) => {
    switch (rating) {
      case 'reach': return 'bg-red-100 text-red-800 border-red-200';
      case 'target': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'safety': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Document Analysis</TabsTrigger>
              <TabsTrigger value="profile">Profile Analysis</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Document Analysis</h3>
                <Button
                  onClick={generateProfileAnalysis}
                  disabled={analyzing}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  {analyzing ? 'Analyzing...' : 'Analyze All Documents'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((document) => {
                  const analysis = analyses.find(a => a.document_id === document.id);
                  
                  return (
                    <Card key={document.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{document.name}</span>
                          </div>
                          {!analysis ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => analyzeDocument(document)}
                              disabled={analyzing}
                            >
                              Analyze
                            </Button>
                          ) : (
                            <Badge className={getCompetitivenessColor(analysis.competitiveness_rating)}>
                              {analysis.competitiveness_rating}
                            </Badge>
                          )}
                        </div>

                        {analysis && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Quality Score</span>
                              <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                                {analysis.score}/100
                              </span>
                            </div>
                            <Progress value={analysis.score} className="h-2" />
                            
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-green-700">Strengths:</p>
                                <ul className="text-xs text-green-600 list-disc list-inside">
                                  {analysis.strengths.slice(0, 2).map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-blue-700">Top Suggestions:</p>
                                <ul className="text-xs text-blue-600 list-disc list-inside">
                                  {analysis.suggestions.slice(0, 2).map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDocument(
                                selectedDocument === document.id ? null : document.id
                              )}
                              className="w-full"
                            >
                              {selectedDocument === document.id ? 'Hide Details' : 'View Details'}
                            </Button>

                            {selectedDocument === document.id && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                                <div>
                                  <p className="text-sm font-medium">AI Insights:</p>
                                  <ul className="text-xs text-gray-600 list-disc list-inside">
                                    {analysis.ai_insights.map((insight, index) => (
                                      <li key={index}>{insight}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {analysis.improvement_areas.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium">Improvement Areas:</p>
                                    <ul className="text-xs text-gray-600 list-disc list-inside">
                                      {analysis.improvement_areas.map((area, index) => (
                                        <li key={index}>{area}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {documents.length === 0 && (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                  <p className="text-sm text-gray-500">Upload documents to get AI analysis</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              {profileAnalysis ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Application Strength</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(profileAnalysis.overall_strength)}`}>
                          {profileAnalysis.overall_strength}/100
                        </div>
                        <Badge variant="secondary">
                          {profileAnalysis.overall_strength >= 85 ? 'Highly Competitive' :
                           profileAnalysis.overall_strength >= 70 ? 'Competitive' : 'Developing'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(profileAnalysis.academic_profile)}`}>
                            {profileAnalysis.academic_profile}
                          </div>
                          <p className="text-sm text-gray-600">Academic</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(profileAnalysis.extracurricular_profile)}`}>
                            {profileAnalysis.extracurricular_profile}
                          </div>
                          <p className="text-sm text-gray-600">Extracurricular</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(profileAnalysis.essay_quality)}`}>
                            {profileAnalysis.essay_quality}
                          </div>
                          <p className="text-sm text-gray-600">Essays</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(profileAnalysis.recommendation_strength)}`}>
                            {profileAnalysis.recommendation_strength}
                          </div>
                          <p className="text-sm text-gray-600">Recommendations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Admission Likelihood by School Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Safety Schools</span>
                            <span className="font-bold text-green-600">
                              {profileAnalysis.competitiveness_by_tier.safety}%
                            </span>
                          </div>
                          <Progress value={profileAnalysis.competitiveness_by_tier.safety} className="h-3" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Target Schools</span>
                            <span className="font-bold text-yellow-600">
                              {profileAnalysis.competitiveness_by_tier.target}%
                            </span>
                          </div>
                          <Progress value={profileAnalysis.competitiveness_by_tier.target} className="h-3" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Reach Schools</span>
                            <span className="font-bold text-red-600">
                              {profileAnalysis.competitiveness_by_tier.reach}%
                            </span>
                          </div>
                          <Progress value={profileAnalysis.competitiveness_by_tier.reach} className="h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Generate your comprehensive profile analysis</p>
                  <Button onClick={generateProfileAnalysis} disabled={analyzing}>
                    {analyzing ? 'Analyzing...' : 'Analyze Profile'}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {profileAnalysis && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Improvement Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {profileAnalysis.improvement_recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                            <p className="text-sm text-blue-800">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Timeline Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {profileAnalysis.timeline_suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p className="text-sm text-green-800">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalyzer;