import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import db from "../database/db.js";

const router = express.Router();

/**
 * POST /api/chat
 */
router.post("/", authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "Message is required",
    });
  }

  const reply =
    "This information relates to voting and civic processes. Please verify using official Election Commission sources.";

  try {
    await db.run(
      `
      INSERT INTO chat_logs (user_id, question, answer)
      VALUES (?, ?, ?)
      `,
      [req.user.id, message, reply]
    );

    res.json({
      success: true,
      data: {
        answer: reply,
      },
      explanation: [
        "This response is generated using a civic-information assistant.",
        "Always verify critical information from official sources.",
      ],
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to save chat log",
    });
  }
});

/**
 * GET /api/chat/history
 */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const rows = await db.all(
      `
      SELECT question, answer, created_at
      FROM chat_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: rows,
      explanation: [],
    });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history",
    });
  }
});

export default router;
