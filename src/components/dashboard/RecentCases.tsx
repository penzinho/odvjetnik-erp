'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RecentCases({ cases }: { cases: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Briefcase className="h-5 w-5 text-purple-600" />
             Nedavni Predmeti
           </div>
           <Link href="/predmeti" className="text-xs text-blue-600 hover:underline font-normal">Svi predmeti</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
           {cases.map((c) => (
             <Link href={`/predmeti/${c.id}`} key={c.id} className="block hover:bg-slate-50 dark:hover:bg-slate-900 transition p-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 font-mono">
                         {c.klijent_id}-{c.broj_spisa}
                      </Badge>
                      <div>
                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{c.naziv}</p>
                         <p className="text-xs text-slate-500">{c.klijenti?.naziv}</p>
                      </div>
                   </div>
                   <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
             </Link>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}