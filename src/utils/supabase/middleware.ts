import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Kreiraj odgovor (response) koji ćemo vratiti
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Inicijaliziraj Supabase klijent
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Provjeri korisnika
  // OPREZ: getUser() je sigurnije od getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. LOGIKA ZAŠTITE
  
  const pathname = request.nextUrl.pathname
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/auth')

  // Ako korisnik NIJE logiran i NIJE na auth stranicama
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Ako je korisnik VEĆ logiran i pokušava otvoriti auth stranice
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Vrati originalni odgovor (s ažuriranim kolačićima)
  return supabaseResponse
}
