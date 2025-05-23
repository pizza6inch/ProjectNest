"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { User } from "@/lib/types";
import { createUser, getToken } from "@/lib/apiClient";

import { useToast } from "./use-toast";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: string;
  role: string;
  name: string;
  email: string;
  img_url: string;
}

type UserRole = "student" | "professor" | "admin" | null;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // On mount, check if user info is stored in localStorage (simulate session)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (student_id: string, password: string) => {
    setLoading(true);
    try {
      const response = await getToken({ user_id: student_id, password });

      console.log("Login response:", response);
      // setUser(response);
      localStorage.setItem("user", JSON.stringify(response.token));
      const decodedToken: DecodedToken = jwtDecode(response.token);
      const userData: User = {
        user_id: decodedToken.user_id,
        name: decodedToken.name,
        role: decodedToken.role,
        image_url: decodedToken.img_url,
      };
      setUser(userData);
      if (userData.role === "admin") router.push("/admin");
      else {
        router.push("/dashboard");
      }

      toast({
        title: "Login Success",
        description: "Welcome back!",
        variant: "default",
      });
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    student_id: string,
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setLoading(true);
    try {
      await createUser({
        user_id: student_id,
        name,
        email,
        password,
        role,
      });
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      await login(student_id, password);
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
