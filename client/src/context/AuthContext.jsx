import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/httpClient";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }
  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser);

  const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    const nextToken = response.data.token;
    const nextUser = response.data.user;

    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const register = async (username, password) => {
    const response = await api.post("/auth/register", { username, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user && user.role !== "pending"),
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен вызываться внутри AuthProvider");
  }
  return context;
};
