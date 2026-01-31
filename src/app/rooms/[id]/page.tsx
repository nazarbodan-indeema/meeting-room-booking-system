import { notFound } from 'next/navigation';
import { use } from 'react';
import { getRoomAvailability } from '@/lib/actions/rooms';
import { prisma } from '@/lib/prisma';
import { RoomDetailClient } from './RoomDetailClient';

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    notFound();
  }

  // Get today's bookings for this room to show occupancy
  const bookings = await getRoomAvailability(id, new Date());

  return <RoomDetailClient room={room} existingBookings={bookings} />;
}
