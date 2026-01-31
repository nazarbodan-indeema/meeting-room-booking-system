'use server';

import type { Room } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getOffices() {
  return await prisma.office.findMany();
}

export async function getRooms(officeId: string) {
  return await prisma.room.findMany({
    where: { officeId },
    orderBy: { name: 'asc' },
  });
}

export async function getRoomById(id: string) {
  return await prisma.room.findUnique({
    where: { id },
  });
}

export async function getRoomAvailability(roomId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.booking.findMany({
    where: {
      roomId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ['PENDING', 'CONFIRMED', 'COMPLETED'],
      },
    },
    orderBy: { startTime: 'asc' },
  });
}
