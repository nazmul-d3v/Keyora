import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    // Verify reset token in database
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date() > new Date(resetRecord.expires)) {
      await prisma.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
      return NextResponse.json(
        { message: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    const user = await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Delete token and any other tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetRecord.email },
    });

    return NextResponse.json({
      message: 'Password has been successfully updated! You can now log in.',
      email: user.email,
    });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
