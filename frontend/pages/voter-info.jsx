import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

export default function VoterInfo() {
  const [claim, setClaim] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkMisinformation = async () => {
    setError("");
    setResult(null);

    if (!claim.trim()) {
      setError("Please enter a claim to verify.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/misinformation/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            claim,
            source_url: sourceUrl || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Verification failed");
      }

      // ✅ MAP BACKEND → FRONTEND SHAPE
      setResult({
        analysis: {
          riskLevel: data?.data?.riskLevel || "unknown",
          flags: data?.data?.flags || [],
          recommendation:
            data?.data?.recommendation || "No recommendation available",
        },
        explanation: Array.isArray(data.explanation)
          ? data.explanation
          : [],
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to verify claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Fact Check & Misinformation Verification
        </h1>

        <textarea
          className="w-full p-3 border rounded mb-3"
          rows={4}
          placeholder="Enter the claim you want to verify..."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Optional source URL"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />

        <button
          onClick={checkMisinformation}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Checking..." : "Verify Claim"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {result && (
          <div className="mt-6 border rounded p-4 bg-gray-50 dark:bg-gray-800">
            <h2 className="font-bold text-lg mb-2">Analysis Result</h2>

            <p>
              <strong>Risk Level:</strong>{" "}
              <span className="capitalize">
                {result.analysis.riskLevel}
              </span>
            </p>

            {result.analysis.flags.length > 0 && (
              <ul className="list-disc ml-6 mt-2">
                {result.analysis.flags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}

            <p className="mt-3">
              <strong>Recommendation:</strong>{" "}
              {result.analysis.recommendation}
            </p>

            {result.explanation.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                {result.explanation.map((line, i) => (
                  <p key={i}>• {line}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
