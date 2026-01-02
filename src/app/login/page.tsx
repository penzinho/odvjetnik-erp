'use client';

import { useState } from 'react';
import { login } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // MAKNUO SAM FRONTEND VALIDACIJU.
    // Šaljemo što god je korisnik upisao na server.

    const result = await login(formData);

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
          <CardTitle className="text-2xl font-bold tracking-tight">Lex Office</CardTitle>
          <CardDescription>
            Unesite svoje vjerodajnice za pristup sustavu.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* ERROR BOX */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email adresa</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="ime@odvjetnik.hr" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <Label htmlFor="password">Lozinka</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  className="pl-10" 
                  required 
                />
              </div>
              {/* Obrisao sam helper tekst o složenosti lozinke */}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Prijavi se
            </Button>

            <div className="text-center text-sm text-slate-500">
                Nemate račun?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Registriraj se
                </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      
      
      <div className="absolute bottom-6 text-xs text-slate-400 text-center">
         &copy; 2026 Lex Office ERP. Sva prava pridržana.
      </div>
    </div>
  );
}