// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5181',
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    
    // External auth endpoints
    GOOGLE_LOGIN: '/api/externalauth/google-login',
    
    // Todo endpoints
    TODOS: '/api/todo',
    TODO_BY_ID: (id: number) => `/api/todo/${id}`,
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Token storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    TOKEN_EXPIRY: 'tokenExpiry',
  },
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;