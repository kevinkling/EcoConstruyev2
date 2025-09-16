import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoConstruye - Plataforma de Donación de Materiales',
  description: 'Conectamos empresas constructoras con ONGs para donar materiales de construcción y promover la sostenibilidad',
  generator: 'v0.app',
  icons: {
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
