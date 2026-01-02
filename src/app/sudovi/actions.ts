'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// BRISANJE
export async function deleteSud(id: string) {
  const supabase = await createClient()
  await supabase.from('sudovi').delete().eq('id', id)
  revalidatePath('/sudovi')
}

// KREIRANJE / AŽURIRANJE
export async function saveSud(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const sud = {
    naziv: formData.get('naziv') as string,
    adresa: formData.get('adresa') as string,
    postanski_broj: formData.get('postanski_broj') as string,
    grad: formData.get('grad') as string,
  }

  console.log("--- POKUŠAJ SPREMANJA ---", sud); // <--- DEBUG

  let error;

  if (id) {
    // Ažuriranje
    const res = await supabase.from('sudovi').update(sud).eq('id', id);
    error = res.error;
  } else {
    // Kreiranje novog
    const res = await supabase.from('sudovi').insert(sud);
    error = res.error;
  }

  if (error) {
    console.error("❌ GREŠKA KOD SPREMANJA:", error.message); // <--- OVO ĆE TI PISATI U TERMINALU
    // Ovdje bi idealno vratili grešku nazad na formu, ali za debug je dovoljan log
    return { error: error.message }; 
  }

  console.log("✅ USPJEŠNO SPREMLJENO!");
  revalidatePath('/sudovi')
  redirect('/sudovi')
}
