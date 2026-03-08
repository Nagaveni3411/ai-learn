import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

export default function Profile() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await apiClient.get("/subjects?page=1&pageSize=100");
      const items = data.items || [];
      const rows = await Promise.all(
        items.map(async (s) => {
          const summary = await apiClient.get(`/progress/subjects/${s.id}`);
          return { subject: s, progress: summary.data };
        })
      );
      setSummaries(rows);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Profile & Progress</h1>
      <div className="space-y-3">
        {summaries.map((row) => (
          <div key={row.subject.id} className="rounded border bg-white p-4">
            <h2 className="font-medium">{row.subject.title}</h2>
            <p className="text-sm text-gray-600">
              {row.progress.completed_videos}/{row.progress.total_videos} lessons completed ({row.progress.percent_complete}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
