import { IconTicket } from '../components/icons.jsx';
import './Placeholder.css';

/**
 * Page Tickets — socle posé par #5, module complet livré par #10 (Pelagie).
 */
function Tickets() {
  return (
    <section className="tf-placeholder">
      <div className="tf-placeholder-icon">
        <IconTicket size={28} />
      </div>
      <h2 className="tf-placeholder-title">Aucun ticket pour le moment</h2>
      <p className="tf-placeholder-text">
        Le module tickets arrive très vite — création, suivi, filtres et assignation sont en cours
        de développement.
      </p>
    </section>
  );
}

export default Tickets;
