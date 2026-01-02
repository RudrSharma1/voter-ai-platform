import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import db from "../database/db.js";

const router = express.Router();

/**
 * POST /api/image/analyze
 */
router.post("/analyze", authMiddleware, async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      error: "Image URL is required",
    });
  }

  let riskLevel = "low";
  let flags = [];
  let explanation = [];

  const suspiciousKeywords = [
    "vote",
    "election",
    "ballot",
    "evm",
    "result",
    "poll",
    "commission",
    "breaking",
    "urgent",
    "voting",
  ];

  const lowerUrl = imageUrl.toLowerCase();

  suspiciousKeywords.forEach((keyword) => {
    if (lowerUrl.includes(keyword)) {
      flags.push(`Contains keyword: "${keyword}"`);
    }
  });

  if (flags.length >= 3) {
    riskLevel = "high";
    explanation.push(
      "The image appears to reference election-related topics frequently used in misinformation."
    );
  } else if (flags.length > 0) {
    riskLevel = "medium";
    explanation.push(
      "The image may relate to civic or voting content and should be verified."
    );
  } else {
    explanation.push(
      "No obvious election-related misinformation signals were detected."
    );
  }

  explanation.push(
    "This is an automated preliminary analysis, not a final verification."
  );

  const recommendation =
    "Verify with official Election Commission or trusted news sources.";

  try {
    await db.run(
      `
      INSERT INTO image_logs (user_id, image_url, risk_level, flags)
      VALUES (?, ?, ?, ?)
      `,
      [req.user.id, imageUrl, riskLevel, JSON.stringify(flags)]
    );

    res.json({
      success: true,
      data: {
        riskLevel,
        flags,
        recommendation,
      },
      explanation,
    });
  } catch (err) {
    console.error("Image analysis DB error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to analyze image",
    });
  }
});

/**
 * GET /api/image/history
 */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const rows = await db.all(
      `
      SELECT image_url, risk_level, flags, created_at
      FROM image_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 30
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      data: rows.map((row) => ({
        imageUrl: row.image_url,
        riskLevel: row.risk_level,
        flags: JSON.parse(row.flags),
        createdAt: row.created_at,
      })),
      explanation: [],
    });
  } catch (err) {
    console.error("Image history error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch image history",
    });
  }
});

export default router;
