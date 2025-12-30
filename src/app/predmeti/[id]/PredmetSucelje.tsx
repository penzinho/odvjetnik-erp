'use client'; // Ovo ostaje klijentska komponenta jer ima tabove i klikove

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

// Definiramo što ova komponenta očekuje od podataka
type Props = {
  predmet: any;
  pocetniRokovnik: any[];
  pocetniZadaci: any[];
};

export default function PredmetSucelje({ predmet, pocetniRokovnik, pocetniZadaci }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'rokovnik' | 'zadaci'>('info');
  
  // Zadaci su u state-u jer ih mijenjamo (kvačimo)
  const [zadaci, setZadaci] = useState(pocetniZadaci);

  // Funkcija za kvačicu
  const toggleZadatak = async (id: number, trenutnoStanje: boolean) => {
    setZadaci(zadaci.map(z => z.id === id ? { ...z, obavljeno: !trenutnoStanje } : z));
    await supabase.from('zadaci').update({ obavljeno: !trenutnoStanje }).eq('id', id);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* ZAGLAVLJE PREDMETA */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{predmet.klijent_id}-{predmet.broj_spisa}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${predmet.status === 'Aktivan' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {predmet.status}
                  </span>
               </div>
               <h1 className="text-2xl font-bold text-slate-800">{predmet.naziv}</h1>
               <div className="flex gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">👤 {predmet.klijenti?.naziv}</span>
                  <span className="flex items-center gap-1">⚖️ {predmet.sud || 'Nije definiran'}</span>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 text-sm font-medium">Uredi</button>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">+ Dodaj radnju</button>
            </div>
         </div>
      </div>

      {/* TABOVI */}
      <div className="border-b border-gray-200 flex gap-6">
        <button onClick={() => setActiveTab('info')} className={`pb-3 text-sm font-medium transition ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Informacije</button>
        <button onClick={() => setActiveTab('rokovnik')} className={`pb-3 text-sm font-medium transition ${activeTab === 'rokovnik' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Ročišta ({pocetniRokovnik.length})</button>
        <button onClick={() => setActiveTab('zadaci')} className={`pb-3 text-sm font-medium transition ${activeTab === 'zadaci' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Zadaci ({zadaci.filter(z => !z.obavljeno).length})</button>
      </div>

      {/* SADRŽAJ TABOVA */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-800 border-b border-gray-50 pb-2">Podaci o predmetu</h3>
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-400 text-xs uppercase">Poslovni broj</p><p className="font-medium text-slate-700">{predmet.poslovni_broj || '-'}</p></div>
                <div><p className="text-slate-400 text-xs uppercase">Vrsta</p><p className="font-medium text-slate-700">{predmet.vrsta}</p></div>
                <div><p className="text-slate-400 text-xs uppercase">VPS</p><p className="font-medium text-slate-700">{predmet.vps || '-'}</p></div>
                <div><p className="text-slate-400 text-xs uppercase">Voditelj</p><p className="font-medium text-slate-700">{predmet.voditelj || '-'}</p></div>
                <div className="col-span-2"><p className="text-slate-400 text-xs uppercase">Protustranka</p><p className="font-medium text-slate-700">{predmet.protustranka}</p></div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
             <h3 className="font-bold text-slate-800 border-b border-gray-50 pb-2">Kontakt Klijenta</h3>
             <div className="space-y-3 text-sm">
                <div><p className="text-slate-400 text-xs uppercase">Naziv</p><p className="font-medium text-blue-600">{predmet.klijenti?.naziv}</p></div>
                <div><p className="text-slate-400 text-xs uppercase">OIB</p><p className="font-mono text-slate-600">{predmet.klijenti?.oib || '-'}</p></div>
                <div><p className="text-slate-400 text-xs uppercase">Telefon</p><p className="text-slate-600">{predmet.klijenti?.telefon || '-'}</p></div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'rokovnik' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
           {pocetniRokovnik.length === 0 ? <div className="p-8 text-center text-slate-500">Nema ročišta.</div> : (
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-xs text-gray-500 uppercase"><tr><th className="px-6 py-3">Datum</th><th className="px-6 py-3">Vrijeme</th><th className="px-6 py-3">Događaj</th><th className="px-6 py-3">Mjesto</th></tr></thead>
               <tbody className="divide-y divide-gray-50">
                 {pocetniRokovnik.map((rok: any) => (
                   <tr key={rok.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-slate-700">{rok.datum}</td>
                     <td className="px-6 py-4 text-slate-500">{rok.vrijeme ? rok.vrijeme.slice(0,5) : '-'}</td>
                     <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${rok.vrsta === 'Ročište' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{rok.vrsta}</span><div className="mt-1 font-medium text-slate-800">{rok.naslov}</div></td>
                     <td className="px-6 py-4 text-slate-600">{rok.mjesto || '-'}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      )}

      {activeTab === 'zadaci' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-2">
             {zadaci.length === 0 ? <div className="text-center text-slate-500 py-4">Nema zadataka.</div> : zadaci.map((z) => (
               <div key={z.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${z.obavljeno ? 'bg-gray-50 opacity-60' : 'bg-white hover:border-blue-300'}`}>
                 <input type="checkbox" checked={z.obavljeno} onChange={() => toggleZadatak(z.id, z.obavljeno)} className="w-5 h-5 cursor-pointer"/>
                 <div className="flex-1"><p className={`text-sm font-medium ${z.obavljeno ? 'line-through text-slate-500' : 'text-slate-800'}`}>{z.tekst}</p><div className="flex gap-4 mt-1 text-xs text-slate-400"><span>📅 {z.rok || 'Nema roka'}</span><span>👤 {z.zuzeno || '-'}</span></div></div>
               </div>
             ))}
        </div>
      )}
    </div>
  );
}