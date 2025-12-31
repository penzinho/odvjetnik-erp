'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NoviRokPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Podaci za dropdown
  const [predmeti, setPredmeti] = useState<any[]>([]);

  // Stanja forme
  const [predmetId, setPredmetId] = useState("");
  const [naslov, setNaslov] = useState("");
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]); // Danas
  const [vrijeme, setVrijeme] = useState("09:00");
  const [vrsta, setVrsta] = useState("Ročište");
  const [mjesto, setMjesto] = useState("");
  const [opis, setOpis] = useState("");

  // Dohvati predmete za povezivanje
  useEffect(() => {
    async function fetchPredmeti() {
      const { data } = await supabase
        .from('predmeti')
        .select('id, naziv, broj_spisa, klijent_id')
        .eq('status', 'Aktivan') // Samo aktivni predmeti
        .order('created_at', { ascending: false });
      setPredmeti(data || []);
    }
    fetchPredmeti();
  }, []);

  const handleSpremi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('rokovnik')
        .insert([
          {
            predmet_id: parseInt(predmetId),
            naslov: naslov,
            datum: datum,
            vrijeme: vrijeme,
            vrsta: vrsta,
            mjesto: mjesto,
            opis: opis,
            obavljeno: false
          }
        ]);

      if (error) throw error;
      
      router.push('/rokovnik'); // Vrati na kalendar
    } catch (err: any) {
      alert('Greška: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Novi unos u rokovnik</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dodajte ročište, sastanak ili rok za podnesak.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden p-8">
        <form className="space-y-6" onSubmit={handleSpremi}>
          
          {/* ODABIR PREDMETA */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Vezani predmet *</label>
            <select 
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer"
              value={predmetId}
              onChange={(e) => setPredmetId(e.target.value)}
            >
              <option value="">Odaberite predmet...</option>
              {predmeti.map(p => (
                <option key={p.id} value={p.id}>
                  {p.naziv} (#{p.klijent_id}-{p.broj_spisa})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NASLOV */}
            <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Naziv radnje *</label>
                <input 
                  required
                  type="text" 
                  placeholder="npr. Glavna rasprava"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:border-blue-500 outline-none transition"
                  value={naslov}
                  onChange={e => setNaslov(e.target.value)}
                />
            </div>

            {/* DATUM I VRIJEME */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Datum *</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:border-blue-500 outline-none transition"
                  value={datum}
                  onChange={e => setDatum(e.target.value)}
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Vrijeme</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:border-blue-500 outline-none transition"
                  value={vrijeme}
                  onChange={e => setVrijeme(e.target.value)}
                />
            </div>

            {/* VRSTA */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Vrsta</label>
                <select 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer"
                  value={vrsta}
                  onChange={e => setVrsta(e.target.value)}
                >
                  <option>Ročište</option>
                  <option>Sastanak</option>
                  <option>Rok za žalbu</option>
                  <option>Podnesak</option>
                  <option>Očevid</option>
                  <option>Ostalo</option>
                </select>
            </div>

            {/* MJESTO */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Mjesto / Sudnica</label>
                <input 
                  type="text" 
                  placeholder="npr. OGS ZG, soba 102"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:border-blue-500 outline-none transition"
                  value={mjesto}
                  onChange={e => setMjesto(e.target.value)}
                />
            </div>
          </div>

          {/* OPIS */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Napomena / Opis</label>
            <textarea 
              rows={3}
              placeholder="Dodatne bilješke..."
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:border-blue-500 outline-none transition"
              value={opis}
              onChange={e => setOpis(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-50 dark:border-slate-800">
            <Link href="/rokovnik" className="px-6 py-3 text-slate-600 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition">
              Odustani
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 rounded-xl transition flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Spremanje...' : 'Spremi u Rokovnik'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
