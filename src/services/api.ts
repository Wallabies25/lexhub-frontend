const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export class ApiService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('lexhub_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If JSON parsing fails, use the default message
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Authentication endpoints
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // For development: Send registration data directly to backend
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role
      }),
    });
  }

  async registerLawyer(lawyerData: LawyerRegisterRequest): Promise<AuthResponse> {
    return this.request('/auth/register/lawyer', {
      method: 'POST',
      body: JSON.stringify(lawyerData),
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // For development: Add client-side validation since backend doesn't validate properly
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    if (!credentials.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    try {
      // Send email/password directly to backend
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });
      
      // Additional validation: if backend returns a user but role is 'public' and we're expecting something else
      // This is a workaround for backend issues
      if (!response.user || !response.token) {
        throw new Error('Invalid login credentials');
      }
      
      return response;
    } catch (error) {
      // If it's a network error or server error, throw a user-friendly message
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please try again.');
      }
      throw error;
    }
  }

  async getProfile(): Promise<UserProfile> {
    return this.request('/auth/profile');
  }

  // Statutes endpoints
  async getStatutes(search?: string): Promise<StatutesResponse> {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/statutes${queryParam}`);
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    return this.request('/health');
  }
}

// Type definitions
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface LawyerRegisterRequest extends RegisterRequest {
  phone: string;
  licenseNumber: string;
  specialty: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  idToken?: string; // For Firebase auth
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
    mfaEnabled: boolean;
  };
  token: string;
  expiresIn: number;
}

export interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
    mfaEnabled: boolean;
  };
}

export interface StatutesResponse {
  message: string;
  data: LegalStatute[];
  count: number;
}

export interface LegalStatute {
  id: number;
  title: string;
  content: string;
  category: string;
  enacted_date: string;
  last_updated: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

// Create singleton instance
export const apiService = new ApiService();