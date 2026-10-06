import Link from 'next/link'
import { CartButton, CartSheet } from '@/components/cart-sheet'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          {'Crumb & Co.'}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 md:gap-6">
          <Link href="/#cakes" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Cakes
          </Link>
          <Link href="/#how-it-works" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            How it works
          </Link>
          <CartButton />
        </nav>
      </div>
      <CartSheet />
    </header>
  )
}
