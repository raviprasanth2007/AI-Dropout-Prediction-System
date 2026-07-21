import { prisma } from './src/index';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@example.com';
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: 'System Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Seeded default admin user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
