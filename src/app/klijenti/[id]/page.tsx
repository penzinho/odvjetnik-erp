import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import KlijentView from './KlijentView';

// Prisiljavamo SSR da podaci budu uvijek svježi
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KlijentDetaljiPage({ params }: PageProps) {
  const { id } = await params;

  // Paralelno dohvaćamo sve podatke o klijentu
  const [klijentRes, predmetiRes, racuniRes] = await Promise.all([
    // 1. Klijent
    supabase.from('klijenti').select('*').eq('id', id).single(),
    
    // 2. Njegovi predmeti (samo osnovno)
    supabase.from('predmeti').select('*').eq('klijent_id', id).order('created_at', { ascending: false }),
    
    // 3. Njegovi računi
    supabase.from('racuni').select('*').eq('klijent_id', id).order('datum_izdavanja', { ascending: false })
  ]);

  // Ako klijent ne postoji, baci 404
  if (klijentRes.error || !klijentRes.data) {
    return notFound();
  }

  return (
    <KlijentView 
      klijent={klijentRes.data}
      predmeti={predmetiRes.data || []}
      racuni={racuniRes.data || []}
    />
  );
}