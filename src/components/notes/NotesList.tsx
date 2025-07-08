'use client';

import { useState, useEffect } from 'react';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { useMongoNoteStore } from '@/store/mongoNoteStore';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { Note } from '@/types';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export function NotesList() {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  const { token } = useMongoAuth();
  const { notes, loading, error, fetchNotes } = useMongoNoteStore();

  useEffect(() => {
    if (token) {
      fetchNotes(token, searchQuery || undefined, filterFavorites || undefined);
    }
  }, [token, searchQuery, filterFavorites, fetchNotes]);

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
  };

  const handleFormSuccess = () => {
    if (token) {
      fetchNotes(token); // Refresh the notes list
    }
  };

  // Filter notes based on search query and favorites
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFavorites = !filterFavorites || note.is_favorite;
    
    return matchesSearch && matchesFavorites;
  });

  if (loading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading notes: {error}</p>
        <Button onClick={() => token && fetchNotes(token)} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
          <p className="text-gray-600">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {filterFavorites && ' (favorites only)'}
          </p>
        </div>
        
        <Button onClick={() => setShowNoteForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant={filterFavorites ? 'default' : 'outline'}
          onClick={() => setFilterFavorites(!filterFavorites)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Favorites Only
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery || filterFavorites ? (
            <div>
              <p className="text-gray-500 mb-4">
                No notes found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterFavorites(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">
                You haven't created any notes yet.
              </p>
              <Button onClick={() => setShowNoteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
            />
          ))}
        </div>
      )}

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          initialData={editingNote ? {
            title: editingNote.title,
            content: editingNote.content,
            category_id: editingNote.category_id || '',
            is_favorite: editingNote.is_favorite,
          } : undefined}
          isEditing={!!editingNote}
          noteId={editingNote?.id}
        />
      )}
    </div>
  );
}
