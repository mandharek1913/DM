'use client'

import useSWR from 'swr'
import type { Cart } from '@/lib/shopify'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCart() {
  return useSWR<Cart | null>('/api/cart', fetcher)
}

export function useCartOpen() {
  const { data, mutate } = useSWR<boolean>('cart-open', null, { fallbackData: false })
  return [data ?? false, (open: boolean) => mutate(open, { revalidate: false })] as const
}
