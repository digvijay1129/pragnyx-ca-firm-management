import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading, sessionError, retrySession } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader"><span className="spinner" />Checking your session…</div>;
  if (sessionError) {
    return (
      <div className="page-loader">
        <p className="notice notice-error" role="alert">{sessionError}</p>
        <button className="button button-dark" type="button" onClick={retrySession}>Retry connection</button>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <Outlet />;
}
