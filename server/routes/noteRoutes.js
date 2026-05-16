import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNote,
} from "../controllers/noteController.js";

const router = express.Router();

// 🔐 MUST PROTECT EVERYTHING
router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.post("/:id/share", protect, shareNote);
router.get("/shared/:shareId", getSharedNote);

export default router;