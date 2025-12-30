export default function Home() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 font-sans">
      
      {/* 1. WELCOME BANNER (Kao ljubičasti na Parra slici, ali plavi) */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-blue-100 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Ilustracija (simulacija slike lijevo) */}
          <div className="hidden md:flex bg-white p-4 rounded-xl shadow-sm border border-blue-50">
             <span className="text-4xl">⚖️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Luka Miletić, želimo ti dobrodošlicu u Lex Office!</h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-2xl">
              Sustav je spreman za rad. Od 1.1. moguće je izdavati i zaprimati eRačune. 
              Svoj paket ćeš izabrati nakon isteka promo perioda.
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
           <button className="px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm">
             Upute za korisnike
           </button>
           <button className="px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition shadow-sm">
             Pitaj agenta
           </button>
        </div>
      </div>

      {/* 2. IZDAJ NOVI DOKUMENT (Srednja sekcija na slici) */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Brze radnje</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition group">
            <span className="bg-purple-50 text-purple-600 p-1.5 rounded-md group-hover:bg-purple-100 transition">
              📄
            </span>
            <span className="font-semibold text-slate-700">Novi Predmet</span>
            <span className="ml-1 text-gray-400 text-xs border border-gray-200 rounded-full w-4 h-4 flex items-center justify-center">i</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition group">
             <span className="bg-blue-50 text-blue-600 p-1.5 rounded-md group-hover:bg-blue-100 transition">
              👥
            </span>
            <span className="font-semibold text-slate-700">Novi Klijent</span>
            <span className="ml-1 text-gray-400 text-xs border border-gray-200 rounded-full w-4 h-4 flex items-center justify-center">i</span>
          </button>
        </div>
      </div>

      {/* 3. GLAVNE TABLICE (Split view kao na dnu Parra slike) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LIJEVO: Najprodavanije stavke (u našem slučaju Aktivni predmeti) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Aktivni predmeti</h3>
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="pb-3 font-normal">Naziv predmeta</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Vrijednost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-4 font-medium text-slate-700">Sastav tužbe - neprocjenjivi spor</td>
                <td className="py-4 text-slate-500">1 usluga</td>
                <td className="py-4 text-slate-800 font-bold text-right">1.250,00 EUR</td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-slate-700">Zastupanje na ročištu - VPS do 66.361€</td>
                <td className="py-4 text-slate-500">1 usluga</td>
                <td className="py-4 text-slate-800 font-bold text-right">1.250,00 EUR</td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-slate-700">Sudska pristojba</td>
                <td className="py-4 text-slate-500">2 kom</td>
                <td className="py-4 text-slate-800 font-bold text-right">431,81 EUR</td>
              </tr>
            </tbody>
            <tfoot className="border-t border-gray-100">
               <tr>
                 <td className="pt-4 font-bold text-slate-800">Ukupno</td>
                 <td></td>
                 <td className="pt-4 font-bold text-slate-800 text-right">3.181,81 EUR</td>
               </tr>
            </tfoot>
          </table>
        </div>

        {/* DESNO: Najveći kupci (u našem slučaju Klijenti) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            Najveći klijenti <span className="text-gray-300 font-normal text-sm">ⓘ</span>
          </h3>
          
           <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 font-medium border-b border-gray-100">
              <tr>
                <th className="pb-3 font-normal">Kupac</th>
                <th className="pb-3 font-normal text-center">Broj faktura</th>
                <th className="pb-3 font-normal text-right">Ukupno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-4 font-medium text-slate-700">SALVUS d.o.o.</td>
                <td className="py-4 text-slate-500 text-center">3</td>
                <td className="py-4 text-slate-800 font-bold text-right">3.181,81 EUR</td>
              </tr>
               <tr>
                <td className="py-4 font-medium text-slate-700">Tech Corp d.o.o.</td>
                <td className="py-4 text-slate-500 text-center">1</td>
                <td className="py-4 text-slate-800 font-bold text-right">1.500,00 EUR</td>
              </tr>
            </tbody>
             <tfoot className="border-t border-gray-100">
               <tr>
                 <td className="pt-4 font-bold text-slate-800">Ukupno</td>
                 <td className="pt-4 font-bold text-slate-800 text-center">4</td>
                 <td className="pt-4 font-bold text-slate-800 text-right">4.681,81 EUR</td>
               </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  );
}