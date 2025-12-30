import { supabase } from '../../lib/supabase';
import Link from 'next/link';

// Osiguravamo da su podaci uvijek svježi (ne keširani)
export const revalidate = 0;

export default async function FinancijePage() {
  
  // 1. DOHVAT SVIH RAČUNA (i imena klijenata/predmeta)
  const { data: racuni, error } = await supabase
    .from('racuni')
    .select(`
      *,
      klijenti ( naziv ),
      predmeti ( naziv, broj_spisa, klijent_id )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Greška financije:", error);
    return <div>Greška pri učitavanju financija.</div>;
  }

  // 2. IZRAČUN STATISTIKE (Server-side matematika)
  const danas = new Date().toISOString().split('T')[0];

  let ukupnoNaplaceno = 0;
  let ukupnoOtvoreno = 0;
  let ukupnoDospjelo = 0;
  let brojDospjelih = 0;

  racuni?.forEach((r) => {
    const iznos = Number(r.iznos_ukupno);

    if (r.status === 'Plaćeno') {
      ukupnoNaplaceno += iznos;
    } else if (r.status !== 'Nacrt') {
      // Ako nije plaćeno i nije nacrt -> znači da je otvoreno potraživanje
      ukupnoOtvoreno += iznos;

      // Provjera kašnjenja
      if (r.datum_dospijeca < danas) {
        ukupnoDospjelo += iznos;
        brojDospjelih++;
      }
    }
  });

  // Helper za formatiranje valute
  const formatEUR = (iznos: number) => {
    return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(iznos);
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financije</h1>
          <p className="text-slate-500 text-sm mt-1">Pregled stvarnog prometa (iz baze).</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium shadow-sm transition">
                Izvještaji
            </button>
            <Link href="/financije/nova" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
                <span className="text-xl">+</span>
                Nova Faktura
            </Link>
        </div>
      </div>

      {/* KARTICE STATISTIKE (Dinamičke) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* UKUPNO PRIHODI */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.69 1.64 1.83 1.64 1.22 0 1.6-.51 1.6-1.11 0-.62-.57-1.01-1.63-1.12l-1.55-.16c-1.69-.18-2.83-.91-2.83-2.43 0-1.71 1.34-2.82 3.29-3.21V6h2.67v1.9c1.55.3 2.67 1.25 2.76 2.9h-1.93c-.11-.84-.57-1.39-1.63-1.39-1.07 0-1.47.46-1.47 1.02 0 .6.56.9 1.67 1.02l1.52.16c1.78.19 2.87 1.01 2.87 2.44 0 1.86-1.44 2.94-3.66 3.24z"/></svg>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ukupno Naplaćeno</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{formatEUR(ukupnoNaplaceno)}</h3>
            <div className="mt-4 flex items-center text-green-600 text-sm font-bold bg-green-50 w-fit px-2 py-1 rounded">
                <span>✓ Sigurno</span>
            </div>
        </div>

        {/* OTVORENA POTRAŽIVANJA */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Otvorena potraživanja</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{formatEUR(ukupnoOtvoreno)}</h3>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                {/* Jednostavna vizualizacija omjera */}
                <div 
                  className="bg-orange-400 h-full transition-all duration-1000" 
                  style={{ width: `${(ukupnoOtvoreno / (ukupnoNaplaceno + ukupnoOtvoreno || 1)) * 100}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Iznos koji čekate na naplatu</p>
        </div>

        {/* DOSPJELO (CRVENO) */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Kašnjenje / Dospjelo</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">{formatEUR(ukupnoDospjelo)}</h3>
            <div className="mt-4 flex items-center gap-2">
                {brojDospjelih > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm text-red-600 font-medium">{brojDospjelih} kritičnih faktura</span>
                  </>
                ) : (
                  <span className="text-sm text-green-600 font-medium">Nema kašnjenja 🎉</span>
                )}
            </div>
        </div>
      </div>

      {/* TABLICA FAKTURA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Nedavne fakture</h3>
        </div>
        <div className="overflow-x-auto">
          {racuni?.length === 0 ? (
             <div className="p-8 text-center text-slate-500">Još niste izdali niti jedan račun.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Broj računa</th>
                  <th className="px-6 py-4">Klijent / Predmet</th>
                  <th className="px-6 py-4">Izdano</th>
                  <th className="px-6 py-4">Dospijeće</th>
                  <th className="px-6 py-4 text-right">Iznos</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {racuni?.map((f) => (
                  <tr key={f.id} className="hover:bg-blue-50/30 transition group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                      {f.broj_racuna}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{f.klijenti?.naziv}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {f.predmeti ? `${f.predmeti.naziv} (#${f.predmeti.klijent_id}-${f.predmeti.broj_spisa})` : 'Opći račun'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{f.datum_izdavanja}</td>
                    <td className="px-6 py-4 text-slate-600">{f.datum_dospijeca}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatEUR(f.iznos_ukupno)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          f.status === 'Plaćeno' ? 'bg-green-50 text-green-700 border-green-100' :
                          (f.status !== 'Plaćeno' && f.datum_dospijeca < danas) ? 'bg-red-50 text-red-700 border-red-100' :
                          f.status === 'Nacrt' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {/* Ako kasni, prepiši status u "Dospjelo" vizualno, inače prikaži pravi status */}
                        {(f.status !== 'Plaćeno' && f.datum_dospijeca < danas) ? 'Kasni' : f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-300 group-hover:text-blue-600 transition">⬇ PDF</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}