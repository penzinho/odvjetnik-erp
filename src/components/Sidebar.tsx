'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/app/login/actions'; // <--- 1. UVOZ LOGOUT AKCIJE

type SidebarProps = {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  // Stanje za praćenje je li izbornik skupljen
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isToolsActive = pathname === '/alati' || pathname.startsWith('/alati/');
  const [isToolsOpen, setIsToolsOpen] = useState(isToolsActive);
  const isAddressBookActive =
    pathname === '/adresar' ||
    pathname.startsWith('/adresar/') ||
    pathname === '/klijenti' ||
    pathname.startsWith('/klijenti/') ||
    pathname === '/protustranke' ||
    pathname.startsWith('/protustranke/') ||
    pathname === '/biljeznici' ||
    pathname.startsWith('/biljeznici/') ||
    pathname === '/sudovi' ||
    pathname.startsWith('/sudovi/');
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(isAddressBookActive);
  const isCondensed = isCollapsed && !isMobileOpen;

  useEffect(() => {
    if (isToolsActive) {
      setIsToolsOpen(true);
    }
  }, [isToolsActive]);

  useEffect(() => {
    if (isAddressBookActive) {
      setIsAddressBookOpen(true);
    }
  }, [isAddressBookActive]);

  // Funkcija koja provjerava je li link aktivan
  const isActive = (path: string) => {
    if (path === '/adresar') {
      return isAddressBookActive;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Prilagođeni stilovi koji se mijenjaju ovisno o isCondensed
  const linkStyle = (path: string) => {
    const activeClass = isActive(path)
      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" // Aktivno u Dark modu
      : "text-slate-500 hover:bg-gray-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"; // Neaktivno u Dark modu
    
    // Ako je skupljeno: centriraj i manji padding. Ako nije: normalan padding.
    const layoutClass = isCondensed
      ? "px-4 md:justify-center md:px-2 md:gap-0"
      : "px-4";

    return `flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 group relative cursor-pointer ${activeClass} ${layoutClass}`;
  };

  const subLinkStyle = (path: string) => {
    const activeClass = isActive(path)
      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      : "text-slate-500 hover:bg-gray-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200";

    return `flex items-center gap-3 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeClass}`;
  };

  // Klasa za skrivanje teksta s animacijom
  const textClass = `whitespace-nowrap overflow-hidden transition-all duration-300 w-auto opacity-100 ${
    isCondensed ? "md:w-0 md:opacity-0" : "md:w-auto md:opacity-100"
  }`;

  return (
    
    <aside 
      className={`bg-white flex flex-col border-r border-gray-200 h-screen transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 fixed inset-y-0 left-0 z-40 md:sticky md:top-0 md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } w-72 ${isCondensed ? "md:w-20" : "md:w-72"}`}
    >
      
      {/* GUMB ZA SKUPLJANJE (TOGGLE) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-9 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-blue-600 rounded-full p-1 shadow-sm dark:shadow-none z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        )}
      </button>

      {/* Logo */}
      <div className={`app-header flex items-center border-b border-gray-50 dark:border-slate-800 transition-all ${isCondensed ? 'justify-center px-0' : 'px-6 sm:px-8'} ${isCondensed ? '' : 'justify-between'}`}>
        <div className={`flex items-center ${isCondensed ? "gap-0" : "gap-3"}`}>
          <div className="min-w-[40px] w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-100 shadow-md dark:shadow-none">
            L
          </div>
          <div className={textClass}>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Lex Office</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Odvjetničko društvo</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 px-2.5 py-2 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
          aria-label="Zatvori izbornik"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Navigacija */}
      <nav className="flex-1 px-3 py-8 space-y-1 overflow-y-auto overflow-x-hidden">
        
        <Link href="/" className={linkStyle('/')} title={isCondensed ? "Pregled" : ""} onClick={onMobileClose}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className={textClass}>Pregled</span>
        </Link>
        <Link href="/rokovnik" className={linkStyle('/rokovnik')} title={isCondensed ? "Rokovnik" : ""} onClick={onMobileClose}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className={textClass}>Rokovnik</span>
        </Link>
        
        {/* Adresar s podizbornicima */}
        <button
          type="button"
          onClick={() => setIsAddressBookOpen((open) => !open)}
          className={`w-full ${linkStyle('/adresar')}`}
          title={isCondensed ? "Adresar" : ""}
          aria-expanded={isAddressBookOpen}
          aria-controls="sidebar-adresar"
        >
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span className={textClass}>Adresar</span>
          {!isCondensed ? (
            <svg
              className={`ml-auto h-4 w-4 transition-transform ${isAddressBookOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          ) : null}
        </button>
        {isAddressBookOpen && !isCondensed ? (
          <div id="sidebar-adresar" className="ml-6 space-y-1">
            <Link href="/klijenti" className={subLinkStyle('/klijenti')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              <span>Klijenti</span>
            </Link>
            <Link href="/protustranke" className={subLinkStyle('/protustranke')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14a4 4 0 10-8 0m8 0v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1m16 0v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1m10-8a4 4 0 11-8 0 4 4 0 018 0zm10 3l-4 4m0 0l-4-4m4 4V7"></path></svg>
              <span>Protustranke</span>
            </Link>
            <Link href="/biljeznici" className={subLinkStyle('/biljeznici')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"></path></svg>
              <span>Javni bilježnici</span>
            </Link>
            <Link href="/sudovi" className={subLinkStyle('/sudovi')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M12 10h.01M15 10h.01"></path></svg>
              <span>Sudovi</span>
            </Link>
          </div>
        ) : null}

        <Link href="/predmeti" className={linkStyle('/predmeti')} title={isCondensed ? "Predmeti" : ""} onClick={onMobileClose}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
          <span className={textClass}>Predmeti</span>
        </Link>
        <Link href="/financije" className={linkStyle('/financije')} title={isCondensed ? "Financije" : ""} onClick={onMobileClose}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className={textClass}>Financije</span>
        </Link>
        
        {/* ALATI */}
        <button
          type="button"
          onClick={() => setIsToolsOpen((open) => !open)}
          className={`w-full ${linkStyle('/alati')}`}
          title={isCondensed ? "Alati" : ""}
          aria-expanded={isToolsOpen}
          aria-controls="sidebar-tools"
        >
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 01-1.4 0l-2.6-2.6a1 1 0 00-1.4 0l-2.3 2.3a1 1 0 000 1.4l2.6 2.6a1 1 0 010 1.4l-2.6 2.6a1 1 0 000 1.4l2.3 2.3a1 1 0 001.4 0l2.6-2.6a1 1 0 011.4 0l2.6 2.6a1 1 0 001.4 0l2.3-2.3a1 1 0 000-1.4l-2.6-2.6a1 1 0 010-1.4l2.6-2.6a1 1 0 000-1.4l-2.3-2.3a1 1 0 00-1.4 0l-2.6 2.6z"></path></svg>
          <span className={textClass}>Alati</span>
          {!isCondensed ? (
            <svg
              className={`ml-auto h-4 w-4 transition-transform ${isToolsOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          ) : null}
        </button>
        {isToolsOpen && !isCondensed ? (
          <div id="sidebar-tools" className="ml-6 space-y-1">
            <Link href="/alati/kalkulator" className={subLinkStyle('/alati/kalkulator')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01"></path></svg>
              <span>Kalkulator</span>
            </Link>
            <Link href="/alati/statistika" className={subLinkStyle('/alati/statistika')} onClick={onMobileClose}>
              <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M7 16v-4m4 4V8m4 8v-6m4 6v-10" />
              </svg>
              <span>Statistika</span>
            </Link>
          </div>
        ) : null}

        {/* SUSTAV SEKCIJA */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
          <div className={`transition-all duration-300 ${isCondensed ? 'flex justify-center mb-2' : 'mb-2'}`}>
            {isCondensed ? (
               <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
            ) : (
               <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Sustav</p>
            )}
          </div>
          
          <Link href="/postavke" className={linkStyle('/postavke')} title={isCondensed ? "Postavke" : ""} onClick={onMobileClose}>
             <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             <span className={textClass}>Postavke</span>
          </Link>
        </div>

      </nav>

      {/* Footer Sidebar-a */}
      <div className={`p-6 border-t border-gray-100 dark:border-slate-800 ${isCondensed ? 'flex justify-center px-2' : ''}`}>
         {/* GUMB ZA ODJAVU S AKCIJOM */}
         <button 
           onClick={() => logout()} // <--- 2. POZIVANJE AKCIJE
           className={`${linkStyle('/logout')} cursor-pointer`}
           title={isCondensed ? "Odjava" : ""}
         >
           <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           <span className={textClass}>Odjava</span>
         </button>
      </div>
    </aside>
  );
}
