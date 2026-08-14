import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PT_Mono, Quantico } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const ptMono = PT_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "I.R.I.S",
  description: "Sistema de fichas para o RPG de investigação e mistério",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${ptMono.variable} ${quantico.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}