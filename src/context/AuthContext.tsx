import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthContextValue, AuthUser, LoginCredentials, UserRole } from '../types/auth';
import { supabaseCustomer, supabaseAdmin } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children, supabaseClient }: { children: ReactNode, supabaseClient: SupabaseClient }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user profile and merge with AuthUser type
  const fetchUserProfile = async (authUser: any): Promise<AuthUser | null> => {
    // Try to fetch from admins table first
    let { data: adminData } = await supabaseClient
      .from('admins')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (adminData) {
      const adminInitials = `${adminData.first_name?.[0] || 'A'}${adminData.last_name?.[0] || ''}`.toUpperCase();
      const defaultAdminAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%231e3a8a"/><text x="50" y="58" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23f8fafc" text-anchor="middle">${adminInitials}</text></svg>`;
      return {
        id: adminData.id,
        email: adminData.email,
        firstName: adminData.first_name,
        lastName: adminData.last_name,
        role: 'admin',
        avatar: adminData.avatar || defaultAdminAvatar,
      };
    }

    // Try to fetch from customers table
    let { data: customerData } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (customerData) {
      // Fetch primary account info for the header
      const { data: accounts } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('customer_id', authUser.id)
        .limit(1);

      const account = accounts && accounts.length > 0 ? accounts[0] : null;
      const customerInitials = `${customerData.first_name?.[0] || 'U'}${customerData.last_name?.[0] || ''}`.toUpperCase();
      const defaultCustomerAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="%230f172a"/><text x="50" y="58" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23f8fafc" text-anchor="middle">${customerInitials}</text></svg>`;

      return {
        id: customerData.id,
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        role: 'customer',
        avatar: customerData.avatar || defaultCustomerAvatar,
        accountNumber: account?.number,
        routingNumber: account?.routing,
        accountType: account?.name,
      };
    }

    return null;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
          const profile = await fetchUserProfile(session.user);
          if (mounted && profile) {
            setUser(profile);
            setToken(session.access_token);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setToken(session.access_token);
        // Only fetch profile if user object isn't already set to avoid infinite loops on token refresh
        if (!user || user.id !== session.user.id) {
          const profile = await fetchUserProfile(session.user);
          if (mounted && profile) {
            setUser(profile);
          }
        }
      } else {
        if (mounted) {
          setUser(null);
          setToken(null);
        }
      }
      if (mounted && event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Real-time user profile database sync
  useEffect(() => {
    if (!user?.id) return;

    const targetTable = user.role === 'admin' ? 'admins' : 'customers';
    const profileChannel = supabaseClient
      .channel(`realtime-user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: targetTable,
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Realtime profile change received:', payload);
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session && session.user) {
            const freshProfile = await fetchUserProfile(session.user);
            if (freshProfile) {
              setUser(freshProfile);
            }
          }
        }
      )
      .subscribe();

    return () => {
      profileChannel.unsubscribe();
    };
  }, [user?.id]);


  const login = useCallback(
    async (credentials: LoginCredentials, role: UserRole): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          return { success: false, error: 'Invalid email or password.' };
        }

        if (data.session && data.user) {
          const profile = await fetchUserProfile(data.user);
          
          if (!profile) {
             await supabaseClient.auth.signOut();
             return { success: false, error: 'User profile not found.' };
          }

          if (profile.role !== role) {
            await supabaseClient.auth.signOut();
            return {
              success: false,
              error: `This account does not have ${role} access. Please use the correct login portal.`,
            };
          }

          setUser(profile);
          setToken(data.session.access_token);
          return { success: true };
        }
        
        return { success: false, error: 'An unexpected error occurred during login.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
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
        supabaseClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider supabaseClient={supabaseCustomer}>
      {children}
    </AuthProvider>
  );
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider supabaseClient={supabaseAdmin}>
      {children}
    </AuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
