import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: string;
  caseType: string;
  location: string;
  description: string;
  response: {
    steps: string[];
    requiredDocuments: string[];
    estimatedFees: string;
    timeline: string;
    disclaimers: string[];
  };
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    caseType: {
      type: String,
      enum: ["FIR", "Consumer Complaint", "Rental Dispute", "Cyber Crime"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    response: {
      steps: [String],
      requiredDocuments: [String],
      estimatedFees: String,
      timeline: String,
      disclaimers: [String],
    },
    language: {
      type: String,
      default: "en",
      enum: ["en", "hi", "ta", "te", "kn", "ml"],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
