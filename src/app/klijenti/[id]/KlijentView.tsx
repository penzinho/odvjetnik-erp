'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, Mail, MapPin, Building2, Briefcase, FileText, ArrowLeft, MoreHorizontal, Edit
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Definiramo tipove ovdje ili u posebnom fileu
type KlijentViewProps = {
  klijent: any;
  predmeti: any[];
  racuni: any[];
};

export default function KlijentView({ klijent, predmeti, racuni }: KlijentViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      
      {/* HEADER: Navigacija i Naslov */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {klijent.naziv}
                    {klijent.vrsta === 'pravna' && <Badge variant="secondary">Pravna osoba</Badge>}
                </h1>
                <p className="text-slate-500 text-sm">ID: #{klijent.id} • OIB: {klijent.oib}</p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" /> Uredi
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Arhiviraj klijenta</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Obriši</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* TABS SUČELJE */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="predmeti">Predmeti ({predmeti.length})</TabsTrigger>
          <TabsTrigger value="financije">Računi ({racuni.length})</TabsTrigger>
        </TabsList>

        {/* 1. TAB: INFORMACIJE */}
        <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Kontakt Kartica */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" /> Kontakt Podaci
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Email</p>
                                <p className="text-sm font-medium">{klijent.email || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Telefon</p>
                                <p className="text-sm font-medium">{klijent.telefon || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Adresa Kartica */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" /> Adresa i Sjedište
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                                <Building2 className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase">Adresa</p>
                                <p className="text-sm font-medium">{klijent.adresa || '-'}</p>
                                <p className="text-sm text-slate-500">{klijent.grad}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* 2. TAB: PREDMETI */}
        <TabsContent value="predmeti" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Povezani predmeti</CardTitle>
                </CardHeader>
                <CardContent>
                    {predmeti.length === 0 ? (
                        <p className="text-sm text-slate-500">Nema otvorenih predmeta.</p>
                    ) : (
                        <div className="grid gap-2">
                            {predmeti.map(p => (
                                <Link href={`/predmeti/${p.id}`} key={p.id}>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="font-mono bg-slate-50">{p.klijent_id}-{p.broj_spisa}</Badge>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{p.naziv}</p>
                                                <p className="text-xs text-slate-500">{p.vrsta}</p>
                                            </div>
                                        </div>
                                        <Badge className={p.status === 'Aktivan' ? 'bg-green-500' : 'bg-slate-500'}>{p.status}</Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* 3. TAB: FINANCIJE */}
        <TabsContent value="financije" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Izdani računi</CardTitle>
                </CardHeader>
                <CardContent>
                    {racuni.length === 0 ? (
                        <p className="text-sm text-slate-500">Nema izdanih računa.</p>
                    ) : (
                        <div className="grid gap-2">
                            {racuni.map(r => (
                                <Link href={`/financije/racuni/${r.id}`} key={r.id}>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                                <FileText className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Račun {r.broj_racuna}</p>
                                                <p className="text-xs text-slate-500">{r.datum_izdavanja}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">{Number(r.iznos_ukupno).toFixed(2)} €</p>
                                            <span className={`text-[10px] font-bold ${r.status === 'Plaćeno' ? 'text-green-600' : 'text-red-500'}`}>{r.status}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}