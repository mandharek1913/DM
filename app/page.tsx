import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { ProductGrid } from '@/components/product-grid'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <HowItWorks />
    </main>
  )
}
