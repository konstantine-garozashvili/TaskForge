import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import './Auth.css';

/**
 * Création de compte — rôle « utilisateur » par défaut côté backend.
 * L'admin promeut ensuite en technicien depuis /utilisateurs (#4).
 */
function Register() {
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      toast.success('Compte créé, bienvenue !');
      navigate('/tickets', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="tf-auth-page">
      <div className="tf-auth-card">
        <div className="tf-auth-brand">
          <div className="tf-logo-mark">TF</div>
          <h1 className="tf-auth-title">Créer un compte</h1>
          <p className="tf-auth-subtitle">Rejoindre le helpdesk TaskForge</p>
        </div>

        <form className="tf-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="tf-form-error" role="alert">
              {error}
            </p>
          )}

          <label className="tf-field">
            <span className="tf-field-label">Nom complet</span>
            <input
              className="tf-input"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Camille Dupont"
            />
          </label>

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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
            />
          </label>

          <label className="tf-field">
            <span className="tf-field-label">Confirmer le mot de passe</span>
            <input
              className="tf-input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Retapez le mot de passe"
            />
          </label>

          <button className="tf-button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="tf-auth-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
