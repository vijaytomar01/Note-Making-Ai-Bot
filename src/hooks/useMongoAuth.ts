'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function useMongoAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Also set cookie for middleware
      document.cookie = `auth-token=${storedToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }

    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token and user data
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    // Also set cookie for middleware
    document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useMongoAuth: Starting signIn process...');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Login response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Login failed:', data);
      throw new Error(data.error || 'Login failed');
    }

    console.log('✅ Login successful, received data:', { user: data.user.email, hasToken: !!data.token });

    // Store token and user data
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    // Also set cookie for middleware
    document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

    setToken(data.token);
    setUser(data.user);

    console.log('💾 Auth state updated successfully');
    return data;
  };

  const signOut = async () => {
    // Clear stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

  return {
    user,
    loading,
    token,
    signUp,
    signIn,
    signOut,
    getAuthHeaders,
  };
}
