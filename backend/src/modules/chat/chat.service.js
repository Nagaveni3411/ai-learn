const env = require("../../config/env");

function fallbackReply(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const turn = messages.filter((m) => m.role === "user").length;
  const q = lastUser.toLowerCase();

  if (q.includes("roadmap") || q.includes("plan")) {
    const variants = [
      "Try this: JavaScript Fundamentals -> React -> Node.js + Express -> MySQL -> System Design.",
      "A good sequence is: JS basics, React components, backend APIs, database, then deployment.",
      "Use a 5-step path: JS core, React UI, Express APIs, SQL data modeling, system design basics."
    ];
    return variants[turn % variants.length];
  }

  if (q.includes("backend")) {
    const variants = [
      "Start Node.js + Express APIs, then MySQL for Developers, then Testing JavaScript Apps.",
      "For backend focus: Express APIs -> MySQL -> System Design Intro -> testing.",
      "Backend path: API foundations first, SQL schema next, then scaling and reliability."
    ];
    return variants[turn % variants.length];
  }

  if (q.includes("frontend")) {
    const variants = [
      "Frontend path: JavaScript Fundamentals -> React from Scratch -> CSS Masterclass.",
      "For frontend strength, do JS core, React components, then advanced CSS layouts.",
      "Take JS first, then React, then styling systems and accessibility."
    ];
    return variants[turn % variants.length];
  }

  return "Tell me your target role (frontend/backend/full-stack), and I will generate a step-by-step course plan.";
}

async function askChat(messages) {
  if (!Array.isArray(messages) || !messages.length) {
    return { reply: "Ask me your learning goal and I will suggest a path." };
  }

  if (!env.OPENAI_API_KEY) {
    return { reply: fallbackReply(messages), source: "fallback" };
  }

  const system = {
    role: "system",
    content:
      "You are an LMS study coach. Keep replies concise, practical, and personalized to the user's goals."
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [system, ...messages.map((m) => ({ role: m.role, content: m.content }))]
    })
  });

  if (!response.ok) {
    return { reply: fallbackReply(messages), source: "fallback" };
  }

  const data = await response.json();
  const reply = data.output_text || fallbackReply(messages);
  return { reply, source: "openai" };
}

module.exports = { askChat };
