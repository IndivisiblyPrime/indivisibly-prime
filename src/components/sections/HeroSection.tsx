export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-7xl font-bold tracking-tight text-white drop-shadow-lg md:text-8xl lg:text-9xl">
          Jack Harvey
        </h1>
      </div>
    </section>
  )
}
