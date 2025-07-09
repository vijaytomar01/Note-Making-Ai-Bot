'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Brain, Search, Shield, Zap } from 'lucide-react';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useMongoAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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

      {/* Header */}
      <header className="header-glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group cursor-pointer">
              <Brain className="h-8 w-8 text-blue-600 mr-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <h1 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105">AI Notes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAuthModal(true)}
                className="btn-light hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="btn-colorful hover:scale-105 transition-all duration-300 text-white font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Smart Note-Taking with{' '}
              <span className="gradient-text text-transparent bg-clip-text">
                AI Power
              </span>
            </h1>
          </div>
          <div className="animate-fade-in-up delay-200">
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your learning experience with AI-powered note organization,
              intelligent search, and personalized study assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="btn-colorful text-lg px-8 py-4 hover:scale-110 hover:shadow-2xl transform hover:-translate-y-2 text-white font-semibold"
            >
              <span className="flex items-center">
                Start Taking Notes
                <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-light text-lg px-8 py-4 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group glass card-hover p-8 rounded-2xl text-center cursor-pointer animate-fade-in-up delay-100">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Search className="h-12 w-12 text-blue-600 mx-auto mb-4 relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 transition-all duration-300 group-hover:scale-105">AI-Powered Search</h3>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              Find your notes instantly with intelligent semantic search that
              understands context and meaning.
            </p>
          </div>

          <div className="group glass card-hover p-8 rounded-2xl text-center cursor-pointer animate-fade-in-up delay-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4 relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 transition-all duration-300 group-hover:scale-105">Smart Organization</h3>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              Automatically categorize and tag your notes with AI assistance for
              effortless organization.
            </p>
          </div>

          <div className="group glass card-hover p-8 rounded-2xl text-center cursor-pointer animate-fade-in-up delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4 relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 transition-all duration-300 group-hover:scale-105">Secure & Private</h3>
            <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              Your notes are encrypted and stored securely. Only you have access
              to your personal study materials.
            </p>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
