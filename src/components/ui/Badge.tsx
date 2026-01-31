import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/types';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'status-pending' },
  CONFIRMED: { label: 'Confirmed', className: 'status-confirmed' },
  CANCELLED: { label: 'Cancelled', className: 'status-cancelled' },
  NO_SHOW: { label: 'No Show', className: 'status-no-show' },
  COMPLETED: { label: 'Completed', className: 'status-completed' },
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.className,
        sizes[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface AvailabilityBadgeProps {
  availability: 'available' | 'occupied' | 'upcoming';
  size?: 'sm' | 'md';
  className?: string;
}

const availabilityConfig = {
  available: { label: 'Available', className: 'bg-success-light text-success' },
  occupied: { label: 'Occupied', className: 'bg-danger-light text-danger' },
  upcoming: { label: 'Upcoming', className: 'bg-warning-light text-warning' },
};

export function AvailabilityBadge({
  availability,
  size = 'md',
  className,
}: AvailabilityBadgeProps) {
  const config = availabilityConfig[availability];

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.className,
        sizes[size],
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          availability === 'available' && 'bg-success',
          availability === 'occupied' && 'bg-danger',
          availability === 'upcoming' && 'bg-warning'
        )}
      />
      {config.label}
    </span>
  );
}
