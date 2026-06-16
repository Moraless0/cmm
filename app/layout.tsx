import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinPlan - Tu Plan Financiero",
  description: "Aplicación financiera integral para gestionar tus ahorros, metas y emociones financieras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-black">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
