'use client';

import { useMongoAuth } from '@/hooks/useMongoAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { NoteForm } from '@/components/notes/NoteForm';
import { LogOut, Search, Plus } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useMongoAuth();
  const router = useRouter();
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen colorful-bg relative overflow-hidden">
      {/* Floating Color Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-float delay-1500"></div>
      </div>

      {/* Header */}
      <header className="header-glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group cursor-pointer">
              <h1 className="text-xl font-semibold text-gray-800 transition-all duration-300 group-hover:scale-105">
                AI Notes
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="btn-light hover:scale-105 transition-all duration-300">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>

              <Button size="sm" onClick={() => setShowNoteForm(true)} className="btn-colorful hover:scale-105 transition-all duration-300 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full border border-gray-200">
                  {user.fullName || user.email}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onClose={() => setShowNoteForm(false)}
          onSuccess={() => {
            setShowNoteForm(false);
            // The notes list will automatically refresh via the store
          }}
        />
      )}
    </div>
  );
}
