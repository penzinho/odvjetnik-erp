import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Briefcase, CalendarRange, FileText, Users } from "lucide-react";

export const revalidate = 0;

type StatValue = number | null;

const formatNumber = (value: StatValue) => {
  if (value === null) return "—";
  return new Intl.NumberFormat("hr-HR").format(value);
};

export default async function StatistikaPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
  const startNextYear = new Date(Date.UTC(currentYear + 1, 0, 1));

  const [aktivniPredmetiRes, klijentiRes, predmetiGodinaRes] = await Promise.all([
    supabase
      .from("predmeti")
      .select("id", { count: "exact", head: true })
      .eq("status", "Aktivan"),
    supabase
      .from("klijenti")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("predmeti")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfYear.toISOString())
      .lt("created_at", startNextYear.toISOString()),
  ]);

  const aktivniPredmeti = aktivniPredmetiRes.error ? null : aktivniPredmetiRes.count ?? 0;
  const brojStranaka = klijentiRes.error ? null : klijentiRes.count ?? 0;
  const predmetiTekucaGodina = predmetiGodinaRes.error ? null : predmetiGodinaRes.count ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistika"
        subtitle="Brzi pregled ključnih pokazatelja u sustavu."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Broj aktivnih predmeta
            </CardTitle>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(aktivniPredmeti)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Status: Aktivan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Broj stranaka
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(brojStranaka)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Evidentirani klijenti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Predmeti otvoreni u {currentYear}.
            </CardTitle>
            <CalendarRange className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(predmetiTekucaGodina)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Otvoreni ove godine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Izdani računi
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-400">Uskoro</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
