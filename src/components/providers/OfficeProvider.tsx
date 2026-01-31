'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Office } from '@/types';

interface OfficeContextType {
  offices: Office[];
  currentOffice: Office | null;
  setCurrentOffice: (office: Office) => void;
  isLoading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

// Demo offices - will be replaced with API call
const DEMO_OFFICES: Office[] = [
  {
    id: 'office-wroclaw',
    name: 'Wroclaw',
    timezone: 'Europe/Warsaw',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'office-lviv',
    name: 'Lviv',
    timezone: 'Europe/Kiev',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function OfficeProvider({ children }: { children: React.ReactNode }) {
  const [offices, setOffices] = useState<Office[]>(DEMO_OFFICES);
  const [currentOffice, setCurrentOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load offices from API
    const loadOffices = async () => {
      try {
        // TODO: Replace with actual API call
        // const res = await fetch('/api/offices');
        // const data = await res.json();
        // setOffices(data);

        // For now, use demo data
        setOffices(DEMO_OFFICES);

        // Load saved office preference
        const savedOfficeId = localStorage.getItem('currentOfficeId');
        const savedOffice = DEMO_OFFICES.find((o) => o.id === savedOfficeId);
        setCurrentOffice(savedOffice || DEMO_OFFICES[0]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOffices();
  }, []);

  const handleSetCurrentOffice = (office: Office) => {
    setCurrentOffice(office);
    localStorage.setItem('currentOfficeId', office.id);
  };

  return (
    <OfficeContext.Provider
      value={{
        offices,
        currentOffice,
        setCurrentOffice: handleSetCurrentOffice,
        isLoading,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffice() {
  const context = useContext(OfficeContext);
  if (!context) {
    throw new Error('useOffice must be used within an OfficeProvider');
  }
  return context;
}
