import { useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";

export default function VideoPlayer({
  videoId,
  youtubeUrl,
  startPositionSeconds = 0,
  onProgress,
  onCompleted
}) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const endedRef = useRef(false);
  const ytId = useMemo(() => {
    if (!youtubeUrl) return "";
    const directIdPattern = /^[a-zA-Z0-9_-]{11}$/;
    if (directIdPattern.test(youtubeUrl)) return youtubeUrl;
    try {
      const url = new URL(youtubeUrl);
      if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
      if (url.hostname.includes("youtube.com")) return url.searchParams.get("v") || "";
      return "";
    } catch (_) {
      return "";
    }
  }, [youtubeUrl]);

  const flushProgress = async () => {
    if (!playerRef.current) return;
    const current = await playerRef.current.getCurrentTime();
    const duration = await playerRef.current.getDuration();
    onProgress?.({ last_position_seconds: Math.floor(current), duration_seconds: Math.floor(duration) });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!endedRef.current) flushProgress();
    };
  }, []);

  if (!ytId) return <div className="rounded bg-red-50 p-4 text-sm text-red-700">Video unavailable</div>;

  return (
    <YouTube
      videoId={ytId}
      opts={{
        width: "100%",
        playerVars: {
          autoplay: 0,
          start: Math.max(0, Math.floor(startPositionSeconds))
        }
      }}
      onReady={(e) => {
        playerRef.current = e.target;
      }}
      onStateChange={async (e) => {
        const state = e.data;
        if (state === 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(async () => {
            const current = await playerRef.current.getCurrentTime();
            const duration = await playerRef.current.getDuration();
            onProgress?.({
              last_position_seconds: Math.floor(current),
              duration_seconds: Math.floor(duration)
            });
          }, 5000);
        } else if (state === 2) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          await flushProgress();
        } else if (state === 0) {
          endedRef.current = true;
          if (intervalRef.current) clearInterval(intervalRef.current);
          const current = await playerRef.current.getCurrentTime();
          const duration = await playerRef.current.getDuration();
          onCompleted?.({
            last_position_seconds: Math.floor(current),
            duration_seconds: Math.floor(duration)
          });
        }
      }}
    />
  );
}
