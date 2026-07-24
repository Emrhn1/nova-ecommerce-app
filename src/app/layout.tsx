import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppThemeProvider from "@/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "NOVA Commerce — Modern E-Commerce Platform",
  description: "Everyday essentials, exceptionally considered. Discover curated products with fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}

