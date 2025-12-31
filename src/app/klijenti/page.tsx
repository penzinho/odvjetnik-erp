import { supabase } from '../../lib/supabase';
import KlijentiTablica from './KlijentiTablica';

// Osiguravamo da su podaci svježi (ako želiš da se ne kešira agresivno)
export const revalidate = 0;

export default async function KlijentiPage() {
  
  // 1. DOHVAT SVIH KLIJENATA (Server Side)
  const { data: klijenti, error } = await supabase
    .from('klijenti')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Greška pri dohvatu klijenata:", error);
    return <div className="p-8 text-red-500">Greška pri učitavanju klijenata.</div>;
  }

  // 2. PRIKAZ TABLICE
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Klijenti</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upravljanje bazom fizičkih i pravnih osoba.
        </p>
      </div>

      <KlijentiTablica klijenti={klijenti || []} />
    </div>
  );
}
