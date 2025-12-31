import { supabase } from '../../lib/supabase';
import PredmetiTablica from './PredmetiTablica';

// Sprečavanje keširanja da uvijek vidiš nove predmete
export const revalidate = 0;

export default async function PredmetiPage() {
  
  // 1. DOHVAT PREDMETA + NAZIV KLIJENTA (Server Side)
  const { data: predmeti, error } = await supabase
    .from('predmeti')
    .select(`
      *,
      klijenti ( naziv )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Greška pri dohvatu predmeta:", error);
    return <div className="p-8 text-red-500">Greška pri učitavanju predmeta.</div>;
  }

  // 2. PRIKAZ TABLICE
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Predmeti</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Pregled svih aktivnih i arhiviranih spisa.
        </p>
      </div>

      <PredmetiTablica predmeti={predmeti || []} />
    </div>
  );
}
