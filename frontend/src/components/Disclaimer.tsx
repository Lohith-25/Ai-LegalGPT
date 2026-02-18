import React from 'react';

interface DisclaimerProps {
  text?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ 
  text = "⚠️ This is legal information, not legal advice. Please consult a licensed lawyer for specific cases." 
}) => {
  return (
    <div className="disclaimer">
      <strong>Legal Disclaimer:</strong> {text}
    </div>
  );
};
