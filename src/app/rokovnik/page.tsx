import { supabase } from '../../lib/supabase';
import RokovnikKalendar from './RokovnikKalendar';

export const revalidate = 0; // Osigurava da uvijek dohvatimo svježe podatke (a ne keširane)

export default async function RokovnikPage() {
  
  // 1. Dohvati sve rokove iz baze
  // .select('*, predmeti(naziv)') -> Ovo je JOIN, dohvaćamo i naziv predmeta
  const { data: rokovi, error } = await supabase
    .from('rokovnik')
    .select('*, predmeti ( naziv )') 
    .order('datum', { ascending: true });

  if (error) {
    console.error("Greška kod dohvata rokovnika:", error);
    return <div>Greška pri učitavanju kalendara.</div>;
  }

  // 2. Proslijedi podatke klijentskoj komponenti
  return (
    <RokovnikKalendar rokovi={rokovi || []} />
  );
}