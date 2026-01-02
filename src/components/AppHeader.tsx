'use client';

import GlobalSearch from '@/components/GlobalSearch';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Definiramo tip podataka koje očekujemo (usklađeno s AppShell)
type UserProfile = {
  email?: string;
  role?: string;
  ime?: string;
  prezime?: string;
} | null;

type AppHeaderProps = {
  onOpenMobileNav: () => void;
  user: UserProfile; // <--- Primamo podatke o korisniku
};

export default function AppHeader({ onOpenMobileNav, user }: AppHeaderProps) {

  // 1. Logika za Prikaz Imena
  // Preferiramo "Ime Prezime", ako toga nema koristimo Email
  const displayName = user?.ime && user?.prezime 
    ? `${user.ime} ${user.prezime}` 
    : user?.email || 'Korisnik';

  // 2. Logika za Prikaz Uloge (admin -> Admin)
  const displayRole = user?.role === 'admin' ? 'Admin' : 'Korisnik';

  // 3. Logika za Inicijale (Luka Lukić -> LL, ili prva dva slova emaila)
  const initials = user?.ime && user?.prezime
    ? `${user.ime[0]}${user.prezime[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || '??';

  return (
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
        {/* DINAMIČKI PODACI O KORISNIKU */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {displayName}
          </span>
          <span className="text-xs text-slate-500 capitalize">
            {displayRole}
          </span>
        </div>
        
        {/* INICIJALI */}
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}