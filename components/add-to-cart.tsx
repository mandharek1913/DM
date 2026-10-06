'use client'

import { useState, useTransition } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/app/actions/cart'
import { useCart, useCartOpen } from '@/hooks/use-cart'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ProductVariant } from '@/lib/shopify'

export function AddToCart({ variants }: { variants: ProductVariant[] }) {
  const [variantId, setVariantId] = useState(variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const { mutate } = useCart()
  const [, setOpen] = useCartOpen()

  const selected = variants.find((v) => v.id === variantId)

  const submit = () =>
    startTransition(async () => {
      if (!selected) return
      setError(null)
      try {
        const cart = await addToCart(selected.id, quantity)
        await mutate(cart, { revalidate: false })
        setOpen(true)
      } catch {
        setError('Could not add to cart. Please try again.')
      }
    })

  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-medium tabular-nums">{selected ? formatMoney(selected.price) : ''}</p>

      {variants.length > 1 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">Size</legend>
          <div className="grid grid-cols-2 gap-3">
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={cn(
                  'flex cursor-pointer flex-col gap-0.5 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  variant.id === variantId ? 'border-primary bg-secondary' : 'hover:border-foreground/40',
                  !variant.availableForSale && 'cursor-not-allowed opacity-50',
                )}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={variant.id === variantId}
                  disabled={!variant.availableForSale}
                  onChange={() => setVariantId(variant.id)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{variant.title}</span>
                <span className="text-sm text-muted-foreground tabular-nums">{formatMoney(variant.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex gap-3">
        <div className="flex items-center rounded-full border">
          <button
            type="button"
            className="p-3 disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="p-3 disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          size="lg"
          className="h-auto flex-1 rounded-full"
          onClick={submit}
          disabled={pending || !selected?.availableForSale}
        >
          {pending ? 'Adding…' : selected?.availableForSale ? 'Add to cart' : 'Sold out'}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
