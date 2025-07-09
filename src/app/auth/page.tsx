'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useMongoAuth } from '@/hooks/useMongoAuth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useMongoAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleSuccess = () => {
    // This will be called after successful auth, redirect will happen in the form
    console.log('Authentication successful');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen colorful-bg relative overflow-hidden">
      {/* Floating Color Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-200/15 to-teal-200/15 rounded-full blur-3xl animate-float delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="glass rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join AI Notes'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login'
                ? 'Sign in to access your notes'
                : 'Create an account to get started'
              }
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
