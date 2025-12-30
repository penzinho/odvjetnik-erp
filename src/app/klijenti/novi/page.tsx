'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation'; // Za preusmjeravanje nakon spremanja

// Definiramo tip podataka za Grad
type Grad = {
  naziv: string;
  pbr: string;
};

export default function NoviKlijentPage() {
  const router = useRouter(); // Inicijalizacija routera
  const [loading, setLoading] = useState(false); // Stanje učitavanja (dok se sprema)

  const [vrstaKlijenta, setVrstaKlijenta] = useState<'fizicka' | 'pravna'>('fizicka');

  // Podaci o gradovima
  const [gradoviPodaci] = useState<Grad[]>([
    { naziv: 'Zagreb', pbr: '10000' },
    { naziv: 'Split', pbr: '21000' },
    { naziv: 'Rijeka', pbr: '51000' },
    { naziv: 'Osijek', pbr: '31000' },
    { naziv: 'Velika Gorica', pbr: '10410' },
    { naziv: 'Zadar', pbr: '23000' },
  ]);
  
  const [drzave] = useState(['Hrvatska', 'Slovenija', 'BiH', 'Njemačka', 'Austrija']);

  // Stanje forme (Input polja)
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [nazivTvrtke, setNazivTvrtke] = useState('');
  const [oib, setOib] = useState('');
  
  const [adresa, setAdresa] = useState('');
  const [odabraniGrad, setOdabraniGrad] = useState('');
  const [postanskiBroj, setPostanskiBroj] = useState('');
  const [odabranaDrzava, setOdabranaDrzava] = useState('Hrvatska');
  
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [iban, setIban] = useState('');

  // Stanja za "Novi unos" (grad/država)
  const [noviGradMode, setNoviGradMode] = useState(false);
  const [novaDrzavaMode, setNovaDrzavaMode] = useState(false);

  // LOGIKA: Promjena grada
  const handleGradChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gradNaziv = e.target.value;
    setOdabraniGrad(gradNaziv);
    const pronadjeniGrad = gradoviPodaci.find(g => g.naziv === gradNaziv);
    if (pronadjeniGrad) setPostanskiBroj(pronadjeniGrad.pbr);
    else setPostanskiBroj('');
  };

  // LOGIKA: Spremanje u bazu
  const handleSpremi = async () => {
    setLoading(true);

    try {
      // 1. GENERIRANJE NOVOG ID-a
      let noviId = 0;
      
      if (vrstaKlijenta === 'fizicka') {
        // Tražimo zadnjeg fizičkog (ID < 10000)
        const { data } = await supabase
          .from('klijenti')
          .select('id')
          .lt('id', 10000) // Manje od 10000
          .order('id', { ascending: false })
          .limit(1);
        
        // Ako postoji zadnji, uzmi njegov ID + 1, inače počni od 1
        noviId = data && data.length > 0 ? Number(data[0].id) + 1 : 1;
      
      } else {
        // Tražimo zadnjeg pravnog (ID >= 10000)
        const { data } = await supabase
          .from('klijenti')
          .select('id')
          .gte('id', 10000) // Veće ili jednako 10000
          .order('id', { ascending: false })
          .limit(1);

        // Ako postoji zadnji, uzmi njegov ID + 1, inače počni od 10001
        noviId = data && data.length > 0 ? Number(data[0].id) + 1 : 10001;
      }

      // 2. PRIPREMA NAZIVA (Spajanje imena i prezimena ako je fizička)
      const konacniNaziv = vrstaKlijenta === 'fizicka' ? `${ime} ${prezime}` : nazivTvrtke;

      // 3. SLANJE U BAZU (INSERT)
      const { error } = await supabase
        .from('klijenti')
        .insert([
          { 
            id: noviId,
            naziv: konacniNaziv,
            oib: oib,
            email: email,
            telefon: telefon,
            adresa: adresa,
            grad: odabraniGrad,
            pbr: postanskiBroj,
            drzava: odabranaDrzava,
            vrsta: vrstaKlijenta,
            iban: iban,
            status: 'Aktivan'
          },
        ]);

      if (error) throw error;

      // 4. USPJEH - Preusmjeri natrag na listu
      alert(`Klijent uspješno spremljen pod brojem #${noviId}`);
      router.push('/klijenti');

    } catch (error: any) {
      console.error('Greška:', error);
      alert('Došlo je do greške prilikom spremanja: ' + error.message);
    } finally {
      setLoading(false);
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

        <form className="p-8 space-y-8" onSubmit={(e) => { e.preventDefault(); handleSpremi(); }}>
          
          {/* 1. OSNOVNI PODACI */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</span>
              Osnovni podaci
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vrstaKlijenta === 'fizicka' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Ime *</label>
                    <input required type="text" value={ime} onChange={e => setIme(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Prezime *</label>
                    <input required type="text" value={prezime} onChange={e => setPrezime(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Naziv Tvrtke / Institucije *</label>
                  <input required type="text" value={nazivTvrtke} onChange={e => setNazivTvrtke(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-purple-500 outline-none transition" />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">OIB</label>
                <input type="text" value={oib} onChange={e => setOib(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition font-mono" maxLength={11} />
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* 2. ADRESA */}
          <div>
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">2</span>
              Adresa i Kontakt
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Ulica i kućni broj</label>
                <input type="text" value={adresa} onChange={e => setAdresa(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>

              {/* GRAD */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                  Grad
                  {!noviGradMode ? (
                    <button type="button" onClick={() => { setNoviGradMode(true); setOdabraniGrad(''); }} className="text-blue-600 hover:text-blue-700 text-[10px] font-bold uppercase cursor-pointer">+ Dodaj novi</button>
                  ) : (
                     <button type="button" onClick={() => setNoviGradMode(false)} className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase cursor-pointer">x Odustani</button>
                  )}
                </label>
                
                {noviGradMode ? (
                  <input type="text" value={odabraniGrad} onChange={e => setOdabraniGrad(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-blue-100 text-blue-900 rounded-lg focus:border-blue-500 outline-none transition" placeholder="Unesite grad..." />
                ) : (
                  <select value={odabraniGrad} onChange={handleGradChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700">
                    <option value="">Odaberi grad...</option>
                    {gradoviPodaci.map(g => <option key={g.naziv} value={g.naziv}>{g.naziv}</option>)}
                  </select>
                )}
              </div>

              {/* PBR */}
               <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Poštanski broj</label>
                <input type="text" value={postanskiBroj} onChange={e => setPostanskiBroj(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>

              {/* DRŽAVA */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">Država</label>
                <select value={odabranaDrzava} onChange={e => setOdabranaDrzava(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition cursor-pointer text-slate-700">
                    <option value="Hrvatska">Hrvatska</option>
                    {drzave.filter(d => d !== 'Hrvatska').map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Telefon</label>
                <input type="text" value={telefon} onChange={e => setTelefon(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition" />
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* 3. FINANCIJE */}
          <div>
             <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">3</span>
              Financijski podaci
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">IBAN</label>
                <input type="text" value={iban} onChange={e => setIban(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none transition font-mono uppercase" />
              </div>
            </div>
          </div>

          {/* GUMBI */}
          <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 text-slate-600 font-medium hover:bg-gray-50 rounded-xl transition">Odustani</button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 rounded-xl transition flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? 'Spremanje...' : 'Spremi Klijenta'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}