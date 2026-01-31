import { z } from 'zod/v4';

export const createBookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z
    .number()
    .min(15, 'Minimum duration is 15 minutes')
    .max(480, 'Maximum duration is 8 hours'),
  isRecurring: z.boolean().optional().default(false),
  recurringWeeks: z.number().min(1).max(12).optional(),
});

export const updateBookingSchema = createBookingSchema.partial().extend({
  id: z.string().min(1),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(50),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(100),
  floor: z.number().min(-2).max(50),
  amenities: z.array(z.string()).optional().default([]),
  officeId: z.string().min(1, 'Office is required'),
  coordX: z.number().optional(),
  coordY: z.number().optional(),
});

export const checkInSchema = z.object({
  bookingId: z.string().min(1),
  qrCode: z.string().optional(),
});

export const analyticsQuerySchema = z.object({
  officeId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  roomId: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
