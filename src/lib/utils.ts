import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function getTimeDifferenceInMinutes(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}

export function generateQRCode(): string {
  return `BOOKING-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export function isWithinGracePeriod(startTime: Date, graceMinutes: number = 10): boolean {
  const now = new Date();
  const graceEnd = new Date(startTime.getTime() + graceMinutes * 60 * 1000);
  return now >= startTime && now <= graceEnd;
}

export function getGraceTimeRemaining(startTime: Date, graceMinutes: number = 10): number {
  const now = new Date();
  const graceEnd = new Date(startTime.getTime() + graceMinutes * 60 * 1000);
  return Math.max(0, Math.floor((graceEnd.getTime() - now.getTime()) / 1000));
}

export function isBookingActive(startTime: Date, endTime: Date): boolean {
  const now = new Date();
  return now >= startTime && now <= endTime;
}

export function isBookingPast(endTime: Date): boolean {
  return new Date() > endTime;
}

export function isBookingUpcoming(startTime: Date): boolean {
  return new Date() < startTime;
}

export const AMENITY_ICONS: Record<string, string> = {
  whiteboard: '📋',
  projector: '📽️',
  'video-conferencing': '📹',
  phone: '📞',
  tv: '📺',
  'air-conditioning': '❄️',
  'wheelchair-accessible': '♿',
  'natural-light': '☀️',
};

export const BOOKING_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
];

export const TIME_SLOTS = Array.from({ length: 24 }, (_, hour) => {
  return [0, 15, 30, 45].map((minute) => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return { label: `${h}:${m}`, value: `${h}:${m}` };
  });
}).flat();
