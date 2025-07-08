import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import { noteDb, categoryDb } from '@/lib/filedb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    const { user } = request as AuthenticatedRequest;
    const { id } = params;
    const updates = await request.json();

    // Update the note
    const note = await noteDb.update(id, user!.id, {
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.category_id !== undefined && { categoryId: updates.category_id || undefined }),
      ...(updates.is_favorite !== undefined && { isFavorite: updates.is_favorite }),
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

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
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    const { user } = request as AuthenticatedRequest;
    const { id } = params;

    // Delete the note
    const deleted = await noteDb.delete(id, user!.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
