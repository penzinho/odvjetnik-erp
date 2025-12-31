'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; // Dodali smo useState

export default function Sidebar() {
  const pathname = usePathname();
  // Stanje za praćenje je li izbornik skupljen
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Funkcija koja provjerava je li link aktivan
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Prilagođeni stilovi koji se mijenjaju ovisno o isCollapsed
const linkStyle = (path: string) => {
    const activeClass = isActive(path)
      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" // Aktivno u Dark modu
      : "text-slate-500 hover:bg-gray-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"; // Neaktivno u Dark modu
    
    // Ako je skupljeno: centriraj i manji padding. Ako nije: normalan padding.
    const layoutClass = isCollapsed 
      ? "justify-center px-2" 
      : "px-4";

    return `flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 group relative ${activeClass} ${layoutClass}`;
  };

  // Klasa za skrivanje teksta s animacijom
  const textClass = `whitespace-nowrap overflow-hidden transition-all duration-300 ${
    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
  }`;

  return (
    
    
    <aside 
      className={`bg-white flex flex-col border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      
      {/* GUMB ZA SKUPLJANJE (TOGGLE) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-white border border-gray-200 text-slate-400 hover:text-blue-600 rounded-full p-1 shadow-sm z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        )}
      </button>

      {/* Logo */}
      <div className={`h-20 flex items-center border-b border-gray-50 transition-all ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-[40px] w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-100 shadow-md">
            L
          </div>
          <div className={textClass}>
            <h1 className="font-bold text-slate-800 leading-tight">Lex Office</h1>
            <p className="text-xs text-slate-400">Odvjetničko društvo</p>
          </div>
        </div>
      </div>

      {/* Navigacija */}
      <nav className="flex-1 px-3 py-8 space-y-1 overflow-y-auto overflow-x-hidden">
        
        <Link href="/" className={linkStyle('/')} title={isCollapsed ? "Pregled" : ""}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className={textClass}>Pregled</span>
        </Link>
        <Link href="/rokovnik" className={linkStyle('/rokovnik')} title={isCollapsed ? "Rokovnik" : ""}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className={textClass}>Rokovnik</span>
        </Link>
        
        <Link href="/klijenti" className={linkStyle('/klijenti')} title={isCollapsed ? "Klijenti" : ""}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span className={textClass}>Klijenti</span>
        </Link>

        <Link href="/predmeti" className={linkStyle('/predmeti')} title={isCollapsed ? "Predmeti" : ""}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
          <span className={textClass}>Predmeti</span>
        </Link>
        <Link href="/financije" className={linkStyle('/financije')} title={isCollapsed ? "Financije" : ""}>
          <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className={textClass}>Financije</span>
        </Link>

        {/* SUSTAV SEKCIJA */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          {/* Ako je skupljeno, prikaži točkicu umjesto teksta, ili sakrij */}
          <div className={`transition-all duration-300 ${isCollapsed ? 'flex justify-center mb-2' : 'mb-2'}`}>
            {isCollapsed ? (
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            ) : (
               <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Sustav</p>
            )}
          </div>
          
          <Link href="/adresar" className={linkStyle('/adresar')} title={isCollapsed ? "Adresar" : ""}>
            <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span className={textClass}>Adresar</span>
          </Link>
          
          <Link href="/postavke" className={linkStyle('/postavke')} title={isCollapsed ? "Postavke" : ""}>
             <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             <span className={textClass}>Postavke</span>
          </Link>
        </div>

      </nav>

      {/* Footer Sidebar-a */}
      <div className={`p-6 border-t border-gray-100 ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
         <button className={`flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors ${isCollapsed ? 'justify-center w-full' : ''}`} title={isCollapsed ? "Odjava" : ""}>
           <svg className="w-4 h-4 min-w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           <span className={textClass}>Odjava</span>
         </button>
      </div>
    </aside>
  );
}