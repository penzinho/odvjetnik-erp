'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar'; // Tvoj postojeći sidebar
import AppHeader from '@/components/AppHeader';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      
      {/* SIDEBAR - Koristimo tvoju komponentu */}
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {/* Zatamnjenje pozadine na mobitelu */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* GLAVNI DIO */}
      <main className="flex-1 flex flex-col overflow-y-auto h-screen w-full relative">
        
        <AppHeader onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        {/* SADRŽAJ STRANICE */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
