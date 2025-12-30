'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovaFakturaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // PODACI IZ BAZE
  const [klijenti, setKlijenti] = useState<any[]>([]);
  const [predmetiKlijenta, setPredmetiKlijenta] = useState<any[]>([]); // Predmeti samo za odabranog klijenta

  // STANJE FORME - ZAGLAVLJE
  const [odabraniKlijentId, setOdabraniKlijentId] = useState("");
  const [odabraniKlijentDetalji, setOdabraniKlijentDetalji] = useState<any>(null);
  
  const [odabraniPredmetId, setOdabraniPredmetId] = useState(""); // Opcionalno
  
  const [brojRacuna, setBrojRacuna] = useState(`2024-${Math.floor(Math.random() * 1000)}`); // Random broj za demo
  const [datumIzdavanja, setDatumIzdavanja] = useState(new Date().toISOString().split('T')[0]);
  const [datumDospijeca, setDatumDospijeca] = useState("");

  // STANJE FORME - STAVKE
  const [stavke, setStavke] = useState([
    { id: Date.now(), opis: "", kolicina: 1, cijena: 0 }
  ]);

  // TOTALI
  const [subtotal, setSubtotal] = useState(0);
  const [pdv, setPdv] = useState(0);
  const [total, setTotal] = useState(0);

  // 1. DOHVATI SVE KLIJENTE NA POČETKU
  useEffect(() => {
    async function fetchKlijenti() {
      const { data } = await supabase.from('klijenti').select('*').order('naziv');
      setKlijenti(data || []);
    }
    fetchKlijenti();
  }, []);

  // 2. IZRAČUN TOTALA (Svaki put kad se promijeni stavka)
  useEffect(() => {
    const noviSubtotal = stavke.reduce((acc, item) => acc + (item.kolicina * item.cijena), 0);
    const noviPdv = noviSubtotal * 0.25; // 25% PDV
    const noviTotal = noviSubtotal + noviPdv;

    setSubtotal(noviSubtotal);
    setPdv(noviPdv);
    setTotal(noviTotal);
  }, [stavke]);

  // 3. KAD SE ODABERE KLIJENT -> DOHVATI NJEGOVE PREDMETE
  const handleKlijentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const klijentId = e.target.value;
    setOdabraniKlijentId(klijentId);
    setOdabraniPredmetId(""); // Resetiraj predmet
    
    if (klijentId) {
      // Postavi detalje za prikaz adrese
      const k = klijenti.find(x => x.id.toString() === klijentId);
      setOdabraniKlijentDetalji(k);

      // Dohvati predmete tog klijenta
      const { data } = await supabase
        .from('predmeti')
        .select('id, naziv, broj_spisa')
        .eq('klijent_id', klijentId)
        .eq('status', 'Aktivan');
      setPredmetiKlijenta(data || []);
    } else {
      setOdabraniKlijentDetalji(null);
      setPredmetiKlijenta([]);
    }
  };

  // Upravljanje stavkama
  const handleItemChange = (id: number, field: string, value: any) => {
    setStavke(stavke.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const dodajRed = () => setStavke([...stavke, { id: Date.now(), opis: "", kolicina: 1, cijena: 0 }]);
  const obrisiRed = (id: number) => {
    if (stavke.length > 1) setStavke(stavke.filter(item => item.id !== id));
  };

  // 4. SPREMANJE U BAZU (VELIKO FINALE)
  const handleSpremi = async () => {
    if (!odabraniKlijentId || !datumIzdavanja || !datumDospijeca) {
      alert("Molimo ispunite obavezna polja (Klijent, Datumi).");
      return;
    }
    setLoading(true);

    try {
      // A) Spremi ZAGLAVLJE RAČUNA
      const { data: racunData, error: racunError } = await supabase
        .from('racuni')
        .insert([
          {
            broj_racuna: brojRacuna,
            klijent_id: parseInt(odabraniKlijentId),
            predmet_id: odabraniPredmetId ? parseInt(odabraniPredmetId) : null,
            datum_izdavanja: datumIzdavanja,
            datum_dospijeca: datumDospijeca,
            iznos_neto: subtotal,
            iznos_pdv: pdv,
            iznos_ukupno: total,
            status: 'Poslano' // Odmah ga označimo kao izdanog
          }
        ])
        .select() // Vrati nam podatke da dobijemo novi ID
        .single();

      if (racunError) throw racunError;
      const noviRacunId = racunData.id;

      // B) Spremi STAVKE RAČUNA
      // Pripremamo niz za insert
      const stavkeZaUnos = stavke.map(s => ({
        racun_id: noviRacunId,
        opis: s.opis,
        kolicina: s.kolicina,
        cijena: s.cijena,
        ukupno: s.kolicina * s.cijena
      }));

      const { error: stavkeError } = await supabase
        .from('stavke_racuna')
        .insert(stavkeZaUnos);

      if (stavkeError) throw stavkeError;

      // C) SVE JE PROŠLO!
      router.push('/financije');

    } catch (err: any) {
      console.error(err);
      alert('Greška prilikom spremanja računa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Faktura</h1>
          <p className="text-slate-500 text-sm mt-1">Kreiranje izlaznog računa</p>
        </div>
        <div className="flex gap-3">
            <Link href="/financije" className="bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium shadow-sm transition">
                Odustani
            </Link>
            <button 
              onClick={handleSpremi}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Spremanje...' : 'Izdaj Račun'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* SEKCIJA 1: GLAVNI PODACI */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-100">
            
            {/* LIJEVO: KLIJENT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primatelj računa</h3>
                <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition cursor-pointer font-medium text-slate-700"
                    onChange={handleKlijentChange}
                    value={odabraniKlijentId}
                >
                    <option value="">Odaberite klijenta...</option>
                    {klijenti.map(k => (
                        <option key={k.id} value={k.id}>{k.naziv}</option>
                    ))}
                </select>

                {odabraniKlijentDetalji && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-900 space-y-1">
                        <p className="font-bold">{odabraniKlijentDetalji.naziv}</p>
                        <p>{odabraniKlijentDetalji.adresa}, {odabraniKlijentDetalji.grad}</p>
                        <p>OIB: {odabraniKlijentDetalji.oib}</p>
                    </div>
                )}
            </div>

            {/* DESNO: DETALJI RAČUNA */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalji računa</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Broj računa</label>
                        <input type="text" value={brojRacuna} onChange={e => setBrojRacuna(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none font-mono" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Datum izdavanja</label>
                        <input type="date" value={datumIzdavanja} onChange={e => setDatumIzdavanja(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Datum dospijeća</label>
                        <input type="date" value={datumDospijeca} onChange={e => setDatumDospijeca(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Vezani predmet (opcionalno)</label>
                        <select 
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer"
                            value={odabraniPredmetId}
                            onChange={e => setOdabraniPredmetId(e.target.value)}
                            disabled={!odabraniKlijentId}
                        >
                           <option value="">-- Nije vezano za predmet --</option>
                           {predmetiKlijenta.map(p => (
                             <option key={p.id} value={p.id}>{p.naziv} (#{p.broj_spisa})</option>
                           ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* SEKCIJA 2: STAVKE RAČUNA */}
        <div className="p-8 bg-gray-50/30">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stavke i usluge</h3>
            
            <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                    <div className="col-span-6">Opis usluge</div>
                    <div className="col-span-2 text-right">Količina</div>
                    <div className="col-span-2 text-right">Cijena (€)</div>
                    <div className="col-span-2 text-right">Ukupno</div>
                </div>

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
                            <button onClick={() => obrisiRed(item.id)} className="text-gray-300 hover:text-red-500 transition p-1">✕</button>
                        </div>
                    </div>
                ))}

                <div className="pt-2">
                    <button onClick={dodajRed} className="text-blue-600 text-sm font-bold hover:text-blue-700 flex items-center gap-1">
                        + Dodaj novu stavku
                    </button>
                </div>
            </div>
        </div>

        {/* SEKCIJA 3: ZBROJ */}
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