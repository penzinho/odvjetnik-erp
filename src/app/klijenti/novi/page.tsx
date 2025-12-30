'use client';

import { useState } from 'react';

// Definiramo tip podataka za Grad
type Grad = {
  naziv: string;
  pbr: string;
};

export default function NoviKlijentPage() {
  const [vrstaKlijenta, setVrstaKlijenta] = useState<'fizicka' | 'pravna'>('fizicka');

  // Podaci o gradovima (sada sadrže i PBR)
  const [gradoviPodaci, setGradoviPodaci] = useState<Grad[]>([
    { naziv: 'Zagreb', pbr: '10000' },
    { naziv: 'Split', pbr: '21000' },
    { naziv: 'Rijeka', pbr: '51000' },
    { naziv: 'Osijek', pbr: '31000' },
    { naziv: 'Velika Gorica', pbr: '10410' },
  ]);
  
  const [drzave, setDrzave] = useState(['Hrvatska', 'Slovenija', 'BiH', 'Njemačka']);

  // Stanje forme
  const [odabraniGrad, setOdabraniGrad] = useState('');
  const [postanskiBroj, setPostanskiBroj] = useState(''); // Ovo se puni automatski
  
  const [noviGradMode, setNoviGradMode] = useState(false);
  const [novaDrzavaMode, setNovaDrzavaMode] = useState(false);

  // Funkcija koja se pokreće kad se odabere grad iz liste
  const handleGradChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gradNaziv = e.target.value;
    setOdabraniGrad(gradNaziv);

    // Nađi taj grad u podacima
    const pronadjeniGrad = gradoviPodaci.find(g => g.naziv === gradNaziv);
    
    // Ako ga nađeš, postavi njegov poštanski broj
    if (pronadjeniGrad) {
      setPostanskiBroj(pronadjeniGrad.pbr);
    } else {
      setPostanskiBroj(''); // Resetiraj ako je odabrano "Odaberi grad..."
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Novi Klijent</h1>
        <p className="text-slate-500 text-sm mt-1">Unesite podatke za otvaranje novog kartona klijenta.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* TABS */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setVrstaKlijenta('fizicka')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              vrstaKlijenta === 'fizicka' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-gray-50'
            }`}
          >
            👤 Fizička osoba
          </button>
          <button 
            onClick={() => setVrstaKlijenta('pravna')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              vrstaKlijenta === 'pravna' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-gray-50'
            }`}
          >
            🏢 Pravna osoba
          </button>
        </div>

        <form className="p-8 space-y-8">
          
          {/* OSNOVNI PODACI */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</span>
              Osnovni podaci
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vrstaKlijenta === 'fizicka' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Ime</label>
                    <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Prezime</label>
                    <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Naziv Tvrtke / Institucije</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-purple-500 outline-none transition" />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">OIB</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition font-mono" />
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* ADRESA */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">2</span>
              Adresa i Kontakt
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Ulica i kućni broj</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>

              {/* GRAD (Master) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                  Grad
                  {!noviGradMode && (
                    <button type="button" onClick={() => setNoviGradMode(true)} className="text-blue-600 hover:text-blue-700 text-[10px] font-bold uppercase cursor-pointer">
                      + Dodaj novi
                    </button>
                  )}
                  {noviGradMode && (
                     <button type="button" onClick={() => setNoviGradMode(false)} className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase cursor-pointer">
                      x Odustani
                    </button>
                  )}
                </label>
                
                {noviGradMode ? (
                  <input autoFocus type="text" className="w-full px-4 py-2 bg-white border-2 border-blue-100 text-blue-900 rounded-lg focus:border-blue-500 outline-none transition" placeholder="Unesite naziv novog grada..." />
                ) : (
                  <select 
                    value={odabraniGrad}
                    onChange={handleGradChange} // OVDJE JE MAGIJA
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700"
                  >
                    <option value="">Odaberi grad...</option>
                    {gradoviPodaci.map(g => <option key={g.naziv} value={g.naziv}>{g.naziv}</option>)}
                  </select>
                )}
              </div>

              {/* POŠTANSKI BROJ (Slave - popunjava se automatski) */}
               <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Poštanski broj</label>
                <input 
                  type="text" 
                  value={postanskiBroj} // Povezano sa state-om
                  onChange={(e) => setPostanskiBroj(e.target.value)} // Korisnik može ručno promijeniti ako želi
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" 
                  placeholder="npr. 10000" 
                />
              </div>

              {/* DRŽAVA */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                  Država
                  {!novaDrzavaMode && (
                    <button type="button" onClick={() => setNovaDrzavaMode(true)} className="text-blue-600 hover:text-blue-700 text-[10px] font-bold uppercase cursor-pointer">
                      + Dodaj novu
                    </button>
                  )}
                </label>
                
                {novaDrzavaMode ? (
                  <input autoFocus type="text" className="w-full px-4 py-2 bg-white border-2 border-blue-100 text-blue-900 rounded-lg outline-none transition" placeholder="Unesite naziv nove države..." />
                ) : (
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700">
                    <option value="Hrvatska">Hrvatska</option>
                    {drzave.filter(d => d !== 'Hrvatska').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Telefon / Mobitel</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">E-mail adresa</label>
                <input type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>

            </div>
          </div>

          <hr className="border-gray-50" />

          {/* FINANCIJE */}
          <div>
             {/* ... (isto kao prije) ... */}
             <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">3</span>
              Financijski podaci
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">IBAN</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none transition font-mono uppercase" />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50">
            <button type="button" className="px-6 py-3 text-slate-600 font-medium hover:bg-gray-50 rounded-xl transition">Odustani</button>
            <button type="button" className="px-6 py-3 bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 rounded-xl transition flex items-center gap-2">Spremi Klijenta</button>
          </div>

        </form>
      </div>
    </div>
  );
}