'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Camera, CheckCircle, Clock, MapPin, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button, Card, QRCode, StatusBadge } from '@/components/ui';

// Demo booking
const demoBooking = {
  id: '1',
  title: 'Sprint Planning',
  room: 'Innovation Lab',
  floor: 2,
  date: 'Today',
  startTime: '10:00',
  endTime: '11:00',
  status: 'PENDING' as const,
  qrCode: 'BOOKING-123456',
};

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = use(params);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCheckingIn(false);
    setIsSuccess(true);

    // Redirect after success
    setTimeout(() => {
      router.push('/bookings');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check-in Successful!</h1>
          <p className="text-foreground-secondary mb-8">
            Your attendance for <strong>{demoBooking.title}</strong> has been recorded.
          </p>
          <Link href="/bookings">
            <Button variant="ghost">Return to Bookings</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to my bookings
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Room Check-in</h1>
        <p className="text-foreground-secondary">
          Please check in to confirm your presence in the room.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Booking Info Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-6">
              <StatusBadge status={demoBooking.status} />
              <div className="flex items-center gap-1.5 text-danger font-bold">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">{demoBooking.title}</h2>

            <div className="space-y-4 text-foreground-secondary mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-medium">{demoBooking.room}</p>
                  <p className="text-sm">Floor {demoBooking.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-foreground font-medium">
                    {demoBooking.startTime} - {demoBooking.endTime}
                  </p>
                  <p className="text-sm">{demoBooking.date}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-hover rounded-xl border border-dashed border-border flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                You must check in within 10 minutes of the meeting start time. Failure to do so will
                result in automatic cancellation.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card padding="lg" className="text-center">
            <div className="mb-4 text-sm font-medium text-foreground-secondary uppercase tracking-wider">
              Scan this QR code
            </div>
            <QRCode value={demoBooking.qrCode} className="mx-auto shadow-sm" />
            <p className="mt-4 text-xs text-foreground-secondary">
              Scan the code on the tablet outside the room
            </p>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-foreground-secondary">
                Or use browser check-in
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            isLoading={isCheckingIn}
            onClick={handleCheckIn}
            leftIcon={<CheckCircle className="w-5 h-5" />}
          >
            Confirm Presence
          </Button>

          <Button variant="ghost" className="w-full" leftIcon={<Camera className="w-4 h-4" />}>
            Open QR Scanner
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
