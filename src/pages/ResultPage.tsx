
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, CheckCircle, XCircle, ArrowLeft, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchScore from '@/components/MatchScore';
import KeywordMatch from '@/components/KeywordMatch';
import { extractKeywords, compareKeywords, generateSuggestions } from '@/utils/textAnalysis';

const ResultPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [analysis, setAnalysis] = useState<{
    resumeKeywords: string[];
    jobKeywords: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    matchScore: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    skillsScore?: number;
    suggestions: Record<string, string>;
  } | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get data from sessionStorage
    const storedResumeText = sessionStorage.getItem('resumeText');
    const storedJobDescriptionText = sessionStorage.getItem('jobDescriptionText');

    if (!storedResumeText || !storedJobDescriptionText) {
      toast({
        title: 'Missing information',
        description: 'Please enter your resume and job description first.',
        variant: 'destructive',
      });
      navigate('/input');
      return;
    }

    setResumeText(storedResumeText);
    setJobDescriptionText(storedJobDescriptionText);

    // Analyze the text
    const resumeKeywords = extractKeywords(storedResumeText);
    const jobKeywords = extractKeywords(storedJobDescriptionText);
    
    const { 
      matchedKeywords, 
      missingKeywords, 
      matchScore,
      matchedSkills,
      missingSkills,
      skillsScore
    } = compareKeywords(
      resumeKeywords,
      jobKeywords
    );
    
    const suggestions = generateSuggestions(storedResumeText, missingKeywords);

    setAnalysis({
      resumeKeywords,
      jobKeywords,
      matchedKeywords,
      missingKeywords,
      matchScore,
      matchedSkills,
      missingSkills,
      skillsScore,
      suggestions,
    });
  }, [navigate, toast]);

  const handleBackToInput = () => {
    navigate('/input');
  };

  const handleDownloadReport = () => {
    if (!analysis) return;

    // Create a report text
    const reportText = `
ALIGNCV ANALYSIS REPORT
==============================

MATCH SCORE: ${analysis.matchScore}%
${analysis.skillsScore !== undefined ? `SKILLS MATCH SCORE: ${analysis.skillsScore}%` : ''}

MATCHED KEYWORDS (${analysis.matchedKeywords.length}):
${analysis.matchedKeywords.join(', ')}

${analysis.matchedSkills && analysis.matchedSkills.length > 0 ? 
`MATCHED TECHNICAL SKILLS (${analysis.matchedSkills.length}):
${analysis.matchedSkills.join(', ')}` : ''}

MISSING KEYWORDS (${analysis.missingKeywords.length}):
${analysis.missingKeywords.join(', ')}

${analysis.missingSkills && analysis.missingSkills.length > 0 ? 
`MISSING TECHNICAL SKILLS (${analysis.missingSkills.length}):
${analysis.missingSkills.join(', ')}` : ''}

SUGGESTIONS:
${Object.entries(analysis.suggestions)
  .map(([keyword, suggestion]) => `${keyword}: ${suggestion}`)
  .join('\n')}

==============================
Resume:
${resumeText}

Job Description:
${jobDescriptionText}
    `;

    // Create a blob and download link
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'aligncv-analysis-report.txt');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Analyzing...</h2>
          <p className="text-muted-foreground">Please wait while we analyze your content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <Button 
                variant="outline" 
                onClick={handleBackToInput}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Input
              </Button>
              <h1 className="text-3xl font-bold">Analysis Results</h1>
            </div>
            
            <Button onClick={handleDownloadReport}>
              <DownloadCloud className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1">
              <MatchScore score={analysis.matchScore} />
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Resume Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.matchedSkills && analysis.matchedSkills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" /> 
                        Matched Technical Skills ({analysis.matchedSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.matchedSkills.map((skill) => (
                          <span key={skill} className="keyword-highlight">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium flex items-center gap-2 text-destructive">
                        <XCircle className="h-4 w-4" /> 
                        Missing Technical Skills ({analysis.missingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.missingSkills.map((skill) => (
                          <span key={skill} className="missing-keyword">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <h4 className="font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" /> 
                      Other Matched Keywords ({analysis.matchedKeywords.length - (analysis.matchedSkills?.length || 0)})
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {analysis.matchedKeywords
                        .filter(kw => !analysis.matchedSkills?.includes(kw))
                        .map((keyword) => (
                          <span key={keyword} className="keyword-highlight">
                            {keyword}
                          </span>
                        ))}
                      {analysis.matchedKeywords.length === 0 && (
                        <p className="text-sm text-muted-foreground">No matched keywords found.</p>
                      )}
                    </div>
                    
                    <h4 className="font-medium flex items-center gap-2 text-destructive">
                      <XCircle className="h-4 w-4" /> 
                      Other Missing Keywords ({analysis.missingKeywords.length - (analysis.missingSkills?.length || 0)})
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.missingKeywords
                        .filter(kw => !analysis.missingSkills?.includes(kw))
                        .map((keyword) => (
                          <span key={keyword} className="missing-keyword">
                            {keyword}
                          </span>
                        ))}
                      {analysis.missingKeywords.length === 0 && (
                        <p className="text-sm text-muted-foreground">No missing keywords found.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="resume">
                <TabsList className="mb-4">
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                  <TabsTrigger value="job">Job Description</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resume">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-4 rounded-md max-h-[500px] overflow-y-auto">
                        <KeywordMatch 
                          text={resumeText} 
                          keywords={analysis.matchedKeywords} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="job">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-4 rounded-md max-h-[500px] overflow-y-auto">
                        <KeywordMatch 
                          text={jobDescriptionText} 
                          keywords={analysis.matchedKeywords} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="suggestions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {analysis.missingKeywords.length > 0 ? (
                          analysis.missingKeywords.map((keyword) => (
                            <div key={keyword} className="p-3 bg-muted/30 rounded-md">
                              <h4 className="font-medium mb-1 flex items-center gap-2">
                                <span className={analysis.missingSkills?.includes(keyword) ? 
                                  "missing-keyword font-semibold" : "missing-keyword"}>
                                  {keyword}
                                </span>
                                {analysis.missingSkills?.includes(keyword) && 
                                  <span className="text-xs bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded">
                                    Technical Skill
                                  </span>
                                }
                              </h4>
                              <p className="text-sm">{analysis.suggestions[keyword]}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h4 className="text-lg font-medium mb-2">Great job!</h4>
                            <p className="text-muted-foreground">
                              Your resume already includes all the important keywords from the job description.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">What To Do Next</h2>
            <Separator className="mb-6" />
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Update Your Resume</h3>
                  <p className="text-muted-foreground">
                    Incorporate the missing keywords into your resume naturally, focusing on your most relevant experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Customize Your Cover Letter</h3>
                  <p className="text-muted-foreground">
                    Use the same keywords in your cover letter to strengthen your application.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Download Your Report</h3>
                  <p className="text-muted-foreground">
                    Save your analysis to reference as you update your application materials.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Analyze Again</h3>
                  <p className="text-muted-foreground">
                    After updating your resume, run the analysis again to see your improved score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultPage;
