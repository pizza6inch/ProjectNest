"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "student" | "professor" | "guest" | "admin" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    // On mount, check if user info is stored in localStorage (simulate session)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call to login endpoint
      // Replace with real API call
      // Example response:
      // { id, name, email, role, avatar }
      const response = await new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          // Mock user data based on email for demo
          if (email === "admin@example.com") {
            resolve({
              id: "1",
              name: "Admin User",
              email,
              role: "admin",
              avatar: "/placeholder-user.jpg",
            })
          } else if (email === "professor@example.com") {
            resolve({
              id: "2",
              name: "Professor User",
              email,
              role: "professor",
              avatar: "/placeholder-user.jpg",
            })
          } else if (email === "student@example.com") {
            resolve({
              id: "3",
              name: "Student User",
              email,
              role: "student",
              avatar: "/placeholder-user.jpg",
            })
          } else {
            resolve({
              id: "4",
              name: "Guest User",
              email,
              role: "guest",
              avatar: "/placeholder-user.jpg",
            })
          }
        }, 1000)
      })
      setUser(response)
      localStorage.setItem("user", JSON.stringify(response))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true)
    try {
      // Simulate API call to register endpoint
      // Replace with real API call
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        avatar: "/placeholder-user.jpg",
      }
      // Simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
