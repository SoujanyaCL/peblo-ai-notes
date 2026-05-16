import express from "express";

import protect from "../middleware/authMiddleware.js";

import { generateSummary } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-summary", generateSummary);

export default router;