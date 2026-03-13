import { createContext, useContext, useState, useEffect } from 'react';
import * as adminAuthService from '../services/adminAuthService';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = adminAuthService.getAdminToken();
      if (token) {
        try {
          const res = await adminAuthService.getAdminDashboard();
          setAdmin(res.data?.admin || { email: 'admin' });
        } catch {
          adminAuthService.adminLogout();
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await adminAuthService.adminLogin({ email, password });
    adminAuthService.setAdminToken(data.token);
    localStorage.removeItem('scholamatch_user_token');
    setAdmin(data.user);
    return data;
  };

  const logout = () => {
    adminAuthService.adminLogout();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!adminAuthService.getAdminToken(),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};