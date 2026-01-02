'use client';

import { useState } from 'react';
import { updateEvent } from '@/app/rokovnik/actions';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, Calendar, Clock, FileText, Briefcase, Save, X, Loader2 
} from "lucide-react";
import { useRouter } from 'next/navigation';

interface EventDialogProps {
  event: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Resetiraj stanje kad se zatvori
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleSave = async (formData: FormData) => {
    setLoading(true);
    await updateEvent(formData);
    setLoading(false);
    setIsEditing(false);
    handleClose(); // Zatvori nakon spremanja
    router.refresh(); // Osvježi podatke na klijentu
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        
        {/* HEADER */}
        <DialogHeader className="flex flex-row items-start justify-between pr-8 space-y-0">
          <DialogTitle className="text-xl font-bold flex flex-col gap-2">
            {isEditing ? 'Uredi Događaj' : 'Detalji Događaja'}
            {!isEditing && (
               <Badge variant="outline" className="w-fit font-normal text-xs">
                 {event.vrsta || 'Opće'}
               </Badge>
            )}
          </DialogTitle>
          
          {/* GUMB ZA UREĐIVANJE (Olovka) */}
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-12 top-4 text-slate-400 hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>

        {/* SADRŽAJ (VIEW MODE vs EDIT MODE) */}
        {isEditing ? (
          
          // --- EDIT MODE (FORMA) ---
          <form action={handleSave} className="space-y-4 py-2">
            <input type="hidden" name="id" value={event.id} />
            
            <div className="space-y-2">
              <Label>Naslov</Label>
              <Input name="naslov" defaultValue={event.naslov} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Datum</Label>
                 <Input type="date" name="datum" defaultValue={event.datum} required />
               </div>
               <div className="space-y-2">
                 <Label>Vrijeme</Label>
                 <Input type="time" name="vrijeme" defaultValue={event.vrijeme} required />
               </div>
            </div>

            <div className="space-y-2">
              <Label>Opis</Label>
              <Textarea name="opis" defaultValue={event.opis} rows={3} />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Odustani
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Spremi promjene
              </Button>
            </DialogFooter>
          </form>

        ) : (

          // --- VIEW MODE (PREGLED) ---
          <div className="space-y-6 py-2">
            
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
               {event.naslov}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Datum</p>
                        <p className="font-medium text-slate-900 dark:text-slate-200">
                           {new Date(event.datum).toLocaleDateString('hr-HR')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Clock className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Vrijeme</p>
                        <p className="font-medium text-slate-900 dark:text-slate-200">
                           {event.vrijeme ? event.vrijeme.slice(0,5) : '-'}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Povezani predmet */}
            {event.predmeti && (
                <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                     <Briefcase className="h-4 w-4 text-purple-500 shrink-0" />
                     <div className="overflow-hidden">
                        <p className="text-xs text-slate-500">Povezani predmet</p>
                        <p className="text-sm font-medium truncate">{event.predmeti.naziv}</p>
                     </div>
                </div>
            )}

            {/* Opis */}
            {event.opis && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                        <FileText className="h-3 w-3" /> Opis / Bilješka
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border-none">
                        {event.opis}
                    </p>
                </div>
            )}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}