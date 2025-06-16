import { PrismaClient, TaskStatus } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Buat user
  const password = await hash('password123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      password,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      password,
    },
  });

  // Buat project milik Alice
  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesign landing page for new product',
      ownerId: user1.id,
      members: {
        createMany: {
          data: [
            { userId: user1.id }, // Owner
            { userId: user2.id }, // Member
          ],
        },
      },
    },
  });

  // Buat beberapa task
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Wireframe',
        description: 'Sketch initial layout',
        status: 'TODO',
        projectId: project.id,
        assigneeId: user1.id,
      },
      {
        title: 'Implement Header',
        status: 'IN_PROGRESS',
        projectId: project.id,
        assigneeId: user2.id,
      },
      {
        title: 'Deploy to Vercel',
        status: 'DONE',
        projectId: project.id,
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
