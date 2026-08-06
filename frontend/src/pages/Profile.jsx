import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import './Auth.css';
import './Profile.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * Profil — chaque utilisateur consulte et modifie ses propres infos (ticket #4).
 * Deux blocs séparés : identité (nom/email) et mot de passe.
 */
function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="tf-profile-page">
      <section className="tf-profile-card tf-profile-identity">
        <div className="tf-avatar tf-avatar-large" aria-hidden="true">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="tf-profile-name">{user.name}</h2>
          <span className={`tf-role-badge tf-role-${user.role}`}>{user.role}</span>
          <p className="tf-profile-since">Membre depuis le {formatDate(user.createdAt)}</p>
        </div>
      </section>

      <IdentityForm user={user} />
      <PasswordForm />
    </div>
  );
}

function IdentityForm({ user }) {
  const { updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);

  const dirty = name.trim() !== user.name || email.trim() !== user.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = {};
    if (name.trim() !== user.name) fields.name = name.trim();
    if (email.trim() !== user.email) fields.email = email.trim();
    if (!fields.name && !fields.email) return;

    setSaving(true);
    try {
      await updateProfile(fields);
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="tf-profile-card">
      <h3 className="tf-profile-section-title">Informations</h3>
      <form className="tf-form" onSubmit={handleSubmit} noValidate>
        <label className="tf-field">
          <span className="tf-field-label">Nom</span>
          <input
            className="tf-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="tf-field">
          <span className="tf-field-label">Email</span>
          <input
            className="tf-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <div className="tf-profile-actions">
          <button type="submit" className="tf-button-primary" disabled={saving || !dirty}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const { updateProfile } = useAuth();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = password.length >= 8 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    setSaving(true);
    try {
      await updateProfile({ password });
      toast.success('Mot de passe modifié');
      setPassword('');
      setConfirm('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="tf-profile-card">
      <h3 className="tf-profile-section-title">Mot de passe</h3>
      <form className="tf-form" onSubmit={handleSubmit} noValidate>
        <label className="tf-field">
          <span className="tf-field-label">Nouveau mot de passe</span>
          <input
            className="tf-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            minLength={8}
          />
        </label>
        <label className="tf-field">
          <span className="tf-field-label">Confirmation</span>
          <input
            className="tf-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Retapez le mot de passe"
          />
        </label>
        {mismatch && (
          <p className="tf-form-error" role="alert">
            Les deux mots de passe ne correspondent pas.
          </p>
        )}
        <div className="tf-profile-actions">
          <button type="submit" className="tf-button-primary" disabled={saving || !valid}>
            {saving ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Profile;
