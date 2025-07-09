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
    <div className="space-y-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="gradient-text">{user?.fullName || user?.email}</span>!
        </h2>
        <p className="text-gray-600 text-lg">
          Here are your notes and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="group glass card-hover p-6 rounded-2xl cursor-pointer animate-fade-in-up delay-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:scale-105 transition-all duration-300">
                Total Notes
              </h3>
              <p className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">{notes.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group glass card-hover p-6 rounded-2xl cursor-pointer animate-fade-in-up delay-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:scale-105 transition-all duration-300">
                Categories
              </h3>
              <p className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group glass card-hover p-6 rounded-2xl cursor-pointer animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:scale-105 transition-all duration-300">
                Favorites
              </h3>
              <p className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">{favoriteNotes.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up delay-400 relative z-10">
        <NotesList />
      </div>
    </div>
  );
}
