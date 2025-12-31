import { supabase } from '../../../lib/supabase';
import PredmetSucelje from './PredmetSucelje'; // Uvozimo klijentsku komponentu
import Link from 'next/link';

// Ova stranica je sada Server Component (po defaultu)
export default async function DetaljiPredmetaPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Pričekaj parametre (ID predmeta)
  const { id } = await params;

  // 2. Dohvati PREDMET (na serveru, super brzo)
  const { data: predmet, error } = await supabase
    .from('predmeti')
    .select('*, klijenti ( naziv, oib, telefon )')
    .eq('id', id)
    .single();

  if (error || !predmet) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Predmet nije pronađen</h2>
        <Link href="/predmeti" className="text-blue-600 hover:underline mt-4 block">
          &larr; Natrag na popis
        </Link>
      </div>
    );
  }

  // 3. Dohvati ROKOVNIK (paralelno bi bilo bolje, ali ovo je dovoljno brzo)
  const { data: rokovnik } = await supabase
    .from('rokovnik')
    .select('*')
    .eq('predmet_id', id)
    .order('datum', { ascending: true });

  // 4. Dohvati ZADATKE
  const { data: zadaci } = await supabase
    .from('zadaci')
    .select('*')
    .eq('predmet_id', id)
    .order('id', { ascending: false });

  // 5. Pošalji podatke Klijentskoj komponenti da ih prikaže
  return (
    <PredmetSucelje 
      predmet={predmet} 
      pocetniRokovnik={rokovnik || []} 
      pocetniZadaci={zadaci || []} 
    />
  );
}
