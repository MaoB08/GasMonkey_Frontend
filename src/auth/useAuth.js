import { useState } from 'react';
import { login } from './authService';
import { useAuthContext } from './AuthContext';

export function useAuth() {
  const { user, login: contextLogin, logout: contextLogout, getToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(credentials, onLoginCallback) {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      console.log('Login data:', data);

      if (!data) return null;

      // Si requiere 2FA, pasar data al callback
      if (data.requires2FA) {
        if (onLoginCallback) onLoginCallback(data);
        return data;
      }

      // Si NO requiere 2FA (login directo)
      // Use context login to update global state
      contextLogin(data.token, data.user);

      if (onLoginCallback) onLoginCallback(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    error,
    handleLogin,
    logout: contextLogout,
    getToken
  };
}
