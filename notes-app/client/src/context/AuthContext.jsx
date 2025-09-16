// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isAuthenticated = !!token;

  useEffect(() => {
    // keep localStorage in sync
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
    // after register, auto-login (optional)
    return await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isAuthenticated, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
