import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { deleteUser, listUsers, updateUser } from '../services/api.js';
import { IconClose, IconPencil, IconTrash } from '../components/icons.jsx';
import './Auth.css';
import './Users.css';

const ROLES = ['utilisateur', 'technicien', 'admin'];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Gestion des utilisateurs — réservé à l'admin (ticket #4).
 * Table sobre : nom, email, rôle, date ; édition et suppression via modales.
 */
function Users() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const reload = useCallback(() => {
    listUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleSave = async (id, fields) => {
    try {
      await updateUser(id, fields);
      toast.success('Utilisateur mis à jour');
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleting.id);
      toast.success(`${deleting.name} supprimé`);
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="tf-users-page">
      {error && (
        <p className="tf-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="tf-table-card">
        <table className="tf-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Créé le</th>
              <th className="tf-table-actions-head">
                <span className="tf-visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users === null &&
              [1, 2, 3].map((n) => (
                <tr key={n} className="tf-table-skeleton">
                  <td colSpan="5">
                    <span className="tf-skeleton-bar" />
                  </td>
                </tr>
              ))}
            {users?.map((u) => (
              <tr key={u.id}>
                <td className="tf-table-name">
                  {u.name}
                  {u.id === me?.id && <span className="tf-you-badge">vous</span>}
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`tf-role-badge tf-role-${u.role}`}>{u.role}</span>
                </td>
                <td className="tf-table-date">{formatDate(u.createdAt)}</td>
                <td className="tf-table-actions">
                  <button
                    type="button"
                    className="tf-icon-button"
                    onClick={() => setEditing(u)}
                    title={`Modifier ${u.name}`}
                    aria-label={`Modifier ${u.name}`}
                  >
                    <IconPencil />
                  </button>
                  <button
                    type="button"
                    className="tf-icon-button tf-icon-button-danger"
                    onClick={() => setDeleting(u)}
                    disabled={u.id === me?.id}
                    title={
                      u.id === me?.id
                        ? 'Impossible de supprimer votre propre compte'
                        : `Supprimer ${u.name}`
                    }
                    aria-label={`Supprimer ${u.name}`}
                  >
                    <IconTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && <p className="tf-table-empty">Aucun utilisateur.</p>}
      </div>

      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
      {deleting && (
        <ConfirmDeleteModal
          user={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="tf-modal-backdrop" onClick={onClose}>
      <div
        className="tf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tf-modal-header">
          <h2 className="tf-modal-title">{title}</h2>
          <button type="button" className="tf-icon-button" onClick={onClose} aria-label="Fermer">
            <IconClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = {};
    if (name.trim() && name !== user.name) fields.name = name.trim();
    if (email.trim() && email !== user.email) fields.email = email.trim();
    if (role !== user.role) fields.role = role;
    if (password) fields.password = password;

    if (Object.keys(fields).length === 0) {
      onClose();
      return;
    }
    setSaving(true);
    await onSave(user.id, fields);
    setSaving(false);
  };

  return (
    <Modal title={`Modifier ${user.name}`} onClose={onClose}>
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
        <label className="tf-field">
          <span className="tf-field-label">Rôle</span>
          <select
            className="tf-input tf-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="tf-field">
          <span className="tf-field-label">Nouveau mot de passe</span>
          <input
            className="tf-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            minLength={8}
          />
        </label>
        <div className="tf-modal-footer">
          <button type="button" className="tf-button-secondary" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="tf-button-primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmDeleteModal({ user, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    await onConfirm();
    setBusy(false);
  };

  return (
    <Modal title="Supprimer cet utilisateur ?" onClose={onClose}>
      <p className="tf-modal-text">
        <strong>{user.name}</strong> ({user.email}) perdra immédiatement l'accès au helpdesk. Cette
        action est définitive.
      </p>
      <div className="tf-modal-footer">
        <button type="button" className="tf-button-secondary" onClick={onClose}>
          Annuler
        </button>
        <button type="button" className="tf-button-danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Suppression…' : 'Supprimer'}
        </button>
      </div>
    </Modal>
  );
}

export default Users;
