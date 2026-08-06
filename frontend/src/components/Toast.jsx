import { useCallback, useRef, useState } from 'react';
import { ToastContext } from '../context/toast-context.js';
import { IconAlert, IconCheck, IconInfo } from './icons.jsx';
import './Toast.css';

/**
 * Toasts — retour non bloquant en bas à droite (ticket créé, erreur…).
 * Entrée : glissade vers le haut 350ms ; sortie plus courte (75%).
 */

const ICONS = {
  success: <IconCheck />,
  error: <IconAlert />,
  info: <IconInfo />,
};

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      delete timers.current[id];
    }, 260);
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = nextId++;
      setToasts((list) => [...list.slice(-3), { id, type, message }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const toast = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="tf-toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`tf-toast tf-toast-${t.type} ${t.leaving ? 'tf-toast-leave' : ''}`}
            onClick={() => dismiss(t.id)}
          >
            <span className="tf-toast-icon">{ICONS[t.type]}</span>
            <span className="tf-toast-message">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
