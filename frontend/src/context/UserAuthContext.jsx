import { createContext, useContext, useState, useEffect } from 'react';
import * as userAuthService from '../services/userAuthService';

const UserAuthContext = createContext(null);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = userAuthService.getUserToken();
      if (token) {
        try {
          const res = await userAuthService.getUserProfile();
          setUser(res.user);
        } catch {
          userAuthService.userLogout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await userAuthService.userLogin({ email, password });
    userAuthService.setUserToken(data.token);
    localStorage.removeItem('scholamatch_admin_token');
    setUser(data.user);
    return data;
  };

  const logout = () => {
    userAuthService.userLogout();
    setUser(null);
  };

  const registerUser = async (formData) => {
    const data = await userAuthService.register(formData);
    return data;
  };

  const setVerifiedUser = (token, userData) => {
    userAuthService.setUserToken(token);
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const res = await userAuthService.getUserProfile();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!userAuthService.getUserToken(),
        login,
        logout,
        register: registerUser,
        setVerifiedUser,
        refreshUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};