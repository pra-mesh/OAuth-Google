// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: string[];
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  roles: string[];
}

// Todo Types
export interface TodoItem {
  id: number;
  title: string;
  isCompleted: boolean;
  ownerId: string;
  createdAt: string;
}

export interface CreateTodoRequest {
  title: string;
  isCompleted?: boolean;
}

export interface UpdateTodoRequest {
  title: string;
  isCompleted: boolean;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormErrors {
  [key: string]: string;
}