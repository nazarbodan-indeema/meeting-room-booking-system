'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getOffices } from '@/lib/actions/rooms';
import type { Office } from '@/types';

interface OfficeContextType {
  offices: Office[];
  currentOffice: Office | null;
  setCurrentOffice: (office: Office) => void;
  isLoading: boolean;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export function OfficeProvider({ children }: { children: React.ReactNode }) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [currentOffice, setCurrentOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load offices from API
    const loadOffices = async () => {
      try {
        const data = await getOffices();
        setOffices(data as any);

        // Load saved office preference
        const savedOfficeId = localStorage.getItem('currentOfficeId');
        const savedOffice = (data as any).find((o: any) => o.id === savedOfficeId);
        setCurrentOffice(savedOffice || data[0] || null);
      } catch (error) {
        console.error('Failed to load offices:', error);
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
