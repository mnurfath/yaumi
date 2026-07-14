import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Smartphone, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <section className="relative flex min-h-[62vh] flex-1 items-center justify-center px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="space-y-5">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="size-3.5" />
              A quieter daily rhythm
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-foreground md:text-8xl">
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
                className: "h-11 gap-2 rounded-full px-6",
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
                className: "h-11 rounded-full px-6",
              })}
            >
              Browse Adhkar
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need for your spiritual journey
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>List & Counter</CardTitle>
                <CardDescription>
                  Browse adhkar with Arabic text, transliteration, and translation. Track your progress with a simple tap.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Swipe Mode</CardTitle>
                <CardDescription>
                  A Tinder-style interface for completing adhkar. Swipe right to mark complete, left to skip.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
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
