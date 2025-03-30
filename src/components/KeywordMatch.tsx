import React from 'react';

interface KeywordMatchProps {
  text: string;
  keywords: string[];
  highlightClass?: string;
}

const KeywordMatch: React.FC<KeywordMatchProps> = ({ 
  text, 
  keywords, 
  highlightClass = 'keyword-highlight' 
}) => {
  if (!text || !keywords.length) {
    return <div>{text}</div>;
  }

  // Create a regex to match all keywords with word boundaries
  const keywordPattern = new RegExp(
    `\\b(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 
    'gi'
  );

  // Split the text by keywords and keep the keywords as parts of the result
  const parts = text.split(keywordPattern);

  // Map through parts and highlight the keywords
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        // Check if this part is a keyword (case-insensitive)
        const isKeyword = keywords.some(
          keyword => keyword.toLowerCase() === part.toLowerCase()
        );

        return isKeyword ? (
          <span key={i} className={highlightClass}>{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </div>
  );
};

export default KeywordMatch;
