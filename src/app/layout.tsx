import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "relative h-full font-sans antialiased",
          inter.className
        )}>
        <main className="relative flex flex-col min-h-screen">
          <Providers>
            <Navbar/>
            <div className="flex-grow flex-1 app">
              {children}
              </div>
            <Footer/>
          </Providers>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
