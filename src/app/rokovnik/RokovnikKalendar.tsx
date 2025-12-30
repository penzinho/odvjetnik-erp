'use client';

import { useState } from 'react';
import Link from 'next/link';

type Rok = {
  id: number;
  datum: string; // "2024-02-15"
  vrijeme: string;
  naslov: string;
  vrsta: string;
  mjesto: string;
  predmeti: { naziv: string } | null;
};

type ViewType = 'mjesec' | 'tjedan' | 'radni_tjedan';

export default function RokovnikKalendar({ rokovi }: { rokovi: Rok[] }) {
  // Stanje pogleda
  const [view, setView] = useState<ViewType>('mjesec');
  
  // Stanje trenutnog datuma (fokus)
  // Postavljamo na 01.02.2024. jer tamo imamo testne podatke, u praksi bi bilo 'new Date()'
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); 

  // --- POMOĆNE FUNKCIJE ZA DATUME ---

  // Vraća početak tjedna (Ponedjeljak) za bilo koji datum
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Ned) - 6 (Sub)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ponedjeljak
    return new Date(d.setDate(diff));
  };

  // Navigacija (Naprijed / Nazad)
  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'mjesec') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else {
      // Za tjedan i radni tjedan pomičemo se za 7 dana
      newDate.setDate(currentDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  // Generiranje dana za prikaz
  const getDaysToDisplay = () => {
    const days = [];
    
    if (view === 'mjesec') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Ned
      const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      // Prazna polja prije prvog u mjesecu
      for (let i = 0; i < startOffset; i++) days.push(null);
      // Dani u mjesecu
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
    } 
    else {
      // Tjedni pogledi
      const startOfWeek = getStartOfWeek(currentDate);
      const daysToShow = view === 'radni_tjedan' ? 5 : 7;
      
      for (let i = 0; i < daysToShow; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push(d);
      }
    }
    return days;
  };

  const daysToDisplay = getDaysToDisplay();

  // Formatiranje naslova (npr. "Veljača 2024" ili "5. Velj - 11. Velj")
  const getHeaderTitle = () => {
    const monthNames = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];
    
    if (view === 'mjesec') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}.`;
    } else {
      const start = getStartOfWeek(currentDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (view === 'radni_tjedan' ? 4 : 6));
      
      // Kratki prikaz ako su u istom mjesecu
      if (start.getMonth() === end.getMonth()) {
         return `${start.getDate()}. - ${end.getDate()}. ${monthNames[start.getMonth()]}`;
      }
      return `${start.getDate()}. ${monthNames[start.getMonth()].slice(0,3)} - ${end.getDate()}. ${monthNames[end.getMonth()].slice(0,3)}`;
    }
  };

  // Pomoćna za formatiranje datuma u string YYYY-MM-DD (kakav je u bazi)
  const formatDateForComparison = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rokovnik</h1>
          <p className="text-slate-500 text-sm">Pregled obaveza i ročišta</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            {/* VIEW SWITCHER */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('mjesec')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${view === 'mjesec' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Mjesec
              </button>
              <button 
                onClick={() => setView('tjedan')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${view === 'tjedan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Tjedan
              </button>
              <button 
                onClick={() => setView('radni_tjedan')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${view === 'radni_tjedan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Radni tjedan
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

            {/* NAVIGACIJA */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                <button onClick={() => navigate(-1)} className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded">&lt;</button>
                <div className="px-4 py-1 text-sm font-bold text-slate-800 min-w-[140px] text-center flex items-center justify-center">
                  {getHeaderTitle()}
                </div>
                <button onClick={() => navigate(1)} className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded">&gt;</button>
            </div>
            
            <Link 
  href="/rokovnik/novi" 
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition text-sm flex items-center justify-center"
>
  + Novi Rok
</Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* GLAVNI PRIKAZ (GRID) */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            
            {/* DANI U TJEDNU (HEADER GRIDA) */}
            <div className={`grid border-b border-gray-100 bg-gray-50 ${view === 'radni_tjedan' ? 'grid-cols-5' : 'grid-cols-7'}`}>
                {['PON', 'UTO', 'SRI', 'ČET', 'PET', 'SUB', 'NED'].slice(0, view === 'radni_tjedan' ? 5 : 7).map(dan => (
                    <div key={dan} className="py-3 text-center text-xs font-bold text-slate-400 tracking-wider">
                        {dan}
                    </div>
                ))}
            </div>

            {/* TIJELO GRIDA */}
            <div className={`grid flex-1 auto-rows-fr bg-white ${view === 'radni_tjedan' ? 'grid-cols-5' : 'grid-cols-7'}`}>
                {daysToDisplay.map((day, index) => {
                    // Prazna polja (samo za mjesečni pregled na početku)
                    if (!day) return <div key={index} className="bg-gray-50/30 border-b border-r border-gray-50"></div>;

                    const dateStr = formatDateForComparison(day);
                    const dailyEvents = rokovi.filter(r => r.datum === dateStr);
                    const isToday = formatDateForComparison(new Date()) === dateStr;

                    return (
                        <div 
                          key={index} 
                          className={`
                            border-b border-r border-gray-50 p-2 relative hover:bg-slate-50 transition group flex flex-col gap-1
                            ${view !== 'mjesec' ? 'min-h-[200px]' : 'min-h-[100px]'} 
                          `}
                        >
                            {/* Datum (Broj) */}
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md' : 'text-slate-500'}`}>
                                    {day.getDate()}
                                </span>
                                {view !== 'mjesec' && index < 5 && (
                                  <span className="text-[10px] text-slate-300 font-medium">08:00 - 18:00</span>
                                )}
                            </div>
                            
                            {/* Lista događaja */}
                            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-full">
                              {dailyEvents.map(ev => (
                                  <div key={ev.id} className={`text-[10px] px-2 py-1.5 rounded border shadow-sm cursor-pointer transition hover:scale-[1.02] ${
                                      ev.vrsta === 'Ročište' 
                                      ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' 
                                      : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                                  }`}>
                                      <div className="flex justify-between items-center mb-0.5">
                                        <span className="font-bold">{ev.vrijeme ? ev.vrijeme.slice(0,5) : ''}</span>
                                        <span className="opacity-70">{ev.vrsta}</span>
                                      </div>
                                      <div className="font-medium leading-tight">{ev.naslov}</div>
                                      {/* U tjednom prikazu vidimo i naziv predmeta */}
                                      {view !== 'mjesec' && (
                                        <div className="mt-1 pt-1 border-t border-black/5 opacity-75 truncate">
                                          {ev.predmeti?.naziv}
                                        </div>
                                      )}
                                  </div>
                              ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* DESNA TRAKA (Ostaje ista) */}
        <div className="hidden xl:flex w-80 flex-col gap-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1">
                <h3 className="font-bold text-slate-800 mb-4">Uskoro</h3>
                <div className="space-y-4">
                     {rokovi.slice(0, 5).map(r => (
                         <div key={r.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0">
                            <div className="flex flex-col items-center bg-gray-50 rounded-lg px-2 py-1 min-w-[50px] border border-gray-100">
                                <span className="text-xs font-bold text-slate-400">{r.datum.split('-')[1]}</span>
                                <span className="text-xl font-bold text-slate-800">{r.datum.split('-')[2]}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{r.naslov}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.vrsta === 'Ročište' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {r.vrsta}
                                </span>
                            </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}