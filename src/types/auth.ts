// ─── Auth Types ───────────────────────────────────────────────────
// These types define the authentication and authorization structure.
// In production, JWT tokens will be issued by the Express backend and
// verified on each request. For Phase 1, we simulate the flow client-side.

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  // Demo data for customer dashboard
  accountNumber?: string;
  routingNumber?: string;
  accountType?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
