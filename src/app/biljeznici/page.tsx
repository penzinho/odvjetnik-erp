import { createClient } from "@/utils/supabase/server";

import PageHeader from '@/components/PageHeader';
import BiljezniciTable from './BiljezniciTable';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Plus } from "lucide-react";

export const revalidate = 0;

export default async function BiljezniciPage() {
  const supabase = await createClient();

  const { data: biljeznici } = await supabase
    .from('biljeznici')
    .select('*')
    .order('naziv', { ascending: true });

  return (
    <div>
      <PageHeader
        title="Adresar Javnih Bilježnika"
        subtitle="Pregled i upravljanje svim javnim bilježnicima u sustavu."
        extra={
          <Link href="/biljeznici/novi">
            <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Dodaj Novog Bilježnika
            </Button>
          </Link>
        }
      />

      <BiljezniciTable biljeznici={biljeznici || []} />
    </div>
  );
}
