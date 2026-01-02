'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signup } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Frontend provjera podudaranja lozinki
    if (password !== confirmPassword) {
        setError("Lozinke se ne podudaraju.");
        setLoading(false);
        return;
    }

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-gray-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/20">
              L
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Novi korisnički račun</CardTitle>
          <CardDescription>
            Pridružite se Lex Office timu.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ime">Ime</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <Input id="ime" name="ime" placeholder="Ivan" className="pl-10" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prezime">Prezime</Label>
                    <Input id="prezime" name="prezime" placeholder="Horvat" required />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email adresa</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="email" name="email" type="email" placeholder="ime@odvjetnik.hr" className="pl-10" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="password" name="password" type="password" className="pl-10" required />
              </div>
              <p className="text-[10px] text-slate-400">Min. 8 znakova, veliko slovo i simbol.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Ponovi lozinku</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="confirmPassword" name="confirmPassword" type="password" className="pl-10" required />
              </div>
            </div>

          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registriraj se
            </Button>
            
            <div className="text-center text-sm text-slate-500">
                Već imate račun?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Prijavi se
                </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}