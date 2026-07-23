"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export interface SearchableAdhkar {
  id: string;
  title: string;
  arabic_text: string;
  latin_transliteration: string | null;
  english_translation: string | null;
  category: { name: string; slug: string } | null;
}

interface AdhkarSearchProps {
  adhkars: SearchableAdhkar[];
  query: string;
  onQueryChange: (query: string) => void;
}

// ponytail: client-side filter over a small in-memory list; move to server
// ilike/full-text search if adhkar count grows large.
export function AdhkarSearch({ adhkars, query, onQueryChange }: AdhkarSearchProps) {
  const trimmed = query.trim();
  const isActive = trimmed.length >= 2;

  const results = useMemo(() => {
    const q = trimmed.toLowerCase();
    if (q.length < 2) return [];
    return adhkars.filter((a) =>
      [a.title, a.english_translation, a.latin_transliteration, a.arabic_text]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [trimmed, adhkars]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search adhkars..."
          className="h-11 rounded-xl pl-10 pr-10 text-[15px] shadow-none focus-visible:ring-primary/30"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isActive && (
        <div className="mt-5">
          <p className="mb-2.5 px-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "No results"}
          </p>

          {results.length > 0 ? (
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {results.map((adhkar) => (
                <Link
                  key={adhkar.id}
                  href={`/categories/${adhkar.category?.slug}`}
                  className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {adhkar.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {adhkar.english_translation}
                      {adhkar.category && (
                        <span className="text-muted-foreground/70">
                          {adhkar.english_translation ? " · " : ""}
                          {adhkar.category.name}
                        </span>
                      )}
                    </p>
                  </div>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="max-w-[40%] shrink-0 truncate text-lg leading-snug text-foreground/90"
                  >
                    {adhkar.arabic_text}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No adhkars found for &ldquo;{trimmed}&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Try a different spelling or keyword
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
