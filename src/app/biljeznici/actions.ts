'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteBiljeznik(id: string) {
  const supabase = await createClient()
  await supabase.from('biljeznici').delete().eq('id', id)
  revalidatePath('/biljeznici')
}

export async function saveBiljeznik(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const postanskiBroj = (formData.get('postanski_broj') as string) || ''
  const biljeznik = {
    naziv: formData.get('naziv') as string,
    adresa: formData.get('adresa') as string,
    postanski_broj: postanskiBroj,
    grad: formData.get('grad') as string,
    telefon: formData.get('telefon') as string,
    email: formData.get('email') as string,
  }

  if (postanskiBroj && !/^\d{5}$/.test(postanskiBroj)) {
    console.error("Neispravan poštanski broj:", postanskiBroj)
    return { error: 'Poštanski broj mora imati 5 znamenaka.' }
  }

  let error

  if (id) {
    const res = await supabase.from('biljeznici').update(biljeznik).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('biljeznici').insert(biljeznik)
    error = res.error
  }

  if (error) {
    console.error("Greška kod spremanja bilježnika:", error.message)
    return { error: error.message }
  }

  revalidatePath('/biljeznici')
  redirect('/biljeznici')
}
