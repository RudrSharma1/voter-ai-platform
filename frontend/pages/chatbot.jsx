import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // Load chat history
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/chat/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setChat(
            data.data
              .slice()
              .reverse()
              .map((h) => ({
                q: h.question,
                a: h.answer,
              }))
          );
        }
      })
      .catch((err) => console.error("History error:", err));
  }, [token]);

  const sendMsg = async () => {
    if (!msg.trim() || loading) return;

    const userMsg = msg;
    setMsg("");
    setLoading(true);

    // Optimistic UI
    setChat((prev) => [...prev, { q: userMsg, a: "Thinking..." }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Chat failed");
      }

      // ✅ CORRECT RESPONSE PATH
      const reply =
        data?.data?.answer ||
        "No response from assistant";

      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          q: userMsg,
          a: reply,
        };
        return updated;
      });
    } catch (err) {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          q: userMsg,
          a: "Error getting response",
        };
        return updated;
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">AI Voter Assistant</h2>

        <div className="space-y-4 mb-4">
          {chat.map((c, i) => (
            <div key={i}>
              <p className="font-semibold">You:</p>
              <p>{c.q}</p>

              <p className="font-semibold mt-2">AI:</p>
              <p className="text-indigo-600 dark:text-indigo-400">
                {c.a}
              </p>
            </div>
          ))}
        </div>

        <input
          className="w-full p-3 border rounded mb-2 dark:bg-gray-800"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask about voting..."
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />

        <button
          onClick={sendMsg}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
