import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateLegalGuidance, analyzeDocument } from "../services/legalService.js";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import fs from "fs";

interface LegalQueryRequest extends Request {
  body: {
    userId?: string;
    caseType: string;
    location: string;
    description: string;
    language?: string;
  };
  file?: Express.Multer.File;
}

export const submitLegalQuery = asyncHandler(
  async (req: LegalQueryRequest, res: Response) => {
    const { userId, caseType, location, description, language = "en" } = req.body;
    const file = req.file;

    // Validation - either description or file must be provided
    if (!caseType || !location || (!description && !file)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: caseType, location, and (description or document)",
      });
    }

    const validCaseTypes = ["FIR", "Consumer Complaint", "Rental Dispute", "Cyber Crime"];
    if (!validCaseTypes.includes(caseType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid case type. Must be one of: ${validCaseTypes.join(", ")}`,
      });
    }

    let guidance;
    let analysisText = description;

    // If file is uploaded, analyze it
    if (file) {
      try {
        analysisText = await analyzeDocument(file);
        console.log(`✓ Document analyzed: ${file.originalname}`);
      } catch (err) {
        // Clean up file on error
        if (file.path) fs.unlinkSync(file.path);
        throw err;
      }
    }

    // Generate legal guidance using AI
    guidance = await generateLegalGuidance({
      caseType,
      location,
      description: analysisText,
      language,
    });

    // Save to database
    const message = new Message({
      userId: userId || uuidv4(),
      caseType,
      location,
      description: analysisText,
      response: guidance,
      language,
      documentName: file?.originalname,
    });

    await message.save();

    // Clean up uploaded file
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }

    res.json({
      success: true,
      data: {
        messageId: message._id,
        ...guidance,
        disclaimer: "⚠️ This is legal information, not legal advice. Consult a licensed lawyer for specific cases.",
      },
    });
  }
);

