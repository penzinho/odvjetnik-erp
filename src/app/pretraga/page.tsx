import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, FileText, ArrowRight, MapPin } from "lucide-react";

export default async function PretragaPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  const query = q || '';

  if (!query) return <div className="p-12 text-center text-slate-500">Unesite pojam za pretragu.</div>;

  const [klijentiRes, predmetiRes, racuniPoBrojuRes, racuniPoKlijentuRes] = await Promise.all([
    supabase
      .from('klijenti')
      .select('*')
      .or(`naziv.ilike.%${query}%,oib.ilike.%${query}%,adresa.ilike.%${query}%`),
      
    supabase.from('predmeti').select('*, klijenti(naziv)').ilike('naziv', `%${query}%`),

    supabase
      .from('racuni')
      .select('*, klijenti(naziv)')
      .ilike('broj_racuna', `%${query}%`),

    supabase
      .from('racuni')
      .select('*, klijenti!inner(naziv)')
      .ilike('klijenti.naziv', `%${query}%`)
  ]);

  const klijenti = klijentiRes.data || [];
  const predmeti = predmetiRes.data || [];
  
  const sviRacuni = [...(racuniPoBrojuRes.data || []), ...(racuniPoKlijentuRes.data || [])];
  const racuni = Array.from(new Map(sviRacuni.map(item => [item.id, item])).values());

  const totalResults = klijenti.length + predmeti.length + racuni.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Rezultati za: <span className="text-blue-600">"{query}"</span>
        </h1>
        <p className="text-slate-500 mt-1">Pronađeno ukupno {totalResults} zapisa.</p>
      </div>

      {/* KLIJENTI */}
      {klijenti.length > 0 && (
        <section className="space-y-4">
           <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-gray-200 dark:border-slate-800">
              <User className="h-5 w-5 text-blue-500" /> Klijenti ({klijenti.length})
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {klijenti.map((k: any) => (
               // LINK NA DETALJE KLIJENTA
               <Link href={`/klijenti/${k.id}`} key={k.id}>
                   <Card className="group hover:border-blue-500 transition-colors dark:bg-slate-900 dark:border-slate-800 cursor-pointer">
                     <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 text-lg">
                                {k.naziv}
                            </div>
                            {k.status && (
                                 <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-300 dark:border-slate-700">{k.status}</Badge>
                            )}
                        </div>
                        
                        <div className="text-sm text-slate-500 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 rounded text-slate-600 dark:text-slate-400 text-xs">OIB: {k.oib || '-'}</span>
                            </div>
                            {k.adresa && (
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="h-3 w-3" /> 
                                    {k.adresa}, {k.grad}
                                </div>
                            )}
                        </div>
                     </CardContent>
                   </Card>
               </Link>
             ))}
           </div>
        </section>
      )}

      {/* PREDMETI */}
      {predmeti.length > 0 && (
        <section className="space-y-4">
           <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-gray-200 dark:border-slate-800">
              <Briefcase className="h-5 w-5 text-purple-500" /> Predmeti ({predmeti.length})
           </h2>
           <div className="grid grid-cols-1 gap-3">
             {predmeti.map((p: any) => (
               // LINK NA DETALJE PREDMETA
               <Link href={`/predmeti/${p.id}`} key={p.id}>
                  <Card className="group hover:border-purple-500 transition-colors dark:bg-slate-900 dark:border-slate-800 cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <Badge variant="secondary" className="font-mono bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                  {p.klijent_id}-{p.broj_spisa}
                              </Badge>
                              <div>
                                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600">{p.naziv}</div>
                                  <div className="text-sm text-slate-500">Klijent: {p.klijenti?.naziv}</div>
                              </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600" />
                      </CardContent>
                  </Card>
               </Link>
             ))}
           </div>
        </section>
      )}

      {/* RAČUNI */}
      {racuni.length > 0 && (
        <section className="space-y-4">
           <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-gray-200 dark:border-slate-800">
              <FileText className="h-5 w-5 text-green-500" /> Računi ({racuni.length})
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {racuni.map((r: any) => (
                 // LINK NA DETALJE RAČUNA
                 <Link href={`/financije/racuni/${r.id}`} key={r.id}>
                     <Card className="hover:border-green-400 transition-colors cursor-pointer group dark:bg-slate-900 dark:border-slate-800">
                       <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{r.broj_racuna}</Badge>
                            <span className={`text-xs font-bold ${r.status === 'Plaćeno' ? 'text-green-600' : 'text-slate-500'}`}>{r.status}</span>
                          </div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-green-600">
                            {r.klijenti?.naziv}
                          </div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                            {Number(r.iznos_ukupno).toFixed(2)} €
                          </div>
                       </CardContent>
                     </Card>
                 </Link>
               ))}
           </div>
        </section>
      )}

      {totalResults === 0 && (
          <div className="py-12 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
              <p className="text-slate-500">Nema rezultata.</p>
          </div>
      )}
    </div>
  );
}