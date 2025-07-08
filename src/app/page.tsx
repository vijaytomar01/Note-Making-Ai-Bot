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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">AI Notes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
              <Button onClick={() => setShowAuthModal(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Note-Taking with{' '}
            <span className="text-blue-600">AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your learning experience with AI-powered note organization,
            intelligent search, and personalized study assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="text-lg px-8 py-3"
            >
              Start Taking Notes
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
            <p className="text-gray-600">
              Find your notes instantly with intelligent semantic search that
              understands context and meaning.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
            <p className="text-gray-600">
              Automatically categorize and tag your notes with AI assistance for
              effortless organization.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
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
