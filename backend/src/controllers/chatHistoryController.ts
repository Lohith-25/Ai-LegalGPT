import { Request, Response } from "express";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getChatHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const messages = await Message.find({ userId }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  }
);

export const saveChatMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, caseType, location, description, language = "en" } = req.body;

    if (!userId || !caseType) {
      return res.status(400).json({
        success: false,
        error: "userId and caseType are required",
      });
    }

    const message = new Message({
      userId,
      caseType,
      location,
      description,
      language,
    });

    await message.save();

    res.status(201).json({
      success: true,
      data: message,
      message: "Chat message saved successfully",
    });
  }
);

export const deleteChatHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const result = await Message.deleteMany({ userId });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} messages`,
    });
  }
);
