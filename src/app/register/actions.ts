'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const ime = formData.get('ime') as string
  const prezime = formData.get('prezime') as string

  // 1. VALIDACIJA LOZINKE (Ovdje je obavezna!)
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasMinLength || !hasUpperCase || !hasSpecialChar) {
    return { 
      error: 'Lozinka mora imati min. 8 znakova, jedno veliko slovo i jedan posebni znak (!, ?, # itd.).' 
    };
  }

  // 2. REGISTRACIJA KORISNIKA
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        // Ovo su meta podaci, ali mi koristimo 'profiles' tablicu
        // Svejedno je dobro poslati ih.
        data: {
            first_name: ime,
            last_name: prezime,
        }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // 3. AŽURIRANJE PROFILA (Ime i Prezime)
  // Trigger u bazi je već kreirao redak u 'profiles', sad ga samo dopunjujemo
  if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ ime: ime, prezime: prezime })
        .eq('id', data.user.id)

      if (profileError) {
          console.error("Greška pri spremanju profila:", profileError)
      }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}