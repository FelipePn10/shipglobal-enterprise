import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: 'ShipGlobal-Enterprise',
  description: '',
  generator: 'ShipGlboal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}