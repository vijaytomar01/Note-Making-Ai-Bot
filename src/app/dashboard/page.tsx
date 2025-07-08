'use client';

import { useMongoAuth } from '@/hooks/useMongoAuth';
import { useMongoNoteStore } from '@/store/mongoNoteStore';
import { NotesList } from '@/components/notes/NotesList';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, token } = useMongoAuth();
  const { notes, categories, fetchNotes, fetchCategories } = useMongoNoteStore();

  useEffect(() => {
    if (token) {
      fetchNotes(token);
      fetchCategories(token);
    }
  }, [token, fetchNotes, fetchCategories]);

  const favoriteNotes = notes.filter(note => note.is_favorite);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName || user?.email}!
        </h2>
        <p className="text-gray-600 mt-2">
          Here are your notes and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Total Notes
          </h3>
          <p className="text-3xl font-bold text-blue-600">{notes.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Categories
          </h3>
          <p className="text-3xl font-bold text-green-600">{categories.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Favorites
          </h3>
          <p className="text-3xl font-bold text-purple-600">{favoriteNotes.length}</p>
        </div>
      </div>

      <NotesList />
    </div>
  );
}
