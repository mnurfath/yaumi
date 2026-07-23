"use client";

import { useState, type ReactNode } from "react";
import { AdhkarSearch, type SearchableAdhkar } from "./adhkar-search";

interface CategoriesBrowserProps {
  adhkars: SearchableAdhkar[];
  children: ReactNode;
}

// Owns the search query so the server-rendered category grid can be hidden
// while a search is active.
export function CategoriesBrowser({ adhkars, children }: CategoriesBrowserProps) {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length >= 2;

  return (
    <div>
      <AdhkarSearch adhkars={adhkars} query={query} onQueryChange={setQuery} />
      {!isSearching && <div className="mt-6">{children}</div>}
    </div>
  );
}
