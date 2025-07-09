import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import Note from '@/models/Note';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    await connectToDatabase();

    const { user } = request as AuthenticatedRequest;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const favorites = searchParams.get('favorites') === 'true';

    let query: any = { userId: user!.id };

    if (favorites) {
      query.isFavorite = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query)
      .populate('categoryId', 'name color')
      .sort({ updatedAt: -1 });

    // Transform the data to match frontend expectations
    const transformedNotes = notes.map(note => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      user_id: note.userId.toString(),
      category_id: note.categoryId?.toString() || null,
      is_favorite: note.isFavorite,
      created_at: note.createdAt.toISOString(),
      updated_at: note.updatedAt.toISOString(),
      category: note.categoryId ? {
        id: note.categoryId._id.toString(),
        name: note.categoryId.name,
        color: note.categoryId.color,
      } : null,
      tags: [], // TODO: Implement tags if needed
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
    await connectToDatabase();

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
    const note = new Note({
      title,
      content,
      userId: user!.id,
      categoryId: category_id || null,
      isFavorite: is_favorite || false,
    });

    await note.save();

    // Populate the note with category
    await note.populate('categoryId', 'name color');

    // Transform the data
    const transformedNote = {
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      user_id: note.userId.toString(),
      category_id: note.categoryId?.toString() || null,
      is_favorite: note.isFavorite,
      created_at: note.createdAt.toISOString(),
      updated_at: note.updatedAt.toISOString(),
      category: note.categoryId ? {
        id: note.categoryId._id.toString(),
        name: note.categoryId.name,
        color: note.categoryId.color,
      } : null,
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
