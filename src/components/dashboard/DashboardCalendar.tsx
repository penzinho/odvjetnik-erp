'use client';

import { useState } from 'react'; // <--- 1. NOVI IMPORT
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
// Maknuli smo Link jer nam više ne treba za navigaciju
import { EventDialog } from "./EventDialog"; // <--- 2. IMPORT DIJALOGA

// Pazi: Maknuli smo 'default' da se slaže s importom u page.tsx
export function DashboardCalendar({ events }: { events: any[] }) {
  
  // 3. STANJE ZA MODAL
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Pomoćna funkcija za datume
  const getLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    if (dateStr === today) return "Danas";
    if (dateStr === tomorrow) return "Sutra";
    
    const d = new Date(dateStr);
    return `${d.getDate()}.${d.getMonth() + 1}.`;
  };

  const groupedEvents: Record<string, any[]> = {};
  
  for(let i=0; i<4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split('T')[0];
    groupedEvents[key] = [];
  }

  events.forEach(ev => {
    if (groupedEvents[ev.datum]) {
      groupedEvents[ev.datum].push(ev);
    }
  });

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Agenda (4 dana)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.keys(groupedEvents).map((date) => (
            <div key={date} className="relative pl-6 border-l border-gray-100 dark:border-slate-800">
               <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${date === new Date().toISOString().split('T')[0] ? 'bg-blue-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
               
               <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">{getLabel(date)}</h4>
               
               {groupedEvents[date].length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nema obaveza</p>
               ) : (
                  <div className="space-y-2">
                    {groupedEvents[date].map((ev: any) => (
                      // 4. ZAMIJENJENO: Umjesto Link-a, koristimo div s onClick
                      <div 
                        key={ev.id} 
                        onClick={() => setSelectedEvent(ev)} // <--- KLIK OTVARA POPUP
                        className="block cursor-pointer" // Dodali smo cursor-pointer
                      >
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors group">
                          <div className="flex justify-between items-start">
                             <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600">{ev.naslov}</span>
                             <Badge variant="outline" className={`text-[10px] h-5 px-1 ${ev.vrsta === 'Ročište' ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                                {ev.vrsta}
                             </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ev.vrijeme.slice(0,5)}</span>
                             {ev.predmeti && <span className="truncate max-w-[120px]">• {ev.predmeti.naziv}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. POZIV DIJALOGA NA DNU */}
      <EventDialog 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </>
  );
}