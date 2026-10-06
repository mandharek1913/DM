import { ProductCard } from '@/components/product-card'
import { getProducts } from '@/lib/shopify'

export async function ProductGrid() {
  const products = await getProducts()

  return (
    <section id="cakes" className="scroll-mt-20 border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-widest text-accent uppercase">The menu</p>
            <h2 className="font-serif text-4xl font-medium text-balance">Our signature cakes</h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Every cake comes in two sizes and is finished by hand the day you pick it up.
          </p>
        </div>
        {products.length === 0 ? (
          <p className="text-muted-foreground">New cakes are coming out of the oven soon.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
