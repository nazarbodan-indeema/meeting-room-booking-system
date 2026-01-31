'use client';

import type { BookingStatus } from '@prisma/client';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, MapPin, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, Select, StatusBadge } from '@/components/ui';

interface BookingsClientProps {
  initialBookings: any[];
}

export function BookingsClient({ initialBookings }: BookingsClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = initialBookings.filter((booking) => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  const upcomingCount = initialBookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-foreground-secondary mt-1">
            {upcomingCount} upcoming booking{upcomingCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/rooms">
          <Button>Book New Room</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-foreground-secondary" />
          <Select
            options={[
              { value: 'all', label: 'All Bookings' },
              { value: 'PENDING', label: 'Pending Check-in' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'NO_SHOW', label: 'No Show' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          />
        </div>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-success-light text-success'
                        : booking.status === 'PENDING'
                          ? 'bg-warning-light text-warning'
                          : booking.status === 'NO_SHOW'
                            ? 'bg-danger-light text-danger'
                            : 'bg-surface-hover text-foreground-secondary'
                    }`}
                  >
                    {booking.status === 'CONFIRMED' && <CheckCircle className="w-5 h-5" />}
                    {booking.status === 'PENDING' && <Clock className="w-5 h-5" />}
                    {booking.status === 'NO_SHOW' && <AlertCircle className="w-5 h-5" />}
                    {booking.status === 'CANCELLED' && <XCircle className="w-5 h-5" />}
                    {booking.status === 'COMPLETED' && <CheckCircle className="w-5 h-5" />}
                  </div>

                  {/* Booking Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate" title={booking.title}>
                      {booking.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-secondary mt-1">
                      <span className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate" title={`${booking.room?.name} • Floor ${booking.room?.floor}`}>
                          {booking.room?.name} • Floor {booking.room?.floor}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(booking.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={booking.status} />
                  {booking.status === 'PENDING' && (
                    <Link href={`/check-in/${booking.id}`}>
                      <Button size="sm">Check In</Button>
                    </Link>
                  )}
                  {booking.status === 'PENDING' && (
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-foreground-secondary">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
