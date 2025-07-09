import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import Note from '@/models/Note';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    await connectToDatabase();

    const { user } = request as AuthenticatedRequest;
    const { id } = params;
    const updates = await request.json();

    // Find and update the note
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: user!.id },
      {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.content !== undefined && { content: updates.content }),
        ...(updates.category_id !== undefined && { categoryId: updates.category_id || null }),
        ...(updates.is_favorite !== undefined && { isFavorite: updates.is_favorite }),
      },
      { new: true }
    ).populate('categoryId', 'name color');

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

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
    await connectToDatabase();

    const { user } = request as AuthenticatedRequest;
    const { id } = params;

    // Find and delete the note
    const note = await Note.findOneAndDelete({
      _id: id,
      userId: user!.id,
    });

    if (!note) {
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
