import { useState, useEffect } from 'react';
import { login } from './authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error al recuperar usuario:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  async function handleLogin(credentials, onLoginCallback) {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      console.log('Login data:', data);
      
      if (!data) return null;
      
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      
      setUser(data.user);
      
      if (onLoginCallback) onLoginCallback(data.token, 'user');
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  }

  return { user, loading, error, handleLogin, logout };
}
