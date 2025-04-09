// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/providers";


export const metadata: Metadata = {
  title: "ShipGlobal-Enterprise",
  description: "",
  generator: "ShipGlboal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}