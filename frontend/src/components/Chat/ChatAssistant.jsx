import { useState } from "react";
import apiClient from "../../lib/apiClient";

export default function ChatAssistant({ title = "AI Chatbot", subtitle = "Study helper" }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Tell me your goal and I will suggest a clear learning path." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function localReply(history) {
    const turn = history.filter((m) => m.role === "user").length;
    const q = history[history.length - 1]?.content?.toLowerCase() || "";
    if (q.includes("backend")) {
      const options = [
        "Backend path: Node.js + Express APIs -> MySQL for Developers -> Testing JavaScript Apps.",
        "Focus backend in 3 phases: APIs, data modeling, then reliability and system design.",
        "Do Express first, then SQL schema work, then caching/queues in System Design Intro."
      ];
      return options[turn % options.length];
    }
    if (q.includes("frontend")) {
      const options = [
        "Frontend path: JavaScript Fundamentals -> React from Scratch -> CSS Masterclass.",
        "Prioritize JS basics, then React state/routing, then polished responsive UI.",
        "For frontend jobs, complete JS + React + accessibility-focused CSS practice."
      ];
      return options[turn % options.length];
    }
    if (q.includes("ai") || q.includes("chatgpt")) {
      const options = [
        "AI path: AI for Web Developers -> Prompt Engineering practice -> Build one AI feature in your project.",
        "Start with prompt design, then tool calling concepts, then production integration patterns.",
        "Learn AI APIs, build a chatbot module, and add memory + guardrails incrementally."
      ];
      return options[turn % options.length];
    }
    return "Share your goal and available daily time, and I will return a personalized week-by-week learning plan.";
  }

  async function onSend(e) {
    e.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await apiClient.post("/chat", { messages: nextMessages });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: localReply(nextMessages)
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-[520px] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm ${
                m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading ? <p className="text-xs text-slate-500">Thinking...</p> : null}
      </div>
      <form className="border-t border-slate-200 p-3" onSubmit={onSend}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Ask anything about your course plan..."
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
