'use client';

import { saveBiljeznik } from "@/app/biljeznici/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BiljeznikForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await saveBiljeznik(formData);
  };

  return (
    <form action={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

          <div className="space-y-2">
            <Label htmlFor="naziv">Naziv Bilježnika</Label>
            <Input
              id="naziv"
              name="naziv"
              required
              placeholder="npr. Ivica Ivić"
              defaultValue={initialData?.naziv}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresa">Adresa (Ulica i broj)</Label>
            <Input
              id="adresa"
              name="adresa"
              placeholder="Ulica grada Vukovara 84"
              defaultValue={initialData?.adresa}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postanski_broj">Poštanski broj</Label>
              <Input
                id="postanski_broj"
                name="postanski_broj"
                placeholder="10000"
                inputMode="numeric"
                pattern="[0-9]{5}"
                minLength={5}
                maxLength={5}
                title="Poštanski broj mora imati 5 znamenaka."
                defaultValue={initialData?.postanski_broj}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grad">Grad</Label>
              <Input
                id="grad"
                name="grad"
                placeholder="Zagreb"
                defaultValue={initialData?.grad}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input
                id="telefon"
                name="telefon"
                placeholder="+385 1 2345 678"
                defaultValue={initialData?.telefon}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail adresa</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ime.prezime@biljeznik.hr"
                defaultValue={initialData?.email}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50 dark:bg-slate-900/50 p-4">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            Odustani
          </Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Spremi Promjene' : 'Dodaj Bilježnika'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
