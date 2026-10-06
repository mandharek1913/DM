import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopify'

export async function GET() {
  const cartId = (await cookies()).get('cartId')?.value
  if (!cartId) return Response.json(null)
  try {
    return Response.json(await getCart(cartId))
  } catch {
    return Response.json(null)
  }
}
