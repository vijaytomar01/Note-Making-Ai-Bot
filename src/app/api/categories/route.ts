import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth-middleware';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  const authError = await authenticateUser(request);
  if (authError) return authError;

  try {
    await connectToDatabase();

    const { user } = request as AuthenticatedRequest;

    const categories = await Category.find({ userId: user!.id })
      .sort({ name: 1 });

    // Transform the data to match frontend expectations
    const transformedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      color: category.color,
      user_id: category.userId.toString(),
      created_at: category.createdAt.toISOString(),
      updated_at: category.updatedAt.toISOString(),
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
    await connectToDatabase();

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
    const category = new Category({
      name,
      color: color || '#3B82F6',
      userId: user!.id,
    });

    await category.save();

    // Transform the data
    const transformedCategory = {
      id: category._id.toString(),
      name: category.name,
      color: category.color,
      user_id: category.userId.toString(),
      created_at: category.createdAt.toISOString(),
      updated_at: category.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error('Create category error:', error);

    // Handle duplicate category name
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
