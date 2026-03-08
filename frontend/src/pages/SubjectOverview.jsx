import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../lib/apiClient";
import Spinner from "../components/common/Spinner";

export default function SubjectOverview() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await apiClient.get(`/subjects/${subjectId}/first-video`);
      if (data.video_id) {
        navigate(`/courses/${subjectId}/video/${data.video_id}`, { replace: true });
      }
    })();
  }, [subjectId, navigate]);

  return <div className="p-8"><Spinner /></div>;
}
