import { getRooms } from '@/lib/actions/rooms';
import { RoomsClient } from './RoomsClient';

export default async function RoomsPage() {
  // We'll use a default office ID for now or fetch from cookies/params if needed
  // For the hackaton demo, we'll fetch Wroclaw rooms by default
  const rooms = await getRooms('office-wroclaw');

  // Map to the format expected by the UI (adding demo availability for now)
  const roomsWithAvailability = rooms.map((room) => ({
    ...room,
    availability: ['available', 'occupied', 'upcoming'][Math.floor(Math.random() * 3)] as any,
  }));

  return <RoomsClient initialRooms={roomsWithAvailability as any} />;
}
