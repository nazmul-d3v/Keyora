import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Keyora database...');

  // Create demo user
  const demoPassword = await bcrypt.hash('keyora123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@keyora.io' },
    update: {},
    create: {
      name: 'CyberTypist Demo',
      email: 'demo@keyora.io',
      password: demoPassword,
      image: '/images/avatar-1.svg',
      bio: 'Official Keyora Demonstration Pilot',
      bestWpm: 124.5,
      avgWpm: 92.0,
      avgAccuracy: 98.4,
      testsCompleted: 35,
      totalTimeTyped: 1800,
    },
  });

  const racer2 = await prisma.user.upsert({
    where: { email: 'kinesis@keyora.io' },
    update: {},
    create: {
      name: 'KinesisPhantom',
      email: 'kinesis@keyora.io',
      password: demoPassword,
      image: '/images/avatar-2.svg',
      bestWpm: 168.4,
      avgWpm: 142.1,
      avgAccuracy: 99.2,
      testsCompleted: 140,
      totalTimeTyped: 7200,
    },
  });

  // Seed Passages
  const passagesData = [
    {
      title: 'The Art of Fluid Typing',
      content:
        'Keyboard mastery is not simply an act of speed, but a symphony of rhythm and precision. When your fingers dance across the mechanical switches without conscious deliberation, the barrier between mind and screen disappears, leaving only pure thought translated into light.',
      language: 'english',
      difficulty: 'medium',
      category: 'prose',
      source: 'Keyora Philosophy',
      wordCount: 39,
    },
    {
      title: 'TypeScript Async Pipeline',
      content:
        'async function fetchTypingLeaderboard(limit: number = 10): Promise<Entry[]> { const res = await fetch(`/api/leaderboard?limit=${limit}`); if (!res.ok) throw new Error("Failed to load records"); return await res.json(); }',
      language: 'code',
      difficulty: 'medium',
      category: 'javascript',
      source: 'Keyora Core API',
      wordCount: 29,
    },
    {
      title: 'Ada Lovelace on the Engine',
      content:
        'The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves. We may say most aptly that the Analytical Engine is an embodying of the science of operations.',
      language: 'quotes',
      difficulty: 'hard',
      category: 'quotes',
      source: 'Ada Lovelace',
      wordCount: 32,
    },
    {
      title: 'Numeric Matrix & Punctuation',
      content:
        'In 2026, 4,892 active nodes transmitted 192.168.1.1:8080 packets at 99.85% efficiency. Calculated profit was $7,450,120.50 (an increase of +14.2% over Q3). Note: 3.1415926535 * 42 = 131.94689.',
      language: 'numbers',
      difficulty: 'hard',
      category: 'numbers',
      source: 'Data Ledger',
      wordCount: 23,
    },
  ];

  for (const p of passagesData) {
    await prisma.passage.create({
      data: p,
    });
  }

  // Create demo test result & leaderboard
  const test1 = await prisma.testResult.create({
    data: {
      userId: racer2.id,
      wpm: 168.4,
      rawWpm: 172.0,
      accuracy: 99.2,
      consistency: 96.8,
      duration: 60,
      mode: 'time',
      language: 'english',
      difficulty: 'medium',
      wordsCount: 168,
      errorsCount: 2,
      charCount: 842,
    },
  });

  await prisma.leaderboardEntry.create({
    data: {
      userId: racer2.id,
      testResultId: test1.id,
      wpm: 168.4,
      accuracy: 99.2,
      duration: 60,
      mode: 'time',
      language: 'english',
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
