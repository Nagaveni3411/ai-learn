export default function VideoMeta({ video }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold">{video.title}</h1>
      <p className="mt-1 text-sm text-gray-600">{video.description || "No description provided."}</p>
      <p className="mt-2 text-xs text-gray-500">
        {video.subject_title} / {video.section_title}
      </p>
    </div>
  );
}
