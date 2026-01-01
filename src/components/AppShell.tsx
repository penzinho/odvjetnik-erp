'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar'; // Tvoj postojeći sidebar
import GlobalSearch from '@/components/GlobalSearch'; // Nova tražilica
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        
        {/* HEADER (Sticky) */}
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-colors">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger gumb (samo mobile) */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden shrink-0 border-slate-200 dark:border-slate-700"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="sr-only">Otvori izbornik</span>
            </Button>

            {/* GLOBALNA TRAŽILICA - Vidljiva svugdje */}
            <GlobalSearch />
          </div>

          {/* DESNA STRANA HEADERA */}
          <div className="flex items-center gap-4 ml-4">
            <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Ivan Miletić</span>
                <span className="text-xs text-slate-500">Odvjetnik</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
              IM
            </div>
          </div>
        </header>

        {/* SADRŽAJ STRANICE */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}