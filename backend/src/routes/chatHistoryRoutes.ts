import express from "express";
import {
  getChatHistory,
  saveChatMessage,
  deleteChatHistory,
} from "../controllers/chatHistoryController.js";

const router = express.Router();

router.get("/history/:userId", getChatHistory);
router.post("/save", saveChatMessage);
router.delete("/history/:userId", deleteChatHistory);

export default router;
