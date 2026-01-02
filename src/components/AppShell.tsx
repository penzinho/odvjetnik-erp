'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AppHeader from '@/components/AppHeader';

// Definiramo tip za profil
type UserProfile = {
  id: string;
  email: string;
  role: string;
  ime?: string;
  prezime?: string;
  oib?: string;
} | null;

type AppShellProps = {
  children: React.ReactNode;
  userProfile: UserProfile; // <--- NOVI PROP
};

export default function AppShell({ children, userProfile }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isPublicPage = pathname === '/login' || pathname === '/register';

  // Ako je login stranica, ne prikazuj shell
  if (isPublicPage) {
    return (
      <main className="min-h-screen w-full bg-gray-50 dark:bg-slate-950">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col overflow-y-auto h-screen w-full relative">
        
        {/* ŠALJEMO PROFIL DALJE U HEADER */}
        <AppHeader 
           onOpenMobileNav={() => setIsMobileNavOpen(true)} 
           user={userProfile} 
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}