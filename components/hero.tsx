import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 pb-16 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:pt-16 md:pb-24">
      <div className="flex flex-col gap-6">
        <p className="text-sm font-medium tracking-widest text-accent uppercase">Baked to order</p>
        <h1 className="font-serif text-5xl leading-[1.05] font-medium text-balance md:text-6xl">
          Cakes worth gathering around.
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
          Six signature layer cakes, made from scratch with real butter, single-origin chocolate, and fruit at its
          peak. Order online, pick up or get it delivered within 48 hours.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" render={<Link href="#cakes" />} nativeButton={false}>
            Shop cakes
          </Button>
          <Button size="lg" variant="outline" render={<Link href="#how-it-works" />} nativeButton={false}>
            How it works
          </Button>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted md:aspect-[5/4]">
        <Image
          src="/images/hero-bakery.png"
          alt="Layer cakes on stands across a sunlit bakery counter"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
