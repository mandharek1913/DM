import { CakeSlice, CalendarCheck, Truck } from 'lucide-react'

const steps = [
  {
    icon: CakeSlice,
    title: 'Choose your cake',
    body: 'Pick a flavor and size. Six inches feeds eight; eight inches feeds fourteen.',
  },
  {
    icon: CalendarCheck,
    title: 'We bake it fresh',
    body: 'Every order is baked from scratch and finished by hand within 48 hours.',
  },
  {
    icon: Truck,
    title: 'Pick up or delivery',
    body: 'Collect from our bakery or have it delivered chilled in a protective box.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">How it works</p>
          <h2 className="font-serif text-4xl font-medium text-balance">From our oven to your table</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <step.icon className="size-6 text-accent" aria-hidden="true" />
                <span className="font-serif text-3xl text-muted-foreground/50">{`0${index + 1}`}</span>
              </div>
              <h3 className="font-serif text-xl">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
