import Image from 'next/image'
import Link from 'next/link'
import { formatMoney } from '@/lib/format'
import type { Product } from '@/lib/shopify'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className="group flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.productType && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
            {product.productType}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl leading-tight group-hover:text-accent">{product.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums">
          {`From ${formatMoney(product.priceRange.minVariantPrice)}`}
        </p>
      </div>
    </Link>
  )
}
