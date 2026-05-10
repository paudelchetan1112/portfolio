// Project Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  liveLink?: string;
  githubLink?: string;
  technologies: string[];
  languages: string[];
  category: "web" | "mobile" | "desktop" | "ai" | "other";
  featured: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  image?: string;
  liveLink?: string;
  githubLink?: string;
  technologies: string[];
  languages: string[];
  category: "web" | "mobile" | "desktop" | "ai" | "other";
  featured: boolean;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

// Contact Form
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
