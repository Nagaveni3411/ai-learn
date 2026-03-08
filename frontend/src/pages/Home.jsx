import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";
import Spinner from "../components/common/Spinner";
import ChatAssistant from "../components/Chat/ChatAssistant";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get("/subjects?page=1&pageSize=100");
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Learning Path</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Courses</h1>
        <p className="mt-2 text-sm text-slate-600">Track progress and continue in strict order.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
            >
              <h2 className="text-lg font-semibold text-slate-900">{course.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{course.description}</p>
              <p className="mt-4 text-sm font-medium text-slate-900">Start learning</p>
            </Link>
          ))}
        </div>

        <ChatAssistant title="AI Chatbot" subtitle="Personalized, multi-turn course guidance" />
      </div>
    </div>
  );
}
