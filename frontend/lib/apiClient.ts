"use client";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Router from "next/router";
import { GetUsersResponse, GetUsersParams, User } from "@/lib/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
import type { InternalAxiosRequestConfig } from "axios";

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("user");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // localStorage.removeItem("user");
        // Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

// Example API functions

// // User type example
// export interface User {
//   id: string
//   name: string
//   email: string
//   role: string
//   avatar?: string
// }

// get userCount
// export const getTotalUsers  = async ():Promise<{"total_user_count"}>

// Get Users
export const getUsers = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
  const response = await apiClient.get<GetUsersResponse>("/get_users", {
    params,
  });

  return response.data;
};

// get user by id
export const getUserById = async (user_id: string): Promise<User> => {
  const response = await apiClient.get<User>(`/get_user_by_id/${user_id}`);
  return response.data;
};

// Create a new user
export const createUser = async (userData: {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  await apiClient.post("/create_user", userData);
  console.log("createUser API");
};

// Update a user

export const updateUser = async (
  user_id: string,
  userData: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    role: string;
  }
) => {
  await apiClient.put(`/update_user/${user_id}`, userData);
  console.log("updateUser API");
};

export const deleteUser = async (user_id: string) => {
  await apiClient.delete(`/delete_user/${user_id}`);
  console.log("deleteUser API");
};

// Get projects list
export interface Project {
  project_id: string;
  title: string;
  status: string;
  deadline: string;
  progress: number;
  professor_user: {
    name: string;
    user_id: string;
    image_url: string;
  };
  update_at: string;
  description: string;
  create_at: string;
  user_count: number;
}

export interface Progress {
  progress_id: string;
  status: string;
  estimated_time: string;
  progress_note: string;
  create_at: string;
  update_at: string;
  comments: Comment[];
  title: string;
  author: {
    user_id: string;
    name: string;
    image_url: string;
  };
}

export interface Comment {
  comment_id: string;
  author: {
    user_id: string;
    name: string;
    image_url: string;
  };
  content: string;
  create_at: string;
}

export interface ProjectDetail {
  project: Project;
  students: {
    user_id: string;
    name: string;
    email: string;
    image_url: string;
  }[];
  professors: {
    user_id: string;
    name: string;
    email: string;
  }[];
  progresses: Progress[];
}

export interface GetProjectsResponse {
  total: number;
  results: Project[];
  page: number;
  pageSize: number;
}

export const getProjects = async (params: {
  status?: string;
  keyword?: string;
  sort_by?: string;
  page?: number;
  pageSize?: number;
}): Promise<GetProjectsResponse> => {
  const response = await apiClient.get<GetProjectsResponse>("/get_projects", {
    params,
  });
  console.log("getProjects API");
  return response.data;
};

// TODO: 等後端
export const getProjectDetail = async (params: { project_id: string }): Promise<ProjectDetail> => {
  const response = await apiClient.get<ProjectDetail>(`/project_detail/${params.project_id}`);
  console.log("project_detail API");
  return response.data;
};

export const getTotalProjects = async (params: {
  status?: "in_progress" | "done";
}): Promise<{ total_projects: number }> => {
  const response = await apiClient.get<{ total_projects: number }>("/totalProjects", {
    params,
  });
  console.log("totalProjects API");
  return response.data;
};
export default apiClient;

export const getMyProjects = async (params: { user_id: string }): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>(`/my_projects/${params.user_id}`);
  console.log("getMyProjects API");
  return response.data;
};

export const createProject = async (projectData: {
  title: string;
  status: string;
  deadline: string;
  progress: number;
  description: string;
  users: string[];
}) => {
  await apiClient.post("/create_project", projectData);
  console.log("createProject API");
};

export const updateProject = async (projectData: {
  project_id: string;
  title: string;
  status: string;
  deadline: string;
  progress: number;
  description: string;
  users: string[];
}) => {
  await apiClient.put(`/update_project/${projectData.project_id}`, projectData);
  console.log("updateProject API");
};

export const deleteProject = async (project_id: string) => {
  await apiClient.delete(`/delete_project/${project_id}`);
  console.log("deleteProject API");
};

export const getToken = async ({
  user_id,
  password,
}: {
  user_id: string;
  password: string;
}): Promise<{ message: string; token: string }> => {
  const response = await apiClient.post("/login", {
    user_id,
    password,
  });
  console.log("getToken API");
  return response.data;
};

// Comment API functions

export const createComment = async (commentData: { progress: string; content: string }) => {
  await apiClient.post("/create_comment", commentData);
  console.log("createComment API");
};

export const updateComment = async (
  comment_id: string,
  commentData: {
    progress: string;
    content: string;
  }
) => {
  await apiClient.put(`/update_comment/${comment_id}`, commentData);
  console.log("updateComment API");
};

export const deleteComment = async (comment_id: string) => {
  await apiClient.delete(`/delete_comment/${comment_id}`);
  console.log("deleteComment API");
};

export const createProgress = async (progressData: {
  project_id: string;
  title: string;
  estimated_time: string;
  progress_note: string;
  // status: string;
}) => {
  const response = await apiClient.post("/create_progress", progressData);
  console.log("createProgress API");
};

export const updateProgress = async (
  progress_id: string,
  progressData: {
    estimated_time: string;
    progress_note: string;
    project_id: string;
    title: string;
  }
) => {
  await apiClient.put(`/update_progress/${progress_id}`, progressData);
  console.log("updateProgress API");
};

export const deleteProgress = async (progress_id: string) => {
  await apiClient.delete(`/delete_progress/${progress_id}`);
  console.log("deleteProgress API");
};
