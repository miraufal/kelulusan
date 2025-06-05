import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pengumuman Kelulusan",
  authors: [{name: "Zakariya", url: ""}],
  description: "Pengumuman kelulusan siswa MI Raudlotul Athfal TP 2024-2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <footer className="text-center text-sm text-gray-500 overflow-auto ">
          <p className="font-bold">
            Designed and Created by {" "}
            <a
              href="https://github.com/zakariya"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zakariya
            </a>
          </p>
        </footer>        
      </body>
    </html>
  );
}
