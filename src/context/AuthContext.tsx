import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthContextValue, AuthUser, LoginCredentials, UserRole } from '../types/auth';

// ─── Simulated JWT Auth ────────────────────────────────────────────
// Phase 1 simulates JWT authentication client-side. The real backend
// will issue JWT tokens via Express + bcrypt and verify them on each
// API request. The structure below mirrors that flow.

const STORAGE_KEY = 'evercrest-auth';

// Demo credentials — in production these live in MySQL with bcrypt hashes
const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  'customer@evercrestbank.com': {
    password: 'demo1234',
    user: {
      id: 'cus-001',
      email: 'customer@evercrestbank.com',
      firstName: 'Alexander',
      lastName: 'Hayes',
      role: 'customer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      accountNumber: '4827 **** **** 9153',
      routingNumber: '021 000 089',
      accountType: 'Evercrest Premium Checking',
    },
  },
  'admin@evercrestbank.com': {
    password: 'admin1234',
    user: {
      id: 'adm-001',
      email: 'admin@evercrestbank.com',
      firstName: 'Victoria',
      lastName: 'Sterling',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
};

// Simulate a JWT token (header.payload.signature format)
function createMockToken(userId: string, role: UserRole): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      role,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  );
  const signature = btoa(`mock-signature-${userId}-${role}`);
  return `${header}.${payload}.${signature}`;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          // Check token expiry
          const payload = JSON.parse(atob(parsed.token.split('.')[1]));
          if (payload.exp > Date.now()) {
            setUser(parsed.user);
            setToken(parsed.token);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials, role: UserRole): Promise<{ success: boolean; error?: string }> => {
      await new Promise((r) => setTimeout(r, 600));

      const record = DEMO_USERS[credentials.email];
      if (!record || record.password !== credentials.password) {
        return { success: false, error: 'Invalid email or password.' };
      }

      if (record.user.role !== role) {
        return {
          success: false,
          error: `This account does not have ${role} access. Please use the correct login portal.`,
        };
      }

      const mockToken = createMockToken(record.user.id, role);
      setUser(record.user);
      setToken(mockToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: mockToken, user: record.user }));
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
