'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Monitor, Phone, Tv, Users, Wifi } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AvailabilityBadge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from '@/components/ui';
import { createBooking } from '@/lib/actions/bookings';
import { BOOKING_DURATIONS } from '@/lib/utils';

interface RoomDetailClientProps {
  room: any;
  existingBookings: any[];
}

const amenityIcons: Record<string, { icon: typeof Tv; label: string }> = {
  whiteboard: { icon: Monitor, label: 'Whiteboard' },
  projector: { icon: Tv, label: 'Projector' },
  'video-conferencing': { icon: Monitor, label: 'Video Conferencing' },
  phone: { icon: Phone, label: 'Conference Phone' },
  wifi: { icon: Wifi, label: 'High-Speed WiFi' },
};

export function RoomDetailClient({ room, existingBookings }: RoomDetailClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [title, setTitle] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Generate time slots based on existing bookings
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (const min of [0, 30]) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Check if slot is in the past
        const now = new Date();
        const slotDate = new Date(selectedDate);
        slotDate.setHours(hour, min, 0);
        const isPast = slotDate < now;

        // Check if slot overlaps with existing bookings
        const isBooked = existingBookings.some((b) => {
          const bStart = new Date(b.startTime);
          const bEnd = new Date(b.endTime);
          return slotDate >= bStart && slotDate < bEnd;
        });

        slots.push({ time: timeStr, isPast, isBooked });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleBook = async () => {
    if (!selectedTime || !title) return;
    setIsBooking(true);

    try {
      const startTime = new Date(selectedDate);
      const [h, m] = selectedTime.split(':').map(Number);
      startTime.setHours(h, m, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + duration);

      await createBooking({
        title,
        description: '',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        roomId: room.id,
        userId: 'demo-user-id', // Would be real user ID
      });

      router.push('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to rooms
      </Link>

      {/* Room Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-2xl">
                {room.name.charAt(0)}
              </div>
              <AvailabilityBadge availability={room.availability || 'available'} />
            </div>

            <h1 className="text-2xl font-bold mb-2">{room.name}</h1>
            <div className="flex flex-wrap gap-4 text-foreground-secondary mb-6">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.capacity} people
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Floor {room.floor}
              </span>
            </div>

            {/* Amenities */}
            <h3 className="font-semibold mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {room.amenities.map((amenity: string) => {
                const config = amenityIcons[amenity];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-3 bg-surface-hover rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[400px]"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Book this room
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meeting Title"
                placeholder="Enter meeting title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                type="date"
                label="Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />

              <Select
                label="Duration"
                options={BOOKING_DURATIONS.map((d) => ({
                  value: d.value.toString(),
                  label: d.label,
                }))}
                value={duration.toString()}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              />

              {/* Time Slots */}
              <div>
                <span className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Select Time
                </span>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.time}
                      disabled={slot.isPast || slot.isBooked}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-primary text-white'
                          : slot.isPast || slot.isBooked
                            ? 'bg-surface-hover text-foreground-secondary opacity-50 cursor-not-allowed'
                            : 'bg-surface-hover hover:bg-border text-foreground'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!selectedTime || !title}
                isLoading={isBooking}
                onClick={handleBook}
              >
                Book Room
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
