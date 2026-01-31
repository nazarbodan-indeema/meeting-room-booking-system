import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Offices
  const wroclaw = await prisma.office.upsert({
    where: { id: 'office-wroclaw' },
    update: {},
    create: {
      id: 'office-wroclaw',
      name: 'Wroclaw HQ',
      timezone: 'Europe/Warsaw',
    },
  });

  const lviv = await prisma.office.upsert({
    where: { id: 'office-lviv' },
    update: {},
    create: {
      id: 'office-lviv',
      name: 'Lviv Office',
      timezone: 'Europe/Kiev',
    },
  });

  console.log('✅ Offices created');

  // 2. Create Rooms for Wroclaw
  const wroclawRooms = [
    {
      name: 'Innovation Lab',
      capacity: 12,
      floor: 2,
      amenities: ['whiteboard', 'projector', 'video-conferencing'],
    },
    {
      name: 'Board Room',
      capacity: 20,
      floor: 4,
      amenities: ['whiteboard', 'projector', 'video-conferencing', 'phone'],
    },
    { name: 'Creative Space', capacity: 8, floor: 2, amenities: ['whiteboard', 'tv'] },
    { name: 'Focus Room A', capacity: 4, floor: 1, amenities: ['whiteboard'] },
    { name: 'Focus Room B', capacity: 4, floor: 1, amenities: ['whiteboard'] },
    { name: 'Phone Booth', capacity: 2, floor: 1, amenities: ['phone'] },
  ];

  for (const roomData of wroclawRooms) {
    await prisma.room.create({
      data: {
        ...roomData,
        officeId: wroclaw.id,
      },
    });
  }

  // 3. Create Rooms for Lviv
  const lvivRooms = [
    {
      name: 'Carpathian Summit',
      capacity: 15,
      floor: 3,
      amenities: ['whiteboard', 'video-conferencing'],
    },
    { name: 'Dnipro Meeting', capacity: 8, floor: 3, amenities: ['tv'] },
    { name: 'Kyiv Hub', capacity: 6, floor: 5, amenities: ['whiteboard', 'phone'] },
  ];

  for (const roomData of lvivRooms) {
    await prisma.room.create({
      data: {
        ...roomData,
        officeId: lviv.id,
      },
    });
  }

  console.log('✅ Rooms created');

  // 4. Create a Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'USER',
    },
  });

  console.log('✅ Demo user created');

  console.log('✨ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
