import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message || 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (!user) {
      // Return ambiguous success for security prevention of user enumeration,
      // but in dev or if user doesn't exist, don't crash
      return NextResponse.json({
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Delete any old tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: lowerEmail },
    });

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        email: lowerEmail,
        token,
        expires,
      },
    });

    // Determine host URL for reset link
    const host = req.headers.get('host') || 'localhost:3001';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

    console.log(`🔑 Password reset link generated for ${lowerEmail}: ${resetUrl}`);

    return NextResponse.json({
      message: 'Password reset link generated successfully.',
      resetUrl,
      token,
    });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while generating password reset request.' },
      { status: 500 }
    );
  }
}
