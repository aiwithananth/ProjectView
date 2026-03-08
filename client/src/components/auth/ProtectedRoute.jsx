import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'hsl(var(--page-bg))' }}
      >
        <div className="text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <div className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
