import { getUserBookings } from '@/lib/actions/bookings';
import { BookingsClient } from './BookingsClient';

export default async function BookingsPage() {
  const userId = 'demo-user-id'; // Would come from auth
  const bookings = await getUserBookings(userId);

  return <BookingsClient initialBookings={bookings} />;
}
