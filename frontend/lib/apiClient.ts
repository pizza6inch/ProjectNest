"use client"
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import Router from "next/router"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add Authorization header
import type { InternalAxiosRequestConfig } from "axios"

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        Router.push("/login")
      }
    }
    return Promise.reject(error)
  }
)

// Example API functions

// User type example
export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}


// Get Users
export const getUsers = async():Promise<User[]> => {
  const response = await apiClient.get<User[]>("/get_users")
  console.log("getUsers API");
  return response.data
}

// Create a new user
export const createUser = async (userData: {
  name: string
  email: string
  password: string
  role: string
}): Promise<User> => {
  const response = await apiClient.post<User>("/users", userData)
  console.log("createUser API");

  return response.data
}

// Get projects list
export interface Project {
  id: string
  title: string
  status: string
  deadline: string
  progress: number
  professor: string
  lastActivity: string
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>("/projects")
  console.log("getProjects API");
  return response.data
}

export default apiClient
