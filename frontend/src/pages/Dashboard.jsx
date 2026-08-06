import { IconChart } from '../components/icons.jsx';
import './Placeholder.css';

/**
 * Page Dashboard — statistiques livrées par #11 (backend) et #41 (Yanis).
 */
function Dashboard() {
  return (
    <section className="tf-placeholder">
      <div className="tf-placeholder-icon">
        <IconChart size={28} />
      </div>
      <h2 className="tf-placeholder-title">Le dashboard arrive</h2>
      <p className="tf-placeholder-text">
        Tickets ouverts, temps moyen de résolution et répartition par priorité seront affichés ici.
      </p>
    </section>
  );
}

export default Dashboard;
