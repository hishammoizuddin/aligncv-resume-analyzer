
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, Briefcase, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUploader from '@/components/FileUploader';

const InputPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMethod, setInputMethod] = useState('paste');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // Validate inputs
    if (!resumeText.trim()) {
      toast({
        title: 'Resume is empty',
        description: 'Please paste or upload your resume content.',
        variant: 'destructive',
      });
      return;
    }

    if (!jobDescriptionText.trim()) {
      toast({
        title: 'Job description is empty',
        description: 'Please paste the job description content.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      // Store the data in sessionStorage for the result page
      sessionStorage.setItem('resumeText', resumeText);
      sessionStorage.setItem('jobDescriptionText', jobDescriptionText);
      
      // Navigate to the result page
      navigate('/result');
      
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleFileContent = (content: string) => {
    setResumeText(content);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Enter Your Content</h1>
            <p className="text-muted-foreground">
              Upload your resume and paste the job description to get personalized suggestions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="paste" onValueChange={setInputMethod}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="paste">Paste</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="paste">
                    <textarea
                      className="text-input"
                      placeholder="Paste your resume here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <div className="space-y-4">
                      <FileUploader onFileContent={handleFileContent} />
                      {resumeText && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2">Preview:</h3>
                          <div className="text-input overflow-auto max-h-[200px] p-4">
                            {resumeText}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="text-input"
                  placeholder="Paste the job description here..."
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="rounded-full px-8"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Now'} {!isAnalyzing && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <Separator className="mb-6" />
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upload or Paste Your Resume</h3>
                  <p className="text-muted-foreground">
                    Upload a PDF/DOCX file or copy and paste the full text of your current resume.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Paste the Job Description</h3>
                  <p className="text-muted-foreground">
                    Copy and paste the job description text into the right box.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Analyze and Get Insights</h3>
                  <p className="text-muted-foreground">
                    Click "Analyze Now" to receive a detailed report with keyword matches and recommendations.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InputPage;
