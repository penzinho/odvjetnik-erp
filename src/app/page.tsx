import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader'; 
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { TodayTasks } from '@/components/dashboard/TodayTasks';
import RecentCases from '@/components/dashboard/RecentCases';
import StatsCard from '@/components/dashboard/StatsCard';

export const revalidate = 0; 

export default async function DashboardPage() {
  
  // --- LOGIKA ZA DOHVAT PODATAKA (Ostaje ista) ---
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const future = new Date();
  future.setDate(today.getDate() + 4); 
  const futureStr = future.toISOString().split('T')[0];

  const [rokoviRes, predmetiRes] = await Promise.all([
    supabase
      .from('rokovnik')
      .select('*, predmeti(naziv)')
      .gte('datum', todayStr)
      .lte('datum', futureStr)
      .order('datum', { ascending: true })
      .order('vrijeme', { ascending: true }),

    supabase
      .from('predmeti')
      .select('*, klijenti(naziv)')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const sviRokovi = rokoviRes.data || [];
  const zadnjiPredmeti = predmetiRes.data || [];
  const zadaciDanas = sviRokovi.filter(r => r.datum === todayStr);
  // ------------------------------------------------

  return (
    <div>
      {/* 2. OVDJE KORISTIMO PageHeader */}
      {/* On već ima ugrađene margine (mb-8), pa ne trebamo dodatne razmake */}
      <PageHeader 
        title="Pregled" 
        subtitle="Dobrodošli u Lex Office. Evo što je aktualno."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIJEVI STUPAC (2/3 širine) */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              <DashboardCalendar events={sviRokovi} />
              <TodayTasks tasks={zadaciDanas} />
           </div>

           <div className="h-auto">
              <RecentCases cases={zadnjiPredmeti} />
           </div>
        </div>

        {/* DESNI STUPAC (1/3 širine) - Statistika */}
        <div className="lg:col-span-1 h-full">
           <StatsCard />
        </div>

      </div>
    </div>
  );
}
