'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronDown, Menu, Monitor, Moon, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useOffice, useSidebar, useTheme } from '@/components/providers';

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 hover:bg-surface-hover rounded-lg lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">RoomBook</span>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <OfficeSwitcher />
          </div>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function OfficeSwitcher() {
  const { offices, currentOffice, setCurrentOffice } = useOffice();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentOffice) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
      >
        <Building2 className="w-4 h-4 text-foreground-secondary" />
        <span className="text-sm font-medium">{currentOffice.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-foreground-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {offices.map((office) => (
              <button
                type="button"
                key={office.id}
                onClick={() => {
                  setCurrentOffice(office);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-hover transition-colors ${
                  currentOffice.id === office.id
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-foreground'
                }`}
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

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-surface-hover transition-colors ${
                  theme === value ? 'bg-primary-light text-primary font-medium' : 'text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center hover:ring-2 hover:ring-primary transition-all"
      >
        <User className="w-5 h-5 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">Demo User</p>
              <p className="text-xs text-foreground-secondary">demo@example.com</p>
            </div>
            <button
              type="button"
              className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-surface-hover transition-colors"
            >
              Profile Settings
            </button>
            <button
              type="button"
              className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-light transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
