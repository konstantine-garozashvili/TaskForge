import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import ProtectedRoute, { RequireRole } from './components/ProtectedRoute.jsx';
import AppShell from './components/AppShell.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Profile from './pages/Profile.jsx';

/**
 * Routage TaskForge (ticket #5).
 * /login et /register sont publiques ; tout le reste passe par
 * ProtectedRoute + la coquille applicative. /utilisateurs est admin-only.
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/tickets" replace />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profil" element={<Profile />} />
              <Route
                path="/utilisateurs"
                element={
                  <RequireRole role="admin">
                    <Users />
                  </RequireRole>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
