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

    // Strong prompt (forces structured output)
    const prompt = `
You are an AI assistant that extracts structured information from notes.

Analyze the following note and return ONLY valid JSON.

IMPORTANT RULES:
- Return ONLY JSON (no explanation, no markdown)
- Summary must be 1-2 lines
- ActionItems must contain 3–5 short bullet points (never empty)
- SuggestedTitle must be short and meaningful

OUTPUT FORMAT:
{
  "Summary": "",
  "ActionItems": ["", "", "", ""],
  "SuggestedTitle": ""
}

NOTE:
${content}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;

    let parsedContent;

    try {
      // Clean AI output
      const clean = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[^{]*/, "")
        .trim();

      parsedContent = JSON.parse(clean);

      // Ensure valid structure
      parsedContent = {
        Summary: parsedContent.Summary || "",
        ActionItems: Array.isArray(parsedContent.ActionItems)
          ? parsedContent.ActionItems
          : [],
        SuggestedTitle: parsedContent.SuggestedTitle || "Untitled Note",
      };

      // If ActionItems still empty, fallback
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
        user: req.user?._id, // safe for now (won't crash if undefined)
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
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};