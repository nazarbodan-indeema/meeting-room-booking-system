'use client';

import { motion } from 'framer-motion';
import type { Room, RoomAvailability } from '@/types';

interface FloorMapProps {
  rooms: (Room & { availability?: RoomAvailability })[];
  selectedRoomId?: string;
  onRoomSelect?: (roomId: string) => void;
  floor: number;
}

// Demo floor layout positions for rooms
const roomPositions: Record<string, { x: number; y: number; width: number; height: number }> = {
  'room-1': { x: 50, y: 50, width: 120, height: 80 },
  'room-2': { x: 190, y: 50, width: 100, height: 80 },
  'room-3': { x: 310, y: 50, width: 140, height: 80 },
  'room-4': { x: 50, y: 150, width: 180, height: 100 },
  'room-5': { x: 250, y: 150, width: 100, height: 100 },
  'room-6': { x: 370, y: 150, width: 80, height: 100 },
};

export function FloorMap({ rooms, selectedRoomId, onRoomSelect, floor }: FloorMapProps) {
  const getAvailabilityColor = (availability?: RoomAvailability) => {
    switch (availability) {
      case 'available':
        return { fill: 'var(--success-light)', stroke: 'var(--success)' };
      case 'occupied':
        return { fill: 'var(--danger-light)', stroke: 'var(--danger)' };
      case 'upcoming':
        return { fill: 'var(--warning-light)', stroke: 'var(--warning)' };
      default:
        return { fill: 'var(--surface-hover)', stroke: 'var(--border)' };
    }
  };

  return (
    <div className="relative w-full aspect-video bg-surface rounded-xl border border-border overflow-hidden">
      {/* Floor Label */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-surface text-sm font-medium rounded-lg border border-border shadow-sm">
        Floor {floor}
      </div>

      <svg
        viewBox="0 0 500 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby="floor-map-title"
      >
        <title id="floor-map-title">Interactive floor map for office floor {floor}</title>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Rooms */}
        {rooms.map((room, index) => {
          const position = roomPositions[`room-${index + 1}`] || {
            x: 50 + (index % 3) * 150,
            y: 50 + Math.floor(index / 3) * 120,
            width: 120,
            height: 80,
          };
          const colors = getAvailabilityColor(room.availability);
          const isSelected = room.id === selectedRoomId;

          return (
            <motion.g
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onRoomSelect?.(room.id)}
              className="cursor-pointer"
            >
              {/* Room Rectangle */}
              <motion.rect
                x={position.x}
                y={position.y}
                width={position.width}
                height={position.height}
                rx="8"
                fill={colors.fill}
                stroke={isSelected ? 'var(--primary)' : colors.stroke}
                strokeWidth={isSelected ? 3 : 2}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />

              {/* Room Name */}
              <text
                x={position.x + position.width / 2}
                y={position.y + position.height / 2 - 8}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="12"
                fontWeight="600"
              >
                {room.name.length > 15 ? `${room.name.slice(0, 12)}...` : room.name}
              </text>

              {/* Capacity */}
              <text
                x={position.x + position.width / 2}
                y={position.y + position.height / 2 + 10}
                textAnchor="middle"
                fill="var(--foreground-secondary)"
                fontSize="10"
              >
                {room.capacity} people
              </text>

              {/* Status indicator */}
              <circle
                cx={position.x + position.width - 12}
                cy={position.y + 12}
                r="6"
                fill={colors.stroke}
              />
            </motion.g>
          );
        })}

        {/* Legend */}
        <g transform="translate(380, 260)">
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            rx="2"
            fill="var(--success-light)"
            stroke="var(--success)"
          />
          <text x="15" y="9" fontSize="8" fill="var(--foreground-secondary)">
            Available
          </text>

          <rect
            x="60"
            y="0"
            width="10"
            height="10"
            rx="2"
            fill="var(--danger-light)"
            stroke="var(--danger)"
          />
          <text x="75" y="9" fontSize="8" fill="var(--foreground-secondary)">
            Occupied
          </text>
        </g>
      </svg>
    </div>
  );
}
