'use client';

import { useState } from 'react';
import { Note } from '@/types';
import { useMongoAuth } from '@/hooks/useMongoAuth';
import { useMongoNoteStore } from '@/store/mongoNoteStore';
import { Button } from '@/components/ui/Button';
import { formatDate, truncateText } from '@/lib/utils';
import {
  Heart,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Tag,
  Folder,
} from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { token } = useMongoAuth();
  const { deleteNote, updateNote } = useMongoNoteStore();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?') || !token) return;

    try {
      setIsDeleting(true);
      await deleteNote(token, note.id);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavorite = async () => {
    if (!token) return;

    try {
      await updateNote(token, note.id, { is_favorite: !note.is_favorite });
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  // Strip HTML tags for preview
  const getTextContent = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const textContent = getTextContent(note.content);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {note.title}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={note.is_favorite ? 'text-red-500' : 'text-gray-400'}
          >
            <Heart
              className={`h-4 w-4 ${
                note.is_favorite ? 'fill-current' : ''
              }`}
            />
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(note);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    disabled={isDeleting}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {truncateText(textContent, 150)}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(note.updated_at)}
          </div>
          
          {note.category && (
            <div className="flex items-center">
              <Folder className="h-3 w-3 mr-1" />
              <span
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: note.category.color + '20',
                  color: note.category.color,
                }}
              >
                {note.category.name}
              </span>
            </div>
          )}
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            <span>{note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Click overlay for menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
