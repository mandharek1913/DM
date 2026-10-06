import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })

export const metadata: Metadata = {
  title: 'Crumb & Co. | Handmade Layer Cakes Baked to Order',
  description:
    'Order small-batch layer cakes online: chocolate ganache, red velvet, strawberry shortcake and more, baked fresh within 48 hours.',
  verification: {
    google:
      "3-iCJyX6_zf2crF5ZLk9fRCscPvU14-CPxwqkN4-ihE"
  },
  
}

export const viewport: Viewport = {
  themeColor: '#f8f3ec',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
