// Tech skills and common job terms for smarter analysis
const TECH_SKILLS = new Set([
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'php', 'swift',
  'kotlin', 'rust', 'scala', 'perl', 'haskell', 'r', 'matlab', 'bash', 'shell', 'sql',
  
  // Web Technologies
  'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
  'redux', 'graphql', 'rest', 'api', 'ajax', 'jquery', 'bootstrap', 'tailwind', 'sass',
  'webpack', 'babel', 'next.js', 'gatsby', 'svelte', 'nuxt', 
  
  // Data Science & ML
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
  'scipy', 'hadoop', 'spark', 'tableau', 'powerbi', 'd3', 'opencv', 'nltk', 'spacy',
  
  // DevOps & Cloud
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
  'puppet', 'chef', 'gitlab', 'github', 'bitbucket', 'cicd', 'devops', 'serverless',
  
  // Databases
  'mysql', 'postgresql', 'mongodb', 'firebase', 'dynamodb', 'redis', 'elasticsearch',
  'sqlite', 'oracle', 'cassandra', 'couchdb', 'neo4j', 'mariadb', 'supabase', 'planetscale',
  
  // Mobile
  'android', 'ios', 'react-native', 'flutter', 'xamarin', 'cordova', 'ionic',
  'swift', 'objective-c', 'kotlin', 'dart',
  
  // Other Tools & Platforms
  'git', 'jira', 'confluence', 'slack', 'trello', 'figma', 'sketch', 'adobe',
  'photoshop', 'illustrator', 'xd', 'premiere', 'aftereffects',
  
  // Soft Skills
  'agile', 'scrum', 'kanban', 'waterfall', 'leadership', 'teamwork', 'communication',
  'problem-solving', 'creativity', 'analytical', 'adaptability', 'time-management',
  
  // Certifications
  'aws-certified', 'microsoft-certified', 'google-certified', 'comptia', 'cisco',
  'pmp', 'csm', 'ceh', 'itil', 'prince2',
]);

// Basic stop words list (expanded)
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 
  'by', 'about', 'as', 'of', 'this', 'that', 'these', 'those', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 
  'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 
  'her', 'its', 'our', 'their', 'from', 'then', 'than', 'when', 'what', 'where',
  'who', 'which', 'how', 'why', 'all', 'any', 'both', 'each', 'more', 'most',
  'other', 'some', 'such', 'only', 'own', 'same', 'so', 'can', 'will', 'just',
  'should', 'now'
]);

// Extract keywords and skills from text
export const extractKeywords = (text: string): string[] => {
  if (!text) return [];
  
  // Convert to lowercase
  const lowerText = text.toLowerCase();
  
  // Split into words, remove punctuation
  const words = lowerText.split(/\W+/).filter(word => {
    // Filter out short words, stop words
    return word.length > 2 && !STOP_WORDS.has(word);
  });
  
  // Count word frequencies and classify them
  const wordCounts = new Map<string, number>();
  const skills: string[] = [];
  
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    
    // If it's a tech skill, add it to skills array
    if (TECH_SKILLS.has(word) && !skills.includes(word)) {
      skills.push(word);
    }
  });
  
  // Get all unique words
  const uniqueWords = Array.from(new Set(words));
  
  // Sort by frequency (descending)
  uniqueWords.sort((a, b) => (wordCounts.get(b) || 0) - (wordCounts.get(a) || 0));
  
  // Prioritize skills at the top of results
  const prioritizedWords = [
    ...skills.filter(skill => uniqueWords.includes(skill)),
    ...uniqueWords.filter(word => !skills.includes(word))
  ];
  
  return prioritizedWords;
};

// Compare resume keywords to job description keywords
export const compareKeywords = (resumeKeywords: string[], jobKeywords: string[]) => {
  // Categorize job keywords by skill type
  const jobSkills = jobKeywords.filter(word => TECH_SKILLS.has(word));
  const otherJobKeywords = jobKeywords.filter(word => !TECH_SKILLS.has(word));
  
  // Categorize resume keywords by skill type
  const resumeSkills = resumeKeywords.filter(word => TECH_SKILLS.has(word));
  const otherResumeKeywords = resumeKeywords.filter(word => !TECH_SKILLS.has(word));
  
  // Find matching skills (prioritize these in matching)
  const matchedSkills = resumeSkills.filter(word => 
    jobSkills.includes(word)
  );
  
  // Find missing skills (prioritize these in missing)
  const missingSkills = jobSkills.filter(word => 
    !resumeSkills.includes(word)
  );
  
  // Find other matching keywords
  const matchedOtherKeywords = otherResumeKeywords.filter(word => 
    otherJobKeywords.includes(word)
  );
  
  // Find other missing keywords
  const missingOtherKeywords = otherJobKeywords.filter(word => 
    !otherResumeKeywords.includes(word)
  );
  
  // Combine with skills first for UI display
  const matchedKeywords = [...matchedSkills, ...matchedOtherKeywords];
  const missingKeywords = [...missingSkills, ...missingOtherKeywords];
  
  // Calculate match score (weighted more heavily toward skills)
  let skillsScore = 0;
  if (jobSkills.length > 0) {
    skillsScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
  }
  
  let otherScore = 0;
  if (otherJobKeywords.length > 0) {
    otherScore = Math.round((matchedOtherKeywords.length / otherJobKeywords.length) * 100);
  }
  
  // Skills are 70% of score, other keywords are 30%
  const matchScore = Math.round((skillsScore * 0.7) + (otherScore * 0.3));
  
  return {
    matchedKeywords,
    missingKeywords,
    matchScore,
    matchedSkills,
    missingSkills,
    skillsScore
  };
};

// Calculate frequency for each keyword
export const getKeywordFrequency = (text: string, keywords: string[]): Map<string, number> => {
  const frequency = new Map<string, number>();
  const lowerText = text.toLowerCase();
  
  keywords.forEach(keyword => {
    // Create a regex that matches the word boundary
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    frequency.set(keyword, matches ? matches.length : 0);
  });
  
  return frequency;
};

// Generate smarter suggestions for missing keywords
export const generateSuggestions = (resumeText: string, missingKeywords: string[]): Record<string, string> => {
  const suggestions: Record<string, string> = {};
  
  missingKeywords.forEach(keyword => {
    if (TECH_SKILLS.has(keyword)) {
      // Provide more detailed suggestions for tech skills
      suggestions[keyword] = `Add "${keyword}" to your skills section. If you have experience with it, mention specific projects or achievements where you've used ${keyword}.`;
    } else {
      suggestions[keyword] = `Consider incorporating "${keyword}" in your resume. Look for relevant experience where you might have demonstrated this quality or skill.`;
    }
  });
  
  return suggestions;
};
