import { notFound } from 'next/navigation';
import { use } from 'react';
import { prisma } from '@/lib/prisma';
import { CheckInClient } from './CheckInClient';

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking) {
    notFound();
  }

  return <CheckInClient booking={booking} />;
}
