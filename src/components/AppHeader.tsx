'use client';

import GlobalSearch from '@/components/GlobalSearch';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  onOpenMobileNav: () => void;
};

export default function AppHeader({ onOpenMobileNav }: AppHeaderProps) {
  return (
    // DODANO: h-16 (visina 64px) za mobitele, md:h-20 (visina 80px) za desktop
    // DODANO: shrink-0 da se nikad ne spljošti ako je sadržaj stranice dugačak
    <header className="h-16 md:h-20 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-colors">
      
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden shrink-0 border-slate-200 dark:border-slate-700"
          onClick={onOpenMobileNav}
        >
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="sr-only">Otvori izbornik</span>
        </Button>

        <GlobalSearch />
      </div>

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
  );
}