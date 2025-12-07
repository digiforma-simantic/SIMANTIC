/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Custom hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from SSO on mount
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.me();
        const userData = response.data || response;
        
        // Normalize user data from SSO
        const normalizedUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          nip: userData.nip,
          role: userData.roleObj?.slug || userData.role_obj?.slug || userData.role || 'staff',
          roleName: userData.roleObj?.name || userData.role_obj?.name || userData.role_name,
          dinas: userData.dinas?.name || userData.dinas_name,
          dinasId: userData.dinas?.id || userData.dinas_id,
          ssoId: userData.sso_id,
          jenisKelamin: userData.jenis_kelamin,
          jabatan: userData.jabatan,
          unitKerja: userData.unit_kerja,
        };

        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // If token invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
