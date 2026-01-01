'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input";
import { Search, User, Briefcase, FileText, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SearchResult = {
  id: number;
  type: 'klijent' | 'predmet' | 'racun';
  title: string;
  subtitle: string;
  link: string;
};

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setIsOpen(true);

      const [klijentiRes, predmetiRes, racuniPoBrojuRes, racuniPoKlijentuRes] = await Promise.all([
        supabase
          .from('klijenti')
          .select('id, naziv, oib, adresa')
          .or(`naziv.ilike.%${query}%,oib.ilike.%${query}%,adresa.ilike.%${query}%`)
          .limit(3),
        
        supabase.from('predmeti').select('id, naziv, broj_spisa, klijent_id').ilike('naziv', `%${query}%`).limit(3),
        
        supabase.from('racuni').select('id, broj_racuna, klijenti(naziv)').ilike('broj_racuna', `%${query}%`).limit(3),

        supabase.from('racuni').select('id, broj_racuna, klijenti!inner(naziv)').ilike('klijenti.naziv', `%${query}%`).limit(3),
      ]);

      const noviRezultati: SearchResult[] = [];

      // --- 1. KLIJENTI ---
      klijentiRes.data?.forEach((k: any) => {
        let subtitle = '';
        if (k.oib && k.oib.includes(query)) subtitle = `OIB: ${k.oib}`;
        else if (k.adresa && k.adresa.toLowerCase().includes(query.toLowerCase())) subtitle = k.adresa;
        else subtitle = k.oib ? `OIB: ${k.oib}` : 'Nema OIB';

        noviRezultati.push({
          id: k.id,
          type: 'klijent',
          title: k.naziv,
          subtitle: subtitle,
          // LINK NA DETALJE KLIJENTA
          link: `/klijenti/${k.id}` 
        });
      });

      // --- 2. PREDMETI ---
      predmetiRes.data?.forEach((p: any) => {
        noviRezultati.push({
          id: p.id,
          type: 'predmet',
          title: p.naziv,
          subtitle: `Spis: ${p.klijent_id}-${p.broj_spisa}`,
          // LINK NA DETALJE PREDMETA
          link: `/predmeti/${p.id}`
        });
      });

      // --- 3. RAČUNI ---
      const sviRacuni = [...(racuniPoBrojuRes.data || []), ...(racuniPoKlijentuRes.data || [])];
      const jedinstveniRacuni = Array.from(new Map(sviRacuni.map(item => [item.id, item])).values()).slice(0, 3);

      jedinstveniRacuni.forEach((r: any) => {
        const klijentNaziv = r.klijenti?.naziv || '';
        const matchFoundInClient = klijentNaziv.toLowerCase().includes(query.toLowerCase());

        noviRezultati.push({
          id: r.id,
          type: 'racun',
          title: `Račun #${r.broj_racuna}`,
          subtitle: matchFoundInClient ? `Klijent: ${klijentNaziv}` : klijentNaziv,
          // LINK NA DETALJE RAČUNA (ili financije)
          link: `/financije/racuni/${r.id}`
        });
      });

      setResults(noviRezultati);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      // Samo preusmjeri na stranicu pretrage, ona će sama izlistati rezultate koji su također linkani
      router.push(`/pretraga?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClickResult = (link: string) => {
    // Ovdje se događa navigacija na točan URL iz objekta
    router.push(link);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Pretraži (Ime, OIB, Adresa...)"
          className="pl-10 h-10 bg-slate-100 border-transparent dark:bg-slate-800/50 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(query.length >= 2) setIsOpen(true) }}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="py-2">
            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Predloženo
            </div>
            
            {results.map((res) => (
              <div 
                key={`${res.type}-${res.id}`}
                onClick={() => handleClickResult(res.link)} // <--- KLIK OTVARA DETALJE
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center gap-3 transition-colors group border-l-2 border-transparent hover:border-blue-500"
              >
                <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 shadow-sm
                  ${res.type === 'klijent' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 
                    res.type === 'predmet' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' : 
                    'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'}`}
                >
                  {res.type === 'klijent' && <User className="h-4 w-4" />}
                  {res.type === 'predmet' && <Briefcase className="h-4 w-4" />}
                  {res.type === 'racun' && <FileText className="h-4 w-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600">
                    {res.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                     <Badge variant="secondary" className="text-[9px] h-4 px-1 py-0 rounded text-slate-500 uppercase tracking-wide bg-slate-100 dark:bg-slate-800 border-none">
                        {res.type}
                     </Badge>
                     <p className="text-xs text-slate-400 truncate">
                        {res.subtitle}
                     </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div 
            onClick={() => { setIsOpen(false); router.push(`/pretraga?q=${encodeURIComponent(query)}`) }}
            className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-t border-gray-100 dark:border-slate-800 text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer flex items-center justify-between transition-colors"
          >
            <span>Pritisni <strong>Enter</strong> za sve rezultate</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}