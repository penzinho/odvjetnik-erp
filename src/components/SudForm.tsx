'use client';

import { saveSud } from "@/app/sudovi/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SudForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await saveSud(formData);
    // Redirect radi server action, ne moramo ovdje
  };

  return (
    <form action={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Skriveni ID ako uređujemo */}
          {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

          <div className="space-y-2">
            <Label htmlFor="naziv">Naziv Suda</Label>
            <Input 
                id="naziv" name="naziv" required placeholder="npr. Općinski građanski sud u Zagrebu" 
                defaultValue={initialData?.naziv} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresa">Adresa (Ulica i broj)</Label>
            <Input 
                id="adresa" name="adresa" placeholder="Ulica grada Vukovara 84" 
                defaultValue={initialData?.adresa} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="postanski_broj">Poštanski broj</Label>
                <Input 
                    id="postanski_broj" name="postanski_broj" placeholder="10000" 
                    defaultValue={initialData?.postanski_broj} 
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="grad">Grad</Label>
                <Input 
                    id="grad" name="grad" placeholder="Zagreb" 
                    defaultValue={initialData?.grad} 
                />
             </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t bg-gray-50 dark:bg-slate-900/50 p-4">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
                Odustani
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Spremi Promjene' : 'Dodaj Sud'}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}