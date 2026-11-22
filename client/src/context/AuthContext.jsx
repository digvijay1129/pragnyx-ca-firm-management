import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pragnyx_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("pragnyx_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, payload) => {
    const { data } = await api.post(path, payload);
    localStorage.setItem("pragnyx_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login: (payload) => authenticate("/auth/login", payload),
    register: (payload) => authenticate("/auth/register", payload),
    logout: () => {
      localStorage.removeItem("pragnyx_token");
      setUser(null);
    },
    refreshUser: async () => {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      return data.user;
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
