'use server';

import type { BookingStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CreateBookingSchema } from '@/lib/validations';

export async function createBooking(data: any) {
  const validated = CreateBookingSchema.safeParse(data);
  if (!validated.success) {
    throw new Error('Invalid booking data');
  }

  const booking = await prisma.booking.create({
    data: {
      title: validated.data.title,
      description: validated.data.description,
      startTime: new Date(validated.data.startTime),
      endTime: new Date(validated.data.endTime),
      roomId: validated.data.roomId,
      userId: validated.data.userId,
      status: 'PENDING',
    },
  });

  revalidatePath('/bookings');
  revalidatePath(`/rooms/${validated.data.roomId}`);
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
