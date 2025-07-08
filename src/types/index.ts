export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: string;
}

export interface SearchResult {
  note: Note;
  relevance_score: number;
  matched_content: string;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  related_notes?: Note[];
}
