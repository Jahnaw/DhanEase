import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup, getMe } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem("token", res.data.token);
    await loadUser();
    return res;
  };

  const signup = async (payload) => {
    const res = await apiSignup(payload);
    localStorage.setItem("token", res.data.token);
    await loadUser();
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
