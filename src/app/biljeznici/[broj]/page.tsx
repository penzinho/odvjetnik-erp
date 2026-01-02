import { createClient } from "@/utils/supabase/server";
import PageHeader from "@/components/PageHeader";
import BiljeznikForm from "@/components/BiljeznikForm";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function UrediBiljeznikaPage({ params }: { params: Promise<{ broj: string }> }) {
  const { broj } = await params;
  const brojNum = Number(broj);

  if (!Number.isInteger(brojNum)) {
    return notFound();
  }

  const supabase = await createClient();

  const { data: biljeznik, error } = await supabase
    .from('biljeznici')
    .select('*')
    .eq('public_id', brojNum)
    .single();

  if (error || !biljeznik) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Uredi Bilježnika" subtitle={`Ažuriranje podataka: ${biljeznik.naziv}`} />
      <BiljeznikForm initialData={biljeznik} />
    </div>
  );
}
