'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NovaFakturaPage() {
  // Simulirani klijenti
  const klijenti = [
    { id: 1, naziv: "Tech Corp d.o.o.", oib: "12345678901", adresa: "Ilica 1, Zagreb" },
    { id: 2, naziv: "Ivan Horvat", oib: "98765432100", adresa: "Vukovarska 20, Split" },
  ];

  // STANJE: Podaci o fakturi
  const [odabraniKlijent, setOdabraniKlijent] = useState<any>(null);
  
  // STANJE: Stavke računa (početno imamo jedan prazan red)
  const [stavke, setStavke] = useState([
    { id: 1, opis: "", kolicina: 1, cijena: 0 }
  ]);

  // STANJE: Totali
  const [subtotal, setSubtotal] = useState(0);
  const [pdv, setPdv] = useState(0);
  const [total, setTotal] = useState(0);

  // Funkcija koja se pokreće svaki put kad se promijene stavke
  useEffect(() => {
    const noviSubtotal = stavke.reduce((acc, item) => acc + (item.kolicina * item.cijena), 0);
    const noviPdv = noviSubtotal * 0.25; // 25% PDV
    const noviTotal = noviSubtotal + noviPdv;

    setSubtotal(noviSubtotal);
    setPdv(noviPdv);
    setTotal(noviTotal);
  }, [stavke]);

  // Rukovanje promjenom klijenta
  const handleKlijentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const klijentId = parseInt(e.target.value);
    const k = klijenti.find(k => k.id === klijentId);
    setOdabraniKlijent(k || null);
  };

  // Rukovanje promjenom unutar reda (stavke)
  const handleItemChange = (id: number, field: string, value: any) => {
    const noveStavke = stavke.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setStavke(noveStavke);
  };

  // Dodavanje novog reda
  const dodajRed = () => {
    setStavke([...stavke, { id: Date.now(), opis: "", kolicina: 1, cijena: 0 }]);
  };

  // Brisanje reda
  const obrisiRed = (id: number) => {
    if (stavke.length === 1) return; // Ne dajemo brisanje zadnjeg reda
    setStavke(stavke.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* HEADER STRANICE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Faktura</h1>
          <p className="text-slate-500 text-sm mt-1">Kreiranje izlaznog računa #2024-004</p>
        </div>
        <div className="flex gap-3">
            <Link href="/financije" className="bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium shadow-sm transition">
                Odustani
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Izdaj Račun
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* SEKCIJA 1: GLAVNI PODACI (Klijent i Datumi) */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-100">
            
            {/* LIJEVO: KLIJENT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primatelj računa</h3>
                <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition cursor-pointer font-medium text-slate-700"
                    onChange={handleKlijentChange}
                >
                    <option value="">Odaberite klijenta...</option>
                    {klijenti.map(k => (
                        <option key={k.id} value={k.id}>{k.naziv}</option>
                    ))}
                </select>

                {/* Prikaz adrese kad je klijent odabran */}
                {odabraniKlijent && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-900 space-y-1">
                        <p className="font-bold">{odabraniKlijent.naziv}</p>
                        <p>{odabraniKlijent.adresa}</p>
                        <p>OIB: {odabraniKlijent.oib}</p>
                    </div>
                )}
            </div>

            {/* DESNO: DETALJI RAČUNA */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalji računa</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Datum izdavanja</label>
                        <input type="date" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Datum dospijeća</label>
                        <input type="date" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Vezani predmet (opcionalno)</label>
                        <input type="text" placeholder="npr. P-1234/23" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                    </div>
                </div>
            </div>
        </div>

        {/* SEKCIJA 2: STAVKE RAČUNA (TABLICA) */}
        <div className="p-8 bg-gray-50/30">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stavke i usluge</h3>
            
            <div className="space-y-3">
                {/* ZAGLAVLJE TABLICE */}
                <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                    <div className="col-span-6">Opis usluge</div>
                    <div className="col-span-2 text-right">Količina</div>
                    <div className="col-span-2 text-right">Cijena (€)</div>
                    <div className="col-span-2 text-right">Ukupno</div>
                </div>

                {/* REDOVI (Dinamički) */}
                {stavke.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-start group">
                        <div className="col-span-6">
                            <input 
                                type="text" 
                                placeholder="Unesite opis usluge..." 
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition shadow-sm"
                                value={item.opis}
                                onChange={(e) => handleItemChange(item.id, 'opis', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="number" 
                                min="1"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition text-right shadow-sm"
                                value={item.kolicina}
                                onChange={(e) => handleItemChange(item.id, 'kolicina', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="number" 
                                min="0"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition text-right shadow-sm"
                                value={item.cijena}
                                onChange={(e) => handleItemChange(item.id, 'cijena', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-3">
                            <span className="font-bold text-slate-700 py-3">
                                {(item.kolicina * item.cijena).toFixed(2)} €
                            </span>
                            {/* Gumb za brisanje (pojavljuje se na hover) */}
                            <button 
                                onClick={() => obrisiRed(item.id)}
                                className="text-gray-300 hover:text-red-500 transition p-1"
                                title="Obriši red"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                {/* GUMB DODAJ RED */}
                <div className="pt-2">
                    <button 
                        onClick={dodajRed}
                        className="text-blue-600 text-sm font-bold hover:text-blue-700 flex items-center gap-1"
                    >
                        + Dodaj novu stavku
                    </button>
                </div>
            </div>
        </div>

        {/* SEKCIJA 3: ZBROJ (TOTALI) */}
        <div className="p-8 bg-white border-t border-gray-100 flex justify-end">
            <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between text-slate-500 text-sm">
                    <span>Osnovica (Subtotal):</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm">
                    <span>PDV (25%):</span>
                    <span className="font-medium">{pdv.toFixed(2)} €</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between text-slate-800 text-xl font-bold">
                    <span>Ukupno za platiti:</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}