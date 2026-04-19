'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  sub: string;
  email: string;
  name?: string;
  role: string;
  orgSlug?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

const getRoleHomePage = (role: string) => {
  if (role === 'SUPER_ADMIN') return '/superadmin/dashboard';
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'STAFF') return '/staff/complaints';
  return '/dashboard';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.orgSlug) localStorage.setItem('orgSlug', parsed.orgSlug);
      } catch (e) {
        // failed to parse
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.orgSlug) localStorage.setItem('orgSlug', userData.orgSlug);
    else localStorage.removeItem('orgSlug');
    setUser(userData);
    router.push(getRoleHomePage(userData.role));
  };

  const logout = () => {
    const orgSlug = user?.orgSlug || localStorage.getItem('orgSlug');
    const role = user?.role;
    const needsJoinContext = role === 'USER' || role === 'STAFF';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!needsJoinContext) localStorage.removeItem('orgSlug');
    setUser(null);
    router.push(needsJoinContext && orgSlug ? `/login?join=${orgSlug}` : '/login');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/login', '/register', '/register/org', '/'];
      const isPublic = publicPaths.includes(pathname) || pathname.startsWith('/join/');
      if (!user && !isPublic) {
        const orgSlug = localStorage.getItem('orgSlug');
        router.push(orgSlug ? `/login?join=${orgSlug}` : '/login');
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        router.push(getRoleHomePage(user.role));
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
