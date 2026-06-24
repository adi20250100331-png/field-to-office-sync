import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { isApiConfigured } from '../../lib/api';

export interface FieldOfficerCredentials {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role?: string;
}

// Mock database of field officers (fallback when API not configured)
const FIELD_OFFICERS: FieldOfficerCredentials[] = [
  {
    id: 'officer-001',
    name: 'Adhy',
    email: 'adhy@fieldoffice.com',
    username: 'adhy',
    password: 'adhy123',
    role: 'field_officer',
  },
  {
    id: 'officer-002',
    name: 'Budi Hartono',
    email: 'budi@fieldoffice.com',
    username: 'budi',
    password: 'budi123',
    role: 'field_officer',
  },
  {
    id: 'officer-003',
    name: 'Siti Nurhaliza',
    email: 'siti@fieldoffice.com',
    username: 'siti',
    password: 'siti123',
    role: 'field_officer',
  },
];

// Mock database of admins
const ADMINS: FieldOfficerCredentials[] = [
  {
    id: 'admin-001',
    name: 'Admin Kemenkes',
    email: 'admin@kemenkes.go.id',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'admin-002',
    name: 'Supervisor',
    email: 'supervisor@kemenkes.go.id',
    username: 'supervisor',
    password: 'super123',
    role: 'admin',
  },
];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'field_officer' | 'customer';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string, role?: 'field_officer' | 'admin' | 'customer') => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  usingApi: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'app_auth';
const CUSTOMER_STORAGE_KEY = 'app_customers';

const loadStoredCustomers = (): FieldOfficerCredentials[] => {
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load stored customers:', error);
  }
  return [];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [customers, setCustomers] = useState<FieldOfficerCredentials[]>(loadStoredCustomers);
  const [isLoading, setIsLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  // Persist customer accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('Failed to save customers to localStorage:', error);
    }
  }, [customers]);

  // Check if using API on mount
  useEffect(() => {
    const apiConfigured = isApiConfigured();
    setUsingApi(apiConfigured);

    // Load auth state from localStorage on mount
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string, role: 'field_officer' | 'admin' | 'customer' = 'field_officer'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Try API login if configured
      if (usingApi) {
        try {
          let email = usernameOrEmail;
          if (!usernameOrEmail.includes('@')) {
            const localUser = role === 'admin'
              ? ADMINS.find(o => o.username === usernameOrEmail)
              : role === 'field_officer'
                ? FIELD_OFFICERS.find(o => o.username === usernameOrEmail)
                : customers.find(o => o.username === usernameOrEmail || o.email === usernameOrEmail);
            email = localUser?.email || `${usernameOrEmail}@${role === 'admin' ? 'kemenkes.go.id' : 'fieldoffice.com'}`;
          }

          console.log('🔐 Attempting API login...', { email, role });
          
          const response = await api.login(email, password);
          
          if (response.success && response.user) {
            const authUser: AuthUser = {
              id: response.user.id,
              name: response.user.fullName,
              email: response.user.email,
              username: usernameOrEmail,
              role: response.user.role as AuthUser['role'],
            };
            
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            
            console.log('✅ API login successful', authUser);
            setIsLoading(false);
            return { success: true };
          }
        } catch (apiError: any) {
          console.warn('⚠️ API login failed, falling back to local auth:', apiError.message);
          // Fall through to local authentication
        }
      }

      // Fallback to local authentication
      console.log('🔐 Using local authentication');
      
      await new Promise(resolve => setTimeout(resolve, 500));

      let userToAuth: FieldOfficerCredentials | undefined;
      if (role === 'admin') {
        userToAuth = ADMINS.find(o => (o.username === usernameOrEmail || o.email === usernameOrEmail) && o.password === password);
      } else if (role === 'field_officer') {
        userToAuth = FIELD_OFFICERS.find(o => (o.username === usernameOrEmail || o.email === usernameOrEmail) && o.password === password);
      } else {
        userToAuth = customers.find(o => (o.username === usernameOrEmail || o.email === usernameOrEmail) && o.password === password);
      }

      if (userToAuth) {
        const authUser: AuthUser = {
          id: userToAuth.id,
          name: userToAuth.name,
          email: userToAuth.email,
          username: userToAuth.username,
          role: userToAuth.role as AuthUser['role'] || role,
        };
        
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        
        console.log('✅ Local login successful', authUser);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Email atau password salah'
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'Terjadi kesalahan saat login'
      };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const googleUser: AuthUser = {
      id: 'google-' + Date.now(),
      name: 'Demo Google User',
      email: 'demo@gmail.com',
      username: 'demo@gmail.com',
      role: 'customer',
    };
    
    setUser(googleUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    
    console.log('✅ Google login successful', googleUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = [...FIELD_OFFICERS, ...ADMINS, ...customers].find(
        u => u.username === data.email || u.email === data.email
      );
      
      if (existingUser) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Email sudah terdaftar'
        };
      }
      
      const newCustomer: FieldOfficerCredentials = {
        id: 'customer-' + Date.now(),
        name: data.name,
        email: data.email,
        username: data.email,
        password: data.password,
        role: 'customer',
      };

      setCustomers(prev => [newCustomer, ...prev]);

      const authUser: AuthUser = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        username: newCustomer.username,
        role: 'customer',
      };
      
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      
      console.log('✅ Registration successful', authUser);
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'Terjadi kesalahan saat mendaftar'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('👋 User logged out');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login,
        loginWithGoogle,
        register,
        logout,
        isLoading,
        usingApi
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
