import { IconUsers } from '../components/icons.jsx';
import './Placeholder.css';

/**
 * Page Utilisateurs (admin) — gestion des comptes livrée par #4.
 */
function Users() {
  return (
    <section className="tf-placeholder">
      <div className="tf-placeholder-icon">
        <IconUsers size={28} />
      </div>
      <h2 className="tf-placeholder-title">Gestion des utilisateurs</h2>
      <p className="tf-placeholder-text">
        La liste des comptes et la gestion des rôles seront disponibles ici.
      </p>
    </section>
  );
}

export default Users;
