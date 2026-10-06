'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { setLineQuantity } from '@/app/actions/cart'
import { useCart, useCartOpen } from '@/hooks/use-cart'
import { formatMoney } from '@/lib/format'
import type { CartLine } from '@/lib/shopify'

export function CartButton() {
  const { data: cart } = useCart()
  const [, setOpen] = useCartOpen()
  const count = cart?.totalQuantity ?? 0

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(true)}>
      <ShoppingBag className="size-5" aria-hidden="true" />
      <span className="sr-only">{`Open cart, ${count} items`}</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </Button>
  )
}

function CartLineItem({ line }: { line: CartLine }) {
  const { mutate } = useCart()
  const [pending, startTransition] = useTransition()
  const image = line.merchandise.product.featuredImage

  const change = (quantity: number) =>
    startTransition(async () => {
      const cart = await setLineQuantity(line.id, quantity)
      await mutate(cart, { revalidate: false })
    })

  return (
    <li className="flex gap-4 py-4" aria-busy={pending}>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {image && (
          <Image src={image.url} alt={image.altText ?? line.merchandise.product.title} fill sizes="80px" className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-serif text-base leading-tight">{line.merchandise.product.title}</p>
            <p className="text-xs text-muted-foreground">{line.merchandise.title}</p>
          </div>
          <button
            type="button"
            onClick={() => change(0)}
            disabled={pending}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">{`Remove ${line.merchandise.product.title}`}</span>
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-full border">
            <button
              type="button"
              className="p-1.5 disabled:opacity-40"
              onClick={() => change(line.quantity - 1)}
              disabled={pending}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              type="button"
              className="p-1.5 disabled:opacity-40"
              onClick={() => change(line.quantity + 1)}
              disabled={pending || line.quantity >= 10}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <p className="text-sm font-medium tabular-nums">{formatMoney(line.cost.totalAmount)}</p>
        </div>
      </div>
    </li>
  )
}

export function CartSheet() {
  const { data: cart } = useCart()
  const [open, setOpen] = useCartOpen()
  const lines = cart?.lines.nodes ?? []

  const checkout = () => {
    if (!cart) return
    const url = new URL(cart.checkoutUrl)
    url.searchParams.set('channel', 'online_store')
    if (window.self !== window.top) {
      window.open(url.toString(), '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url.toString()
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your box</SheetTitle>
          <SheetDescription>Freshly baked to order, ready in 48 hours.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="font-serif text-lg">Your box is empty</p>
            <p className="text-sm text-muted-foreground">Pick a cake to get started.</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        )}

        {cart && lines.length > 0 && (
          <SheetFooter className="border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-semibold tabular-nums">{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Taxes and delivery calculated at checkout.</p>
            <Button size="lg" className="w-full" onClick={checkout}>
              Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
