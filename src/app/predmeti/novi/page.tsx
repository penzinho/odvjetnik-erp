'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NoviPredmetPage() {
  // Simulirani klijenti (u stvarnosti bi dolazili iz baze)
  // 'nextCaseNum' je podatak koji bi baza vratila (koji je sljedeći broj za tog klijenta)
  const klijenti = [
    { id: 1, naziv: "Ivan Horvat", nextCaseNum: 3 }, // Već ima 1-1 i 1-2
    { id: 2, naziv: "Ana Anić", nextCaseNum: 1 },
    { id: 10001, naziv: "Tech Corp d.o.o.", nextCaseNum: 2 },
  ];

  // STANJA FORME
  const [selectedKlijentId, setSelectedKlijentId] = useState("");
  const [klijentNaziv, setKlijentNaziv] = useState("");
  const [protustranka, setProtustranka] = useState("");
  const [brojSpisa, setBrojSpisa] = useState("---"); // Prikaz broja spisa
  
  // Automatski generirani naziv
  const nazivPredmeta = (klijentNaziv && protustranka) 
    ? `${klijentNaziv} c/a ${protustranka}` 
    : "Odaberite klijenta i unesite protustranku...";

  // Logika: Kad se promijeni klijent, ažuriraj ID i generiraj broj spisa
  const handleKlijentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedKlijentId(id);

    if (id) {
      const klijent = klijenti.find(k => k.id.toString() === id);
      if (klijent) {
        setKlijentNaziv(klijent.naziv);
        // Generiranje broja spisa: ID_KLIJENTA - SLJEDEĆI_BROJ
        setBrojSpisa(`${klijent.id}-${klijent.nextCaseNum}`);
      }
    } else {
      setKlijentNaziv("");
      setBrojSpisa("---");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Otvaranje Novog Spisa</h1>
        <p className="text-slate-500 text-sm mt-1">Unesite osnovne podatke. Broj i naziv se generiraju automatski.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* PREVIEW TRAKA - Da odmah vidiš broj i naziv */}
        <div className="bg-slate-50 border-b border-gray-200 p-6 flex items-center gap-6">
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Broj spisa</span>
              <span className="text-2xl font-mono font-bold text-blue-600">{brojSpisa}</span>
           </div>
           <div className="h-10 w-px bg-gray-300"></div>
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Naziv predmeta (Auto)</span>
              <span className={`text-lg font-medium ${klijentNaziv && protustranka ? 'text-slate-800' : 'text-gray-400 italic'}`}>
                {nazivPredmeta}
              </span>
           </div>
        </div>

        <form className="p-8 space-y-8">
          
          {/* 1. STRANKE U POSTUPKU */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</span>
              Stranke
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ODABIR KLIJENTA */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Zastupamo (Klijent)</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer font-medium text-slate-700"
                  onChange={handleKlijentChange}
                  value={selectedKlijentId}
                >
                  <option value="">Odaberite klijenta...</option>
                  {klijenti.map(k => (
                    <option key={k.id} value={k.id}>{k.naziv} (#{k.id})</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400">Odabirom klijenta dodjeljuje se prvi slobodan broj spisa.</p>
              </div>

              {/* UNOS PROTUSTRANKE */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Protivna strana</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition"
                  placeholder="npr. Croatia Osiguranje"
                  value={protustranka}
                  onChange={(e) => setProtustranka(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* 2. DETALJI PREDMETA */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">2</span>
              Detalji predmeta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Vrsta predmeta</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700">
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
                <label className="text-xs font-semibold text-slate-500 uppercase">Vrijednost predmeta spora (VPS)</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" placeholder="npr. 10.000,00 EUR" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nadležno tijelo / Sud</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" placeholder="npr. Općinski građanski sud u Zagrebu" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Poslovni broj (ako postoji)</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" placeholder="npr. P-1234/2024" />
              </div>

            </div>
          </div>

          <hr className="border-gray-50" />

           {/* 3. ODGOVORNOST */}
           <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">3</span>
              Zaduženje
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nositelj spisa</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700">
                  <option>Luka Miletić (Partner)</option>
                  <option>Marko Marić (Odvjetnik)</option>
                  <option>Ivan Ivić (Vježbenik)</option>
                </select>
              </div>
            </div>
           </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50">
            <Link href="/predmeti" className="px-6 py-3 text-slate-600 font-medium hover:bg-gray-50 rounded-xl transition">
              Odustani
            </Link>
            <button type="button" className="px-6 py-3 bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 rounded-xl transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Otvori Spis
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}