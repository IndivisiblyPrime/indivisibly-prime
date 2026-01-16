import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

interface HeroSection {
  headline: string;
  subtitle?: string;
}

async function getHeroSection(): Promise<HeroSection | null> {
  try {
    const query = `*[_type == "heroSection"][0]{
      headline,
      subtitle
    }`;
    return await client.fetch(query);
  } catch {
    return null;
  }
}

export default async function Home() {
  const heroSection = await getHeroSection();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-12 px-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white md:text-7xl">
          indivisibly prime
        </h1>

        {heroSection ? (
          <section className="flex flex-col items-center gap-4">
            <h2 className="text-3xl font-semibold text-zinc-800 dark:text-zinc-200 md:text-4xl">
              {heroSection.headline}
            </h2>
            {heroSection.subtitle && (
              <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
                {heroSection.subtitle}
              </p>
            )}
          </section>
        ) : (
          <section className="flex flex-col items-center gap-4">
            <p className="text-lg text-zinc-500 dark:text-zinc-500">
              Add content in Sanity Studio at /studio
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
