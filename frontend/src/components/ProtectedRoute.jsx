import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Gate de routes privées (ticket #5).
 * - Session en cours de validation → écran d'attente sobre
 * - Pas de session → redirection /login (avec retour prévu après connexion)
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="tf-auth-loading">
        <div className="tf-logo-mark">TF</div>
        <p>Vérification de la session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Variante par rôle — ex. /utilisateurs réservé à l'admin.
 */
export function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (user?.role !== role) {
    return <Navigate to="/tickets" replace />;
  }
  return children;
}

export default ProtectedRoute;
