'use client';

import { useState } from 'react'; // <--- DODANO
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { EventDialog } from "./EventDialog"; // <--- DODANO

export function TodayTasks({ tasks }: { tasks: any[] }) {
  // Stanje za odabrani zadatak
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  return (
    <>
      <Card className="h-full border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Dospijeva Danas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Sve čisto! Nema rokova za danas.</p>
             </div>
          ) : (
             <div className="space-y-3">
               {tasks.map((task) => (
                 <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)} // <--- KLIK OTVARA POPUP
                    className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 p-2 rounded transition-colors"
                 >
                    <div className="mt-1">
                      <div className="w-4 h-4 rounded-full border-2 border-orange-200" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{task.naslov}</p>
                      <p className="text-xs text-slate-500">
                        {task.vrijeme.slice(0,5)} • {task.predmeti?.naziv || 'Opće'}
                      </p>
                    </div>
                 </div>
               ))}
             </div>
          )}
        </CardContent>
      </Card>

      {/* POPUP MODAL */}
      <EventDialog 
        event={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </>
  );
}