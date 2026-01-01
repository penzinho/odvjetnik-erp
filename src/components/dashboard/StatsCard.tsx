'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText } from "lucide-react";

export default function StatsCard() {
  return (
    <Card className="h-full bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <TrendingUp className="h-5 w-5" />
          Statistika (Ovaj mjesec)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg dark:bg-white/10">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Novih klijenata</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
          <div className="text-emerald-600 text-xs font-bold dark:text-emerald-400">+20%</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg dark:bg-white/10">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Izdano računa</p>
              <p className="text-xl font-bold">3.450 €</p>
            </div>
          </div>
          <div className="text-emerald-600 text-xs font-bold dark:text-emerald-400">+5%</div>
        </div>

        {/* Placeholder graf */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-end gap-1 h-16">
            <div className="w-1/6 bg-blue-600/20 h-1/3 rounded-t dark:bg-blue-500/30"></div>
            <div className="w-1/6 bg-blue-600/35 h-2/3 rounded-t dark:bg-blue-500/50"></div>
            <div className="w-1/6 bg-blue-600/25 h-1/2 rounded-t dark:bg-blue-500/40"></div>
            <div className="w-1/6 bg-blue-600/70 h-3/4 rounded-t dark:bg-blue-500/80"></div>
            <div className="w-1/6 bg-blue-600/45 h-1/2 rounded-t dark:bg-blue-500/60"></div>
            <div className="w-1/6 bg-blue-600 h-full rounded-t dark:bg-blue-500"></div>
          </div>
          <p className="text-[10px] text-center text-slate-500 mt-2 dark:text-slate-500">Aktivnost po danima</p>
        </div>
      </CardContent>
    </Card>
  );
}
