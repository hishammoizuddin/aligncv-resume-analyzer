
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MatchScoreProps {
  score: number;
}

const MatchScore: React.FC<MatchScoreProps> = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  // Get descriptive text
  const getScoreText = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Poor Match';
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-2">Keyword Match Score</h3>
      <div className="flex items-center gap-4 mb-3">
        <div className={`text-4xl font-bold ${getScoreColor()}`}>{score}%</div>
        <div className="text-sm text-muted-foreground">{getScoreText()}</div>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-sm text-muted-foreground mt-4">
        This score represents how well your resume keywords match the job description.
      </p>
    </div>
  );
};

export default MatchScore;
