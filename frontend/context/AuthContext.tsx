"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";
import { ApiResponse, User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: { name?: string; imageBase64?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setSession = (token: string, user: User) => {
  localStorage.setItem("lucknow-cart-token", token);
  localStorage.setItem("lucknow-cart-user", JSON.stringify(user));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persistedUser = localStorage.getItem("lucknow-cart-user");
    if (persistedUser) {
      setUser(JSON.parse(persistedUser) as User);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, isAdmin = false) => {
    const endpoint = isAdmin ? "/auth/admin/login" : "/auth/login";
    const res = await api.post<ApiResponse<{ token: string; user: User }>>(endpoint, { email, password });
    setSession(res.data.data.token, res.data.data.user);
    setUser(res.data.data.user);
    toast.success(res.data.message);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>("/auth/register", {
      name,
      email,
      password,
    });
    setSession(res.data.data.token, res.data.data.user);
    setUser(res.data.data.user);
    toast.success(res.data.message);
  };

  const logout = () => {
    localStorage.removeItem("lucknow-cart-token");
    localStorage.removeItem("lucknow-cart-user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (payload: { name?: string; imageBase64?: string }) => {
    const res = await api.put<ApiResponse<User>>("/users/profile", payload);
    setUser(res.data.data);
    localStorage.setItem("lucknow-cart-user", JSON.stringify(res.data.data));
    toast.success(res.data.message);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
