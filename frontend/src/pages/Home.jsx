import { useEffect, useState } from 'react';
import { getApiInfo } from '../services/api.js';

/**
 * Home page - displays backend connection status.
 * Validates the frontend <-> backend proxy configuration (issue #13).
 */
function Home() {
  const [apiInfo, setApiInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getApiInfo()
      .then(setApiInfo)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="home">
      <h1>🔥 TaskForge</h1>
      <p>Gestion de tickets d'incidents helpdesk - MVP ForgeWorks</p>

      <section className="status">
        <h2>Backend status</h2>
        {error && <p className="error">❌ Backend unreachable: {error}</p>}
        {!error && !apiInfo && <p>⏳ Connecting to API…</p>}
        {apiInfo && (
          <p className="success">
            ✅ {apiInfo.message} (v{apiInfo.version})
          </p>
        )}
      </section>
    </main>
  );
}

export default Home;
