import { createClient } from "@/utils/supabase/server"; 
import PageHeader from "@/components/PageHeader";
import SudForm from "@/components/SudForm";
import { notFound } from "next/navigation";

export const revalidate = 0;

// Pazi: params sada očekuje 'broj', a ne 'id' jer smo preimenovali mapu
export default async function UrediSudPage({ params }: { params: Promise<{ broj: string }> }) {
  const { broj } = await params;
  const brojNum = Number(broj);

  if (!Number.isInteger(brojNum)) {
    return notFound();
  }

  const supabase = await createClient();

  // 1. TRAŽIMO PREMA NOVOM KRATKOM BROJU (public_id)
  const { data: sud, error } = await supabase
    .from('sudovi')
    .select('*')
    .eq('public_id', brojNum) // <--- OVDJE JE PROMJENA
    .single();

  if (error || !sud) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Uredi Sud" subtitle={`Ažuriranje podataka: ${sud.naziv}`} />
      
      {/* Formi šaljemo cijeli objekt 'sud'. 
          Forma je pametna i uzet će 'sud.id' (onaj pravi UUID) i staviti ga u skriveno polje.
          Tako da ne moramo mijenjati actions.ts! */}
      <SudForm initialData={sud} />
    </div>
  );
}
