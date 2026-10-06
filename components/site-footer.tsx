export function SiteFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="flex flex-col gap-2">
          <p className="font-serif text-2xl">{'Crumb & Co.'}</p>
          <p className="max-w-xs text-sm text-primary-foreground/70">
            Small-batch layer cakes, baked from scratch every morning with real butter and seasonal fruit.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-primary-foreground/70">
          <p>Open Tue–Sun, 8am–6pm</p>
          <p>hello@crumbandco.com</p>
          <p>{`© ${new Date().getFullYear()} Crumb & Co. Bakery`}</p>
        </div>
      </div>
    </footer>
  )
}
