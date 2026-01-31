'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useOffice } from '@/components/providers';
import {
  AvailabilityBadge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';

// Demo data for dashboard
const stats = [
  { label: 'Total Rooms', value: '12', icon: MapPin, color: 'text-primary' },
  { label: 'Active Bookings', value: '8', icon: Calendar, color: 'text-success' },
  { label: 'Available Now', value: '4', icon: CheckCircle, color: 'text-info' },
  { label: 'No-Show Rate', value: '12%', icon: XCircle, color: 'text-warning' },
];

const upcomingBookings = [
  {
    id: '1',
    room: 'Innovation Lab',
    time: '10:00 - 11:00',
    title: 'Sprint Planning',
    status: 'pending' as const,
  },
  {
    id: '2',
    room: 'Board Room',
    time: '14:00 - 15:30',
    title: 'Client Presentation',
    status: 'pending' as const,
  },
  {
    id: '3',
    room: 'Focus Room A',
    time: '16:00 - 16:30',
    title: '1:1 Meeting',
    status: 'pending' as const,
  },
];

const availableRooms = [
  { id: '1', name: 'Creative Space', capacity: 8, floor: 2, availability: 'available' as const },
  { id: '2', name: 'Quiet Corner', capacity: 4, floor: 1, availability: 'available' as const },
  { id: '3', name: 'Innovation Lab', capacity: 12, floor: 3, availability: 'upcoming' as const },
  { id: '4', name: 'Board Room', capacity: 20, floor: 4, availability: 'occupied' as const },
];

export default function DashboardPage() {
  const { currentOffice } = useOffice();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Good morning! 👋</h1>
          <p className="text-foreground-secondary mt-1">
            {currentOffice?.name} Office •{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Link href="/rooms">
          <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Book a Room</Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-surface-hover ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Bookings
              </CardTitle>
              <Link href="/bookings" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-foreground-secondary">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No bookings for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/check-in/${booking.id}`}
                      className="block p-3 rounded-lg bg-surface-hover hover:bg-border transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.title}</p>
                          <p className="text-sm text-foreground-secondary">
                            {booking.room} • {booking.time}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Check In
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Rooms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Room Status
              </CardTitle>
              <Link href="/rooms" className="text-sm text-primary hover:underline">
                View map
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-hover hover:bg-border transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-medium">
                        {room.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-foreground-secondary">
                          <Users className="w-3 h-3 inline mr-1" />
                          {room.capacity} people • Floor {room.floor}
                        </p>
                      </div>
                    </div>
                    <AvailabilityBadge availability={room.availability} size="sm" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="glass">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics Dashboard</h3>
                <p className="text-sm text-foreground-secondary">
                  View room utilization and booking insights
                </p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
