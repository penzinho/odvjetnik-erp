import Link from 'next/link';

export default function FinancijePage() {
  // Simulirani podaci o fakturama
  const fakture = [
    { broj: "2024-001", klijent: "Tech Corp d.o.o.", predmet: "Upravni spor", iznos: "1.250,00 €", datum: "15.01.2024", dospijece: "30.01.2024", status: "Plaćeno" },
    { broj: "2024-002", klijent: "Ivan Horvat", predmet: "Naknada štete", iznos: "450,00 €", datum: "28.01.2024", dospijece: "12.02.2024", status: "Poslano" },
    { broj: "2024-003", klijent: "Grad Zagreb", predmet: "Zemljišnoknjižno", iznos: "3.500,00 €", datum: "10.01.2024", dospijece: "25.01.2024", status: "Dospjelo" },
    { broj: "NACRT", klijent: "Ana Anić", predmet: "Razvod braka", iznos: "250,00 €", datum: "-", dospijece: "-", status: "Nacrt" },
  ];

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financije</h1>
          <p className="text-slate-500 text-sm mt-1">Pregled prihoda i izdanih računa.</p>
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

      {/* KARTICE STATISTIKE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* UKUPNO PRIHODI */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.69 1.64 1.83 1.64 1.22 0 1.6-.51 1.6-1.11 0-.62-.57-1.01-1.63-1.12l-1.55-.16c-1.69-.18-2.83-.91-2.83-2.43 0-1.71 1.34-2.82 3.29-3.21V6h2.67v1.9c1.55.3 2.67 1.25 2.76 2.9h-1.93c-.11-.84-.57-1.39-1.63-1.39-1.07 0-1.47.46-1.47 1.02 0 .6.56.9 1.67 1.02l1.52.16c1.78.19 2.87 1.01 2.87 2.44 0 1.86-1.44 2.94-3.66 3.24z"/></svg>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Naplaćeno (Siječanj)</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">12.450,00 €</h3>
            <div className="mt-4 flex items-center text-green-600 text-sm font-bold bg-green-50 w-fit px-2 py-1 rounded">
                <span>↗ +12%</span>
                <span className="text-green-600/60 font-medium ml-1">vs prošli mj.</span>
            </div>
        </div>

        {/* NENAPLAĆENO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Otvorena potraživanja</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">3.950,00 €</h3>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-400 h-full w-[40%]"></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">40% iznosa dospijeva u 7 dana</p>
        </div>

        {/* DOSPJELO (CRVENO) */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Dospjelo / Kašnjenje</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">3.500,00 €</h3>
            <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm text-red-600 font-medium">1 kritična faktura</span>
            </div>
        </div>
      </div>

      {/* TABLICA FAKTURA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Nedavne fakture</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">Vidi sve</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Broj računa</th>
                <th className="px-6 py-4">Klijent / Predmet</th>
                <th className="px-6 py-4">Datum izdavanja</th>
                <th className="px-6 py-4">Dospijeće</th>
                <th className="px-6 py-4 text-right">Iznos</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fakture.map((f) => (
                <tr key={f.broj} className="hover:bg-blue-50/30 transition group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                    {f.broj}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{f.klijent}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{f.predmet}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{f.datum}</td>
                  <td className="px-6 py-4 text-slate-600">{f.dospijece}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{f.iznos}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        f.status === 'Plaćeno' ? 'bg-green-50 text-green-700 border-green-100' :
                        f.status === 'Dospjelo' ? 'bg-red-50 text-red-700 border-red-100' :
                        f.status === 'Nacrt' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="text-slate-300 group-hover:text-blue-600 transition">⬇ PDF</span>
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