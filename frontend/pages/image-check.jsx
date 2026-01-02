import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

export default function ImageCheck() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    setError("");
    setResult(null);

    if (!imageUrl) {
      setError("Image URL is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/image/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong");
        return;
      }

      // 🔒 NORMALIZED RESULT
      setResult({
        ...data.data,
        explanation: data.explanation,
      });
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Verify Image / Poster</h2>

        <input type="file" disabled className="mb-2 opacity-50" />
        <p className="text-sm text-gray-500 mb-4">
          File upload coming soon. Currently supports image URL.
        </p>

        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Paste image URL here"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button
          onClick={analyze}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Analyze
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {result && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p>
              <strong>Risk Level:</strong>{" "}
              <span className="uppercase">{result.riskLevel}</span>
            </p>

            {result.flags.length > 0 && (
              <div className="mt-2">
                <strong>Flags:</strong>
                <ul className="list-disc ml-5">
                  {result.flags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2">
              <strong>Explanation:</strong>
              <ul className="list-disc ml-5">
                {result.explanation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
