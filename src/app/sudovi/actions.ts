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
  const postanskiBroj = (formData.get('postanski_broj') as string) || ''
  const sud = {
    naziv: formData.get('naziv') as string,
    adresa: formData.get('adresa') as string,
    postanski_broj: postanskiBroj,
    grad: formData.get('grad') as string,
  }

  if (postanskiBroj && !/^\d{5}$/.test(postanskiBroj)) {
    console.error("Neispravan poštanski broj:", postanskiBroj);
    return { error: 'Poštanski broj mora imati 5 znamenaka.' };
  }

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
    console.error("Greška kod spremanja:", error.message);
    return { error: error.message }; 
  }

  revalidatePath('/sudovi')
  redirect('/sudovi')
}
