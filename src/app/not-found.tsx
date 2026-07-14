import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Lost your way</p>
      <h2 className="text-6xl font-semibold tracking-tight text-emerald-950 md:text-7xl">404</h2>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "mt-2 h-11 rounded-full border-emerald-900/10 bg-white/70 px-6 backdrop-blur hover:bg-white",
        })}
      >
        Go Home
      </Link>
    </div>
  );
}
