import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; 
import AppShell from "@/components/AppShell";
import { createClient } from "@/utils/supabase/server"; // <--- SERVER CLIENT
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lex Office",
  description: "Odvjetnički ERP Sustav",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 1. DOHVAT KORISNIKA NA SERVERU
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  let userProfile = null;

  if (user) {
    // Ako je logiran, dohvati detalje profila (ime, prezime, role)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    userProfile = data;
  }

  return (
    <html lang="hr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {/* 2. ŠALJEMO PODATKE U APP SHELL */}
          <AppShell userProfile={userProfile}>
            {children}
          </AppShell>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}