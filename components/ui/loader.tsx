export function PulseLoader() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
  {/* Dots */}
  <div className="flex gap-3">
    <span className="h-4 w-4 animate-pulse rounded-full bg-primary" />
    <span className="h-4 w-4 animate-pulse rounded-full bg-primary delay-150" />
    <span className="h-4 w-4 animate-pulse rounded-full bg-primary delay-300" />
  </div>

  {/* Text */}
  <p className="text-sm font-medium tracking-widest text-muted-foreground animate-pulse">
    LOADING
  </p>
</div>

    )
}
