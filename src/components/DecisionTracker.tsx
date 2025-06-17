import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  DollarSign, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Calculator
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { geminiAI } from '@/services/geminiAIService';
import { toast } from '@/hooks/use-toast';

interface DecisionStatus {
  application_id: string;
  college_name: string;
  decision_status: 'pending' | 'accepted' | 'waitlisted' | 'rejected';
  decision_date: string;
  decision_type: 'early' | 'regular' | 'rolling';
  notification_method: 'email' | 'portal' | 'mail';
  enrollment_deadline: string;
  deposit_amount: number;
  deposit_deadline: string;
  deposit_paid: boolean;
}

interface FinancialAidPackage {
  application_id: string;
  college_name: string;
  total_cost: number;
  grants_scholarships: number;
  work_study: number;
  loans: number;
  family_contribution: number;
  net_cost: number;
  package_received: boolean;
  package_date?: string;
  appeal_submitted: boolean;
  appeal_result?: number;
}

interface ScholarshipOffer {
  id: string;
  college_name: string;
  scholarship_name: string;
  amount: number;
  renewable: boolean;
  requirements: string;
  deadline: string;
  status: 'offered' | 'accepted' | 'declined' | 'expired';
}

interface CostBenefitAnalysis {
  college_name: string;
  total_4_year_cost: number;
  net_4_year_cost: number;
  roi_score: number;
  academic_fit: number;
  career_prospects: number;
  location_preference: number;
  overall_score: number;
  pros: string[];
  cons: string[];
  ai_recommendation: string;
}

const DecisionTracker = () => {
  const { applications } = useApplications();
  const [decisions, setDecisions] = useState<DecisionStatus[]>([]);
  const [financialAid, setFinancialAid] = useState<FinancialAidPackage[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipOffer[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostBenefitAnalysis[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    generateSampleData();
  }, [applications]);

  const generateSampleData = () => {
    // Generate sample decisions
    const sampleDecisions: DecisionStatus[] = applications.map((app, index) => ({
      application_id: app.id,
      college_name: app.college?.name || 'Unknown College',
      decision_status: ['pending', 'accepted', 'waitlisted', 'rejected'][index % 4] as any,
      decision_date: new Date(Date.now() + (index * 30 + 60) * 86400000).toISOString().split('T')[0],
      decision_type: index % 2 === 0 ? 'early' : 'regular',
      notification_method: ['email', 'portal', 'mail'][index % 3] as any,
      enrollment_deadline: new Date(Date.now() + (index * 30 + 120) * 86400000).toISOString().split('T')[0],
      deposit_amount: 500 + (index * 100),
      deposit_deadline: new Date(Date.now() + (index * 30 + 90) * 86400000).toISOString().split('T')[0],
      deposit_paid: false
    }));

    setDecisions(sampleDecisions);

    // Generate sample financial aid packages
    const sampleFinancialAid: FinancialAidPackage[] = applications.slice(0, 3).map((app, index) => ({
      application_id: app.id,
      college_name: app.college?.name || 'Unknown College',
      total_cost: 60000 + (index * 5000),
      grants_scholarships: 25000 + (index * 3000),
      work_study: 2500,
      loans: 15000 + (index * 2000),
      family_contribution: 20000 - (index * 2000),
      net_cost: 35000 + (index * 2000),
      package_received: index < 2,
      package_date: index < 2 ? new Date(Date.now() - index * 86400000).toISOString().split('T')[0] : undefined,
      appeal_submitted: false
    }));

    setFinancialAid(sampleFinancialAid);

    // Generate sample scholarships
    const sampleScholarships: ScholarshipOffer[] = [
      {
        id: 'sch-1',
        college_name: applications[0]?.college?.name || 'College A',
        scholarship_name: 'Merit Scholarship',
        amount: 15000,
        renewable: true,
        requirements: 'Maintain 3.5 GPA',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'offered'
      },
      {
        id: 'sch-2',
        college_name: applications[1]?.college?.name || 'College B',
        scholarship_name: 'Leadership Award',
        amount: 10000,
        renewable: true,
        requirements: 'Community service requirement',
        deadline: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
        status: 'offered'
      }
    ];

    setScholarships(sampleScholarships);
  };

  const generateCostBenefitAnalysis = async () => {
    setAnalyzing(true);
    try {
      const analyses: CostBenefitAnalysis[] = [];

      for (const aid of financialAid) {
        const analysis: CostBenefitAnalysis = {
          college_name: aid.college_name,
          total_4_year_cost: aid.total_cost * 4,
          net_4_year_cost: aid.net_cost * 4,
          roi_score: Math.round(85 + Math.random() * 15),
          academic_fit: Math.round(80 + Math.random() * 20),
          career_prospects: Math.round(75 + Math.random() * 25),
          location_preference: Math.round(70 + Math.random() * 30),
          overall_score: 0,
          pros: [
            'Strong academic programs',
            'Good financial aid package',
            'Excellent career services',
            'Beautiful campus'
          ],
          cons: [
            'High cost of living',
            'Limited research opportunities',
            'Competitive environment'
          ],
          ai_recommendation: ''
        };

        analysis.overall_score = Math.round(
          (analysis.roi_score + analysis.academic_fit + analysis.career_prospects + analysis.location_preference) / 4
        );

        // Generate AI recommendation
        const recommendation = await geminiAI.generateContent(`
          Provide a brief recommendation for ${aid.college_name} based on:
          - Net 4-year cost: $${analysis.net_4_year_cost.toLocaleString()}
          - ROI Score: ${analysis.roi_score}/100
          - Academic Fit: ${analysis.academic_fit}/100
          - Career Prospects: ${analysis.career_prospects}/100
          
          Give a 2-3 sentence recommendation focusing on value and fit.
        `);

        analysis.ai_recommendation = recommendation;
        analyses.push(analysis);
      }

      setCostAnalysis(analyses);

      toast({
        title: "Analysis Complete",
        description: "Cost-benefit analysis has been generated for all schools",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate cost-benefit analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const compareFinancialPackages = async () => {
    setAnalyzing(true);
    try {
      const comparison = await geminiAI.generateContent(`
        Compare these financial aid packages and provide recommendations:
        
        ${financialAid.map(aid => `
        ${aid.college_name}:
        - Total Cost: $${aid.total_cost.toLocaleString()}
        - Net Cost: $${aid.net_cost.toLocaleString()}
        - Grants/Scholarships: $${aid.grants_scholarships.toLocaleString()}
        - Loans: $${aid.loans.toLocaleString()}
        `).join('\n')}
        
        Provide:
        1. Best value recommendation
        2. Lowest debt option
        3. Factors to consider beyond cost
        4. Negotiation opportunities
      `);

      toast({
        title: "Financial Comparison Ready",
        description: "AI has analyzed your financial aid packages",
      });

      // You could display this in a modal or dedicated section
      console.log('Financial Aid Comparison:', comparison);
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: "Unable to compare financial packages",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getDecisionColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'waitlisted': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'waitlisted': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const calculateSavings = (aid: FinancialAidPackage) => {
    return aid.total_cost - aid.net_cost;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Decision & Financial Aid Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="decisions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
              <TabsTrigger value="financial">Financial Aid</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="decisions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">
                          {decisions.filter(d => d.decision_status === 'accepted').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Waitlisted</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {decisions.filter(d => d.decision_status === 'waitlisted').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-gray-600">
                          {decisions.filter(d => d.decision_status === 'pending').length}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">
                          {decisions.filter(d => d.decision_status === 'rejected').length}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {decisions.map((decision) => (
                  <Card key={decision.application_id} className={`border-l-4 border-l-${decision.decision_status === 'accepted' ? 'green' : decision.decision_status === 'waitlisted' ? 'yellow' : decision.decision_status === 'rejected' ? 'red' : 'gray'}-500`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{decision.college_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {decision.decision_type} Decision
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getDecisionColor(decision.decision_status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(decision.decision_status)}
                              {decision.decision_status}
                            </div>
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(decision.decision_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Notification Method</p>
                          <p className="text-sm text-muted-foreground capitalize">{decision.notification_method}</p>
                        </div>
                        
                        {decision.decision_status === 'accepted' && (
                          <>
                            <div>
                              <p className="text-sm font-medium">Enrollment Deadline</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(decision.enrollment_deadline).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Deposit</p>
                              <p className="text-sm text-muted-foreground">
                                ${decision.deposit_amount} by {new Date(decision.deposit_deadline).toLocaleDateString()}
                              </p>
                              {!decision.deposit_paid && (
                                <Badge variant="outline" className="mt-1">
                                  Payment Pending
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {decision.decision_status === 'accepted' && !decision.deposit_paid && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-800">Action Required</p>
                              <p className="text-sm text-green-600">
                                Submit enrollment deposit by {new Date(decision.deposit_deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Pay Deposit
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Financial Aid Packages</h3>
                <Button
                  onClick={compareFinancialPackages}
                  disabled={analyzing}
                  variant="outline"
                >
                  {analyzing ? 'Analyzing...' : 'Compare Packages'}
                </Button>
              </div>

              <div className="space-y-4">
                {financialAid.map((aid) => (
                  <Card key={aid.application_id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{aid.college_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {aid.package_received ? `Package received ${aid.package_date ? new Date(aid.package_date).toLocaleDateString() : ''}` : 'Package pending'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${aid.net_cost.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Net Annual Cost</p>
                        </div>
                      </div>

                      {aid.package_received && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">
                                ${aid.total_cost.toLocaleString()}
                              </div>
                              <p className="text-sm text-blue-800">Total Cost</p>
                            </div>
                            
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                ${aid.grants_scholarships.toLocaleString()}
                              </div>
                              <p className="text-sm text-green-800">Grants & Scholarships</p>
                            </div>
                            
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <div className="text-lg font-bold text-yellow-600">
                                ${aid.loans.toLocaleString()}
                              </div>
                              <p className="text-sm text-yellow-800">Loans</p>
                            </div>
                            
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">
                                ${aid.family_contribution.toLocaleString()}
                              </div>
                              <p className="text-sm text-purple-800">Family Contribution</p>
                            </div>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Financial Aid Coverage</span>
                              <span className="font-bold">
                                {Math.round((calculateSavings(aid) / aid.total_cost) * 100)}%
                              </span>
                            </div>
                            <Progress value={(calculateSavings(aid) / aid.total_cost) * 100} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-2">
                              You're saving ${calculateSavings(aid).toLocaleString()} per year
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {!aid.appeal_submitted && (
                              <Button size="sm" variant="outline">
                                <DollarSign className="h-4 w-4 mr-1" />
                                Appeal Package
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Calculator className="h-4 w-4 mr-1" />
                              4-Year Projection
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scholarships" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Offered</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${scholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Offers</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {scholarships.filter(s => s.status === 'offered').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Accepted</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {scholarships.filter(s => s.status === 'accepted').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{scholarship.scholarship_name}</h3>
                          <p className="text-sm text-muted-foreground">{scholarship.college_name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">
                            ${scholarship.amount.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {scholarship.renewable ? 'Renewable' : 'One-time'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Requirements:</p>
                          <p className="text-sm text-muted-foreground">{scholarship.requirements}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                            </p>
                            <Badge variant="outline" className="mt-1 capitalize">
                              {scholarship.status}
                            </Badge>
                          </div>
                          
                          {scholarship.status === 'offered' && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>

                        {scholarship.renewable && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>4-Year Value:</strong> ${(scholarship.amount * 4).toLocaleString()} 
                              (if requirements are maintained)
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Cost-Benefit Analysis</h3>
                <Button
                  onClick={generateCostBenefitAnalysis}
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : 'Generate Analysis'}
                </Button>
              </div>

              {costAnalysis.length > 0 ? (
                <div className="space-y-4">
                  {costAnalysis.map((analysis) => (
                    <Card key={analysis.college_name}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{analysis.college_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              4-Year Net Cost: ${analysis.net_4_year_cost.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                              {analysis.overall_score}/100
                            </div>
                            <p className="text-sm text-muted-foreground">Overall Score</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(analysis.roi_score)}`}>
                              {analysis.roi_score}
                            </div>
                            <p className="text-sm text-muted-foreground">ROI Score</p>
                          </div>
                          
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(analysis.academic_fit)}`}>
                              {analysis.academic_fit}
                            </div>
                            <p className="text-sm text-muted-foreground">Academic Fit</p>
                          </div>
                          
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(analysis.career_prospects)}`}>
                              {analysis.career_prospects}
                            </div>
                            <p className="text-sm text-muted-foreground">Career Prospects</p>
                          </div>
                          
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(analysis.location_preference)}`}>
                              {analysis.location_preference}
                            </div>
                            <p className="text-sm text-muted-foreground">Location</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                            <ul className="text-sm text-green-600 list-disc list-inside space-y-1">
                              {analysis.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                            <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                              {analysis.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {analysis.ai_recommendation && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">AI Recommendation</h4>
                            <p className="text-sm text-blue-700">{analysis.ai_recommendation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No cost analysis available</p>
                  <p className="text-sm text-gray-500">Generate analysis to compare your options</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionTracker;