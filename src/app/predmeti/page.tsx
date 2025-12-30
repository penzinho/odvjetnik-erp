'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function PredmetiPage() {
  const [predmeti, setPredmeti] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredmeti();
  }, []);

  async function fetchPredmeti() {
    setLoading(true);
    
    // Ovdje radimo "magiju": Dohvaćamo predmete I podatke o klijentu u jednom potezu
    const { data, error } = await supabase
      .from('predmeti')
      .select(`
        *,
        klijenti ( naziv )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Greška:', error);
    } else {
      setPredmeti(data || []);
    }
    setLoading(false);
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Učitavanje spisa...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Popis Predmeta</h1>
          <p className="text-slate-500 text-sm mt-1">Svi aktivni i arhivirani spisi (Iz baze).</p>
        </div>
        <Link href="/predmeti/novi" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
          <span className="text-xl">+</span>
          Novi Predmet
        </Link>
      </div>

      {/* FILTERI (Vizualni) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Traži..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition text-slate-700" />
        </div>
      </div>

      {/* TABLICA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Broj Spisa</th>
                <th className="px-6 py-4">Naziv Predmeta</th>
                <th className="px-6 py-4">Vrsta</th>
                <th className="px-6 py-4">Sud / Poslovni broj</th>
                <th className="px-6 py-4 text-right">VPS</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {predmeti.map((p) => (
                // Dodali smo onClick koji vodi na detalje
                <tr 
                  key={p.id} 
                  onClick={() => window.location.href = `/predmeti/${p.id}`} // Najbrži način za navigaciju
                  className="hover:bg-blue-50/30 transition group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                      {p.klijent_id}-{p.broj_spisa}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{p.naziv}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Klijent: {p.klijenti?.naziv}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-600">{p.vrsta}</td>
                  
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-mono">{p.poslovni_broj || '-'}</div>
                    <div className="text-slate-500 text-xs">{p.sud}</div>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-slate-700">{p.vps}</td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === 'Aktivan' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                     <span className="text-slate-300 group-hover:text-blue-600 transition">→</span>
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