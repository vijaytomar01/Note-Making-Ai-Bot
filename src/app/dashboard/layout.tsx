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
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                AI Notes
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              <Button size="sm" onClick={() => setShowNoteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
