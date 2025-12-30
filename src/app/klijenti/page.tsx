export default function KlijentiPage() {
  // Podaci s numeracijom:
  // 1-9999: Fizičke osobe
  // 10000+: Pravne osobe
  const klijenti = [
    { 
      id: 1, 
      naziv: "Ivan Horvat", 
      oib: "98765432100", 
      email: "ivan.horvat@gmail.com", 
      telefon: "091/222-333", 
      vrsta: "Fizička osoba", 
      status: "Aktivan" 
    },
    { 
      id: 2, 
      naziv: "Ana Anić", 
      oib: "11122233344", 
      email: "ana.anic@net.hr", 
      telefon: "098/765-4321", 
      vrsta: "Fizička osoba", 
      status: "Neaktivan" 
    },
    { 
      id: 10001, 
      naziv: "Tech Corp d.o.o.", 
      oib: "12345678901", 
      email: "info@techcorp.hr", 
      telefon: "01/555-333", 
      vrsta: "Pravna osoba", 
      status: "Aktivan" 
    },
    { 
      id: 10002, 
      naziv: "Grad Zagreb", 
      oib: "55555555555", 
      email: "pisarnica@zagreb.hr", 
      telefon: "01/610-1111", 
      vrsta: "Javno tijelo", 
      status: "Aktivan" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* ZAGLAVLJE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Klijenti</h1>
          <p className="text-slate-500 text-sm mt-1">
            Baza klijenata s numeracijom (1-9999 Fizičke, 10000+ Pravne)
          </p>
        </div>
       <a href="/klijenti/novi" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
  <span className="text-xl">+</span>
  Novi Klijent
</a>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Pretraži po Broju, Nazivu ili OIB-u..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
          />
        </div>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer">
          <option>Svi tipovi</option>
          <option>Fizičke osobe (1-9999)</option>
          <option>Pravne osobe (10000+)</option>
        </select>
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
                  {/* KOLONA BROJ */}
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {klijent.id}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{klijent.naziv}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-600 font-mono">{klijent.oib}</td>
                  
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{klijent.email}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{klijent.telefon}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      klijent.id >= 10000 
                        ? "bg-purple-50 text-purple-700 border-purple-100" 
                        : "bg-blue-50 text-blue-700 border-blue-100"     
                    }`}>
                      {klijent.vrsta}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    {klijent.status === "Aktivan" ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Aktivan
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Neaktivan
                      </span>
                    )}
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