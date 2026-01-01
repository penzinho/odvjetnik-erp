# Lex Office - Trenutne funkcionalnosti

Ovaj dokument opisuje funkcionalnosti koje su trenutno implementirane u aplikaciji.

## Navigacija i opci okvir
- App shell s fiksnim headerom, globalnom pretragom i responsivnim sidebarom (sklapanje i mobilna navigacija).
- Prikaz korisnickog profila u zaglavlju.

## Pregled (Dashboard)
- Pregledna pocetna stranica s aktualnim dogadajima iz rokovnika za iduca 4 dana.
- Panel "Dospijeva danas" s rokovima i rocistima koji padaju na danasnji datum.
- Lista nedavnih predmeta (zadnjih 5) s brzim linkom na detalje.
- Statisticki prikaz "Ovaj mjesec" s brojacima i grafom (trenutno staticki/placeholder).

## Pretraga
- Globalna pretraga u headeru s prijedlozima za klijente, predmete i racune.
- Stranica rezultata pretrage s grupiranim karticama za klijente, predmete i racune.

## Klijenti
- Popis klijenata s filtriranjem po nazivu i OIB-u.
- Prikaz osnovnih podataka (kontakt, vrsta klijenta, status).
- Kreiranje novog klijenta (fizicka/pravna osoba) s automatskom numeracijom ID-a.
- Unos adrese, grada, drzave, kontakt podataka i IBAN-a.

## Predmeti
- Popis predmeta s filtriranjem po nazivu, klijentu, broju spisa i poslovnom broju.
- Otvaranje novog predmeta uz automatski broj spisa i naziv (klijent c/a protustranka).
- Evidencija detalja predmeta: vrsta, sud, poslovni broj, VPS, voditelj.
- Detaljni prikaz predmeta s tabovima Informacije, Rocista i Zadaci.
- Pregled rokova/rocista vezanih uz predmet.
- Zadaci uz mogucnost oznacavanja obavljenog.

## Rokovnik
- Kalendar s pogledom mjesec/tjedan/radni tjedan i navigacijom kroz razdoblja.
- Prikaz dogadaja na kalendaru i lista nadolazecih obaveza.
- Unos novog roka/rocista/sastanka uz povezivanje s predmetom, datum, vrijeme, mjesto i napomenu.

## Financije
- Dashboard sa sumama: naplaceno, otvoreno potrazivanje i dospjelo (kasnjenje).
- Popis racuna s klijentom/predmetom, datumima, iznosima i statusom.
- Izrada nove fakture s odabirom klijenta i opcionalnog predmeta.
- Stavke racuna s unosom kolicine i cijene, uz automatski izracun osnovice, PDV-a i ukupnog iznosa.
- Spremanje racuna i stavki u bazu.

## Alati
- Kalkulator naknada: odabir postupka i akcije (parnica: tuzba/podnesak) uz izracun neto, PDV i ukupno.
- Podrska za unos vrijednosti spora ili kazne (kazneno - UI).

## Postavke
- Promjena teme sucelja: svijetlo, tamno ili prema sustavu.
