import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import { categoryDb } from '@/lib/filedb';

export async function GET(request: NextRequest) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    const { user } = request as AuthenticatedRequest;

    const categories = await categoryDb.findByUserId(user!.id);

    // Transform the data to match frontend expectations
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      color: category.color,
      user_id: category.userId,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Get categories error:', error);
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
    const { name, color } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Create new category
    const category = await categoryDb.create({
      name,
      color: color || '#3B82F6',
      userId: user!.id,
    });

    // Transform the data
    const transformedCategory = {
      id: category.id,
      name: category.name,
      color: category.color,
      user_id: category.userId,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error('Create category error:', error);

    // Handle duplicate category name
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
