import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
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
          <div className="flex h-screen overflow-hidden">
            
            <Sidebar />

            {/* GLAVNI SADRŽAJ */}
            <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-slate-950">
              
              {/* HEADER - Dodane dark klase za pozadinu, bordere i tekst */}
              <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pregled</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Dobrodošli natrag, Odvjetnik.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* AVATAR - Dodane dark klase */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold">IM</span>
                  </div>
                </div>
              </header>

              <div className="p-8 max-w-7xl mx-auto w-full">
                {children}
              </div>
              
            </main>
          </div>
        </ThemeProvider>

      </body>
    </html>
  );
}