'use client';

import { motion } from 'framer-motion';
import { Filter, List, Map as MapIcon, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useOffice } from '@/components/providers';
import { FloorMap, RoomCard } from '@/components/rooms';
import { Button, Card, Select } from '@/components/ui';
import type { Room, RoomAvailability } from '@/types';

// Demo rooms data
const demoRooms: (Room & { availability: RoomAvailability })[] = [
  {
    id: 'room-1',
    name: 'Innovation Lab',
    capacity: 12,
    floor: 2,
    amenities: ['whiteboard', 'projector', 'video-conferencing'],
    officeId: 'office-wroclaw',
    coordX: 50,
    coordY: 50,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'available',
  },
  {
    id: 'room-2',
    name: 'Board Room',
    capacity: 20,
    floor: 4,
    amenities: ['whiteboard', 'projector', 'video-conferencing', 'phone'],
    officeId: 'office-wroclaw',
    coordX: 190,
    coordY: 50,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'occupied',
  },
  {
    id: 'room-3',
    name: 'Creative Space',
    capacity: 8,
    floor: 2,
    amenities: ['whiteboard', 'tv'],
    officeId: 'office-wroclaw',
    coordX: 310,
    coordY: 50,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'available',
  },
  {
    id: 'room-4',
    name: 'Focus Room A',
    capacity: 4,
    floor: 1,
    amenities: ['whiteboard'],
    officeId: 'office-wroclaw',
    coordX: 50,
    coordY: 150,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'upcoming',
  },
  {
    id: 'room-5',
    name: 'Focus Room B',
    capacity: 4,
    floor: 1,
    amenities: ['whiteboard'],
    officeId: 'office-wroclaw',
    coordX: 250,
    coordY: 150,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'available',
  },
  {
    id: 'room-6',
    name: 'Phone Booth',
    capacity: 2,
    floor: 1,
    amenities: ['phone'],
    officeId: 'office-wroclaw',
    coordX: 370,
    coordY: 150,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: 'available',
  },
];

type ViewMode = 'map' | 'list';

export default function RoomsPage() {
  const { currentOffice } = useOffice();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [minCapacity, setMinCapacity] = useState<number>(0);

  // Filter rooms
  const filteredRooms = demoRooms.filter((room) => {
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (minCapacity > 0 && room.capacity < minCapacity) return false;
    return true;
  });

  const floors = [...new Set(demoRooms.map((r) => r.floor))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meeting Rooms</h1>
          <p className="text-foreground-secondary mt-1">
            {currentOffice?.name} Office • {filteredRooms.length} rooms available
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 bg-surface-hover rounded-lg">
          <Button
            variant={viewMode === 'map' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            leftIcon={<MapIcon className="w-4 h-4" />}
          >
            Map
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List className="w-4 h-4" />}
          >
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <Select
            options={[
              { value: 'all', label: 'All Floors' },
              ...floors.map((f) => ({ value: f.toString(), label: `Floor ${f}` })),
            ]}
            value={selectedFloor === 'all' ? 'all' : selectedFloor.toString()}
            onChange={(e) =>
              setSelectedFloor(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
            }
            className="w-32"
          />

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-foreground-secondary" />
            <Select
              options={[
                { value: '0', label: 'Any capacity' },
                { value: '2', label: '2+ people' },
                { value: '4', label: '4+ people' },
                { value: '8', label: '8+ people' },
                { value: '12', label: '12+ people' },
              ]}
              value={minCapacity.toString()}
              onChange={(e) => setMinCapacity(parseInt(e.target.value, 10))}
              className="w-32"
            />
          </div>
        </div>
      </Card>

      {/* Map View */}
      {viewMode === 'map' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <FloorMap
              rooms={filteredRooms}
              selectedRoomId={selectedRoomId}
              onRoomSelect={setSelectedRoomId}
              floor={selectedFloor === 'all' ? 1 : selectedFloor}
            />
          </div>
          <div>
            {selectedRoomId ? (
              <RoomCard
                room={filteredRooms.find((r) => r.id === selectedRoomId) || filteredRooms[0]}
              />
            ) : (
              <Card className="h-full flex items-center justify-center text-foreground-secondary">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a room on the map</p>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
          {filteredRooms.length === 0 && (
            <div className="col-span-full text-center py-12 text-foreground-secondary">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No rooms match your filters</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
