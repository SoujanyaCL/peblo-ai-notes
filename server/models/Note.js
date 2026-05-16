import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // 👤 User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 📝 Original content
    content: {
      type: String,
      default: "",
      required: true,
    },

    // 🤖 AI title
    title: {
      type: String,
      default: "Untitled Note",
    },

    // 🤖 AI summary
    summary: {
      type: String,
      default: "",
    },

    // 🤖 AI action items
    actionItems: {
      type: [String],
      default: [],
    },

    // 🏷 Tags
    tags: {
      type: [String],
      default: [],
    },

    // 📂 Category
    category: {
      type: String,
      default: "General",
    },

    // 📦 Archive
    archived: {
      type: Boolean,
      default: false,
    },

    // 🌐 Public Share
    shareable: {
      type: Boolean,
      default: false,
    },

    // 🔗 Share ID
    shareId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;