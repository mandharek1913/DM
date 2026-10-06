import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AddToCart } from '@/components/add-to-cart'
import { getProduct } from '@/lib/shopify'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).handle)
  if (!product) return { title: 'Cake not found' }
  return { title: `${product.title} | Crumb & Co.`, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).handle)
  if (!product) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Link href="/#cakes" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All cakes
      </Link>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-6 md:py-6">
          {product.productType && (
            <p className="text-sm font-medium tracking-widest text-accent uppercase">{product.productType}</p>
          )}
          <h1 className="font-serif text-4xl leading-tight font-medium text-balance md:text-5xl">{product.title}</h1>
          <div
            className="leading-relaxed text-muted-foreground [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
          <AddToCart variants={product.variants.nodes} />
          <ul className="flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground">
            <li>Baked fresh to order, ready in 48 hours</li>
            <li>Keeps 3 days refrigerated, best at room temperature</li>
            <li>Free pickup, or chilled delivery available at checkout</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
