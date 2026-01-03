import { createClient } from "@/utils/supabase/server"; 

import PageHeader from '@/components/PageHeader';
import SudoviTable from './SudoviTable';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Plus } from "lucide-react";

// Ovo osigurava da se stranica uvijek ponovno učita (ne kešira se)
export const revalidate = 0;

export default async function SudoviPage() {
  // 1. Kreiramo klijent koji zna tko je trenutni korisnik (čita cookies)
  const supabase = await createClient();

  // 2. Dohvaćamo podatke
  const { data: sudovi } = await supabase
    .from('sudovi')
    .select('*')
    .order('naziv', { ascending: true });

  return (
    <div>
      <PageHeader 
        title="Adresar Sudova" 
        subtitle="Pregled i upravljanje svim sudovima u sustavu."
        extra={
            <Link href="/sudovi/novi">
                <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Dodaj Novi Sud
                </Button>
            </Link>
        }
      />
      
      {/* 3. Šaljemo podatke u tablicu */}
      <SudoviTable sudovi={sudovi || []} />
    </div>
  );
}