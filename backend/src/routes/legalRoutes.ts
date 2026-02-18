import express from "express";
import { submitLegalQuery } from "../controllers/legalController.js";

const router = express.Router();

router.post("/query", submitLegalQuery);

export default router;
