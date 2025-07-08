import { create } from 'zustand';
import { Note, Category, Tag } from '@/types';

interface MongoNoteStore {
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  
  // Note actions
  fetchNotes: (token: string, search?: string, favorites?: boolean) => Promise<void>;
  createNote: (token: string, note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note>;
  updateNote: (token: string, id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (token: string, id: string) => Promise<void>;
  
  // Category actions
  fetchCategories: (token: string) => Promise<void>;
  createCategory: (token: string, category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<Category>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMongoNoteStore = create<MongoNoteStore>((set, get) => ({
  notes: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,

  fetchNotes: async (token: string, search?: string, favorites?: boolean) => {
    try {
      set({ loading: true, error: null });
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (favorites) params.append('favorites', 'true');
      
      const response = await fetch(`/api/notes?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const notes = await response.json();
      set({ notes, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createNote: async (token: string, noteData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const newNote = await response.json();
      set(state => ({ 
        notes: [newNote, ...state.notes], 
        loading: false 
      }));

      return newNote;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateNote: async (token: string, id: string, updates) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update note');
      }

      const updatedNote = await response.json();
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? updatedNote : note
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteNote: async (token: string, id: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }

      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCategories: async (token: string) => {
    try {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categories = await response.json();
      set({ categories });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createCategory: async (token: string, categoryData) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      const newCategory = await response.json();
      set(state => ({ 
        categories: [...state.categories, newCategory] 
      }));

      return newCategory;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
