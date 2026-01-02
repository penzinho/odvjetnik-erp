'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteSud } from './actions';
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
import { MoreHorizontal, Search, Trash2, Edit } from "lucide-react";

export default function SudoviTable({ sudovi }: { sudovi: any[] }) {
  const [filter, setFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cityMap = new Map<string, string>();
  sudovi.forEach((s) => {
    const city = (s.grad || '').trim();
    if (!city) return;
    const key = city.toLowerCase();
    if (!cityMap.has(key)) {
      cityMap.set(key, city);
    }
  });
  const cityOptions = Array.from(cityMap.entries()).sort((a, b) => a[1].localeCompare(b[1]));

  // Klijentsko filtriranje
  const filteredSudovi = sudovi.filter(s =>
    (
      s.naziv.toLowerCase().includes(filter.toLowerCase()) ||
      s.grad?.toLowerCase().includes(filter.toLowerCase())
    ) &&
    (cityFilter === "all" || (s.grad || '').trim().toLowerCase() === cityFilter)
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSud(deleteId);
      setDeleteId(null);
    }
  };

  const handleResetFilters = () => {
    setFilter("");
    setCityFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pretraži sudove..."
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

      {/* Tablica */}
      <div className="rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naziv Suda</TableHead>
              <TableHead>Adresa</TableHead>
              <TableHead>Grad</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSudovi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  Nema rezultata.
                </TableCell>
              </TableRow>
            ) : (
              filteredSudovi.map((sud) => (
                <TableRow key={sud.id}>
                  <TableCell className="font-medium">{sud.naziv}</TableCell>
                  <TableCell>{sud.adresa}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-slate-500 font-mono text-xs">{sud.postanski_broj}</span>
                       <span>{sud.grad}</span>
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
                        <Link href={`/sudovi/${sud.public_id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Uredi
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => setDeleteId(sud.id)}
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

      {/* Dijalog za potvrdu brisanja */}
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
              Ova radnja će trajno obrisati odabrani sud iz baze podataka.
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
