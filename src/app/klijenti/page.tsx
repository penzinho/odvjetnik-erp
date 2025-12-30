'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Uvozimo našu vezu s bazom
import Link from 'next/link';

export default function KlijentiPage() {
  const [klijenti, setKlijenti] = useState<any[]>([]); // Ovdje ćemo čuvati podatke iz baze
  const [loading, setLoading] = useState(true); // Da znamo kad se podaci još učitavaju
  const [error, setError] = useState<string | null>(null);

  // Funkcija koja dohvaća klijente kad se stranica učita
  useEffect(() => {
    async function fetchKlijenti() {
      setLoading(true);
      
      // Upit prema Supabaseu: Daj mi sve iz tablice 'klijenti' i sortiraj po ID-u
      const { data, error } = await supabase
        .from('klijenti')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Greška:', error);
        setError('Ne mogu učitati klijente.');
      } else {
        setKlijenti(data || []);
      }
      
      setLoading(false);
    }

    fetchKlijenti();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Učitavanje podataka...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* ZAGLAVLJE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Klijenti</h1>
          <p className="text-slate-500 text-sm mt-1">
            Baza klijenata (Podaci iz Supabase baze)
          </p>
        </div>
        <Link href="/klijenti/novi" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          <span className="text-xl">+</span>
          Novi Klijent
        </Link>
      </div>

      {/* SEARCH BAR (Za sada samo vizualan) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Pretraži..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition text-slate-700"
          />
        </div>
      </div>

      {/* TABLICA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-24">Broj</th>
                <th className="px-6 py-4">Naziv / Ime</th>
                <th className="px-6 py-4">OIB</th>
                <th className="px-6 py-4">Kontakt</th>
                <th className="px-6 py-4">Vrsta</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Radnje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {klijenti.map((klijent) => (
                <tr key={klijent.id} className="hover:bg-blue-50/30 transition group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {klijent.id}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{klijent.naziv}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{klijent.adresa}, {klijent.grad}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-600 font-mono">{klijent.oib || '-'}</td>
                  
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{klijent.email || '-'}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{klijent.telefon}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      klijent.id >= 10000 
                        ? "bg-purple-50 text-purple-700 border-purple-100" 
                        : "bg-blue-50 text-blue-700 border-blue-100"     
                    }`}>
                      {klijent.vrsta === 'fizicka' ? 'Fizička osoba' : 'Pravna osoba'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                     <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {klijent.status}
                      </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}