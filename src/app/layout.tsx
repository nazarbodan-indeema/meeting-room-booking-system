import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header, Sidebar } from '@/components/layout';
import { OfficeProvider, SidebarProvider, ThemeProvider } from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RoomBook - Smart Meeting Room Booking',
  description:
    'Book meeting rooms with smart check-in, auto-cancellation, and real-time availability tracking.',
  keywords: ['meeting rooms', 'booking', 'office management', 'check-in'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <OfficeProvider>
            <SidebarProvider>
              <div className="min-h-screen">
                <Header />
                <Sidebar />
                <main className="pt-16 lg:pl-[var(--sidebar-width,240px)] min-h-screen transition-all duration-200">
                  <div className="page-container">{children}</div>
                </main>
              </div>
            </SidebarProvider>
          </OfficeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
