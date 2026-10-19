import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  // If an external database URL is provided (PostgreSQL, Supabase, Neon, etc.), use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Detect serverless environment (Vercel, AWS Lambda)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const tmpDir = '/tmp';
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        // Ignore mkdir error
      }
    }
    const tmpDbPath = path.join(tmpDir, 'dev.db');

    // Candidate locations where Next.js / Vercel might place the bundled db file
    const candidatePaths = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.resolve(process.cwd(), 'prisma', 'dev.db'),
      path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
      path.join(__dirname, '..', 'prisma', 'dev.db'),
      path.join('/var/task', 'prisma', 'dev.db'),
    ];

    try {
      if (!fs.existsSync(tmpDbPath)) {
        let foundSource = false;
        for (const candidate of candidatePaths) {
          if (fs.existsSync(candidate)) {
            const stats = fs.statSync(candidate);
            if (stats.size > 0) {
              fs.copyFileSync(candidate, tmpDbPath);
              try {
                fs.chmodSync(tmpDbPath, 0o666);
              } catch {
                // Ignore chmod errors
              }
              console.log(`[Prisma] Initialized /tmp/dev.db from ${candidate} (${stats.size} bytes)`);
              foundSource = true;
              break;
            }
          }
        }

        if (!foundSource) {
          // If no source DB with data is found, ensure a placeholder exists so SQLite doesn't crash on open
          fs.writeFileSync(tmpDbPath, '');
          try {
            fs.chmodSync(tmpDbPath, 0o666);
          } catch {
            // Ignore chmod errors
          }
          console.warn('[Prisma] Created empty placeholder /tmp/dev.db');
        }
      }
    } catch (err) {
      console.error('[Prisma] Error setting up /tmp/dev.db:', err);
    }

    const resolvedUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = resolvedUrl;
    return resolvedUrl;
  }

  // Local development: use absolute path to ensure correct resolution from any working directory
  const localDb = path.resolve(process.cwd(), 'prisma', 'dev.db');
  const resolvedUrl = `file:${localDb}`;
  process.env.DATABASE_URL = resolvedUrl;
  return resolvedUrl;
}

const dbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

