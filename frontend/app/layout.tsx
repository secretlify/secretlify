import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/navigation/page-transition";
import { TransitionProvider } from "@/components/navigation/transition-provider";
import { AppNavigation } from "@/components/navigation/app-navigation";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secretly",
  description: "Secretly is a platform for sharing secrets with your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <TransitionProvider>
          <PageTransition>{children}</PageTransition>
        </TransitionProvider>
        <AppNavigation />
      </body>
    </html>
  );
}
