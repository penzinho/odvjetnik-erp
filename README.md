# ⚖️ Lex Office - Odvjetnički ERP

> Moderno web rješenje za upravljanje odvjetničkim uredom, predmetima, rokovima i financijama.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

Ovaj projekt je **Minimum Viable Product (MVP)** sustava za digitalizaciju odvjetničkog poslovanja. Izgrađen je na najnovijim web tehnologijama s fokusom na brzinu (Server Side Rendering), sigurnost i jednostavnost korištenja.

---

## 🚀 Ključne Funkcionalnosti

### 👥 1. Upravljanje Klijentima (CRM)
- Centralna baza fizičkih i pravnih osoba.
- **Automatska numeracija:** Sustav sam dodjeljuje ID-eve (1-9999 za fizičke, 10000+ za pravne osobe).
- Brza pretraga i filtriranje.
- Povijest i detalji svakog klijenta.

### 📂 2. Upravljanje Predmetima (Spisi)
- Povezivanje predmeta s klijentima.
- **Automatsko generiranje:** Sustav kreira naziv predmeta (*Stranka c/a Protustranka*) i dodjeljuje broj spisa (*ID_Klijenta - Redni_Broj*).
- Detaljan pregled spisa: Info, Ročišta, Zadaci.
- Statusi predmeta (Aktivan, U mirovanju, Arhiviran).

### 📅 3. Pametni Rokovnik
- Centralni kalendar s prikazom Mjesec / Tjedan / Radni tjedan.
- Unos ročišta, sastanaka i rokova povezanih s konkretnim predmetima.
- Prikaz nadolazećih obaveza i upozorenja za hitne rokove.

### 💶 4. Financije i Naplata
- Financijski dashboard s prikazom prihoda, otvorenih potraživanja i dospjelih računa.
- **Izrada faktura:** Odabir klijenta, automatsko povlačenje vezanih predmeta.
- Stavke računa s automatskim izračunom poreza (PDV) i ukupnih iznosa.

---

## 🛠️ Tehnološki Stack

* **Frontend & Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Jezik:** TypeScript
* **Stiliziranje:** Tailwind CSS
* **Baza podataka & Backend:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Ikone:** Heroicons / Custom SVG

---

## ⚙️ Kako pokrenuti projekt lokalno

1.  **Kloniraj repozitorij:**
    ```bash
    git clone [https://github.com/TVOJ_USERNAME/odvjetnicki-erp.git](https://github.com/TVOJ_USERNAME/odvjetnicki-erp.git)
    cd odvjetnicki-erp
    ```

2.  **Instaliraj zavisnosti:**
    ```bash
    npm install
    ```

3.  **Postavi varijable okruženja:**
    Kreiraj datoteku `.env.local` u korijenu projekta i dodaj svoje Supabase ključeve:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tvoj_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tvoj_supabase_anon_key
    ```

4.  **Pokreni razvojni server:**
    ```bash
    npm run dev
    ```
    Otvori [http://localhost:3000](http://localhost:3000) u pregledniku.

---

## 🗺️ Plan Razvoja (Roadmap)

Projekt je trenutno u MVP fazi. Planirane nadogradnje uključuju:

- [ ] **Faza 1:** Implementacija Login sustava i sigurnosnih pravila (RLS).
- [ ] **Faza 2:** Upload dokumenata (PDF, Word) na predmete (Supabase Storage).
- [ ] **Faza 3:** Generiranje PDF faktura i punomoći jednim klikom.
- [ ] **Faza 4:** Implementacija HOK Odvjetničke tarife (kalkulator bodova).
- [ ] **Faza 5:** Hosting na Vercel platformi.

---

## 📞 Kontakt

Razvijeno s ❤️ za modernizaciju odvjetništva.