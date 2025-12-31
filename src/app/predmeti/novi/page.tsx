'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NoviPredmetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // PODACI IZ BAZE
  const [klijenti, setKlijenti] = useState<any[]>([]);

  // STANJA FORME
  const [selectedKlijentId, setSelectedKlijentId] = useState("");
  const [klijentNaziv, setKlijentNaziv] = useState("");
  const [sljedeciBroj, setSljedeciBroj] = useState<number | null>(null); // Npr. 2
  
  const [protustranka, setProtustranka] = useState("");
  const [vrsta, setVrsta] = useState("Parnični postupak");
  const [vps, setVps] = useState("");
  const [sud, setSud] = useState("");
  const [poslovniBroj, setPoslovniBroj] = useState("");
  const [voditelj, setVoditelj] = useState("");

  // 1. DOHVATI KLIJENTE NA POČETKU
  useEffect(() => {
    async function fetchKlijenti() {
      const { data } = await supabase
        .from('klijenti')
        .select('id, naziv')
        .order('naziv');
      setKlijenti(data || []);
    }
    fetchKlijenti();
  }, []);

  // 2. MAGIJA: KAD ODABEREŠ KLIJENTA, IZRAČUNAJ SLJEDEĆI BROJ
  const handleKlijentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedKlijentId(id);
    setSljedeciBroj(null); // Resetiraj dok računamo

    if (!id) {
      setKlijentNaziv("");
      return;
    }

    // Nađi naziv klijenta za prikaz
    const klijent = klijenti.find(k => k.id.toString() === id);
    if (klijent) setKlijentNaziv(klijent.naziv);

    // Upit u bazu: Koji je zadnji broj spisa za ovog klijenta?
    const { data } = await supabase
      .from('predmeti')
      .select('broj_spisa')
      .eq('klijent_id', id)
      .order('broj_spisa', { ascending: false })
      .limit(1);

    // Ako ima predmeta, uzmi zadnji + 1. Ako nema, kreni od 1.
    if (data && data.length > 0) {
      setSljedeciBroj(data[0].broj_spisa + 1);
    } else {
      setSljedeciBroj(1);
    }
  };

  // Automatski generirani naziv
  const nazivPredmeta = (klijentNaziv && protustranka) 
    ? `${klijentNaziv} c/a ${protustranka}` 
    : "Odaberite klijenta i unesite protustranku...";

  // Prikaz punog broja spisa (npr. 1-2)
  const puniBrojSpisa = (selectedKlijentId && sljedeciBroj) 
    ? `${selectedKlijentId}-${sljedeciBroj}` 
    : "---";

  // 3. SPREMANJE U BAZU
  const handleSpremi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKlijentId || !sljedeciBroj) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('predmeti')
        .insert([
          {
            klijent_id: parseInt(selectedKlijentId),
            broj_spisa: sljedeciBroj,
            protustranka: protustranka,
            naziv: nazivPredmeta,
            vrsta: vrsta,
            sud: sud,
            poslovni_broj: poslovniBroj,
            vps: vps,
            voditelj: voditelj,
            status: 'Aktivan'
          }
        ]);

      if (error) throw error;

      router.push('/predmeti'); // Vrati na listu
    } catch (err: any) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Otvaranje Novog Spisa</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Unesite osnovne podatke. Broj i naziv se generiraju automatski.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        
        {/* PREVIEW TRAKA */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800 p-6 flex items-center gap-6">
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Broj spisa</span>
              <span className="text-2xl font-mono font-bold text-blue-600">
                {puniBrojSpisa}
              </span>
           </div>
           <div className="h-10 w-px bg-gray-300 dark:bg-slate-700"></div>
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Naziv predmeta (Auto)</span>
              <span className={`text-lg font-medium ${klijentNaziv && protustranka ? 'text-slate-800 dark:text-slate-100' : 'text-gray-400 dark:text-slate-500 italic'}`}>
                {nazivPredmeta}
              </span>
           </div>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSpremi}>
          
          {/* 1. STRANKE */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">1</span>
              Stranke
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Zastupamo (Klijent) *</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer font-medium text-slate-700 dark:text-slate-200"
                  onChange={handleKlijentChange}
                  value={selectedKlijentId}
                >
                  <option value="">Odaberite klijenta...</option>
                  {klijenti.map(k => (
                    <option key={k.id} value={k.id}>{k.naziv} (#{k.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Protivna strana *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:border-blue-500 outline-none transition text-slate-800 dark:text-slate-100"
                  placeholder="npr. Croatia Osiguranje"
                  value={protustranka}
                  onChange={(e) => setProtustranka(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-50 dark:border-slate-800" />

          {/* 2. DETALJI */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">2</span>
              Detalji predmeta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Vrsta predmeta</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700 dark:text-slate-200"
                  value={vrsta}
                  onChange={(e) => setVrsta(e.target.value)}
                >
                  <option>Parnični postupak</option>
                  <option>Ovršni postupak</option>
                  <option>Izvanparnični postupak</option>
                  <option>Kazneni postupak</option>
                  <option>Upravni spor</option>
                  <option>Zemljišnoknjižni predmet</option>
                  <option>Ostalo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">VPS</label>
                <input type="text" value={vps} onChange={e => setVps(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none transition text-slate-800 dark:text-slate-100" placeholder="npr. 10.000,00 EUR" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nadležno tijelo / Sud</label>
                <input type="text" value={sud} onChange={e => setSud(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none transition text-slate-800 dark:text-slate-100" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Poslovni broj</label>
                <input type="text" value={poslovniBroj} onChange={e => setPoslovniBroj(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none transition text-slate-800 dark:text-slate-100" placeholder="npr. P-1234/2024" />
              </div>
            </div>
          </div>

          <hr className="border-gray-50 dark:border-slate-800" />

           {/* 3. ZADUŽENJE */}
           <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">3</span>
              Zaduženje
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nositelj spisa</label>
                <input type="text" value={voditelj} onChange={e => setVoditelj(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none transition text-slate-800 dark:text-slate-100" placeholder="Ime odvjetnika" />
              </div>
            </div>
           </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50 dark:border-slate-800">
            <Link href="/predmeti" className="px-6 py-3 text-slate-600 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition">
              Odustani
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 rounded-xl transition flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Spremanje...' : 'Otvori Spis'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
