import React from 'react';
import { LegalResponse } from '../types/index';
import { Disclaimer } from './Disclaimer';

interface ResponseDisplayProps {
  response: LegalResponse;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  if (!response) {
    return (
      <div className="error-message">
        No response data available. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Disclaimer text={response.disclaimer || "⚠️ This is legal information, not legal advice. Consult a licensed lawyer for specific cases."} />

      {/* Steps */}
      {response.steps && Array.isArray(response.steps) && response.steps.length > 0 && (
        <div className="document-checklist">
          <h4>📋 Procedural Steps</h4>
          <ol style={{ marginLeft: '20px' }}>
            {response.steps.map((step, idx) => (
              <li key={idx} className="text-sm my-2">
                {String(step)}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Documents */}
      {response.requiredDocuments && Array.isArray(response.requiredDocuments) && response.requiredDocuments.length > 0 && (
        <div className="document-checklist">
          <h4>📄 Required Documents</h4>
          <ul>
            {response.requiredDocuments.map((doc, idx) => (
              <li key={idx} className="text-sm my-1">
                ✓ {String(doc)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fees and Timeline */}
      <div className="grid grid-cols-2 gap-4">
        {response.estimatedFees && (
          <div className="document-checklist">
            <h4>💰 Estimated Fees</h4>
            <p className="text-sm">{String(response.estimatedFees)}</p>
          </div>
        )}
        {response.timeline && (
          <div className="document-checklist">
            <h4>⏱️ Timeline</h4>
            <p className="text-sm">{String(response.timeline)}</p>
          </div>
        )}
      </div>

      {/* Clarifying Questions */}
      {response.clarifyingQuestions && Array.isArray(response.clarifyingQuestions) && response.clarifyingQuestions.length > 0 && (
        <div className="document-checklist">
          <h4>❓ Additional Information Needed</h4>
          <ul>
            {response.clarifyingQuestions.map((q, idx) => (
              <li key={idx} className="text-sm my-1">
                {String(q)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
