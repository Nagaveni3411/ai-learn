export default function VideoProgressBar({ current = 0, duration = 0 }) {
  const pct = duration > 0 ? Math.min((current / duration) * 100, 100) : 0;
  return (
    <div className="mt-4">
      <div className="h-2 w-full rounded bg-gray-200">
        <div className="h-2 rounded bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-500">{Math.round(pct)}% complete</p>
    </div>
  );
}
