'use client';

import { motion } from 'framer-motion';
import { Coffee, Monitor, Phone, Tv, Users, Wifi } from 'lucide-react';
import Link from 'next/link';
import { AvailabilityBadge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Room, RoomAvailability } from '@/types';

interface RoomCardProps {
  room: Room & { availability?: RoomAvailability };
  showBookButton?: boolean;
}

const amenityIcons: Record<string, typeof Tv> = {
  whiteboard: Monitor,
  projector: Tv,
  'video-conferencing': Monitor,
  phone: Phone,
  tv: Tv,
  wifi: Wifi,
  coffee: Coffee,
};

export function RoomCard({ room, showBookButton = true }: RoomCardProps) {
  const availability = room.availability || 'available';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/rooms/${room.id}`}>
        <Card variant="interactive" className="h-full">
          {/* Room Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg',
                availability === 'available' && 'gradient-success',
                availability === 'occupied' && 'gradient-danger',
                availability === 'upcoming' && 'bg-warning'
              )}
            >
              {room.name.charAt(0)}
            </div>
            <AvailabilityBadge availability={availability} />
          </div>

          {/* Room Info */}
          <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
          <p className="text-sm text-foreground-secondary mb-4">
            Floor {room.floor} • <Users className="w-3 h-3 inline-block" /> {room.capacity} people
          </p>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.slice(0, 4).map((amenity: string) => {
                const Icon = amenityIcons[amenity] || Monitor;
                return (
                  <span
                    key={amenity}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-hover rounded-md text-foreground-secondary"
                  >
                    <Icon className="w-3 h-3" />
                    {amenity}
                  </span>
                );
              })}
              {room.amenities.length > 4 && (
                <span className="px-2 py-1 text-xs bg-surface-hover rounded-md text-foreground-secondary">
                  +{room.amenities.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Action Area */}
          {showBookButton && availability === 'available' && (
            <div className="mt-auto pt-4">
              <div
                className={cn(
                  'btn btn-primary w-full inline-flex items-center justify-center py-2 text-sm',
                  'group-hover:bg-primary-hover transition-colors'
                )}
              >
                Book Now
              </div>
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}
