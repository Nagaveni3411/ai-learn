import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubjectOverview from "./pages/SubjectOverview";
import VideoPage from "./pages/VideoPage";
import Profile from "./pages/Profile";
import AuthGuard from "./components/Auth/AuthGuard";
import { logoutRequest } from "./lib/auth";
import { useAuthStore } from "./store/authStore";

function LegacySubjectRedirect() {
  const { subjectId } = useParams();
  return <Navigate to={`/courses/${subjectId}`} replace />;
}

function LegacyVideoRedirect() {
  const { subjectId, videoId } = useParams();
  return <Navigate to={`/courses/${subjectId}/video/${videoId}`} replace />;
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">LMS Path</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link to="/">Courses</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile">Profile</Link>
                <button onClick={logoutRequest} className="rounded-md bg-slate-900 px-3 py-1.5 text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/courses/:subjectId"
          element={
            <AuthGuard>
              <SubjectOverview />
            </AuthGuard>
          }
        />
        <Route
          path="/courses/:subjectId/video/:videoId"
          element={
            <AuthGuard>
              <VideoPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route path="/subjects/:subjectId" element={<LegacySubjectRedirect />} />
        <Route path="/subjects/:subjectId/video/:videoId" element={<LegacyVideoRedirect />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
