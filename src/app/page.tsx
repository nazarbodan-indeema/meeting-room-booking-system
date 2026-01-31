import { Calendar, CheckCircle, MapPin, XCircle } from 'lucide-react';
import { getUtilizationStats } from '@/lib/actions/analytics';
import { getUserBookings } from '@/lib/actions/bookings';
import { getRooms } from '@/lib/actions/rooms';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const officeId = 'office-wroclaw'; // Default for demo
  const userId = 'demo-user-id'; // Would come from auth

  // Fetch data in parallel
  const [rooms, bookings, statsData] = await Promise.all([
    getRooms(officeId),
    getUserBookings(userId),
    getUtilizationStats(officeId),
  ]);

  const activeBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const availableNow = rooms.length - activeBookings.length; // Simplified for demo

  const stats = [
    { label: 'Total Rooms', value: rooms.length.toString(), icon: MapPin, color: 'text-primary' },
    {
      label: 'Active Bookings',
      value: activeBookings.length.toString(),
      icon: Calendar,
      color: 'text-success',
    },
    {
      label: 'Available Now',
      value: Math.max(0, availableNow).toString(),
      icon: CheckCircle,
      color: 'text-info',
    },
    {
      label: 'No-Show Rate',
      value: `${Math.round(statsData.noShowRate)}%`,
      icon: XCircle,
      color: 'text-warning',
    },
  ];

  // Map rooms to have availability for display
  const roomsWithAvailability = rooms.slice(0, 4).map((room) => ({
    ...room,
    availability: 'available', // In real app, check against current time
  }));

  return (
    <DashboardClient
      stats={stats}
      upcomingBookings={activeBookings.slice(0, 3)}
      availableRooms={roomsWithAvailability}
    />
  );
}
