'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Scale, Briefcase, ArrowRight } from "lucide-react";

type Predmet = {
  id: number;
  broj_spisa: number;
  klijent_id: number;
  naziv: string;
  vrsta: string;
  sud: string;
  poslovni_broj: string;
  vps: string;
  status: string;
  klijenti: { naziv: string } | null; // Relacija
};

export default function PredmetiTablica({ predmeti }: { predmeti: Predmet[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtriranje (po nazivu, broju spisa, imenu klijenta ili poslovnom broju)
  const filtriraniPredmeti = predmeti.filter(p => {
    const term = searchTerm.toLowerCase();
    const puniBroj = `${p.klijent_id}-${p.broj_spisa}`;
    
    return (
      p.naziv.toLowerCase().includes(term) ||
      (p.klijenti?.naziv && p.klijenti.naziv.toLowerCase().includes(term)) ||
      puniBroj.includes(term) ||
      (p.poslovni_broj && p.poslovni_broj.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      
      {/* HEADER I PRETRAGA */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Traži po strankama, broju spisa..."
            className="pl-8 bg-white dark:bg-slate-900 dark:border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700">
          <Link href="/predmeti/novi">+ Novi Predmet</Link>
        </Button>
      </div>

      {/* TABLICA */}
      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle>Popis Predmeta</CardTitle>
          <CardDescription>
            Ukupno {filtriraniPredmeti.length} aktivnih i arhiviranih spisa.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px]">
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="w-[100px]">Broj</TableHead>
                <TableHead>Naziv Predmeta</TableHead>
                <TableHead>Vrsta</TableHead>
                <TableHead>Sud / Poslovni broj</TableHead>
                <TableHead className="text-right">VPS</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtriraniPredmeti.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nema rezultata pretrage.
                  </TableCell>
                </TableRow>
              ) : (
                filtriraniPredmeti.map((p) => (
                  <TableRow 
                    key={p.id} 
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer group"
                    onClick={() => router.push(`/predmeti/${p.id}`)}
                  >
                    {/* BROJ SPISA (Zadržali smo tvoj plavi stil) */}
                    <TableCell>
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 text-xs">
                        {p.klijent_id}-{p.broj_spisa}
                      </span>
                    </TableCell>
                    
                    {/* NAZIV */}
                    <TableCell>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.naziv}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                         <span className="text-slate-400 dark:text-slate-500">Klijent:</span> {p.klijenti?.naziv}
                      </div>
                    </TableCell>
                    
                    {/* VRSTA */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Briefcase className="h-3 w-3 opacity-50" />
                        <span>{p.vrsta}</span>
                      </div>
                    </TableCell>
                    
                    {/* SUD */}
                    <TableCell>
                      <div className="flex flex-col text-sm">
                         <span className="font-mono text-slate-700 dark:text-slate-200 text-xs">{p.poslovni_broj || '-'}</span>
                         {p.sud && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <Scale className="h-3 w-3 opacity-50" /> {p.sud}
                            </span>
                         )}
                      </div>
                    </TableCell>

                    {/* VPS */}
                    <TableCell className="text-right font-medium text-slate-700 dark:text-slate-200">
                      {p.vps || '-'}
                    </TableCell>
                    
                    {/* STATUS */}
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={p.status === 'Aktivan' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    
                    {/* STRELICA */}
                    <TableCell className="text-right">
                       <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-500 group-hover:text-blue-600 transition-colors ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
