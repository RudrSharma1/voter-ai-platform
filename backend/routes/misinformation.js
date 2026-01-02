import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import db from "../database/db.js";

const router = express.Router();

/**
 * POST /api/misinformation/check
 */
router.post("/check", authMiddleware, async (req, res) => {
  const { claim, source_url } = req.body;

  if (!claim) {
    return res.status(400).json({
      success: false,
      error: "Claim is required",
    });
  }

  let riskLevel = "low";
  let flags = [];

  const suspiciousKeywords = [
    "guaranteed",
    "secret",
    "leaked",
    "ban",
    "fake",
    "rigged",
    "vote cancel",
    "no election",
    "evm hacked",
  ];

  suspiciousKeywords.forEach((word) => {
    if (claim.toLowerCase().includes(word)) {
      flags.push(`Suspicious keyword detected: "${word}"`);
    }
  });

  if (flags.length > 2) riskLevel = "high";
  else if (flags.length > 0) riskLevel = "medium";

  const recommendation =
    riskLevel === "high"
      ? "High risk of misinformation. Verify immediately with official Election Commission or government portals."
      : "Verify this claim using trusted government or reputable news sources.";

  try {
    await db.run(
      `
      INSERT INTO misinformation_checks 
      (user_id, claim, source_url, risk_level, flags, recommendation)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        claim,
        source_url || null,
        riskLevel,
        JSON.stringify(flags),
        recommendation,
      ]
    );

    res.json({
      success: true,
      data: {
        riskLevel,
        flags,
        recommendation,
      },
      explanation: [
        "This is an automated preliminary misinformation check.",
        "The result is heuristic-based and not an official verification.",
      ],
    });
  } catch (err) {
    console.error("Misinformation DB error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process misinformation check",
    });
  }
});

export default router;
