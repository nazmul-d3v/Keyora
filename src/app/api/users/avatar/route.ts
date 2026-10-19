import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let extension = 'png';

    // Handle Multipart FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ message: 'No image file uploaded' }, { status: 400 });
      }

      const mimeType = file.type;
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('gif')) extension = 'gif';
      else if (mimeType.includes('svg')) extension = 'svg';

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Handle JSON base64 payload
      const body = await req.json();
      const base64Data = body.image;

      if (body.image === null) {
        await prisma.user.update({
          where: { id: userId },
          data: { image: null },
        });
        return NextResponse.json({ url: null, message: 'Avatar removed' });
      }

      if (!base64Data) {
        return NextResponse.json({ message: 'No image data provided' }, { status: 400 });
      }

      // If it's already a static preset path like /images/avatar-1.svg, just save path directly
      if (typeof base64Data === 'string' && base64Data.startsWith('/images/')) {
        await prisma.user.update({
          where: { id: userId },
          data: { image: base64Data },
        });
        return NextResponse.json({ url: base64Data, message: 'Preset avatar applied' });
      }

      // If it's an external URL (http/https), save URL directly
      if (typeof base64Data === 'string' && (base64Data.startsWith('http://') || base64Data.startsWith('https://'))) {
        await prisma.user.update({
          where: { id: userId },
          data: { image: base64Data },
        });
        return NextResponse.json({ url: base64Data, message: 'External avatar applied' });
      }

      // Match base64 data URL
      const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ message: 'Invalid image format' }, { status: 400 });
      }

      const rawExt = matches[1].toLowerCase();
      if (rawExt.includes('jpeg') || rawExt.includes('jpg')) extension = 'jpg';
      else if (rawExt.includes('webp')) extension = 'webp';
      else if (rawExt.includes('svg')) extension = 'svg';
      else if (rawExt.includes('gif')) extension = 'gif';

      buffer = Buffer.from(matches[2], 'base64');
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique short filename
    const filename = `avatar_${userId.slice(-8)}_${Date.now()}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save image file to disk
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Update user in database with the short URL
    await prisma.user.update({
      where: { id: userId },
      data: { image: publicUrl },
    });

    return NextResponse.json({
      url: publicUrl,
      message: 'Avatar uploaded and updated successfully',
    });
  } catch (error: unknown) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });

    return NextResponse.json({ message: 'Avatar removed successfully', url: null });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message || 'Failed to remove avatar' },
      { status: 500 }
    );
  }
}
