import axios from "axios";
import Note from "../models/Note.js";

// Generate AI Summary
export const generateSummary = async (req, res) => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const prompt = `
You are an AI assistant that extracts structured information from notes.

Return ONLY valid JSON in this format:

{
  "Summary": "1-2 line summary",
  "ActionItems": ["task 1", "task 2", "task 3"],
  "SuggestedTitle": "short title"
}

Rules:
- Return ONLY JSON
- No markdown, no explanation
- Keep it clean and strict

NOTE:
${content}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let rawContent = response.data.choices[0].message.content;

    let parsedContent;

    try {
      // safer JSON extraction
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawContent;

      parsedContent = JSON.parse(cleanJson);

      parsedContent = {
        Summary: parsedContent.Summary || "",
        ActionItems: Array.isArray(parsedContent.ActionItems)
          ? parsedContent.ActionItems
          : [],
        SuggestedTitle:
          parsedContent.SuggestedTitle || "Untitled Note",
      };

      if (parsedContent.ActionItems.length === 0) {
        parsedContent.ActionItems = [
          "Review the note",
          "Identify key points",
          "Take necessary actions",
        ];
      }
    } catch (err) {
      console.log("JSON Parse Error:", err.message);

      parsedContent = {
        Summary: rawContent,
        ActionItems: [
          "Review the note",
          "Identify key tasks",
          "Take action",
        ],
        SuggestedTitle: "Generated Note",
      };
    }

    const savedNote = await Note.create({
      user: req.user?._id,
      content,
      title: parsedContent.SuggestedTitle,
      summary: parsedContent.Summary,
      actionItems: parsedContent.ActionItems,
    });

    return res.status(200).json({
      success: true,
      data: savedNote,
    });

  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: "AI generation failed. Please try again.",
      error: error.message,
    });
  }
};