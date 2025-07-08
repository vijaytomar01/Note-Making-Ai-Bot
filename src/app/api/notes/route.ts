import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import { noteDb, categoryDb } from '@/lib/filedb';

export async function GET(request: NextRequest) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    const { user } = request as AuthenticatedRequest;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const favorites = searchParams.get('favorites') === 'true';

    const notes = await noteDb.findByUserId(user!.id, search, favorites);

    // Transform the data to match frontend expectations
    const transformedNotes = await Promise.all(notes.map(async note => {
      let category = null;
      if (note.categoryId) {
        const cat = await categoryDb.findById(note.categoryId);
        if (cat) {
          category = {
            id: cat.id,
            name: cat.name,
            color: cat.color,
          };
        }
      }

      return {
        id: note.id,
        title: note.title,
        content: note.content,
        user_id: note.userId,
        category_id: note.categoryId || null,
        is_favorite: note.isFavorite,
        created_at: note.createdAt,
        updated_at: note.updatedAt,
        category,
        tags: [], // TODO: Implement tags if needed
      };
    }));

    return NextResponse.json(transformedNotes);
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    const { user } = request as AuthenticatedRequest;
    const { title, content, category_id, is_favorite } = await request.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create new note
    const note = await noteDb.create({
      title,
      content,
      userId: user!.id,
      categoryId: category_id || undefined,
      tags: [],
      isFavorite: is_favorite || false,
    });

    // Get category info if exists
    let category = null;
    if (note.categoryId) {
      const cat = await categoryDb.findById(note.categoryId);
      if (cat) {
        category = {
          id: cat.id,
          name: cat.name,
          color: cat.color,
        };
      }
    }

    // Transform the data
    const transformedNote = {
      id: note.id,
      title: note.title,
      content: note.content,
      user_id: note.userId,
      category_id: note.categoryId || null,
      is_favorite: note.isFavorite,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
      category,
      tags: [],
    };

    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
