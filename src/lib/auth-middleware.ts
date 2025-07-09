import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export async function authenticateUser(request: NextRequest) {
  try {
    await connectToDatabase();

    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Add user to request object
    (request as AuthenticatedRequest).user = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };

    return null; // No error, authentication successful
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Invalid authentication token' },
      { status: 401 }
    );
  }
}
