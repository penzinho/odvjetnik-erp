'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      {isMobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-label="Zatvori izbornik"
        />
      ) : null}

      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-slate-950">
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 shadow-sm px-2.5 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Otvori izbornik"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                Pregled
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Dobrodošli natrag, Odvjetnik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="font-bold">IM</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
