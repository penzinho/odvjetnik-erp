'use client';

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Laptop } from "lucide-react"; // Ikone

export default function PostavkePage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Postavke</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Prilagodite izgled i ponašanje aplikacije.
        </p>
      </div>

      {/* IZGLED APLIKACIJE */}
      <Card>
        <CardHeader>
          <CardTitle>Izgled aplikacije</CardTitle>
          <CardDescription>
            Odaberite temu sučelja koja vam najviše odgovara.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* SVIJETLO */}
            <div 
              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${theme === 'light' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-800'}`}
              onClick={() => setTheme("light")}
            >
              <div className="p-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-full shadow-sm">
                <Sun className="w-6 h-6 text-orange-500" />
              </div>
              <span className="font-medium text-sm">Svijetlo</span>
            </div>

            {/* TAMNO */}
            <div 
              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${theme === 'dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-800'}`}
              onClick={() => setTheme("dark")}
            >
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-full shadow-sm">
                <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-medium text-sm">Tamno</span>
            </div>

            {/* SUSTAV */}
            <div 
              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${theme === 'system' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-800'}`}
              onClick={() => setTheme("system")}
            >
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm">
                <Laptop className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="font-medium text-sm">Isto kao sustav</span>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}