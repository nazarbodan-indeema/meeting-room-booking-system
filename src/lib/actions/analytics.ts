'use server';

import { prisma } from '@/lib/prisma';

export async function getUtilizationStats(officeId: string, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const bookings = await prisma.booking.findMany({
    where: {
      room: { officeId },
      startTime: { gte: startDate },
    },
    include: { room: true },
  });

  // Basic stats calculation for the demo
  const totalBookings = bookings.length;
  const completed = bookings.filter((b) => b.status === 'COMPLETED').length;
  const noShows = bookings.filter((b) => b.status === 'NO_SHOW').length;
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;

  return {
    totalBookings,
    completed,
    noShows,
    cancelled,
    noShowRate: totalBookings > 0 ? (noShows / totalBookings) * 100 : 0,
  };
}

export async function processNoShows() {
  const tenMinutesAgo = new Date();
  tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

  // Find pending bookings that started more than 10 minutes ago
  const overdueBookings = await prisma.booking.findMany({
    where: {
      status: 'PENDING',
      startTime: {
        lte: tenMinutesAgo,
      },
    },
  });

  if (overdueBookings.length === 0) return { count: 0 };

  // Update them to NO_SHOW
  const result = await prisma.booking.updateMany({
    where: {
      id: { in: overdueBookings.map((b) => b.id) },
    },
    data: {
      status: 'NO_SHOW',
    },
  });

  return { count: result.count };
}
