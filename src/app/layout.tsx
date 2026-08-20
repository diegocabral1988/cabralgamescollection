import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CABRAL GAMES COLLECTION — Tracker de Consoles Retrô",
  description: "Acervo retrô · cotação · aquisição · legado. Tracker pessoal de consoles clássicos.",
};

export const viewport: Viewport = {
  themeColor: "#252525",
};

const themeInit = `try{if(localStorage.getItem('cgc_theme')==='light')document.documentElement.classList.add('light')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-symbols" aria-hidden="true" />
        <div className="bg-scan" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
