import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('password01', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
    },
    update: { passwordHash: adminPasswordHash },
  });
  console.log('✅ Admin user added/updated:', admin.email);
  console.log('   Login: admin@example.com / password01');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
