import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

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
    <html lang="hr">
      <body className={`${inter.className} bg-[#F3F4F6] text-slate-600`}>
        <div className="flex h-screen overflow-hidden">
          {/* UMETNULI SMO PAMETNI SIDEBAR */}
          <Sidebar />

          {/* GLAVNI SADRŽAJ */}
          <main className="flex-1 flex flex-col overflow-y-auto bg-[#F9FAFB]">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Pregled</h2>
                <p className="text-sm text-slate-400">
                  Dobrodošli natrag, Odvjetnik.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                  <span className="font-bold">IM</span>
                </div>
              </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
