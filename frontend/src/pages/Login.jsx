import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import './Auth.css';

/**
 * Connexion — carte simple 400px, pas de hero marketing.
 * Redirige vers la page demandée avant l'auth (state.from) ou /tickets.
 */
function Login() {
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await signIn(email.trim(), password);
      toast.success(`Bonjour ${user.name}`);
      const destination = location.state?.from?.pathname ?? '/tickets';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.message === 'Invalid credentials' ? 'Email ou mot de passe incorrect.' : err.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="tf-auth-page">
      <div className="tf-auth-card">
        <div className="tf-auth-brand">
          <div className="tf-logo-mark">TF</div>
          <h1 className="tf-auth-title">TaskForge</h1>
          <p className="tf-auth-subtitle">Helpdesk interne — ForgeWorks</p>
        </div>

        <form className="tf-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="tf-form-error" role="alert">
              {error}
            </p>
          )}

          <label className="tf-field">
            <span className="tf-field-label">Email</span>
            <input
              className="tf-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@forgeworks.fr"
            />
          </label>

          <label className="tf-field">
            <span className="tf-field-label">Mot de passe</span>
            <input
              className="tf-input"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
            />
          </label>

          <button className="tf-button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="tf-auth-footer">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
