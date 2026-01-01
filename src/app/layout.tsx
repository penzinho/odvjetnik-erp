import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP Odvjetničko Društvo",
  description: "Sustav za upravljanje predmetima",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'suppressHydrationWarning' je obavezan kad koristimo next-themes da se izbjegne greška u konzoli
    <html lang="hr" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        
        {/* OVDJE SMO AKTIVIRALI THEME PROVIDER */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>

      </body>
    </html>
  );
}
