import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateSummary } from "../controllers/aiController.js";

const router = express.Router();

// Protected AI route (requires login token)
router.post("/generate-summary", protect, generateSummary);

export default router;