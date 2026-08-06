import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LogoMark } from './Logo.jsx';
import { IconChart, IconLogout, IconTicket, IconUsers } from './icons.jsx';
import './AppShell.css';

const TITLES = {
  '/tickets': 'Tickets',
  '/dashboard': 'Dashboard',
  '/utilisateurs': 'Utilisateurs',
};

/**
 * Coquille applicative : sidebar 240px + header + contenu centré.
 * Toutes les pages privées (tickets, dashboard, admin) vivent ici —
 * Pelagie (#9/#10) et Yanis (#41) branchent leurs pages sur cette base.
 */
function AppShell() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="tf-shell">
      <aside className="tf-sidebar">
        <div className="tf-sidebar-brand">
          <LogoMark size={28} />
          <span className="tf-brand-name">TaskForge</span>
        </div>

        <nav className="tf-nav">
          <NavLink to="/tickets" className="tf-nav-item">
            <IconTicket />
            <span>Tickets</span>
          </NavLink>
          <NavLink to="/dashboard" className="tf-nav-item">
            <IconChart />
            <span>Dashboard</span>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/utilisateurs" className="tf-nav-item">
              <IconUsers />
              <span>Utilisateurs</span>
            </NavLink>
          )}
        </nav>

        <div className="tf-sidebar-user">
          <div className="tf-avatar" aria-hidden="true">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="tf-user-meta">
            <span className="tf-user-name">{user?.name}</span>
            <span className={`tf-role-badge tf-role-${user?.role}`}>{user?.role}</span>
          </div>
          <button
            type="button"
            className="tf-icon-button"
            onClick={handleLogout}
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <IconLogout />
          </button>
        </div>
      </aside>

      <div className="tf-main">
        <header className="tf-header">
          <h1 className="tf-header-title">{TITLES[location.pathname] ?? 'TaskForge'}</h1>
        </header>
        <main className="tf-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
