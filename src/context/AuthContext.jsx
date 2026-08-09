import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }
      setAdmin(data.admin);
      return { success: true };
    }
    return { success: false, error: data.error || 'Login failed' };
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('admin_token');
    setAdmin(null);
  };

  const updateAdminProfile = async (profileData) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(profileData),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }
      setAdmin(data.admin);
      return { success: true, message: data.message };
    }
    return { success: false, error: data.error || 'Failed to update profile' };
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth, updateAdminProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
