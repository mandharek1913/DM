'use server'

import { cookies } from 'next/headers'
import { addCartLine, createCart, getCart, removeCartLine, updateCartLine, type Cart } from '@/lib/shopify'

const CART_COOKIE = 'cartId'
const MAX_LINE_QUANTITY = 10

function assertQuantity(quantity: number, min: number) {
  if (!Number.isInteger(quantity) || quantity < min || quantity > MAX_LINE_QUANTITY) {
    throw new Error(`Quantity must be a whole number between ${min} and ${MAX_LINE_QUANTITY}`)
  }
}

function assertGid(id: string, type: 'ProductVariant' | 'CartLine') {
  if (typeof id !== 'string' || !id.startsWith(`gid://shopify/${type}/`)) {
    throw new Error('Invalid item')
  }
}

async function currentCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value
  if (!cartId) return null
  return getCart(cartId)
}

async function saveCartId(id: string) {
  ;(await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
}

export async function addToCart(variantId: string, quantity: number): Promise<Cart> {
  assertGid(variantId, 'ProductVariant')
  assertQuantity(quantity, 1)

  const cart = await currentCart()
  if (!cart) {
    const created = await createCart(variantId, quantity)
    await saveCartId(created.id)
    return created
  }

  const existing = cart.lines.nodes.find((line) => line.merchandise.id === variantId)
  if (existing) {
    const next = existing.quantity + quantity
    assertQuantity(next, 1)
    return updateCartLine(cart.id, existing.id, next)
  }
  return addCartLine(cart.id, variantId, quantity)
}

export async function setLineQuantity(lineId: string, quantity: number): Promise<Cart | null> {
  assertGid(lineId, 'CartLine')
  assertQuantity(quantity, 0)
  const cart = await currentCart()
  if (!cart) return null
  if (!cart.lines.nodes.some((line) => line.id === lineId)) throw new Error('Item not in cart')
  return quantity === 0 ? removeCartLine(cart.id, lineId) : updateCartLine(cart.id, lineId, quantity)
}
