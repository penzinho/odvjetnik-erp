'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function DashboardCalendar({ events }: { events: any[] }) {
  // Pomoćna funkcija za datume
  const getLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    if (dateStr === today) return "Danas";
    if (dateStr === tomorrow) return "Sutra";
    
    // Formatiranje datuma (npr. 15.02.)
    const d = new Date(dateStr);
    return `${d.getDate()}.${d.getMonth() + 1}.`;
  };

  // Grupiraj događaje po datumima
  const groupedEvents: Record<string, any[]> = {};
  
  // Inicijaliziraj iduća 4 dana
  for(let i=0; i<4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split('T')[0];
    groupedEvents[key] = [];
  }

  // Popuni događajima
  events.forEach(ev => {
    if (groupedEvents[ev.datum]) {
      groupedEvents[ev.datum].push(ev);
    }
  });

  return (
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
             {/* Točkica na timelineu */}
             <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${date === new Date().toISOString().split('T')[0] ? 'bg-blue-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
             
             <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">{getLabel(date)}</h4>
             
             {groupedEvents[date].length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nema obaveza</p>
             ) : (
                <div className="space-y-2">
                  {groupedEvents[date].map((ev: any) => (
                    <Link href="/rokovnik" key={ev.id} className="block">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-300 transition-colors group cursor-pointer">
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
                    </Link>
                  ))}
                </div>
             )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}