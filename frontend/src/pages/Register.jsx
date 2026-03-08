import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../lib/auth";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await registerRequest(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">Register</h1>
      {error ? <Alert type="error">{error}</Alert> : null}
      <form className="mt-4 space-y-3" onSubmit={onSubmit} autoComplete="off">
        <input
          value={form.name}
          autoComplete="off"
          className="w-full rounded border p-2"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          value={form.email}
          autoComplete="off"
          className="w-full rounded border p-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          value={form.password}
          autoComplete="new-password"
          className="w-full rounded border p-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" className="w-full">Create account</Button>
      </form>
      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-accent">Login</Link></p>
    </div>
  );
}
