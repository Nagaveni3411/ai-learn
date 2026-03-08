import { Link, useParams } from "react-router-dom";

export default function SectionItem({ subjectId, section }) {
  const { videoId } = useParams();

  return (
    <div className="mb-4">
      <h4 className="mb-2 text-sm font-semibold text-slate-800">{section.title}</h4>
      <div className="space-y-1">
        {section.videos.map((video) => (
          <Link
            key={video.id}
            to={`/courses/${subjectId}/video/${video.id}`}
            className={`block rounded-lg px-2 py-1.5 text-sm ${
              String(video.id) === String(videoId) ? "bg-slate-200" : "hover:bg-slate-100"
            } ${video.locked ? "opacity-60" : ""}`}
          >
            {video.title} {video.is_completed ? "✓" : ""} {video.locked ? "(Locked)" : ""}
          </Link>
        ))}
      </div>
    </div>
  );
}
