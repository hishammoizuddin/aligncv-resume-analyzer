
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-heading">
              Refine Your Resume for Job Success
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Paste your resume + job description → get smart side-by-side insights & suggestions.
              Optimize your resume for each job application in minutes.
            </p>
            <Link to="/input">
              <Button size="lg" className="rounded-full px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Paste Content</h3>
                <p className="text-muted-foreground">
                  Paste your resume and the job description into our analysis tool.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Get Insights</h3>
                <p className="text-muted-foreground">
                  Our AI-powered tool analyzes keywords and provides a match score with recommendations.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Optimize & Apply</h3>
                <p className="text-muted-foreground">
                  Make targeted improvements to your resume based on insights and increase your chances.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Keyword Analysis</h3>
                <p className="text-muted-foreground">
                  Automatically identify matching and missing keywords between your resume and job description.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Match Score</h3>
                <p className="text-muted-foreground">
                  Get a percentage score showing how well your resume matches the job requirements.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Smart Suggestions</h3>
                <p className="text-muted-foreground">
                  Receive personalized recommendations to improve your resume for the specific job.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Side-by-Side Comparison</h3>
                <p className="text-muted-foreground">
                  See highlighted matching keywords in both your resume and the job description.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start refining your resume for each job application and increase your chances of getting interviews.
            </p>
            <Link to="/input">
              <Button size="lg" className="rounded-full px-8">
                Analyze Your Resume Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} AlignCV. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
