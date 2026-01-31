'use server';

import type { BookingStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { createBookingSchema } from '@/lib/validations';

export async function createBooking(data: any) {
  const validated = createBookingSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid booking data');
  }

  const { title, date, startTime, duration, roomId, userId, description, isRecurring } =
    validated.data;

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const booking = await prisma.booking.create({
    data: {
      title,
      description,
      startTime: start,
      endTime: end,
      roomId,
      userId,
      isRecurring,
      status: 'PENDING',
    },
  });

  revalidatePath('/bookings');
  revalidatePath('/rooms');
  revalidatePath(`/rooms/${roomId}`);
  return booking;
}

export async function getUserBookings(userId: string) {
  return await prisma.booking.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { startTime: 'desc' },
  });
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath('/bookings');
  return booking;
}

export async function checkIn(bookingId: string) {
  // In a real app, we'd verify the user is physically there (e.g. QR code matched)
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CONFIRMED',
      checkedInAt: new Date(),
    },
  });

  revalidatePath('/bookings');
  revalidatePath(`/rooms/${booking.roomId}`);
  return booking;
}
