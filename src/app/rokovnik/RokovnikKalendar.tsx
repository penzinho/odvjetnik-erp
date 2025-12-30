'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  addWeeks, 
  subMonths, 
  subWeeks,
  isToday
} from 'date-fns';
import { hr } from 'date-fns/locale'; // Hrvatski jezik za datume

// Shadcn komponente
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Rok = {
  id: number;
  datum: string;
  vrijeme: string;
  naslov: string;
  vrsta: string;
  mjesto: string;
  predmeti: { naziv: string } | null;
};

type ViewType = 'mjesec' | 'tjedan' | 'radni_tjedan';

export default function RokovnikKalendar({ rokovi }: { rokovi: Rok[] }) {
  const [view, setView] = useState<ViewType>('mjesec');
  // Postavljamo datum na veljaču 2024 jer su tamo testni podaci
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1));

  // --- LOGIKA DATUMA (date-fns) ---
  
  const navigate = (direction: number) => {
    if (view === 'mjesec') {
      setCurrentDate(prev => direction > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    } else {
      setCurrentDate(prev => direction > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1));
    }
  };

  const getDaysToDisplay = () => {
    let start, end;

    if (view === 'mjesec') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      // Ponedjeljak kao početak tjedna
      start = startOfWeek(monthStart, { weekStartsOn: 1 });
      end = endOfWeek(monthEnd, { weekStartsOn: 1 });
    } else {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    }

    const days = eachDayOfInterval({ start, end });

    // Ako je radni tjedan, filtriraj vikende (subota=6, nedjelja=0)
    if (view === 'radni_tjedan') {
      return days.filter(d => d.getDay() !== 0 && d.getDay() !== 6);
    }
    return days;
  };

  const daysToDisplay = getDaysToDisplay();

  // Naslov headera (npr. "Veljača 2024")
  const headerTitle = format(currentDate, 'MMMM yyyy', { locale: hr });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rokovnik</h1>
          <p className="text-slate-500 text-sm">Pregled obaveza i ročišta</p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Odabir pogleda */}
            <Select value={view} onValueChange={(v: any) => setView(v)}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Pogled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mjesec">Mjesec</SelectItem>
                <SelectItem value="tjedan">Tjedan</SelectItem>
                <SelectItem value="radni_tjedan">Radni tjedan</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigacija */}
            <div className="flex items-center border rounded-md bg-white shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
                  &lt;
                </Button>
                <div className="px-4 text-sm font-semibold capitalize min-w-[140px] text-center">
                  {headerTitle}
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate(1)} className="h-9 w-9">
                  &gt;
                </Button>
            </div>
            
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
               <Link href="/rokovnik/novi">
                 + Novi Rok
               </Link>
            </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* --- GLAVNI KALENDAR --- */}
        <Card className="flex-1 flex flex-col overflow-hidden border-gray-200 shadow-sm">
            
            {/* DANI HEADER */}
            <div className={`grid border-b bg-slate-50 ${view === 'radni_tjedan' ? 'grid-cols-5' : 'grid-cols-7'}`}>
                {daysToDisplay.slice(0, view === 'radni_tjedan' ? 5 : 7).map((day, i) => (
                    <div key={i} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {format(day, 'EEE', { locale: hr })}
                    </div>
                ))}
            </div>

            {/* MREŽA DANA */}
            <div className={`grid flex-1 auto-rows-fr bg-white ${view === 'radni_tjedan' ? 'grid-cols-5' : 'grid-cols-7'}`}>
                {daysToDisplay.map((day, index) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dailyEvents = rokovi.filter(r => r.datum === dateStr);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);

                    return (
                        <div 
                          key={index} 
                          className={`
                            border-b border-r p-2 relative transition group flex flex-col gap-1.5
                            ${!isCurrentMonth && view === 'mjesec' ? 'bg-slate-50/50 text-slate-400' : 'bg-white'}
                            hover:bg-slate-50
                          `}
                        >
                            {/* Broj dana */}
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700'}`}>
                                    {format(day, 'd')}
                                </span>
                            </div>
                            
                            {/* Događaji (Chipovi) */}
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-full">
                              {dailyEvents.map(ev => (
                                  <Badge 
                                    key={ev.id} 
                                    variant="outline" 
                                    className={`
                                      justify-start font-normal text-[10px] px-1.5 py-1 cursor-pointer truncate border
                                      ${ev.vrsta === 'Ročište' 
                                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300' 
                                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'}
                                    `}
                                  >
                                      <span className="font-bold mr-1.5">{ev.vrijeme?.slice(0,5)}</span>
                                      <span className="truncate">{ev.naslov}</span>
                                  </Badge>
                              ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>

        {/* --- DESNA TRAKA (USKORO) --- */}
        <div className="hidden xl:flex w-80 flex-col gap-4">
            <Card className="flex-1 border-gray-200 shadow-sm flex flex-col overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-100 bg-slate-50/50">
                    <CardTitle className="text-base font-bold text-slate-800">Nadolazeće</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto flex-1">
                   {rokovi.length === 0 ? (
                       <div className="p-6 text-center text-sm text-slate-400">Nema upisanih rokova.</div>
                   ) : (
                       <div className="divide-y divide-gray-100">
                         {rokovi.slice(0, 10).map(r => ( // Prikazujemo prvih 10
                             <div key={r.id} className="p-4 hover:bg-slate-50 transition cursor-pointer group">
                                <div className="flex gap-3 items-start">
                                    <div className="flex flex-col items-center bg-white rounded-lg px-2 py-1 min-w-[50px] border border-gray-200 shadow-sm group-hover:border-blue-300 transition">
                                        <span className="text-xs font-bold text-slate-400 uppercase">{format(new Date(r.datum), 'MMM', { locale: hr })}</span>
                                        <span className="text-lg font-bold text-slate-800">{format(new Date(r.datum), 'dd')}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700">{r.naslov}</p>
                                        <p className="text-xs text-slate-500 truncate mb-1.5">{r.predmeti?.naziv || 'Opće'}</p>
                                        <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${r.vrsta === 'Ročište' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-blue-50 text-blue-700 hover:bg-blue-50'}`}>
                                            {r.vrsta} • {r.vrijeme?.slice(0,5)}
                                        </Badge>
                                    </div>
                                </div>
                             </div>
                         ))}
                       </div>
                   )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}