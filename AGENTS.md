# Smjernice za programere (AGENTS.md)

Ovaj dokument pruža smjernice za programere koji rade na projektu Odvjetnički ERP. Njegova je svrha osigurati dosljednost, kvalitetu i nesmetan tijek razvoja.

## 1. Tehnološki sklop

- **Okvir**: [Next.js](https://nextjs.org/) (koristeći App Router)
- **Jezik**: [TypeScript](https://www.typescriptlang.org/)
- **Pozadina i baza podataka**: [Supabase](https://supabase.io/) (koristeći `@supabase/ssr` za autentifikaciju)
- **Stiliziranje**: [Tailwind CSS](https://tailwindcss.com/)
- **UI komponente**: [shadcn/ui](https://ui.shadcn.com/)
- **Testiranje**: [Vitest](https://vitest.dev/)
- **Linting i formatiranje**: ESLint, Prettier

## 2. Početak rada

1.  **Klonirajte repozitorij:**
    ```bash
    git clone <repository-url>
    cd odvjetnicki-erp
    ```
2.  **Instalirajte ovisnosti:**
    ```bash
    npm install
    ```
3.  **Postavite varijable okruženja:**
    Stvorite datoteku `.env.local` u korijenu projekta. Morat ćete preuzeti Supabase URL i anon ključ iz postavki vašeg Supabase projekta.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
4.  **Pokrenite razvojni poslužitelj:**
    ```bash
    npm run dev
    ```
    Aplikacija će biti dostupna na `http://localhost:3000`.

## 3. Struktura projekta

- `src/app/`: Sadrži sve stranice i rute, prateći konvencije Next.js App Routera.
- `src/components/`: Ponovno iskoristive React komponente koje se koriste u cijeloj aplikaciji.
- `src/components/ui/`: UI komponente iz biblioteke shadcn/ui.
- `src/lib/`: Glavna aplikacijska logika, uslužni programi i biblioteke.
- `src/utils/supabase/`: Sadrži Supabase klijente za interakcije na strani poslužitelja, klijenta i međuprograma (middleware).

## 4. Dizajn i korisničko sučelje

Projekt koristi **Tailwind CSS** za stiliziranje i **shadcn/ui** kao osnovnu biblioteku komponenti.

- **Dosljednost je ključna.** Prije stvaranja nove komponente, provjerite postoji li slična već u `src/components/` ili `src/components/ui/`.
- **Koristite definiranu temu.** Sve boje, fontovi i razmaci definirani su u `tailwind.config.ts`. Pridržavajte se ove teme kako biste održali dosljedan vizualni identitet. Nemojte uvoditi jednokratne boje ili stilove.
- **Alias putanje**: Koristite `@/` alias za uvoz iz `src/` direktorija (npr. `import { Button } from '@/components/ui/button';`).

## 5. Tijek razvoja i dnevnik promjena

Kako bi se održala jasna i organizirana povijest promjena, svaki programer mora zabilježiti svoje doprinose.

**Pravilo**: Prije finaliziranja svog rada (npr. stvaranja pull requesta), dodajte kratak, korisniku prilagođen opis svojih promjena u datoteku `changelog.md` u korijenu projekta. Svaka promjena treba biti nova stavka na popisu.

Primjer unosa u `changelog.md`:
```markdown
- Dodana značajka autentifikacije korisnika pomoću Supabasea.
```