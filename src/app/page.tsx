import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Smartphone, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <section className="relative flex min-h-[62vh] flex-1 items-center justify-center px-4 py-20 md:py-28">
        <div className="absolute left-1/2 top-8 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="space-y-5">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 shadow-sm backdrop-blur">
              <Sparkles className="size-3.5" />
              A quieter daily rhythm
            </div>
            <h1 className="text-6xl font-semibold tracking-[-0.04em] text-emerald-950 md:text-8xl">
              <span>Yaumi</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Track your daily adhkar and spiritual routines with ease
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "h-11 gap-2 rounded-full bg-emerald-700 px-6 shadow-lg shadow-emerald-900/10 hover:bg-emerald-800",
              })}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-11 rounded-full border-emerald-900/10 bg-white/70 px-6 backdrop-blur hover:bg-white",
              })}
            >
              Browse Adhkar
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-950/5 bg-white/45 px-4 py-16 backdrop-blur-sm md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
            Everything you need for your spiritual journey
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5 transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>List & Counter</CardTitle>
                <CardDescription>
                  Browse adhkar with Arabic text, transliteration, and translation. Track your progress with a simple tap.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5 transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <Layers className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>Swipe Mode</CardTitle>
                <CardDescription>
                  A Tinder-style interface for completing adhkar. Swipe right to mark complete, left to skip.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5 transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <Smartphone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>Offline PWA</CardTitle>
                <CardDescription>
                  Install Yaumi on your device. Access your adhkar even without an internet connection.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="px-4 py-8">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>Yaumi - Your daily spiritual companion</p>
        </div>
      </footer>
    </div>
  );
}
