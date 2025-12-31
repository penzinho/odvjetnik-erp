'use client';

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateFee } from "@/lib/fee-calculator";

const categories = [
  { value: "kazneno", label: "Kazneno" },
  { value: "parnica", label: "Parnica" },
  { value: "ovrha", label: "Ovrha" },
  { value: "upravni-postupak", label: "Upravni postupak" },
  { value: "upravni-spor", label: "Upravni spor" },
] as const;

const actionOptionsByCategory: Record<string, Array<{ value: string; label: string }>> = {
  kazneno: [],
  parnica: [
    { value: "tuzba", label: "Tužba" },
    { value: "podnesak", label: "Podnesak" },
  ],
  ovrha: [],
  "upravni-postupak": [],
  "upravni-spor": [],
};

export default function KalkulatorPage() {
  const [category, setCategory] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [caseValue, setCaseValue] = useState<string>("");
  const [penaltyUnit, setPenaltyUnit] = useState<string>("mjeseci");
  const isKazneno = category === "kazneno";
  const actionOptions = useMemo(
    () => (category ? actionOptionsByCategory[category] ?? [] : []),
    [category]
  );
  const normalizedCaseValue = caseValue.replace(",", ".");
  const caseValueNumber = normalizedCaseValue === "" ? NaN : Number(normalizedCaseValue);
  const feeResult = useMemo(
    () => calculateFee({ caseValueEur: caseValueNumber, action }),
    [caseValueNumber, action]
  );
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }),
    []
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Kalkulator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Unesite vrijednost predmeta spora i odaberite akciju za obracun.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ulazni podaci</CardTitle>
          <CardDescription>Postavite vrijednost i akciju za izracun.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vrijednost">
                {isKazneno ? "Zapriječena kazna" : "Vrijednost predmeta spora (EUR)"}
              </Label>
              {isKazneno ? (
                <div className="flex gap-3">
                  <Input
                    id="vrijednost"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="0"
                    className="flex-1"
                    value={caseValue}
                    onChange={(event) => setCaseValue(event.target.value)}
                  />
                  <Select value={penaltyUnit} onValueChange={setPenaltyUnit}>
                    <SelectTrigger id="kazna-jedinica" className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mjeseci">Mjeseci</SelectItem>
                      <SelectItem value="godine">Godine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="vrijednost"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="pr-14"
                    value={caseValue}
                    onChange={(event) => setCaseValue(event.target.value)}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                    EUR
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategorija">Postupak</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setAction("");
                }}
              >
                <SelectTrigger id="kategorija">
                  <SelectValue placeholder="Odaberite postupak" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="akcija">Akcija</Label>
              <Select
                value={action}
                onValueChange={setAction}
                disabled={!category}
              >
                <SelectTrigger id="akcija">
                  <SelectValue
                    placeholder={category ? "Odaberite akciju" : "Prvo odaberite postupak"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.length === 0 ? (
                    <SelectItem value="placeholder" disabled>
                      Akcije ce se dodati kasnije
                    </SelectItem>
                  ) : (
                    actionOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {feeResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Rezultat</CardTitle>
            <CardDescription>Bez PDV + PDV = ukupno</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Bez PDV</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currencyFormatter.format(feeResult.net)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>PDV (25%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currencyFormatter.format(feeResult.vat)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base dark:border-slate-800">
                <span>Ukupno</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currencyFormatter.format(feeResult.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
