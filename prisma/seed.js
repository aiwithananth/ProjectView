import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const ADMIN_PASSWORD = 'password01';

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'frontend', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'backend', color: '#10b981' } }),
    prisma.tag.create({ data: { name: 'design', color: '#ec4899' } }),
    prisma.tag.create({ data: { name: 'infra', color: '#f59e0b' } }),
  ]);

  // Create or update users (with password for login)
  const userData = [
    { name: 'Admin', email: 'admin@example.com', avatar: null, passwordHash: adminPasswordHash },
    { name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', passwordHash },
    { name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', passwordHash },
    { name: 'Carol Davis', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol', passwordHash },
  ];
  const users = await Promise.all(
    userData.map(({ passwordHash: hash, ...u }) =>
      prisma.user.upsert({
        where: { email: u.email },
        create: { ...u, passwordHash: hash },
        update: { passwordHash: hash },
      })
    )
  );
  console.log('  Admin: admin@example.com / ' + ADMIN_PASSWORD);
  console.log('  Others: alice@example.com / ' + DEFAULT_PASSWORD);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      color: '#6366f1',
      members: {
        create: [
          { userId: users[0].id, role: 'owner' },
          { userId: users[1].id, role: 'member' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App',
      description: 'New mobile application for iOS and Android',
      color: '#ec4899',
      members: {
        create: [
          { userId: users[1].id, role: 'owner' },
          { userId: users[2].id, role: 'member' },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Infrastructure Upgrade',
      description: 'Migrate to cloud infrastructure',
      color: '#10b981',
      members: {
        create: [
          { userId: users[2].id, role: 'owner' },
          { userId: users[0].id, role: 'member' },
        ],
      },
    },
  });

  // Create tasks with 4 levels of nesting for Project 1
  const task1 = await prisma.task.create({
    data: {
      title: 'Frontend Development',
      description: 'Build the user interface',
      projectId: project1.id,
      ownerId: users[0].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 45,
      depth: 0,
      order: 0,
      dueDate: new Date('2026-04-15'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task1_1 = await prisma.task.create({
    data: {
      title: 'Design System Setup',
      projectId: project1.id,
      parentId: task1.id,
      ownerId: users[0].id,
      status: 'DONE',
      phase: 'DEV',
      progress: 100,
      depth: 1,
      order: 0,
      dueDate: new Date('2026-03-20'),
      tags: { connect: [{ id: tags[0].id }, { id: tags[2].id }] },
    },
  });

  const task1_1_1 = await prisma.task.create({
    data: {
      title: 'Color Palette Definition',
      projectId: project1.id,
      parentId: task1_1.id,
      ownerId: users[0].id,
      status: 'DONE',
      progress: 100,
      depth: 2,
      order: 0,
      dueDate: new Date('2026-03-10'),
      tags: { connect: [{ id: tags[2].id }] },
    },
  });

  const task1_1_1_1 = await prisma.task.create({
    data: {
      title: 'Primary Colors',
      projectId: project1.id,
      parentId: task1_1_1.id,
      ownerId: users[0].id,
      status: 'DONE',
      progress: 100,
      depth: 3,
      order: 0,
      tags: { connect: [{ id: tags[2].id }] },
    },
  });

  const task1_1_1_2 = await prisma.task.create({
    data: {
      title: 'Semantic Colors',
      projectId: project1.id,
      parentId: task1_1_1.id,
      ownerId: users[0].id,
      status: 'DONE',
      progress: 100,
      depth: 3,
      order: 1,
      tags: { connect: [{ id: tags[2].id }] },
    },
  });

  const task1_1_2 = await prisma.task.create({
    data: {
      title: 'Typography System',
      projectId: project1.id,
      parentId: task1_1.id,
      ownerId: users[0].id,
      status: 'DONE',
      progress: 100,
      depth: 2,
      order: 1,
      dueDate: new Date('2026-03-12'),
      tags: { connect: [{ id: tags[2].id }] },
    },
  });

  const task1_2 = await prisma.task.create({
    data: {
      title: 'Component Library',
      projectId: project1.id,
      parentId: task1.id,
      ownerId: users[1].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 60,
      depth: 1,
      order: 1,
      dueDate: new Date('2026-04-01'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task1_2_1 = await prisma.task.create({
    data: {
      title: 'Button Component',
      projectId: project1.id,
      parentId: task1_2.id,
      ownerId: users[1].id,
      status: 'DONE',
      progress: 100,
      depth: 2,
      order: 0,
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task1_2_2 = await prisma.task.create({
    data: {
      title: 'Form Components',
      projectId: project1.id,
      parentId: task1_2.id,
      ownerId: users[1].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 70,
      depth: 2,
      order: 1,
      dueDate: new Date('2026-03-25'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task1_2_3 = await prisma.task.create({
    data: {
      title: 'Modal Component',
      projectId: project1.id,
      parentId: task1_2.id,
      ownerId: users[1].id,
      status: 'PENDING',
      progress: 0,
      depth: 2,
      order: 2,
      dueDate: new Date('2026-03-30'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Backend API Development',
      projectId: project1.id,
      ownerId: users[1].id,
      status: 'ON_TRACK',
      phase: 'DEV',
      progress: 35,
      depth: 0,
      order: 1,
      dueDate: new Date('2026-04-20'),
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  const task2_1 = await prisma.task.create({
    data: {
      title: 'Database Schema',
      projectId: project1.id,
      parentId: task2.id,
      ownerId: users[1].id,
      status: 'DONE',
      progress: 100,
      depth: 1,
      order: 0,
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  const task2_2 = await prisma.task.create({
    data: {
      title: 'REST API Endpoints',
      projectId: project1.id,
      parentId: task2.id,
      ownerId: users[1].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 50,
      depth: 1,
      order: 1,
      dueDate: new Date('2026-04-10'),
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  const task2_3 = await prisma.task.create({
    data: {
      title: 'Authentication System',
      projectId: project1.id,
      parentId: task2.id,
      ownerId: users[2].id,
      status: 'BLOCKED',
      progress: 20,
      depth: 1,
      order: 2,
      dueDate: new Date('2026-04-05'),
      tags: { connect: [{ id: tags[1].id }] },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Testing & QA',
      projectId: project1.id,
      ownerId: users[2].id,
      status: 'PENDING',
      phase: 'TEST',
      progress: 0,
      depth: 0,
      order: 2,
      dueDate: new Date('2026-05-01'),
      tags: { connect: [{ id: tags[0].id }, { id: tags[1].id }] },
    },
  });

  // Tasks for Project 2
  const task4 = await prisma.task.create({
    data: {
      title: 'iOS Development',
      projectId: project2.id,
      ownerId: users[1].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 55,
      depth: 0,
      order: 0,
      dueDate: new Date('2026-05-15'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task4_1 = await prisma.task.create({
    data: {
      title: 'Home Screen',
      projectId: project2.id,
      parentId: task4.id,
      ownerId: users[1].id,
      status: 'DONE',
      progress: 100,
      depth: 1,
      order: 0,
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task4_2 = await prisma.task.create({
    data: {
      title: 'Profile Screen',
      projectId: project2.id,
      parentId: task4.id,
      ownerId: users[1].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 80,
      depth: 1,
      order: 1,
      dueDate: new Date('2026-04-25'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Android Development',
      projectId: project2.id,
      ownerId: users[2].id,
      status: 'OVERDUE',
      phase: 'DEV',
      progress: 25,
      depth: 0,
      order: 1,
      dueDate: new Date('2026-03-01'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task5_1 = await prisma.task.create({
    data: {
      title: 'Setup Development Environment',
      projectId: project2.id,
      parentId: task5.id,
      ownerId: users[2].id,
      status: 'DONE',
      progress: 100,
      depth: 1,
      order: 0,
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  const task5_2 = await prisma.task.create({
    data: {
      title: 'Implement Core Features',
      projectId: project2.id,
      parentId: task5.id,
      ownerId: users[2].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 40,
      depth: 1,
      order: 1,
      dueDate: new Date('2026-04-15'),
      tags: { connect: [{ id: tags[0].id }] },
    },
  });

  // Tasks for Project 3
  const task6 = await prisma.task.create({
    data: {
      title: 'Cloud Migration Planning',
      projectId: project3.id,
      ownerId: users[2].id,
      status: 'DONE',
      progress: 100,
      depth: 0,
      order: 0,
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: 'Server Setup',
      projectId: project3.id,
      ownerId: users[0].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 65,
      depth: 0,
      order: 1,
      dueDate: new Date('2026-04-10'),
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  const task7_1 = await prisma.task.create({
    data: {
      title: 'Configure Load Balancer',
      projectId: project3.id,
      parentId: task7.id,
      ownerId: users[0].id,
      status: 'DONE',
      progress: 100,
      depth: 1,
      order: 0,
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  const task7_2 = await prisma.task.create({
    data: {
      title: 'Setup Database Cluster',
      projectId: project3.id,
      parentId: task7.id,
      ownerId: users[0].id,
      status: 'IN_PROGRESS',
      phase: 'DEV',
      progress: 70,
      depth: 1,
      order: 1,
      dueDate: new Date('2026-04-08'),
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: 'Security Audit',
      projectId: project3.id,
      ownerId: users[2].id,
      status: 'PENDING',
      phase: 'REVIEW',
      progress: 0,
      depth: 0,
      order: 2,
      dueDate: new Date('2026-04-30'),
      tags: { connect: [{ id: tags[3].id }] },
    },
  });

  // Create checklists
  await prisma.checklist.create({
    data: {
      title: 'Pre-launch Checklist',
      projectId: project1.id,
      items: {
        create: [
          { label: 'Complete all unit tests', done: true, order: 0 },
          { label: 'Performance optimization', done: true, order: 1 },
          { label: 'Security audit', done: false, order: 2 },
          { label: 'Documentation update', done: false, order: 3 },
          { label: 'Stakeholder approval', done: false, order: 4 },
        ],
      },
    },
  });

  await prisma.checklist.create({
    data: {
      title: 'App Store Requirements',
      projectId: project2.id,
      items: {
        create: [
          { label: 'App icons (all sizes)', done: true, order: 0 },
          { label: 'Screenshots', done: false, order: 1 },
          { label: 'Privacy policy', done: false, order: 2 },
          { label: 'Terms of service', done: false, order: 3 },
          { label: 'App description', done: true, order: 4 },
        ],
      },
    },
  });

  await prisma.checklist.create({
    data: {
      title: 'Infrastructure Compliance',
      projectId: project3.id,
      items: {
        create: [
          { label: 'GDPR compliance check', done: true, order: 0 },
          { label: 'Backup strategy implemented', done: true, order: 1 },
          { label: 'Monitoring setup', done: true, order: 2 },
          { label: 'Disaster recovery plan', done: false, order: 3 },
          { label: 'Cost optimization review', done: false, order: 4 },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${users.length} users, 3 projects, and multiple nested tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

