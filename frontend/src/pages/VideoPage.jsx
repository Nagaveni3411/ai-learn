import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/Layout/AppShell";
import SubjectSidebar from "../components/Sidebar/SubjectSidebar";
import VideoPlayer from "../components/Video/VideoPlayer";
import VideoMeta from "../components/Video/VideoMeta";
import VideoProgressBar from "../components/Video/VideoProgressBar";
import Alert from "../components/common/Alert";
import apiClient from "../lib/apiClient";
import { cancelPendingProgress, flushProgressWithRetry, sendProgressDebounced } from "../lib/progress";
import { useSidebarStore } from "../store/sidebarStore";

export default function VideoPage() {
  const { subjectId, videoId } = useParams();
  const navigate = useNavigate();
  const { tree, loading, error, setTree, setLoading, setError, markVideoCompleted } = useSidebarStore();
  const [video, setVideo] = useState(null);
  const [resume, setResume] = useState({ last_position_seconds: 0, is_completed: false });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionError, setCompletionError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [treeRes, videoRes] = await Promise.all([
          apiClient.get(`/subjects/${subjectId}/tree`),
          apiClient.get(`/videos/${videoId}`)
        ]);
        setTree(treeRes.data);
        setVideo(videoRes.data);
        if (!videoRes.data.locked) {
          const progressRes = await apiClient.get(`/progress/videos/${videoId}`);
          setResume(progressRes.data);
          setIsCompleted(Boolean(progressRes.data.is_completed));
          setCurrentTime(progressRes.data.last_position_seconds || 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelPendingProgress(videoId);
    };
  }, [subjectId, videoId, setError, setLoading, setTree]);

  async function handleProgress(payload) {
    if (isCompleted) return;
    setCurrentTime(payload.last_position_seconds || 0);
    setDuration(payload.duration_seconds || 0);
    sendProgressDebounced(videoId, {
      last_position_seconds: payload.last_position_seconds,
      is_completed: false
    });
  }

  async function handleCompleted(payload = {}) {
    setCompletionError("");
    cancelPendingProgress(videoId);
    try {
      await flushProgressWithRetry(videoId, {
        last_position_seconds:
          payload.duration_seconds ||
          payload.last_position_seconds ||
          duration ||
          video?.duration_seconds ||
          resume.last_position_seconds ||
          0,
        is_completed: true
      });
      setIsCompleted(true);
      setResume((prev) => ({ ...prev, is_completed: true }));
      markVideoCompleted(videoId);
      if (video?.next_video_id) {
        navigate(`/courses/${subjectId}/video/${video.next_video_id}`);
      }
    } catch (_) {
      setCompletionError("Could not save completion. Please click complete again.");
    }
  }

  const sidebar = <SubjectSidebar subjectId={subjectId} tree={tree} loading={loading} error={error} />;

  return (
    <AppShell sidebar={sidebar}>
      {video ? <VideoMeta video={video} /> : null}
      {video?.locked ? (
        <Alert type="info">{video.unlock_reason || "Complete previous video"}</Alert>
      ) : (
        <>
          <VideoPlayer
            videoId={videoId}
            youtubeUrl={video?.youtube_url}
            startPositionSeconds={resume.last_position_seconds || 0}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />
          <div className="mt-3">
            <button
              onClick={() =>
                handleCompleted({
                  last_position_seconds: currentTime,
                  duration_seconds: duration || video?.duration_seconds || 0
                })
              }
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Mark complete and continue
            </button>
          </div>
          <VideoProgressBar current={currentTime} duration={duration || video?.duration_seconds || 0} />
        </>
      )}
      {completionError ? <Alert type="error">{completionError}</Alert> : null}
      {!video?.next_video_id && (resume?.is_completed || isCompleted) ? (
        <Alert type="success">Course completed. Great work.</Alert>
      ) : null}
    </AppShell>
  );
}
