'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteBiljeznik } from './actions';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, Trash2, Edit, Mail } from "lucide-react";

export default function BiljezniciTable({ biljeznici }: { biljeznici: any[] }) {
  const [filter, setFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cityMap = new Map<string, string>();
  biljeznici.forEach((b) => {
    const city = (b.grad || '').trim();
    if (!city) return;
    const key = city.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, city);
    }
  });
  const cityOptions = Array.from(cityMap.entries()).sort((a, b) => a[1].localeCompare(b[1]));

  const filteredBiljeznici = biljeznici.filter(b =>
    (
      b.naziv.toLowerCase().includes(filter.toLowerCase()) ||
      b.grad?.toLowerCase().includes(filter.toLowerCase()) ||
      b.email?.toLowerCase().includes(filter.toLowerCase()) ||
      b.telefon?.toLowerCase().includes(filter.toLowerCase())
    ) &&
    (cityFilter === "all" || (b.grad || '').trim().toLowerCase() === cityFilter)
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBiljeznik(deleteId);
      setDeleteId(null);
    }
  };

  const handleResetFilters = () => {
    setFilter("");
    setCityFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pretraži bilježnike..."
            className="pl-9"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Svi gradovi" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900">
              <SelectItem value="all">Svi gradovi</SelectItem>
              {cityOptions.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
          Poništi
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naziv Bilježnika</TableHead>
              <TableHead>Adresa</TableHead>
              <TableHead>Grad</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBiljeznici.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Nema rezultata.
                </TableCell>
              </TableRow>
            ) : (
              filteredBiljeznici.map((biljeznik) => (
                <TableRow key={biljeznik.id}>
                  <TableCell className="font-medium">{biljeznik.naziv}</TableCell>
                  <TableCell>{biljeznik.adresa}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-xs">{biljeznik.postanski_broj}</span>
                      <span>{biljeznik.grad}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      <div>{biljeznik.telefon || '-'}</div>
                      <div className="text-xs text-slate-500">{biljeznik.email || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/biljeznici/${biljeznik.public_id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Uredi
                          </DropdownMenuItem>
                        </Link>
                        {biljeznik.email ? (
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${biljeznik.email}`} className="cursor-pointer">
                              <Mail className="mr-2 h-4 w-4" /> Pošalji e-mail
                            </a>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled className="text-slate-400 cursor-not-allowed">
                            <Mail className="mr-2 h-4 w-4" /> Pošalji e-mail
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => setDeleteId(biljeznik.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova radnja će trajno obrisati odabranog bilježnika iz baze podataka.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
