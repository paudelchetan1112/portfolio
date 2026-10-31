import api from "./api";

import type {
  Project,
  ProjectFormData,
  User,
  LoginCredentials,
  SignupCredentials,
  ContactFormData,
  ContactMessage,
} from "@/types";

// ====================
// Auth Services
// ====================

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{
      token: string;
      user: User;
    }>("/auth/login", credentials);

    return response.data;
  },

  signup: async (credentials: SignupCredentials) => {
    const response = await api.post<{
      token: string;
      user: User;
    }>("/auth/register", credentials);

    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: async () => {
    const response = await api.get<{
      user: User;
    }>("/auth/me");

    return response.data;
  },
};

// ====================
// Project Services
// ====================

export const projectService = {
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    search?: string;
  }) => {
    const response = await api.get<{
      projects: Project[];
    }>("/projects", {
      params,
    });

    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{
      project: Project;
    }>(`/projects/${id}`);

    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get<{
      projects: Project[];
    }>("/projects", {
      params: {
        featured: true,
      },
    });

    return response.data;
  },

  create: async (data: ProjectFormData) => {
    const response = await api.post<{
      project: Project;
    }>("/projects", data);

    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ProjectFormData>
  ) => {
    const response = await api.put<{
      project: Project;
    }>(`/projects/${id}`, data);

    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(
      `/projects/${id}`
    );

    return response.data;
  },
};

// ====================
// Contact Services
// ====================

export const contactService = {
  // Public: Send contact form
  send: async (data: ContactFormData) => {
    const response = await api.post<{
      success: boolean;
      message: string;
    }>("/contact", data);

    return response.data;
  },

  // Admin: Get all contact messages
  getAllMessages: async () => {
    const response = await api.get<{
      success: boolean;
      count: number;
      data: ContactMessage[];
    }>("/contact/admin/messages");

    return response.data;
  },

  // Admin: Update contact message status
  updateStatus: async (
    id: string,
    status: ContactMessage["status"]
  ) => {
    const response = await api.patch<{
      success: boolean;
      message: string;
      data: ContactMessage;
    }>(`/contact/admin/messages/${id}`, {
      status,
    });

    return response.data;
  },

  // Admin: Delete contact message
  deleteMessage: async (id: string) => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/contact/admin/messages/${id}`);

    return response.data;
  },
};