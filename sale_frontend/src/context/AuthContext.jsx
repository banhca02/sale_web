import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLogged') === 'true'
  );
  
  // Thêm state lưu thông tin user động (không cần lưu cứng vào localStorage)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(localStorage.getItem('isLogged') === 'true');

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (isAuthenticated) {
        try {
          const data = await axiosClient.get('/me');
          setUser(data);
        } catch (error) {
          console.error("Không thể xác thực phiên đăng nhập:", error);
          logout(); // Nếu token cookie hết hạn hoặc lỗi, dọn dẹp luôn
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLogged', 'true'); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isLogged');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);