import 'server-only'

const API_VERSION = '2025-04'

export type Money = { amount: string; currencyCode: string }

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
}

export type Product = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  featuredImage: { url: string; altText: string | null } | null
  priceRange: { minVariantPrice: Money }
  variants: { nodes: ProductVariant[] }
}

export type CartLine = {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: {
    id: string
    title: string
    product: { title: string; handle: string; featuredImage: { url: string; altText: string | null } | null }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: Money }
  lines: { nodes: CartLine[] }
}

type FetchOptions = { variables?: Record<string, unknown>; cache?: 'products' | 'none' }

async function shopifyFetch<T>(query: string, { variables, cache = 'none' }: FetchOptions = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!domain || !token) throw new Error('Shopify environment variables are not configured')

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache === 'products' ? { next: { revalidate: 60, tags: ['products'] } } : { cache: 'no-store' }),
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message ?? `Shopify request failed with ${res.status}`)
  }
  return json.data as T
}

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml productType
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 10) { nodes { id title availableForSale price { amount currencyCode } } }
`

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    nodes {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title
          product { title handle featuredImage { url altText } }
        }
      }
    }
  }
`

export async function getProducts(): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>(
    `query { products(first: 50, sortKey: CREATED_AT) { nodes { ${PRODUCT_FIELDS} } } }`,
    { cache: 'products' },
  )
  return data.products.nodes
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: Product | null }>(
    `query($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { variables: { handle }, cache: 'products' },
  )
  return data.product
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(
    `query($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { variables: { id: cartId } },
  )
  return data.cart
}

type CartMutationResult = { cart: Cart | null; userErrors: { message: string }[] }

function unwrap(result: CartMutationResult): Cart {
  if (result.userErrors.length) throw new Error(result.userErrors[0].message)
  if (!result.cart) throw new Error('Cart not returned')
  return result.cart
}

export async function createCart(merchandiseId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartMutationResult }>(
    `mutation($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { message } } }`,
    { variables: { input: { lines: [{ merchandiseId, quantity }] } } },
  )
  return unwrap(data.cartCreate)
}

export async function addCartLine(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>(
    `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`,
    { variables: { cartId, lines: [{ merchandiseId, quantity }] } },
  )
  return unwrap(data.cartLinesAdd)
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>(
    `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`,
    { variables: { cartId, lines: [{ id: lineId, quantity }] } },
  )
  return unwrap(data.cartLinesUpdate)
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>(
    `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`,
    { variables: { cartId, lineIds: [lineId] } },
  )
  return unwrap(data.cartLinesRemove)
}
