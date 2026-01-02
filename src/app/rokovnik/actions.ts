'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  
  const updates = {
    naslov: formData.get('naslov') as string,
    opis: formData.get('opis') as string,
    datum: formData.get('datum') as string,
    vrijeme: formData.get('vrijeme') as string,
    // Dodaj ostala polja po potrebi (npr. vrsta)
  }

  const { error } = await supabase
    .from('rokovnik')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Osvježi sve bitne rute
  revalidatePath('/')
  revalidatePath('/rokovnik')
  
  return { success: true }
}