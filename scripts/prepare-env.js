const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Ensure .env exists so Prisma CLI always has DATABASE_URL
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ Created .env from .env.example');
  } else {
    fs.writeFileSync(
      envPath,
      'DATABASE_URL="file:./dev.db"\nNEXTAUTH_SECRET="keyora_super_secret_typing_jwt_key_2026_change_me"\n'
    );
    console.log('✓ Created default .env');
  }
}

// Also ensure prisma directory has dev.db placeholder if needed
const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
if (!fs.existsSync(prismaDbPath)) {
  try {
    fs.writeFileSync(prismaDbPath, '');
    console.log('✓ Initialized prisma/dev.db');
  } catch (err) {
    // Ignore if read-only
  }
}
