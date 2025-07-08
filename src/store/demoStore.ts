import { create } from 'zustand';
import { Note, Category, Tag } from '@/types';

// Demo data
const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Study Notes',
    color: '#3B82F6',
    user_id: 'demo-user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Research',
    color: '#10B981',
    user_id: 'demo-user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const demoTags: Tag[] = [
  {
    id: '1',
    name: 'important',
    user_id: 'demo-user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'ai',
    user_id: 'demo-user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const demoNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to AI Notes!',
    content: '<p>This is a <strong>demo note</strong> to show you how the AI Notes app works.</p><p>You can:</p><ul><li>Create and edit notes with rich text</li><li>Organize with categories and tags</li><li>Mark notes as favorites</li><li>Search through your notes</li></ul><p>To get started with real data, set up your Supabase project!</p>',
    user_id: 'demo-user',
    category_id: '1',
    is_favorite: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: demoCategories[0],
    tags: [demoTags[0]],
  },
  {
    id: '2',
    title: 'AI-Powered Features',
    content: '<p>This app includes several AI-powered features:</p><blockquote><p>🔍 <strong>Semantic Search</strong> - Find notes by meaning, not just keywords</p></blockquote><blockquote><p>🤖 <strong>Smart Recommendations</strong> - Get suggestions for related notes</p></blockquote><blockquote><p>📝 <strong>Auto Summaries</strong> - Generate summaries of long notes</p></blockquote><p>These features will be available once you configure your OpenAI API key.</p>',
    user_id: 'demo-user',
    category_id: '2',
    is_favorite: false,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    category: demoCategories[1],
    tags: [demoTags[1]],
  },
  {
    id: '3',
    title: 'Getting Started Guide',
    content: '<h2>Quick Start</h2><ol><li><strong>Create Notes</strong> - Click the "New Note" button to create your first note</li><li><strong>Rich Text Editing</strong> - Use the toolbar to format your text with bold, italic, lists, and more</li><li><strong>Organize</strong> - Add categories and tags to keep your notes organized</li><li><strong>Search</strong> - Use the search bar to quickly find any note</li><li><strong>Favorites</strong> - Mark important notes as favorites for quick access</li></ol><p>This is just a demo with sample data. Set up Supabase to start creating real notes!</p>',
    user_id: 'demo-user',
    category_id: null,
    is_favorite: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    category: null,
    tags: [demoTags[0]],
  },
];

interface DemoStore {
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

export const useDemoStore = create<DemoStore>((set, get) => ({
  notes: demoNotes,
  categories: demoCategories,
  tags: demoTags,
  loading: false,
  error: null,

  fetchNotes: async () => {
    // Simulate API call
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ loading: false });
  },

  createNote: async (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: noteData.category_id ? 
        get().categories.find(c => c.id === noteData.category_id) || null : null,
      tags: [],
    };

    set(state => ({ 
      notes: [newNote, ...state.notes]
    }));

    return newNote;
  },

  updateNote: async (id, updates) => {
    set(state => ({
      notes: state.notes.map(note => 
        note.id === id ? { 
          ...note, 
          ...updates, 
          updated_at: new Date().toISOString(),
          category: updates.category_id ? 
            state.categories.find(c => c.id === updates.category_id) || null : 
            note.category
        } : note
      )
    }));
  },

  deleteNote: async (id) => {
    set(state => ({
      notes: state.notes.filter(note => note.id !== id)
    }));
  },

  fetchCategories: async () => {
    // Demo data is already loaded
  },

  createCategory: async (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set(state => ({ 
      categories: [...state.categories, newCategory] 
    }));

    return newCategory;
  },

  fetchTags: async () => {
    // Demo data is already loaded
  },

  createTag: async (tagData) => {
    const newTag: Tag = {
      ...tagData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set(state => ({ 
      tags: [...state.tags, newTag] 
    }));

    return newTag;
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
