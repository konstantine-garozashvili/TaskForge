import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context.js';
import { clearToken, getMe, getToken, login, register, setToken } from '../services/api.js';

/**
 * Auth state for the whole app: current user + token lifecycle.
 * On mount, a stored token is validated against /auth/me — invalid or
 * expired tokens are dropped silently and the user lands on /login.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Si aucun token n'est stocké, la session est résolue dès le départ.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    let cancelled = false;
    getMe()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => clearToken())
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (email, password) => {
    const data = await login(email, password);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signUp = async (name, email, password) => {
    const data = await register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
