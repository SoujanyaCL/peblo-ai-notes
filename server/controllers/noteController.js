import Note from "../models/Note.js";
import crypto from "crypto";

// Create Note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags,
      category,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find(); // REMOVE user filter TEMPORARILY

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.tags = req.body.tags || note.tags;
    note.category = req.body.category || note.category;
    note.archived = req.body.archived ?? note.archived;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const shareNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // generate random share id
    const shareId = crypto.randomBytes(8).toString("hex");

    note.shareable = true;
    note.shareId = shareId;

    await note.save();

    res.status(200).json({
      success: true,
      shareLink: `http://localhost:5173/shared/${shareId}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      shareId: req.params.shareId,
      shareable: true,
    });

    if (!note) {
      return res.status(404).json({
        message: "Shared note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};