import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const NOTES_FILE = path.join(DB_DIR, 'notes.json');
const CATEGORIES_FILE = path.join(DB_DIR, 'categories.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(NOTES_FILE)) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify([]));
}
if (!fs.existsSync(CATEGORIES_FILE)) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([]));
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Helper functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function readFile<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeFile<T>(filePath: string, data: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// User operations
export const userDb = {
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = readFile<User>(USERS_FILE);
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user: User = {
      id: generateId(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(user);
    writeFile(USERS_FILE, users);
    
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const users = readFile<User>(USERS_FILE);
    return users.find(u => u.email === email) || null;
  },

  async findById(id: string): Promise<User | null> {
    const users = readFile<User>(USERS_FILE);
    return users.find(u => u.id === id) || null;
  },

  async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }
};

// Note operations
export const noteDb = {
  async create(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const notes = readFile<Note>(NOTES_FILE);
    
    const note: Note = {
      id: generateId(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(note);
    writeFile(NOTES_FILE, notes);
    
    return note;
  },

  async findByUserId(userId: string, search?: string, favorites?: boolean): Promise<Note[]> {
    const notes = readFile<Note>(NOTES_FILE);
    let userNotes = notes.filter(n => n.userId === userId);

    if (favorites) {
      userNotes = userNotes.filter(n => n.isFavorite);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      userNotes = userNotes.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.content.toLowerCase().includes(searchLower)
      );
    }

    return userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async findById(id: string): Promise<Note | null> {
    const notes = readFile<Note>(NOTES_FILE);
    return notes.find(n => n.id === id) || null;
  },

  async update(id: string, userId: string, updates: Partial<Note>): Promise<Note | null> {
    const notes = readFile<Note>(NOTES_FILE);
    const noteIndex = notes.findIndex(n => n.id === id && n.userId === userId);
    
    if (noteIndex === -1) return null;

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeFile(NOTES_FILE, notes);
    return notes[noteIndex];
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const notes = readFile<Note>(NOTES_FILE);
    const noteIndex = notes.findIndex(n => n.id === id && n.userId === userId);
    
    if (noteIndex === -1) return false;

    notes.splice(noteIndex, 1);
    writeFile(NOTES_FILE, notes);
    return true;
  }
};

// Category operations
export const categoryDb = {
  async create(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const categories = readFile<Category>(CATEGORIES_FILE);
    
    // Check if category already exists for this user
    if (categories.find(c => c.name === categoryData.name && c.userId === categoryData.userId)) {
      throw new Error('Category with this name already exists');
    }

    const category: Category = {
      id: generateId(),
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(category);
    writeFile(CATEGORIES_FILE, categories);
    
    return category;
  },

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = readFile<Category>(CATEGORIES_FILE);
    return categories
      .filter(c => c.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async findById(id: string): Promise<Category | null> {
    const categories = readFile<Category>(CATEGORIES_FILE);
    return categories.find(c => c.id === id) || null;
  }
};
