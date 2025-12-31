'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, User, Building2, Phone, Mail } from "lucide-react";

type Klijent = {
  id: number;
  naziv: string;
  oib: string;
  email: string;
  telefon: string;
  adresa: string;
  grad: string;
  vrsta: 'fizicka' | 'pravna';
  status: string;
};

export default function KlijentiTablica({ klijenti }: { klijenti: Klijent[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtriraniKlijenti = klijenti.filter(k => 
    k.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.oib && k.oib.includes(searchTerm))
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      
      {/* HEADER I PRETRAGA */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži po imenu ili OIB-u..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/klijenti/novi">+ Novi Klijent</Link>
        </Button>
      </div>

      {/* TABLICA */}
      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle>Baza Klijenata</CardTitle>
          <CardDescription>
            Ukupno {filtriraniKlijenti.length} klijenata u sustavu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                {/* PROMJENA: Umjesto "ID" piše "Broj" */}
                <TableHead className="w-[80px]">Broj</TableHead>
                <TableHead>Klijent</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Vrsta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtriraniKlijenti.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nema rezultata pretrage.
                  </TableCell>
                </TableRow>
              ) : (
                filtriraniKlijenti.map((k) => (
                  <TableRow key={k.id} className="hover:bg-slate-50/50 cursor-pointer group">
                    {/* PROMJENA: Maknut znak # ispred broja */}
                    <TableCell className="font-mono text-xs font-medium text-slate-500">
                      {k.id}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border bg-slate-100">
                          <AvatarFallback className="text-slate-700 text-xs font-bold">
                            {getInitials(k.naziv)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{k.naziv}</span>
                          <span className="text-xs text-slate-500">{k.grad || '-'}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm text-slate-600">
                         {k.email && (
                           <div className="flex items-center gap-1.5">
                             <Mail className="h-3 w-3 text-slate-400" />
                             <span className="truncate max-w-[150px]">{k.email}</span>
                           </div>
                         )}
                         {k.telefon && (
                           <div className="flex items-center gap-1.5">
                             <Phone className="h-3 w-3 text-slate-400" />
                             <span>{k.telefon}</span>
                           </div>
                         )}
                         {!k.email && !k.telefon && <span className="text-slate-400">-</span>}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="font-normal gap-1">
                        {k.vrsta === 'pravna' ? <Building2 className="h-3 w-3 opacity-50"/> : <User className="h-3 w-3 opacity-50"/>}
                        {k.vrsta === 'pravna' ? 'Pravna' : 'Fizička'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={k.status === 'Aktivan' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}
                      >
                        {k.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Otvori izbornik</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert("Uskoro: Uređivanje")}>
                            Uredi podatke
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => alert("Uskoro: Brisanje")}>
                            Arhiviraj klijenta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}