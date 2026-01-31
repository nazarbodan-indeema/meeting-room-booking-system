'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useOffice, useSidebar } from '@/components/providers';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rooms', label: 'Rooms', icon: MapPin },
  { href: '/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/admin', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed } = useSidebar();
  const width = isCollapsed ? 72 : 240;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: width,
          x: isOpen ? 0 : typeof window !== 'undefined' && window.innerWidth < 1024 ? -width : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ '--sidebar-width': `${width}px` } as any}
        className={cn(
          'fixed left-0 top-0 lg:top-16 bottom-0 z-50 lg:z-40 bg-surface border-r border-border flex flex-col',
          !isOpen && 'max-lg:-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">RoomBook</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-surface-hover rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {/* Mobile Office Switcher */}
          <div className="lg:hidden mb-4 px-3 py-2 border-b border-border pb-4">
            <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">Current Office</p>
            <MobileOfficeSwitcher />
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-surface-hover',
                  isActive && 'bg-primary/10 text-primary font-medium',
                  !isActive && 'text-foreground-secondary hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={cn(
                    'text-sm transition-opacity duration-200',
                    isCollapsed && 'lg:opacity-0 lg:hidden'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border hidden lg:block">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 rounded-lg text-foreground-secondary hover:bg-surface-hover hover:text-foreground transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2 text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function MobileOfficeSwitcher() {
  const { offices, currentOffice, setCurrentOffice } = useOffice();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentOffice) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-hover border border-border"
      >
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{currentOffice.name}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-2 space-y-1 bg-surface-hover rounded-lg border border-border overflow-hidden"
          >
            {offices.map((office) => (
              <button
                key={office.id}
                onClick={() => {
                  setCurrentOffice(office);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-border transition-colors",
                  currentOffice.id === office.id && "text-primary font-medium bg-primary/5"
                )}
              >
                {office.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
