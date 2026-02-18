export interface LegalQuery {
  userId: string;
  caseType: "FIR" | "Consumer Complaint" | "Rental Dispute" | "Cyber Crime";
  location: string;
  description: string;
  language: string;
}

export interface LegalResponse {
  messageId: string;
  steps: string[];
  requiredDocuments: string[];
  estimatedFees: string;
  timeline: string;
  disclaimer: string;
  clarifyingQuestions?: string[];
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatHistory {
  userId: string;
  messages: ChatMessage[];
}
