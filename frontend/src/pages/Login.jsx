import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginRequest } from "../lib/auth";
import ChatAssistant from "../components/Chat/ChatAssistant";
import { API_BASE_URL, API_CONFIG_ERROR } from "../lib/config";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await loginRequest(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(
        API_CONFIG_ERROR ||
        err.response?.data?.message ||
          `Login failed. Check backend URL/CORS (API: ${API_BASE_URL || "NOT_SET"}).`
      );
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[400px_1fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">LMS Path</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-600">Continue your learning path.</p>
        {error ? <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

        <form className="mt-5 space-y-3" onSubmit={onSubmit} autoComplete="off">
          <input
            value={form.email}
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            value={form.password}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New user? <Link to="/register" className="text-slate-900 underline">Create account</Link>
        </p>
      </section>

      <ChatAssistant title="AI Chatbot" subtitle="ChatGPT-like study guidance" />
    </div>
  );
}
