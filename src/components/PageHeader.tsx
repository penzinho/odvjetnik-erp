import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode; // Gumbovi desno
  className?: string;
}

export default function PageHeader({ title, subtitle, extra, className }: PageHeaderProps) {
  return (
    // Ovdje koristimo min-h (minimalnu visinu) da osiguramo da header zauzima
    // isti prostor čak i ako nema podnaslova ili gumba.
    // mb-8 osigurava isti razmak do sadržaja dolje.
    <div className={cn(
      "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-800 min-h-[5rem]", 
      className
    )}>
      
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {extra && (
        <div className="flex items-center gap-2">
          {extra}
        </div>
      )}
    </div>
  );
}