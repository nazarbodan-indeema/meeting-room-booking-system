import type { Booking, BookingStatus, Office, Room, User, UserRole } from '@prisma/client';

// Re-export Prisma types
export type { Office, Room, User, Booking, BookingStatus, UserRole };

// Extended types with relations
export type RoomWithOffice = Room & {
  office: Office;
};

export type BookingWithRelations = Booking & {
  room: Room;
  user: User;
};

export type RoomWithBookings = Room & {
  bookings: Booking[];
};

// UI State types
export type RoomAvailability = 'available' | 'occupied' | 'upcoming';

export interface RoomStatus {
  availability: RoomAvailability;
  currentBooking?: Booking;
  nextBooking?: Booking;
  availableUntil?: Date;
  availableIn?: number; // minutes
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  booking?: Booking;
}

// Analytics types
export interface RoomUtilization {
  roomId: string;
  roomName: string;
  totalHours: number;
  bookedHours: number;
  utilizationPercent: number;
  noShowCount: number;
  noShowRate: number;
}

export interface DailyStats {
  date: string;
  totalBookings: number;
  confirmedBookings: number;
  noShows: number;
  cancellations: number;
}

export interface PeakHour {
  hour: number;
  bookingCount: number;
}

export interface AnalyticsSummary {
  totalBookings: number;
  confirmedBookings: number;
  noShowRate: number;
  avgUtilization: number;
  mostPopularRoom: string;
  peakHour: number;
}

// Form types
export interface BookingFormData {
  roomId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  duration: number;
  isRecurring?: boolean;
  recurringWeeks?: number;
}

// Filter types
export interface RoomFilters {
  officeId?: string;
  floor?: number;
  minCapacity?: number;
  amenities?: string[];
  availability?: RoomAvailability;
}

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  roomId?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Office with rooms count
export interface OfficeWithStats extends Office {
  _count?: {
    rooms: number;
  };
}
