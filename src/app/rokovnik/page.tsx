'use client';

import { useState } from 'react';

export default function RokovnikPage() {
  // Simulirani podaci o rokovima
  const rokovi = [
    { id: 1, datum: 30, mjesec: 1, predmet: "Ivan Horvat c/a Croatia Osiguranje", radnja: "Ročište", vrijeme: "09:00", hitno: true },
    { id: 2, datum: 2, mjesec: 2, predmet: "Tech Corp c/a Min. Fin.", radnja: "Predaja žalbe", vrijeme: "do 12:00", hitno: true },
    { id: 3, datum: 5, mjesec: 2, predmet: "Razvod braka K.L.", radnja: "Sastanak sa strankom", vrijeme: "14:00", hitno: false },
  ];

  // Današnji datum (simuliramo da je 30.01.)
  const currentMonth = "Siječanj 2024";
  
  // Generiranje dana za kalendar (jednostavna matrica)
  // 0 = prazno polje, broj = dan u mjesecu
  const daniKalendara = [
    0, 0, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 0
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rokovnik</h1>
          <p className="text-slate-500 text-sm">Pregled ročišta i rokova</p>
        </div>
        
        <div className="flex gap-3">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded">&lt;</button>
                <button className="px-4 py-1 text-sm font-bold text-slate-800">{currentMonth}</button>
                <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded">&gt;</button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition flex items-center gap-2 text-sm">
            <span className="text-lg">+</span>
            Novi Rok
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* LIJEVO: KALENDAR (Veliki prikaz) */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            {/* Dani u tjednu */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                {['PON', 'UTO', 'SRI', 'ČET', 'PET', 'SUB', 'NED'].map(dan => (
                    <div key={dan} className="py-3 text-center text-xs font-bold text-slate-400 tracking-wider">
                        {dan}
                    </div>
                ))}
            </div>

            {/* Mreža datuma */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {daniKalendara.map((dan, index) => {
                    // Nađi rokove za ovaj dan
                    const rokoviZaDan = rokovi.filter(r => r.datum === dan && r.mjesec === 1); // Filter samo za siječanj
                    const isToday = dan === 30; // Simulacija danas

                    return (
                        <div key={index} className={`border-b border-r border-gray-50 p-2 min-h-[100px] relative hover:bg-slate-50 transition group ${dan === 0 ? 'bg-gray-50/30' : ''}`}>
                            {dan > 0 && (
                                <>
                                    <span className={`text-sm font-medium block mb-1 ${isToday ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md' : 'text-slate-500'}`}>
                                        {dan}
                                    </span>
                                    
                                    {/* Prikaz točkica/rokova u kalendaru */}
                                    <div className="space-y-1">
                                        {rokoviZaDan.map(rok => (
                                            <div key={rok.id} className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer ${
                                                rok.hitno 
                                                ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' 
                                                : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                                            }`}>
                                                <span className="font-bold">{rok.vrijeme}</span> {rok.radnja}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* DESNO: SIDEBAR S ROKOVIMA (Alerts) */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
            
            {/* HITNO / DANAS */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Hitno / Danas
                </h3>
                
                <div className="space-y-3">
                     <div className="p-3 bg-red-50 rounded-xl border border-red-100 cursor-pointer hover:shadow-sm transition">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-red-600 bg-white px-2 py-0.5 rounded shadow-sm">09:00</span>
                            <span className="text-[10px] text-red-400 font-bold uppercase">Ročište</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-tight">Horvat vs. Croatia Osiguranje</p>
                        <p className="text-xs text-slate-500 mt-1">Sudnica 102, Sudac Ivić</p>
                     </div>
                </div>
            </div>

            {/* NADOLAZEĆE */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1">
                <h3 className="font-bold text-slate-800 mb-4">Nadolazeće</h3>
                <div className="space-y-4">
                     
                     <div className="flex gap-3 items-start group cursor-pointer">
                        <div className="flex flex-col items-center bg-gray-50 rounded-lg px-2 py-1 min-w-[50px] border border-gray-100 group-hover:border-blue-200 transition">
                            <span className="text-xs font-bold text-slate-400">VELJ</span>
                            <span className="text-xl font-bold text-slate-800">02</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">Predaja žalbe</p>
                            <p className="text-xs text-slate-500">Tech Corp vs. Min. Fin.</p>
                            <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-1.5 py-0.5 rounded mt-1 inline-block">Rok istječe!</span>
                        </div>
                     </div>

                     <div className="flex gap-3 items-start group cursor-pointer">
                        <div className="flex flex-col items-center bg-gray-50 rounded-lg px-2 py-1 min-w-[50px] border border-gray-100 group-hover:border-blue-200 transition">
                            <span className="text-xs font-bold text-slate-400">VELJ</span>
                            <span className="text-xl font-bold text-slate-800">05</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition">Sastanak sa strankom</p>
                            <p className="text-xs text-slate-500">Razvod braka K.L.</p>
                        </div>
                     </div>

                </div>
            </div>

        </div>

      </div>
    </div>
  );
}