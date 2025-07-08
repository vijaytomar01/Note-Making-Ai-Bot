import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Note, Category, Tag } from '@/types';

interface NoteStore {
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  
  // Note actions
  fetchNotes: () => Promise<void>;
  createNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<Category>;
  
  // Tag actions
  fetchTags: () => Promise<void>;
  createTag: (tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => Promise<Tag>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          category:categories(*),
          note_tags(
            tag:tags(*)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const notesWithTags = data?.map(note => ({
        ...note,
        tags: note.note_tags?.map((nt: any) => nt.tag) || []
      })) || [];

      set({ notes: notesWithTags, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createNote: async (noteData) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      const newNote = { ...data, category: null, tags: [] };
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

  updateNote: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? { ...note, ...updates } : note
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteNote: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      set(state => ({ 
        categories: [...state.categories, data] 
      }));

      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  fetchTags: async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ tags: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createTag: async (tagData) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([tagData])
        .select()
        .single();

      if (error) throw error;

      set(state => ({ 
        tags: [...state.tags, data] 
      }));

      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
