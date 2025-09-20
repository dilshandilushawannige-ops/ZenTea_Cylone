import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, profile as apiProfile } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const { data } = await apiProfile(token);
          setUser(data);
        } catch (e) {
          console.log(e);
          logout();
        }
      }
    })();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await apiLogin({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      Swal.fire({ icon: 'success', title: 'Logged in', toast: true, position: 'top', timer: 1500, showConfirmButton: false });
      return data.user;
    } catch (e) {
      Swal.fire({ icon: 'error', title: e.response?.data?.message || 'Login failed', toast: true, position: 'top' });
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    Swal.fire({ icon: 'success', title: 'Logged out', toast: true, position: 'top', timer: 1200, showConfirmButton: false });
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}
